module.exports = {
    getPlanificacion: 'SELECT * FROM tarea WHERE id_padre = 2', //Query de ejemplo
    completar: 'UPDATE tarea ' + 
                'SET fin_real = $1, estado = 1, ' + 
                'WHERE id_tarea = $2',

    actualizarTarea: 'SELECT * FROM comlpetar_tarea($1,$2)',
    deshacerTarea: 'SELECT * FROM deshacer_tarea($1)',

    crearAvance: 'SELECT * FROM crear_avance($1, $2)',
    actualizarAvance: 'SELECT * FROM actualizar_avance($1)',
    eliminarAvance: 'SELECT * FROM eliminar_avance($1)'
}