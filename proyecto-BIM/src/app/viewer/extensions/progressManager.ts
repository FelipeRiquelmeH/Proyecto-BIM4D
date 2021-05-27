export class ProgressManagerExtension {
    public static extensionName: string = 'ProgressManagerExtension'

    private viewer: any

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

    get menuId(){
        return 'AssignTaskContextMenu'
    }

    onBuildingContextMenuItem(menu, status){
        if(status.hasSelected){
            menu.push({
                title: 'Assign task progress to selected element',
                target: () => {
                    const selSet = this.viewer.getSelection();
                    this.viewer.clearSelection();
                    console.log(selSet)
    
                    this.assignTask(selSet)
                    // document.querySelector('#secBody')!.innerHTML = ""
                }
            });
        }else {
            menu.push({
                title: 'Clear task progress',
                target: () => {
                    this.viewer.clearThemingColors(this.viewer.model);
                }
            });
        }
    }

    assignTask(selSet){
        const color = new THREE.Vector4( 255 / 255, 0, 0, 1);
        for(let i = 0; i < selSet.length; i++){
            this.viewer.setThemingColor( selSet[i], color)
        }
    }

    showProgress(idArray: any[]){
        this.viewer.isolate(idArray)
    }
    
}