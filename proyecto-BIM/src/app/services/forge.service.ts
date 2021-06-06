import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ForgeService {

  constructor(private http: HttpClient) {
  }

  async getRecurso(){
    let url = 'app/viewer/test-data/sample.rvt'

    const headers = new HttpHeaders()
      .set('Content-Disposition','attachment')

    const response = await this.http.get(url, {responseType: 'blob', headers: headers}).toPromise()
    let file = new File([response], 'sample.rvt')
    return file
  }

  async getAccessToken(cliId: string, cliSecret: string){
    let url: string = 'https://developer.api.autodesk.com/authentication/v1/authenticate'

    const HttpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' }),
    }

    const body = new HttpParams({
      fromObject: {  
        client_id: cliId, //8bqK6hofASylpd1YSBkUbveFGJlAPgg1
        client_secret: cliSecret, //fdHMGRDKZsJjzJ9J
        grant_type: 'client_credentials',
        scope: 'bucket:create bucket:read data:read data:create data:write'
      }
    })

    return this.http.post<any>(url, body.toString(), HttpOptions).toPromise()
  }

  async getBuckets(accessToken: string){
    let url: string = 'https://developer.api.autodesk.com/oss/v2/buckets'

    const headers = new HttpHeaders()
      .set('authorization',accessToken)

    return await this.http.get(url,{headers: headers}).toPromise()
  }

  async getObjects(accessToken: string, bucketKey: string){
    let url: string = 'https://developer.api.autodesk.com/oss/v2/buckets/' + bucketKey + '/objects'

    const headers = new HttpHeaders()
      .set('authorization', accessToken)

    return await this.http.get(url,{headers: headers}).toPromise()
  }

  async createBucket(accessToken: string, bucketKey: string){
    let url: string = 'https://developer.api.autodesk.com/oss/v2/buckets'

    const headers = new HttpHeaders()
      .set('authorization', accessToken )
      .set('content-type','application/json')

    const body = {
      bucketKey: bucketKey,
      policyKey: 'transient'
    }

    return this.http.post(url,body,{headers: headers}).toPromise()
  }

  async uploadFile(accessToken: string, bucketKey: string, objectKey: string, model: File){
    let url = 'https://developer.api.autodesk.com/oss/v2/buckets/' + bucketKey + '/objects/' + objectKey 

    const headers = new HttpHeaders()
      .set('Authorization', accessToken)

    return this.http.put(url, model, {headers: headers}).toPromise()
  }

  async translateFile(accessToken: string, urn: string, filename: string){
    let url = 'https://developer.api.autodesk.com/modelderivative/v2/designdata/job'
    
    const HttpOptions = {
      headers: new HttpHeaders(
        { 'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + accessToken,
          'x-ads-force':'true'
        }
      ),
    }

    const b = {
      "input": {
          "urn": urn,
          "rootFilename": filename,
          "compressedUrn": true
        },
        "output": {
            "destination": {
                "region": "us"
            },
            "formats": [
                {
                    "type": "svf",
                    "views": [
                        "2d",
                        "3d"
                    ]
                }
            ]
        }
    }

    return this.http.post(url,JSON.stringify(b),HttpOptions).toPromise()
  }

  async checkTranslationProgress(accessToken: string, safeUrn: string){
    let url =  'https://developer.api.autodesk.com/modelderivative/v2/designdata/' + safeUrn + '/manifest'

    const headers = new HttpHeaders()
      .set('Authorization','Bearer ' + accessToken)

    return this.http.get(url,{headers: headers}).toPromise()
  }
}
