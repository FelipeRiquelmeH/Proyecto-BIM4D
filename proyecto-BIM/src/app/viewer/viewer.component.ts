import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ForgeService } from '../services/forge.service';
import { ProgressManagerExtension } from './extensions/progressManager';
import { FourdplanToolbarExtension } from './extensions/fourdplanToolbar';
import { RecursoService } from '../services/recurso.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

declare const Autodesk: any

export interface Resumen{
  id: string
  nombre: string
  estado: string
  nivel: number
  padre: string
}

@Component({
  selector: 'fdp-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  public viewer: any
  private project: string = 'fourdplan'
  private idPlanificacion = 1
  private avances: any[]
  public tareas: any[]

  private loaded: boolean = false
  private fdPExtension: any

  constructor(
    private forgeService: ForgeService, 
    private recursoService: RecursoService,
    private router: Router,
    private activatedRoute: ActivatedRoute
    ){ }

  async ngOnInit(): Promise<void> {
    this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
        if(this.activatedRoute.root){
          window.location.reload()
        }
    });
    this.updateAvances(this.idPlanificacion)
    const res = await this.recursoService.getPlanificacion(this.idPlanificacion)
    let formatArray: Resumen[] = []
    this.formatTareas(formatArray,res['tareas'], 0)
    this.tareas = formatArray
  }

  formatTareas(array: Resumen[], tareas: any[], depth: number, parent: string = ''){
    for(let i = 0; i < tareas.length; i++){
      let resum = <Resumen> new Object()
      resum.id = tareas[i]['id']
      resum.nombre = tareas[i]['nombre']
      resum.nivel = depth;
      resum.padre = parent ? 'Tarea ' + parent: ''
      resum.estado = tareas[i]['estado'] == 1 ? 'Completa': 'Pendiente'
      array.push(resum)
      if(tareas[i]['subtareas'].length > 0){
        this.formatTareas(array, tareas[i]['subtareas'], depth + 1, resum.id)
      }
    }
  }

  async updateAvances(idPlanificacion: number){
    this.avances = await this.recursoService.getAvances(idPlanificacion)
    if(this.loaded){
      this.fdPExtension.cargarAvances(this.avances)
    }
  }

  async ngAfterViewInit(): Promise<void> {
      document.addEventListener('DOMContentLoaded', async () => {
        let cliId = '8bqK6hofASylpd1YSBkUbveFGJlAPgg1'
        let cliSecret = 'fdHMGRDKZsJjzJ9J'
        let res = await this.forgeService.getAccessToken(cliId, cliSecret)
          
        let bucketKey = await this.searchBucket(res.access_token, res.token_type, cliId.toLowerCase() + '-' + this.project)
        let object = await this.searchObjects(res.access_token, res.token_type, bucketKey)
        let model = await this.loadModel(res.access_token,object['objectId'],object['objectKey'])
        if(model['status'] == 'success' && (model['progress'] == 'success' || model['progress'] == 'complete')){
          this.launchViewer(res.access_token, model['urn'])
        }
      })
  }

  ngOnDestroy(){
    // this.viewer.teardown()
    // this.viewer.finish()
    // Autodesk.Viewing.shutdown()
    // this.viewer = null
  }

  async searchBucket(accessToken: string, tokenType: string, bucketKey: string): Promise<string>{
    let token = tokenType + ' ' + accessToken
    let buckets: any = (await this.forgeService.getBuckets(token))['items']

    for(let i = 0; i < buckets.length ; i++){
      if(bucketKey == buckets[i]['bucketKey']){
        return buckets[i]['bucketKey']
      }
    }

    let newBucket = await this.forgeService.createBucket(token,bucketKey)
    return newBucket['bucketKey']
  }

  async searchObjects(accessToken: string, tokenType: string, bucketKey: string): Promise<string>{
    let token = tokenType + ' ' + accessToken
    let objects = (await this.forgeService.getObjects(token, bucketKey))['items']
    let model: any = null

    for(let i = 0; i < objects.length ; i++){
      if(bucketKey == objects[i]['bucketKey']){
        model = objects[i]
        break;
      }
    }

    if(!model){
      let data = await this.forgeService.getRecurso()
      model = this.uploadFile(token ,data, bucketKey)
    }

    return model
  }

  async uploadFile(accessToken: string ,model: any, bucketKey: string){
    return await this.forgeService.uploadFile(accessToken,bucketKey, model.name, model)
  }

  async loadModel(token: string, urn: string, filename: string){
    let safeUrn = btoa(urn).replace('==','')
    let progress = await this.forgeService.checkTranslationProgress(token,safeUrn)

    
    if(progress['status'] != 'success'){
    let job = await this.forgeService.translateFile(token,safeUrn,filename)
      if(job['result'] == 'success'){
        do{
            progress = await this.forgeService.checkTranslationProgress(token,safeUrn)
        }while(progress['progress'] != 'complete')
      }
    }
    
    return progress
  }

  launchViewer(token: string, urn: string){
    let access = token
    var options = {
      env: 'AutodeskProduction',
      api: 'derivativeV2',
      getAccessToken: function(onTokenReady){
        var token = access
        var timeInSeconds = 3599
        onTokenReady(token, timeInSeconds)
      },
    }

    Autodesk.Viewing.Initializer(options, () => {
      const config = {
        extensions: [
          'ProgressManagerExtension',
          'FourdplanToolbarExtension'
        ]
      }
      var viewerElement = document.getElementById('bimViewer')!
      this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement, config)
      var started = this.viewer.start()
      if(started > 0){
        console.error('Failed to create a Viewer: WebGL not suppoerted.')
        return
      }

      Autodesk.Viewing.theExtensionManager.registerExtension('ProgressManagerExtension',ProgressManagerExtension)
      Autodesk.Viewing.theExtensionManager.registerExtension('FourdplanToolbarExtension',FourdplanToolbarExtension)

      var documentId = 'urn:' + urn
      Autodesk.Viewing.Document.load(documentId, 
        (doc) => {
          this.onDocumentLoadSuccess(doc, this.viewer)
        }, this.onDocumentLoadFailure)
    })
  }

  onDocumentLoadSuccess(doc: Autodesk.Viewing.Document, viewer: any){
    var root = doc.getRoot()
    var viewables = root.getDefaultGeometry()
    viewer.loadDocumentNode(doc, viewables).then(i => {
      var instance = new CustomEvent("viewerinstance", {detail: {viewer: viewer}})
      document.dispatchEvent(instance)
    })
    viewer.addEventListener( Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => {
      this.fdPExtension = this.viewer.getExtension('FourdplanToolbarExtension')
      this.loaded = true
      this.fdPExtension.cargarAvances(this.avances)
    })
  }

  onDocumentLoadFailure(viewerErrorCode: any){
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
  }

  onDataChange(event){
    let div = <HTMLElement> document.querySelector('#hiddenDiv')
    if(div.dataset.changetype != 'clear'){
      if(div.dataset.avanceid && div.dataset.avanceid != ''){
        let idAvance = div.dataset.avanceid
        div.dataset.changetype = "clear"
        div.dataset.avanceid = ""
        this.eliminarAvance(parseInt(idAvance))
      }else if(div.dataset.objectid && div.dataset.objectid){
        let select = <HTMLSelectElement> document.querySelector('#tareasSelect')
        console.log(select.value)
        if(select){
          let dataAvance = {
            idTarea: parseInt(select.value),
            idObjeto: parseInt(div.dataset.objectid)
          }
          div.dataset.changetype = "clear"
          div.dataset.objectid = ""
          this.crearAvance(dataAvance)
        }
      }
    }
  }

  private async crearAvance(datosAvance: any){
    const response = await this.recursoService.crearAvance(datosAvance)

    if(response){
      this.updateAvances(this.idPlanificacion)
    }
  }

  private async eliminarAvance(idAvance: number){
    const response = await this.recursoService.eliminarAvance(idAvance)
    if(response){
      this.updateAvances(this.idPlanificacion)
    }
  }

}