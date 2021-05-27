export class FourdplanToolbarExtension {
    private viewer
    private managerExtension
    private showTasks: boolean = false
    private showProgress: boolean = false
    
    data = [
        4686,
        4668,
        2457,
        2591,
        4556,
        4559,
        4563,
        4561
    ]

    constructor(viewer, options){
        this.viewer = viewer

        this.onToolbarCreated = this.onToolbarCreated.bind(this)
    }

    load(){
        this.managerExtension = this.viewer.getExtension('ProgressManagerExtension')

        this.viewer.setLightPreset(6)
        this.viewer.setEnvMapBackground(true)

        console.log('Fourdplan Toolbar cargado')

        return true
    }

    unload(){
        return true
    }

    onToolbarCreated(){
        let taskButton = new Autodesk.Viewing.UI.Button('tasks-button')
        taskButton.addEventListener('click', () => {
            if(!this.showTasks){
                this.showTasks = true
                taskButton.removeClass('inactive')
                taskButton.addClass('active')
                this.managerExtension.assignTask(this.data)
            }else{
                this.showTasks = false
                taskButton.removeClass('active')
                taskButton.addClass('inactive')
                this.viewer.clearThemingColors(this.viewer.model)
            }
        })
        taskButton.addClass('adsk-control')
        taskButton.addClass('adsk-button')
        taskButton.setToolTip('Show Associated Tasks')
        taskButton.icon.classList.add('fas','fa-list')

        let progButton = new Autodesk.Viewing.UI.Button('progress-button')
        progButton.addEventListener('click', () => {
            if(!this.showProgress){
                this.showProgress = true
                progButton.addClass('active')
                progButton.removeClass('inactive')
                this.managerExtension.showProgress(this.data)
            }else{
                this.showProgress = false
                progButton.removeClass('active')
                progButton.addClass('inactive')
                this.viewer.showAll()
            }
        })
        progButton.addClass('show-env-bg-button')
        progButton.setToolTip('Show Model Progress')
        progButton.icon.classList.add('fas','fa-tasks')

        let fdpToolbar = new Autodesk.Viewing.UI.ControlGroup('fpd-toolbar')
        fdpToolbar.addControl(taskButton)
        fdpToolbar.addControl(progButton)

        this.viewer.toolbar.addControl(fdpToolbar)
    }
}