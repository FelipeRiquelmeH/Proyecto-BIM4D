import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class ForgeService {
  url: string = 'https://developer.api.autodesk.com/authentication/v1/authenticate'

  constructor(private http: HttpClient) {
  }

  getAccessToken(cliId: string, cliSecret: string){
    let url: string = 'https://developer.api.autodesk.com/authentication/v1/authenticate'

    const headers = new HttpHeaders()
      .set('content-type','application/x-www-form-urlencoded')

    const body = {
      client_id: cliId,
      client_secret: cliSecret,
      grant_type: 'client_credentials',
      scope: 'data:write data:read bucket:create bucket:delete'
    }

    console.log(body)
    // return this.http.post<any>(url, body, {headers: headers})

      // RESPONSE
      // {
      //   "access_token":"YOUR_ACCESS_TOKEN",
      //   "token_type":"Bearer",
      //   "expires_in":3599
      // }
  }

  getURN(token: string, bucketKey: string){
    let url: string = 'https://developer.api.autodesk.com/oss/v2/buckets'

    const headers = new HttpHeaders()
      .set('authorization','Bearer')
      .set('content-type','application/json')

    const body = {
      bucketKey: bucketKey,
      access: 'full',
      policyKey: 'transient'
    }

    return this.http.post(url,body,{headers: headers})

    // RESPONSE
    //   {
    //     "bucketKey": "YOUR_BUCKET_KEY",
    //     "bucketOwner": "YOUR_FORGE_APP_CLIENT_ID",
    //     "createdDate": 1571296694595,
    //     "permissions": [
    //         {
    //             "authId": "T05H372IE11Kmkksdh73ndj0qie2f6nib",
    //             "access": "full"
    //         }
    //     ],
    //     "policyKey": "transient"
    // }
  }

    // uploadRevit(bucketKey: string, token: string){
    //   let url = 'https://developer.api.autodesk.com/oss/v2/buckets/' + bucketKey +'/objects/' + OBJECT_KEY_4_REVIT_FILE
    // }
}
