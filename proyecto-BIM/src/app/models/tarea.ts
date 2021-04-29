export class Tarea{
    id: string
    nombre: string
    estado: string
    inicio: string
    fin: string
    completa: string
    subtareas: Tarea[] = []
}