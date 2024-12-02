const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"mydb"
});

router.post("/registrarUbicacionInventario",(req,res)=>{
    const id_ubicacion_inventario = req.body.id_ubicacion_inventario;
    const nombre_ubicacion_inventario = req.body.nombre_ubicacion_inventario;

    db.query('INSERT INTO ubicacioninventario(id_ubicacion_inventario, nombre_ubicacion_inventario) VALUES (?, ?)',
        [id_ubicacion_inventario, nombre_ubicacion_inventario], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).send("Registro exitoso");
    });     
});

router.get("/consultarUbicacionInventario", (req, res) => {
    db.query('SELECT * FROM ubicacioninventario', (err, results) => {
        if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.put("/modificarUbicacionInventario", (req, res) => {
    const id_ubicacion_inventario = req.body.id_ubicacion_inventario;
    const nombre_ubicacion_inventario = req.body.nombre_ubicacion_inventario;

    db.query('UPDATE ubicacioninventario SET nombre_ubicacion_inventario = ? WHERE id_ubicacion_inventario = ?',
        [nombre_ubicacion_inventario,id_ubicacion_inventario],(err,result) =>{
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
        res.status(200).send("Modificacion exitosa");        
    });    
});

router.delete("/eliminarUbicacionInventario/:id_ubicacion_inventario", (req, res) => {
    const id_ubicacion_inventario = req.params.id_ubicacion_inventario;
    const deleteQuery = 'DELETE FROM ubicacioninventario WHERE id_ubicacion_inventario=?';
    db.query(deleteQuery, [id_ubicacion_inventario], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en el servidor");
        } else {
            return res.status(200).send("Eliminacion exitosa");
        }
    });    
});

module.exports = router;