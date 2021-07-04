import { Tarea } from "src/app/models/tarea"
import { Semana } from "../viewer.component"

export class FourdplanToolbarExtension {
    private viewer
    private managerExtension
    private showTasks: boolean = false
    private showProgress: boolean = false
    private showSemanalProg: boolean = false
    private showSemanalReal: boolean = false

    public tareas: Tarea[]
    public avancesProg: any[] = []
    public lista: any[] = []
    public avances: any[] = []
    public relaciones: any[] = []
    public semanaProg: Semana[] = []
    public semanaReal: Semana[] = []

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

    mostrarInfoObjeto(){
        let object = this.viewer.getSelection()

        let dbId = <HTMLElement> document.querySelector('#dbId'),
        nombreObj = <HTMLElement> document.querySelector('#nombreObjeto'),
        capaId = <HTMLElement> document.querySelector('#capaId'),
        cicloId = <HTMLElement> document.querySelector('#cicloId'),
        tareaId = <HTMLElement> document.querySelector('#tareaId'),
        estadoObj = <HTMLElement> document.querySelector('#estadoObj'),
        inicioTarea = <HTMLElement> document.querySelector('#inicioTarea'),
        finTarea = <HTMLElement> document.querySelector('#finTarea')

        if(object.length > 0){
            dbId.innerHTML = object[object.length - 1]
            this.viewer.getProperties(object[object.length - 1], function(objProp){
                nombreObj.innerHTML = objProp.name
            })
            
            let avances = this.buscarAvances(object[object.length - 1], this.lista)

            capaId.innerHTML = 'No hay capa asignada'
            cicloId.innerHTML = 'No hay ciclo asignado'
            tareaId.innerHTML = 'No hay tarea asignada'
            estadoObj.innerHTML = 'No hay estado disponible'
            inicioTarea.innerHTML = 'No hay fecha disponible'
            finTarea.innerHTML = 'No hay fecha disponible'
            let isTarea = 0
            for(let i = 0; i < avances.length; i++){
                let tarea = this.buscarTarea(avances[i]['id_tarea'], this.tareas)
                if(avances[i]['tipo_avance'] == 'Capa'){
                    capaId.innerHTML = tarea.id + ' - ' + tarea.nombre
                    if(isTarea < 1){
                        isTarea = 1
                        estadoObj.innerHTML = tarea.estado
                        inicioTarea.innerHTML = tarea.inicio
                        finTarea.innerHTML = tarea.fin
                    }
                }else if(avances[i]['tipo_avance'] == 'Ciclo'){
                    cicloId.innerHTML = tarea.id + ' - ' + tarea.nombre
                    if(isTarea < 2){
                        isTarea = 2
                        estadoObj.innerHTML = tarea.estado
                        inicioTarea.innerHTML = tarea.inicio
                        finTarea.innerHTML = tarea.fin
                    }
                }else{
                    tareaId.innerHTML = tarea.id + ' - ' + tarea.nombre
                    if(isTarea < 3){
                        isTarea = 3
                        estadoObj.innerHTML = tarea.estado
                        inicioTarea.innerHTML = tarea.inicio
                        finTarea.innerHTML = tarea.fin
                    }
                }
            }
        }else{
            dbId.innerHTML = ''
            nombreObj.innerHTML = ''
            capaId.innerHTML = ''
            cicloId.innerHTML = ''
            tareaId.innerHTML = ''
            estadoObj.innerHTML = ''
            inicioTarea.innerHTML = ''
            finTarea.innerHTML = ''
        }
    }

    buscarAvances(idObjeto: number, relaciones: any[]){
        let avances: any[] = []
        for(let i = 0; i < relaciones.length; i++){
            if(relaciones[i]['id_objeto'] == idObjeto){
                avances.push(relaciones[i])
            }
        }

        return avances
    }

    buscarAvanceTipo(idObjeto: number, tipo: string){
        for(let i = 0; i < this.lista.length; i++){
            if(this.lista[i]['id_objeto'] == idObjeto && this.lista[i]['tipo_avance'] == tipo){
                return this.lista[i]
            }
        }

        return null
    }

    buscarAvance(idObjeto: number, idTarea: number, tipo: string){
        for(let i = 0; i < this.lista.length; i++){
            if(this.lista[i]['id_objeto'] == idObjeto){
                if(this.lista[i]['id_tarea'] == idTarea && this.lista[i]['tipo_avance'] == tipo){
                    return this.lista[i]
                }
            }
        }

        return null
    }

    buscarTarea(idTarea: string, tareas: Tarea[]){
        for(let i = 0; i < tareas.length; i++){
            if(tareas[i].id == idTarea){
                return tareas[i]
            }
        }
        return null
    }

