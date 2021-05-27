import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'proyecto-BIM';

  constructor(){
    document.addEventListener('DOMContentLoaded', () => {
      let viewerjs = document.createElement('script'),
          threejs = document.createElement('script')

      viewerjs.type = 'text/javascript'
      threejs.type = 'text/javascript'

      viewerjs.src = 'https://developer.api.autodesk.com/derivativeservice/v2/viewers/viewer3D.js?v=7.*'
      threejs.src = "https://developer.api.autodesk.com/derivativeservice/v2/viewers/three.min.js?v=v2.17"
      document.getElementsByTagName('head')[0].appendChild(viewerjs)
      document.getElementsByTagName('head')[0].appendChild(threejs)
    })
  }
}
