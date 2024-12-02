const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"mydb"
});

router.post("/registroPrestamo",(req,res)=>{
    const id_prestamo = req.body.id_prestamo;
    const fecha_prestamo = req.body.fecha_prestamo;
    const fecha_devolucion = req.body.fecha_devolucion;
    const id_material = req.body.id_material;
    const id_solicitante = req.body.id_solicitante;

    db.query('INSERT INTO prestamo(id_prestamo, fecha_prestamo, fecha_devolucion, id_material, id_solicitante) VALUES (?, ?, ?, ?, ?)',
        [id_prestamo, fecha_prestamo, fecha_devolucion, id_material, id_solicitante], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).send("Registro exitoso");
    });     
});

router.get("/consultaPrestamo", (req, res) => {
    db.query('SELECT * FROM prestamo', (err, results) => {
        if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.put("/modificarPrestamo", (req, res) => {
    const id_prestamo = req.body.id_prestamo;
    const fecha_prestamo = req.body.fecha_prestamo;
    const fecha_devolucion = req.body.fecha_devolucion;
    const id_material = req.body.id_material;
    const id_solicitante = req.body.id_solicitante;

    db.query('UPDATE prestamo SET fecha_prestamo = ?, fecha_devolucion = ?, id_material = ?, id_solicitante = ? WHERE id_prestamo = ?',
        [fecha_prestamo,fecha_devolucion, id_material, id_solicitante, id_prestamo],(err,result) =>{
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
        res.status(200).send("Modificacion exitosa");        
    });    
});

router.delete("/eliminarPrestamo/:id_prestamo", (req, res) => {
    const id_prestamo = req.params.id_prestamo;
    const deleteQuery = 'DELETE FROM prestamo WHERE id_prestamo=?';
    db.query(deleteQuery, [id_prestamo], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en el servidor");
        } else {
            return res.status(200).send("Eliminacion exitosa");
        }
    });    
});


module.exports = router;