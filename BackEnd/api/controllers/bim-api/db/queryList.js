module.exports = {
    test: 'SELECT * FROM test($1)',
    //Funciones /api/planificacion
    obtenerPlanificacion: 'SELECT * FROM obtener_planificacion($1::int)',
    actualizarTarea: 'SELECT * FROM completar_tarea($1, $2::timestamp)',
    actualizarTareas: 'SELECT * FROM completar_tareas($1::int[], $2::timestamp[])',
    deshacerTarea: 'SELECT * FROM deshacer_tarea($1::int)',
    deshacerTareas: 'SELECT * FROM deshacer_tarea($1::int[])',
    //Funciones /api/bim
    obtenerAvances: 'SELECT * FROM obtener_avances($1::int)',
    crearAvance: 'SELECT * FROM crear_avance($1, $2)',
    actualizarAvance: 'SELECT * FROM actualizar_avance($1)',
    eliminarAvance: 'SELECT * FROM eliminar_avance($1)'
}