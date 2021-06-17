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

    buscarAvance(idObjeto: number){
        for(let i = 0; i < this.avances.length; i++){
            if(this.avances[i]['id_objeto'] == idObjeto){
                return this.avances[i]['id_avance']
            }
        }

        return -1
    }

    sendAvance(objectId: any){
        let div = <HTMLElement> document.querySelector('#hiddenDiv')
        div.dataset.objectid = objectId
        div.dataset.changetype = "change"
    }

    sendAvanceDelete(idObjeto: any){
        let idAvance = this.buscarAvance(idObjeto)
        if(idAvance != -1){
            let div = <HTMLElement> document.querySelector('#hiddenDiv')
            div.dataset.avanceid = idAvance
            div.dataset.changetype = "change"
        }
    }

    onBuildingContextMenuItem(menu, status){
        if(status.hasSelected){
            let id_avance = this.buscarAvance(this.viewer.getSelection())
            if(id_avance == -1){
                menu.push({
                    title: 'Asignar tarea a objeto seleccionado',
                    target: () => {
                        const selSet = this.viewer.getSelection();
                        this.viewer.clearSelection();

                        this.sendAvance(selSet)
                    }
                });
            }else{
                menu.push({
                    title: 'Remover tarea asignada a objeto',
                    target: () => {
                        const selSet = this.viewer.getSelection();
                        this.viewer.clearSelection();

                        this.sendAvanceDelete(selSet)
                    }
                });
            }
        }
    }

    assignTask(relations: any[]){
        const defaultC = new THREE.Vector4( 255 / 255, 0, 0, 1);
        for(let i = 0; i < relations.length; i++){
            let selSet = relations[i]['idObjeto']
            let colorArray = relations[i]['color']
            if(colorArray != null){
                let color = new THREE.Vector4(colorArray[0], colorArray[1], colorArray[2], colorArray[3])
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