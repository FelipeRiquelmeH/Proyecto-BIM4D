module.exports = {
    //Funciones /api/planificacion
    obtenerPlanificacion: 'SELECT * FROM obtener_planificacion($1::int)',
    actualizarTarea: 'SELECT * FROM completar_tarea($1, $2::timestamp)',
    actualizarTareas: 'SELECT * FROM completar_tareas($1::int[], $2::timestamp[])',
    deshacerTarea: 'SELECT * FROM deshacer_tarea($1::int)',
    deshacerTareas: 'SELECT * FROM deshacer_tarea($1::int[])',
    //Funciones /api/bim
    obtenerObjetos: 'SELECT * FROM obtener_objetos($1::int)',
    obtenerAvances: 'SELECT * FROM obtener_avances($1::int)',
    crearAvances: 'SELECT * FROM crear_avances($1, $2::int[], $3::varchar[])',
    actualizarAvance: 'SELECT * FROM actualizar_avance($1, $2)',
    eliminarAvances: 'SELECT * FROM eliminar_avances($1::int[])'
}