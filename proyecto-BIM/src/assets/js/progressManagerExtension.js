class ProgressManagerExtension extends Autodesk.Viewing.Extension{
    constructor(viewer, options){
        super(viewer, options);

        this.onBuildingContextMenuItem = this.onBuildingContextMenuItem.bind(this);
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
    
                    const color = new THREE.Vector4( 255 / 255, 0, 0, 1);
                    for(let i = 0; i < selSet.length; i++){
                        this.viewer.setThemingColor( selSet[i], color)
                    }
                }
            });
        }else {
            menu.push({
                title: 'Clear task progress',
                target: () => {
                    this.viewer.clearThemingColors();
                }
            });
        }
    }

    load(){
        this.viewer.registerContextMenuCallback(
            this.menuId,
            this.onBuildingContextMenuItem
        );

        return true;
    }

    unload(){
        this.viewer.unregisterContextMenuCallback(this.menuId);

        return true;
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('ProgressManagerExtension', ProgressManagerExtension);