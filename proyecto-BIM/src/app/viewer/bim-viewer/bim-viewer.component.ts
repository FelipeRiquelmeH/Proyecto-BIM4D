import { Component, OnInit } from '@angular/core';
import { faCube } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-bim-viewer',
  templateUrl: './bim-viewer.component.html',
  styleUrls: ['./bim-viewer.component.scss']
})
export class BimViewerComponent implements OnInit {

  readonly cube = faCube

  constructor() { }

  ngOnInit(): void {
  }

}
