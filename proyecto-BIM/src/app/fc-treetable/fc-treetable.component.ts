import { Component, Input, OnChanges } from '@angular/core';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { ColumnMap } from '../models/columnMap';
import { ColumnSetting } from '../models/columnSetting';
import { Tarea } from '../models/tarea';
import { TreeNode } from '../models/treeNode';

@Component({
  selector: 'fc-treetable',
  templateUrl: './fc-treetable.component.html',
  styleUrls: ['./fc-treetable.component.scss']
})
export class FcTreetableComponent implements OnChanges {
  @Input() values: any[]
  @Input() settings: ColumnSetting[]
  @Input() caption: string = 'My Table'
  @Input() pagination: boolean
  @Input() scroll: boolean

  readonly angleIcon = faAngleRight
  flatTable: any[] = []
  treeTable: any[]
  keys: string[]
  columnMaps: ColumnMap[]
  
  constructor() {
    this.pagination = false
    this.scroll = false
  }

  ngOnChanges(){
    if(this.values){
      this.treeTable = this.createTree(this.formatData(this.values),null)

      this.flatten(this.treeTable,this.flatTable)
      
      if(this.settings){ //Si hay instrucciones para las columnas
        this.columnMaps = this.settings
        .map( col => new ColumnMap(col))
      } else { //Si no hay instrucciones, crea headers con los campos default
        
        // Esta parte es para evitar poner un array como header
        let valueArray = Object.values(this.values[0])
        let childTag = []
        for(let i = 0, j = 0; i < valueArray.length; i++){
          if(Array.isArray(valueArray[i])){
            childTag[j] = i
            j++
          }
        }

        let keys = Object.keys(this.values[0])
        // Si hay sub-arrays en los datos los ignora para generar los headers default
        if(childTag.length){
          for(let index of childTag){
            keys.splice(index,1)
          }
        }
        // Genera los headers
        this.columnMaps = keys
        .map( key => {
          return new ColumnMap( { primaryKey: key})
        })
      }
    }
  }

  flatten(tableData: TreeNode[], flat: any[]){
    for(let i = 0; i < tableData.length; i++){
      flat.push(tableData[i])
      if(tableData[i].children?.length){
        this.flatten(tableData[i].children!,flat)
      }
    }
  }

  formatData(tableData: any[]): any[]{
    let formattedData: Tarea[] = []

    for(let i = 0; i < tableData.length; i++){
      let data = Object.assign(new Tarea(), tableData[i])
      if(tableData[i].subtareas.length){
        data.subtareas = this.formatData(data.subtareas)
      }
      formattedData.push(data)
    }

    return formattedData
  }

  createTree(tableData: Tarea[], parent: string | null): any[] {
    let dataArray: TreeNode[] = []

    for(let i = 0; i < tableData.length ; i++){
      let node: TreeNode = new TreeNode()
      if(parent){
        node.parent = parent
        node.visible = false
      }
      else{
        node.visible = true
      }
      let nodeData = {
        id: tableData[i].id,
        nombre: tableData[i].nombre,
        estado: tableData[i].estado,
        inicio: tableData[i].inicio,
        fin: tableData[i].fin,
        completa: tableData[i].completa
      }
      node.data = nodeData
      node.selectable = true
      node.expanded = false
      node.children = []

      node.expandable = false
      if(tableData[i].subtareas.length){
        node.expandable = true
        node.children = this.createTree(tableData[i].subtareas,node.data.id)
      }

      dataArray.push(node)
    }

    return dataArray
  }

  private moveChildrenNodes(parent: TreeNode, mode: string){
    let children = parent.children

    for(let i = 0; i < children!.length; i++){
      if(mode == 'show'){
        this.showNode(children![i].data.id)
      }else if(mode == 'hide'){
        this.hideNode(children![i].data.id)
      }

      // console.log(children![i].expanded)

      if(children![i].expanded){
        this.moveChildrenNodes(children![i], mode)
      }
    }
  }

  private showNode(nodeId: string){
    let row = document.getElementById(nodeId)

    row!.classList.remove('invisible')
  }

  private hideNode(nodeId: string){
    let row = document.getElementById(nodeId)

    row!.classList.add('invisible')
  }

  expandOrContract(event: any){
    let rowId = event.target.parentNode.parentNode.id,
        nodeData: TreeNode,
        mode: string

    for(let i = 0; i < this.flatTable.length; i++){
      if(this.flatTable[i].data.id == rowId){
        nodeData = this.flatTable[i]
      }
    }

    if(nodeData!){
      nodeData.expanded = !nodeData.expanded

      if(nodeData.expanded){
        mode = 'show'
      }else{
        mode = 'hide'
      }

      if(nodeData.children!.length > 0){
        this.moveChildrenNodes(nodeData,mode)
      }
    }
  }

  highlight(event: any){
    for(let i = 0; i < this.flatTable.length; i++){
      let row = document.getElementById(this.flatTable[i].data.id)
      if(row!.id == event.currentTarget.id){
        row?.classList.add('active-row')
      }else{
        row?.classList.remove('active-row')
      } 
    }
  }

  isSelected(){
    
  }
}
