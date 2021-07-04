export class ProgressManagerExtension {
    public static extensionName: string = 'ProgressManagerExtension'

    private viewer: any
    private avances: any[] = []

    constructor(viewer, options){
        this.viewer = viewer
        this.onBuildingContextMenuItem = this.onBuildingContextMenuItem.bind(this)
    }

    load(){
        this.viewer.registerContextMenuCallback(this.menuId,this.onBuildingContextMenuItem)
        console.log(" Progress Manager cargado")
        return true
    }

    unload(){
        this.viewer.unregisterContextMenuCallback(this.menuId)
        console.log(" Progress Manager desactivado")
        return true
    }

    setAvances(avances: any[]){
        this.avances = avances
    }

    get menuId(){
        return 'AssignTaskContextMenu'
    }

    buscarAvances(objetos: number[]){
        let avances: number[] = []
        for(let i = 0; i < objetos.length; i++){
            for(let j = 0; j < this.avances.length; j++){
                if(this.avances[j]['id_objeto'] == objetos[i]){
                    avances.push(this.avances[j]['id_avance'])
                }
            }
        }

        return avances
    }

    asignarTareas(objects: any[]){
        let infoPanel = <HTMLElement> document.querySelector('#infoPanelLayer')
        infoPanel.style.display = "block"

        let panelLayer = new Autodesk.Viewing.UI.DockingPanel(this.viewer.container,'layerSelect','Seleccionar Capa/Layer')
        panelLayer.container.classList.add('docking-panel-container-solid-color-a')
        panelLayer.container.style.top = '10px'
        panelLayer.container.style.left = '10px'
        panelLayer.container.style.width = '350px'
        panelLayer.container.style.heigth = '200px'
        panelLayer.container.appendChild(infoPanel)
        panelLayer.setVisible(true)
    }

    sendAvance(objectId: any){
        let div = <HTMLElement> document.querySelector('#hiddenDiv')
        div.dataset.objectid = objectId
        div.dataset.changetype = "change"
    }

    sendAvanceDelete(avances: any){
        let div = <HTMLElement> document.querySelector('#hiddenDiv')
        div.dataset.avanceid = avances
        div.dataset.changetype = "change"
        
    }

    onBuildingContextMenuItem(menu, status){
        if(status.hasSelected){
            menu.push({
                title: 'Asignar tareas a seleccion',
                target: () => {
                    const selSet = this.viewer.getSelection()
                    this.asignarTareas(selSet)
                }
            })
            let id_avance = this.buscarAvances(this.viewer.getSelection())
            
            if(id_avance.length){
                menu.push({
                    title: 'Remover tarea asignada a objeto',
                    target: () => {
                        this.viewer.clearSelection();

                        this.sendAvanceDelete(id_avance)
                    }
                });
            }
        }
    }

    assignTask(relations: any[]){
        const defaultC = new THREE.Vector4(255, 255, 255);
        for(let i = 0; i < relations.length; i++){
            let selSet = relations[i]['idObjeto']
            let colorArray = relations[i]['color']
            if(colorArray != null){
                let x = colorArray[0]/255, y = colorArray[1]/255, z = colorArray[2]/255
                let color = new THREE.Vector4(x,y,z)
                this.viewer.setThemingColor( selSet, color)
            }else{
                this.viewer.setThemingColor( selSet, defaultC)
            }
        }
    }

    showProgress(idArray: any[]){
        if(idArray && idArray.length> 0){
            this.viewer.isolate(idArray)
        }else{
            let instanceTree = this.viewer.model.getData().instanceTree
            let rooId = instanceTree.getRootId()
            this.viewer.hide(rooId)
        }
    }
    
}