    cargarPanel(objeto: number){
        if(objeto){
            let panel = this.viewer.getPropertyPanel(objeto)
            console.log(panel.addProperty('DBID',objeto,'Estado Tarea'))
            panel.addProperty('DBID',objeto,'Estado Tarea')
        }
    }

    mostrarAvanceSemanal(tareas: Tarea[]){
        let avances: any[] = []
        for(let i = 0; i < tareas.length; i++){
            for(let j = 0; j < this.lista.length; j++){
                if(tareas[i].id == this.lista[j]['id_tarea']){
                    avances.push(this.lista[j]['id_objeto'])
                }
            }
        }

        this.managerExtension.showProgress(avances)
    }
    
    setTareas(tareas: Tarea[]){
        this.tareas = tareas
    }

    cargarAvances(avances: any[]){
        this.lista = avances
        this.managerExtension.setAvances(avances)
        if(this.lista){
            let rel: any[] = [], av:any[] = []
            for(let i = 0; i < this.lista.length; i++){
                if(this.lista[i]['estado'] == 1){
                    av.push(this.lista[i]['id_objeto'])
                }
                let data = {
                    idObjeto: this.lista[i]['id_objeto'],
                    color: this.lista[i]['color']
                }
                rel.push(data)
            }
            this.avances = av
            this.relaciones = rel
            if(this.showTasks){
                this.viewer.clearThemingColors(this.viewer.model)
                this.managerExtension.assignTask(this.relaciones)
            }
            if(this.showProgress){
                this.managerExtension.showProgress(this.avances)
            }
        }
    }

    mostrarAvanceEsp(tareas: Tarea[]){
        console.log(tareas)
        console.log(this.lista)
        let objetos: any[] = []
        for(let i = 0; i < tareas.length; i++){
            for(let j = 0; j < this.lista.length; j++){
                if(tareas[i].id == this.lista[j]['id_tarea'] && objetos.indexOf(this.lista[j]['id_objeto'])){
                    objetos.push(this.lista[j]['id_objeto'])
                }
            }
        }

        let relaciones: any[] = []
        for(let i = 0; i < objetos.length; i++){
            for(let j = 0; j < this.relaciones.length; j++){
                if(objetos[i] == this.relaciones[j]['idObjeto']){
                    relaciones.push(this.relaciones[j])
                }
            }
        }

        this.viewer.clearThemingColors()
        this.managerExtension.assignTask(relaciones)
        this.managerExtension.showProgress(objetos)
    }

