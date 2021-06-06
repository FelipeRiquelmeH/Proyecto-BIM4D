import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ForgeService } from '../services/forge.service';
import { ProgressManagerExtension } from './extensions/progressManager';
import { FourdplanToolbarExtension } from './extensions/fourdplanToolbar';

declare const Autodesk: any

@Component({
  selector: 'fdp-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements AfterViewInit, OnDestroy {
  public viewer: any
  private project: string = 'fourdplan'

  constructor(private forgeService: ForgeService){ 
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
    // viewer.addEventListener( Autodesk.Viewing.GEOMETRY_LOADED_EVENT, () => {
    //   this.viewer.setThemingColor(4686, new THREE.Vector4( 255 / 255, 0, 0, 1))
    // })
  }

  onDocumentLoadFailure(viewerErrorCode: any){
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
  }
}