import { TokenType } from '@angular/compiler/src/ml_parser/lexer';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ForgeService } from '../services/forge.service';

declare const Autodesk: any

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, AfterViewInit, OnDestroy {
  public viewer: any
  private project: string = 'fourdplan'

  constructor(private forgeService: ForgeService){ 
  }

  ngOnInit(): void {
    document.addEventListener('DOMContentLoaded', () => {
      let viewerjs = document.createElement('script'),
          threejs = document.createElement('script')

      viewerjs.type = 'text/javascript'
      threejs.type = 'text/javascript'

      viewerjs.src = 'https://developer.api.autodesk.com/derivativeservice/v2/viewers/viewer3D.js?v=7.4'
      threejs.src = "https://developer.api.autodesk.com/derivativeservice/v2/viewers/three.min.js?v=v2.17"
      document.getElementsByTagName('head')[0].appendChild(viewerjs)
      document.getElementsByTagName('head')[0].appendChild(threejs)
    })
  }

  async ngAfterViewInit(): Promise<void> {
    let cliId = '8bqK6hofASylpd1YSBkUbveFGJlAPgg1'
    let cliSecret = 'fdHMGRDKZsJjzJ9J'
    let res = await this.forgeService.getAccessToken(cliId, cliSecret)
      
    let bucketKey = await this.searchBucket(res.access_token, res.token_type, cliId.toLowerCase() + '-' + this.project)
    let object = await this.searchObjects(res.access_token, res.token_type, bucketKey)
    let model = await this.loadModel(res.access_token,object['objectId'],object['objectKey'])
    if(model['status'] == 'success' && (model['progress'] == 'success' || model['progress'] == 'complete')){
      this.launchViewer(res.access_token, model['urn'])
    }
  }

  ngOnDestroy(){
    this.viewer.teardown()
    this.viewer.finish()
    this.viewer = null
    Autodesk.Viewing.shutdown()
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
      }
    }

    Autodesk.Viewing.Initializer(options, () => {
      var viewerElement = document.getElementById('bimViewer')!
      this.viewer = new Autodesk.Viewing.Private.GuiViewer3D(viewerElement)
      var started = this.viewer.start()
      if(started > 0){
        console.error('Failed to create a Viewer: WebGL not suppoerted.')
        return
      }

      var documentId = 'urn:' + urn
      let viewerInstance
      Autodesk.Viewing.Document.load(documentId, 
        (doc) => {
          this.onDocumentLoadSuccess(doc, this.viewer)
        }, this.onDocumentLoadFailure)
    })
  }

  onDocumentLoadSuccess(doc: Autodesk.Viewing.Document, viewer: any){
    console.log(doc)
    var root = doc.getRoot()
    console.log(root)
    console.log(root.search({type: 'geometry'}))
    var viewables = root.getDefaultGeometry()
    console.log(viewables)
    viewer.loadDocumentNode(doc, viewables).then(i => {
      var instance = new CustomEvent("viewerinstance", {detail: {viewer: viewer}})
      document.dispatchEvent(instance)
    })
  }

  onDocumentLoadFailure(viewerErrorCode: any){
    console.error('onDocumentLoadFailure() - errorCode:' + viewerErrorCode)
  }
}