    mostrarEstados(tareas: Tarea[]){
        let estados: any[] = []
        for(let i = 0; i < tareas.length; i++){
            for(let j = 0; j < this.lista.length; j++){
                if(tareas[i].id == this.lista[j]['id_tarea']){
                    let estado = {
                        idObjeto: this.lista[j]['id_objeto'],
                        estado: tareas[i].estado
                    }
                    estados.push(estado)
                }
            }
        }

        let relaciones: any[] = []
        for(let i = 0; i < estados.length; i++){
            let relacion: any
            if(estados[i].estado.includes('Completa')){
                relacion = {
                    idObjeto: estados[i].idObjeto,
                    color: [6,165,34]
                }
            }else if(estados[i].estado.includes('Atrasada')){
                relacion = {
                    idObjeto: estados[i].idObjeto,
                    color: [240,46,5]
                }
            }else{
                relacion = {
                    idObjeto: estados[i].idObjeto,
                    color: [255,255,0]
                }
            }
            relaciones.push(relacion)
        }

        this.managerExtension.assignTask(relaciones)
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
                this.managerExtension.assignTask(this.relaciones)
            }else{
                this.showTasks = false
                taskButton.removeClass('active')
                taskButton.addClass('inactive')
                this.viewer.clearThemingColors(this.viewer.model)
            }
        })
        taskButton.addClass('adsk-control')
        taskButton.addClass('adsk-button')
        taskButton.setToolTip('Mostrar tareas asociadas')
        taskButton.icon.classList.add('fas','fa-list')

        let progCombo = new Autodesk.Viewing.UI.ComboButton('progress')
        progCombo.setToolTip('Mostrar avance modelo')
        progCombo.icon.classList.add('fas','fa-tasks')

        //Selector de avances semanales: Programado y Real
        let panelSelectProg = <HTMLSelectElement> document.querySelector('#panelSemanalProg')
        let panelSelectReal = <HTMLSelectElement> document.querySelector('#panelSemanalReal')
        panelSelectProg.style.display = "block"
        panelSelectReal.style.display = "block"

        //Paneles de fechas
        let panelProg = new Autodesk.Viewing.UI.DockingPanel(this.viewer.container,'panelAvanceProg','Avance Semanal Programado')
        panelProg.container.classList.add('docking-panel-container-solid-color-a')
        panelProg.container.style.top = '10px'
        panelProg.container.style.left = '10px'
        panelProg.container.style.width = '350px'
        panelProg.container.style.heigth = '200px'
        panelProg.container.appendChild(panelSelectProg)

        let panelReal = new Autodesk.Viewing.UI.DockingPanel(this.viewer.container,'panelAvanceReal','Avance Semanal Real')
        panelReal.container.classList.add('docking-panel-container-solid-color-a')
        panelReal.container.style.top = '10px'
        panelReal.container.style.left = '10px'
        panelReal.container.style.width = '350px'
        panelReal.container.style.heigth = '200px'
        panelReal.container.appendChild(panelSelectReal)

        //TEST
        // let tareas = document.querySelector('#tablaTareas')
        // let panelTareas = new Autodesk.Viewing.UI.DockingPanel(this.viewer.container,'panelTareas','Resumen Tareas')
        // panelTareas.container.style.top = '50px'
        // panelTareas.container.style.left = '50px'
        // panelTareas.container.style.width = '350px'
        // panelTareas.container.style.heigth = '200px'
        // panelTareas.container.appendChild(tareas)

        let progButton = new Autodesk.Viewing.UI.Button('progress-button')
        progButton.addEventListener('click', () => {
            if(!this.showProgress){
                this.showSemanalProg = false
                progSemanalButton.removeClass('active')
                progSemanalButton.addClass('inactive')
                panelProg.setVisible(false)

                this.showSemanalReal = false
                progRealButton.removeClass('active')
                progRealButton.addClass('inactive')
                panelReal.setVisible(false)
                // panelTareas.setVisible(true)

                this.showProgress = true
                progButton.addClass('active')
                progButton.removeClass('inactive')
                this.managerExtension.showProgress(this.avances)
            }else{
                this.showProgress = false
                progButton.removeClass('active')
                progButton.addClass('inactive')
                this.viewer.showAll()
            }
        })
        progButton.addClass('show-env-bg-button')
        progButton.setToolTip('Avance total')
        progButton.icon.classList.add('fas','fa-clipboard')

        let progSemanalButton = new Autodesk.Viewing.UI.Button('semanal-progress-button')
        

        progSemanalButton.addEventListener('click', () => {
            if(!this.showSemanalProg){
                this.showProgress = false
                progButton.removeClass('active')
                progButton.addClass('inactive')
                this.viewer.showAll()

                this.showSemanalReal = false
                progRealButton.removeClass('active')
                progRealButton.addClass('inactive')
                panelReal.setVisible(false)

                this.showSemanalProg = true
                progSemanalButton.addClass('active')
                progSemanalButton.removeClass('inactive')

                panelProg.setVisible(true)
            }else{
                this.showSemanalProg = false
                progSemanalButton.removeClass('active')
                progSemanalButton.addClass('inactive')

                panelProg.setVisible(false)
                this.viewer.clearThemingColors()
                this.viewer.showAll()
            }
        })
        progSemanalButton.addClass('show-env-bg-button')
        progSemanalButton.setToolTip('Avance semanal programado')
        progSemanalButton.icon.classList.add('fas','fa-calendar-week')

        let progRealButton = new Autodesk.Viewing.UI.Button('real-progress-button')
        progRealButton.addEventListener('click', () => {
            if(!this.showSemanalReal){
                this.showProgress = false
                progButton.removeClass('active')
                progButton.addClass('inactive')
                this.viewer.showAll()

                this.showSemanalProg = false
                progSemanalButton.removeClass('active')
                progSemanalButton.addClass('inactive')
                panelProg.setVisible(false)

                this.showSemanalReal = true
                progRealButton.addClass('active')
                progRealButton.removeClass('inactive')

                panelReal.setVisible(true)
            }else{
                this.showSemanalReal = false
                progRealButton.removeClass('active')
                progRealButton.addClass('inactive')

                panelReal.setVisible(false)
                this.viewer.clearThemingColors()
                this.viewer.showAll()
            }
        })
        progRealButton.addClass('show-env-bg-button')
        progRealButton.setToolTip('Avance semanal real')
        progRealButton.icon.classList.add('fas','fa-check')

        progCombo.addControl(progButton)
        progCombo.addControl(progSemanalButton)
        progCombo.addControl(progRealButton)

        let fdpToolbar = new Autodesk.Viewing.UI.ControlGroup('fpd-toolbar')
        fdpToolbar.addControl(taskButton)
        fdpToolbar.addControl(progCombo)

        this.viewer.toolbar.addControl(fdpToolbar)
    }
}