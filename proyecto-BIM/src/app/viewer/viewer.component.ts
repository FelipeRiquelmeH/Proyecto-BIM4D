import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ForgeService } from '../services/forge.service';
import { ProgressManagerExtension } from './extensions/progressManager';
import { FourdplanToolbarExtension } from './extensions/fourdplanToolbar';
import { RecursoService } from '../services/recurso.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import * as moment from 'moment';
import { Tarea } from '../models/tarea';

declare const Autodesk: any

export interface Semana{
  id: number
  descripcion: string
  inicio: any
  fin: any
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

  //Selector tareas
  public ciclos: Tarea[] = []
  public subtareas: Tarea[] = []
  public tareas: Tarea[]

  public flatTareas: Tarea[] = []
  public semanasProg: any[]
  public semanasReal: any[]

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
    await this.updateAvances(this.idPlanificacion)
    const res = await this.recursoService.getPlanificacion(this.idPlanificacion)

    this.tareas = this.formatJSON(res['tareas'])

    this.flatten(this.tareas,this.flatTareas)
    this.semanasProg = this.getPlannedWeeks(this.flatTareas)
    this.semanasReal = this.getRealWeeks(this.flatTareas)
  }

  private llenarGlosario(capas: Tarea[]){
    for(let i = 0; i < capas.length; i++){
      let capa = <HTMLDivElement> document.querySelector('#capa-' + i)
      let color = this.buscarCapa(parseInt(capas[i].id),this.avances)
      let boton = <HTMLButtonElement> document.querySelector('#botonCapa-' + i)
      if(color){
        let rgb = "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")"
        capa.style.backgroundColor = rgb
        boton.disabled = false
      }else{
        capa.style.backgroundColor = 'transparent'
        boton.disabled = true
      }
    }
  }

  private buscarCapa(idTarea: number, avances: any[]){
    for(let i = 0; i < avances.length; i++){
      if(avances[i]['id_tarea'] == idTarea){
        return avances[i]['color']
      }
    }
  }

  mostrarCapa(event){
    let capa = event.target.value
    
    let min, max
    for(let i = 0; i < this.tareas.length; i++){
      if(this.tareas[i].id == capa){
        min = this.tareas[i]
        max = i != (this.tareas.length - 1) ? this.tareas[i + 1] : null
      }
    }

    let minPos = this.flatTareas.indexOf(min), maxPos = this.flatTareas.indexOf(max)
    let tareasCapa = this.flatTareas.slice(minPos,maxPos)
    
    this.fdPExtension.mostrarAvanceEsp(tareasCapa)
  }

  private formatJSON(array: any[]): Tarea[]{
    let tareas: Tarea[] = []
    for(let i = 0; i < array.length; i++){
      let tareaJSON = array[i]
      let tarea: Tarea = <Tarea>new Object()

      //Llenando datos de la tarea
      tarea.id = tareaJSON["id"]
      tarea.nombre = tareaJSON["nombre"]
      tarea.inicio = moment(tareaJSON["fecha_inicio"]).format('LL') 
      let fin = moment(tareaJSON["fecha_fin"])
      tarea.fin = fin.format('LL')
      let finReal = moment(tareaJSON["fin_real"])
      tarea.completa = finReal.isValid() ? finReal.format('LL') : ''
      let estado = tareaJSON["estado"]
      if(estado){
        let diff = finReal.diff(fin)
        if(diff == 0){
          tarea.estado = 'Completa'
        }else if (diff > 0){
          tarea.estado = 'Completa [Fuera de Plazo]'
        }else{
          tarea.estado = 'Completa [Adelantada]'
        }
      }else{
        tarea.estado = 'Pendiente'
      }

      if(tareaJSON["subtareas"].length > 0){
        tarea.subtareas = this.formatJSON(tareaJSON["subtareas"])
      }else{
        tarea.subtareas = []
      }

      tareas.push(tarea)
    }

    return tareas
  }

  private flatten(array: Tarea[], flat: any[]){
    for(let i = 0; i < array.length; i++){
      flat.push(array[i])
      if(array[i].subtareas?.length){
        this.flatten(array[i].subtareas!,flat)
      }
    }
  }

  getPlannedWeeks(planificacion: Tarea[]){
    let semanas: Semana[] = []
    let id = 0
    if(planificacion){
      let semInicial = <Semana>new Object()

      semInicial.id = id + 1
      semInicial.inicio = moment(planificacion[0].inicio, 'LL').startOf('isoWeek').toString()
      semInicial.fin = moment(planificacion[0].inicio, 'LL').endOf('isoWeek').toString()
      semInicial.descripcion = 'Semana ' + semInicial.id + ' - ' + moment(planificacion[0].inicio, 'LL').startOf('week').format('LL')
      semanas.push(semInicial)
      id++

      let semFinal = <Semana> new Object()

      semFinal.inicio = moment(planificacion[planificacion.length-1].inicio, 'LL').startOf('isoWeek')
      semFinal.fin = moment(planificacion[planificacion.length-1].fin, 'LL').endOf('isoWeek')
      
      let cycleStop = false
      while(!cycleStop){
        let semana = <Semana> new Object()

        semana.id = id + 1
        semana.inicio = moment(semanas[id-1].inicio).add(1,'weeks').startOf('isoWeek').toString()
        semana.fin = moment(semanas[id-1].fin).add(1,'weeks').endOf('isoWeek').toString()
        semana.descripcion = 'Semana ' + semana.id + ' - ' + moment(semana.inicio).format('LL')
        if(moment(semana.inicio).isBefore(semFinal.inicio)){
          semanas.push(semana)
          id++
        }else{
          cycleStop = true
        }
      }

      semFinal.id = id + 1
      semFinal.descripcion = 'Semana ' + semFinal.id + ' - ' + moment(planificacion[planificacion.length-1].inicio, 'LL').startOf('week').format('LL')
      semFinal.inicio = semFinal.inicio.toString()
      semFinal.fin = semFinal.fin.toString()
      semanas.push(semFinal)
    }
    return semanas
  }

  mostrarAvanceProgramado(event){
    let option = (<HTMLSelectElement> document.querySelector('#semanalProg')).value
    let semana: Semana = this.semanasProg[parseInt(option) - 1]
    let avances: any[] = [], tareas: Tarea[] = []
    this.flatten(this.tareas, tareas)

    for(let i = 0; i < tareas.length; i++){
      if(tareas[i].subtareas.length == 0 && moment(tareas[i].fin, 'LL').isBetween(semana.inicio, semana.fin)){
        avances.push(tareas[i])
      }
    }

    if(this.fdPExtension){
      this.fdPExtension.mostrarAvanceSemanal(avances)
      this.fdPExtension.mostrarEstados(this.flatTareas)
    }
  }

  getRealWeeks(planificacion: Tarea[]){
    let semanas: Semana[] = []
    let id = 0
    if(planificacion){
      for(let i = 0; i < planificacion.length; i++){
        if(planificacion[i].completa){
          let semana = <Semana> new Object()

          semana.id = id + 1
          semana.inicio = moment(planificacion[i].completa,'LL').startOf('isoWeek')
          semana.fin = moment(planificacion[i].completa,'LL').endOf('isoWeek')
          semana.descripcion = 'Semana ' + semana.id + ' - ' + moment(semana.inicio).format('LL')

          let exists = false
          for(let j = 0; j < semanas.length; j++){
            if(moment(semana.inicio).diff(semanas[j].inicio) == 0){
              exists = true
              break;
            }
          }

          if(!exists){
            semanas.push(semana)
          }
        }
      }
      //Ordenar array
      let sortedSemanas = semanas.sort((a,b) => moment(a.inicio).diff(moment(b.inicio)))
      for(let i = 0; i < sortedSemanas.length; i++){
        sortedSemanas[i].id = i + 1
        sortedSemanas[i].descripcion = 'Semana ' + sortedSemanas[i].id + ' - ' + moment(sortedSemanas[i].inicio).format('LL')
      }
      return sortedSemanas
    }
    return semanas
  }

  mostrarAvanceReal(event){
    let option = (<HTMLSelectElement> document.querySelector('#semanalReal')).value
    let semana: Semana = this.semanasReal[parseInt(option) - 1]
    let avances: any[] = [], tareas: Tarea[] = []
    this.flatten(this.tareas, tareas)

    for(let i = 0; i < tareas.length; i++){
      if(tareas[i].subtareas.length == 0 && moment(tareas[i].completa, 'LL').isBetween(semana.inicio, semana.fin)){
        avances.push(tareas[i])
      }
    }

    if(this.fdPExtension){
      this.fdPExtension.mostrarAvanceSemanal(avances)
      this.fdPExtension.mostrarEstados(this.flatTareas)
    }
  }

  async updateAvances(idPlanificacion: number){
    this.avances = await this.recursoService.getAvances(idPlanificacion)
    if(this.loaded){
      this.llenarGlosario(this.tareas)
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
      this.llenarGlosario(this.tareas)
      this.fdPExtension.cargarAvances(this.avances)
      this.fdPExtension.setTareas(this.flatTareas)

      let botonDef = <HTMLButtonElement> document.querySelector('#botonCapaDef')
      botonDef.disabled = false
      
      // let objects: any = this.loadObjectIDs(this.idPlanificacion)
      // if(!objects){
      //   objects = this.obtenerObjetos()
      // }
      viewer.addEventListener(Autodesk.Viewing.AGGREGATE_SELECTION_CHANGED_EVENT, () => {
        let obj = this.viewer.getSelection()
        this.fdPExtension.mostrarInfoObjeto()
        let propertyPanel = this.viewer.getPropertyPanel(obj[0])

        if(propertyPanel.isVisible()){
          propertyPanel.addProperty('DBID',obj,'Estado Tarea')
          // this.fdPExtension.cargarPanel(obj)
        }
      })
    });
  }

  onDocumentLoadFailure(viewerErrorCode: any){
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
  }

  onSelectChange(event){
    let select = <HTMLSelectElement> event.target

    for(let i = 0; i < this.flatTareas.length; i++){
      if(select.value == this.flatTareas[i].id){
        if(select.id == "tareaLayer"){
          this.ciclos = this.flatTareas[i].subtareas
          this.subtareas = []
        }else if(select.id == "tareaCiclo"){
          this.subtareas = this.flatTareas[i].subtareas
        }
        break;
      }
    }
  }

  asignarTarea(){
    this.asignarLayer()
    this.asignarCiclo()
    let select = <HTMLSelectElement> document.querySelector('#tareaObjeto')
    let objetos = this.viewer.getSelection()

    if(select && parseInt(select.value) && objetos.length > 0){
      let otroAvance = this.fdPExtension.buscarAvanceTipo(objetos[0],'Tarea')
      if(otroAvance){
        this.eliminarAvance(otroAvance['id_avance'])
      }
      let existe = this.fdPExtension.buscarAvance(objetos[0],parseInt(select.value),'Tarea')
      if(!existe){
        let tipo: any[] = []
        for(let i = 0; i < objetos.length; i++){
          tipo.push('Tarea')
        }

        let avance = {
          idTarea: parseInt(select.value),
          idObjeto: objetos,
          tipoAvance: tipo
        }

        this.crearAvance(avance)
      }
    }
  }

  asignarCiclo(){
    this.asignarLayer()
    let select = <HTMLSelectElement> document.querySelector('#tareaCiclo')
    let objetos = this.viewer.getSelection()

    if(select && parseInt(select.value) && objetos.length > 0){
      let otroAvance = this.fdPExtension.buscarAvanceTipo(objetos[0],'Ciclo')
      if(otroAvance){
        this.eliminarAvance(otroAvance['id_avance'])
      }
      let existe = this.fdPExtension.buscarAvance(objetos[0],parseInt(select.value),'Ciclo')
      if(!existe){
        let tipo: any[] = []
        for(let i = 0; i < objetos.length; i++){
          tipo.push('Ciclo')
        }

        let avance = {
          idTarea: parseInt(select.value),
          idObjeto: objetos,
          tipoAvance: tipo
        }

        this.crearAvance(avance)
      }
    }
  }

  asignarLayer(){
    let select = <HTMLSelectElement> document.querySelector('#tareaLayer')
    let objetos = this.viewer.getSelection()

    if(select && parseInt(select.value) && objetos.length > 0){
      let otroAvance = this.fdPExtension.buscarAvanceTipo(objetos[0],'Capa')
      if(otroAvance){
        this.eliminarAvance(otroAvance['id_avance'])
      }
      let existe = this.fdPExtension.buscarAvance(objetos[0],parseInt(select.value),'Capa')
      if(!existe){
        let tipo: any[] = []
        for(let i = 0; i < objetos.length; i++){
          tipo.push('Capa')
        }

        let avance = {
          idTarea: parseInt(select.value),
          idObjeto: objetos,
          tipoAvance: tipo
        }

        this.crearAvance(avance)
      }
    }
  }

  resetModel(){
    this.viewer.clearThemingColors()
    this.viewer.showAll()
  }

  onDataChange(event){
    let div = <HTMLElement> document.querySelector('#hiddenDiv')
    if(div.dataset.changetype != 'clear'){
      if(div.dataset.avanceid && div.dataset.avanceid != ''){
        let avances = div.dataset.avanceid.split(',').map(x => +x)
        div.dataset.changetype = "clear"
        div.dataset.avanceid = ""
          this.eliminarAvance(avances)
      }
      //Asignar tareas antiguo

      // else if(div.dataset.objectid && div.dataset.objectid){
      //   let select = <HTMLSelectElement> document.querySelector('#tareasSelect')
      //   if(select){
      //     let objetos = div.dataset.objectid.split(',').map(x => +x)
      //     let dataAvance = {
      //       idTarea: parseInt(select.value),
      //       idObjeto: objetos
      //     }
      //     div.dataset.changetype = "clear"
      //     div.dataset.objectid = ""
      //     this.crearAvance(dataAvance)
      //   }
      // }
    }
  }

  private async crearAvance(datosAvance: any){
    const response = await this.recursoService.crearAvance(datosAvance)

    if(response){
      let tarea = this.fdPExtension.buscarTarea(response[0]['id_tarea'],this.flatTareas)
      let messageSpecs = {
        'msgTitleKey': response[0]['tipo_avance'] == 'Ciclo' ? response[0]['tipo_avance'] + ' asignado': response[0]['tipo_avance'] + ' asignada',
        'messageKey': response[0]['tipo_avance'] == 'Ciclo' ? response[0]['tipo_avance'] + ' asignado': response[0]['tipo_avance'] + ' asignada',
        'messageDefaultValue': 'Se ha asignado ' + response[0]['tipo_avance'] + ': ' + tarea.id + ' - ' + tarea.nombre + ' al/a los objeto(s) seleccionado(s).'
      }
      Autodesk.Viewing.Private.HudMessage.displayMessage(this.viewer.container,messageSpecs)

      setTimeout(
        () => {
          Autodesk.Viewing.Private.HudMessage.dismiss()
        }, 3000
      )

      this.updateAvances(this.idPlanificacion)
    }else{
      let messageSpecs = {
        'msgTitleKey': 'Error al asignar avance',
        'messageKey': 'Error al asignar avance',
        'messageDefaultValue': 'No se pudo asignar los avances al objeto seleccionado'
      }
      Autodesk.Viewing.Private.HudMessage.displayMessage(this.viewer.container,messageSpecs)

      setTimeout(
        () => {
          Autodesk.Viewing.Private.HudMessage.dismiss()
        }, 3000
      )
    }
  }

  private async eliminarAvance(idAvance: number | number[]){
    const response = await this.recursoService.eliminarAvance(idAvance)

    if(response.length){
      let tarea = this.fdPExtension.buscarTarea(response[0]['id_tarea'],this.flatTareas)
      let messageSpecs = {
        'msgTitleKey': response[0]['tipo_avance'] == 'Ciclo' ? response[0]['tipo_avance'] + ' eliminado': response[0]['tipo_avance'] + ' eliminada',
        'messageKey': response[0]['tipo_avance'] == 'Ciclo' ? response[0]['tipo_avance'] + ' eliminado': response[0]['tipo_avance'] + ' eliminada',
        'messageDefaultValue': 'Se ha eliminado asignacion de ' + response[0]['tipo_avance'] + ': ' + tarea.id + ' - ' + tarea.nombre + ' en el/los objeto(s) seleccionado(s).'
      }
      Autodesk.Viewing.Private.HudMessage.displayMessage(this.viewer.container,messageSpecs)

      setTimeout(
        () => {
          Autodesk.Viewing.Private.HudMessage.dismiss()
        }, 3000
      )
      this.updateAvances(this.idPlanificacion)
    }else{
      let messageSpecs = {
        'msgTitleKey': 'Error al eliminar avance',
        'messageKey': 'Error al eliminar avance',
        'messageDefaultValue': 'No se pudo eliminar los avances del objeto seleccionado'
      }
      Autodesk.Viewing.Private.HudMessage.displayMessage(this.viewer.container,messageSpecs)

      setTimeout(
        () => {
          Autodesk.Viewing.Private.HudMessage.dismiss()
        }, 3000
      )
    }
  }

}