const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"mydb"
});

router.post("/registrarInventario",(req,res)=>{
    const id_inventario = req.body.id_inventario;
    const nombre_inventario = req.body.nombre_inventario;
    const id_material = req.body.id_material;
    const id_ubicacion_inventario = req.body.id_ubicacion_inventario;

    db.query('INSERT INTO inventario(id_inventario, nombre_inventario, id_material, id_ubicacion_inventario) VALUES (?, ?, ?, ?)',
        [id_inventario, nombre_inventario, id_material, id_ubicacion_inventario], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).send("Registro exitoso");
    });     
});

router.get("/consultarInventario", (req, res) => {
    db.query('SELECT * FROM inventario', (err, results) => {
        if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.put("/modificarInventario", (req, res) => {
    const id_inventario = req.body.id_inventario;
    const nombre_inventario = req.body.nombre_inventario;
    const id_material = req.body.id_material;
    const id_ubicacion_inventario = req.body.id_ubicacion_inventario;

    db.query('UPDATE inventario SET nombre_inventario = ?, id_material = ?, id_ubicacion_inventario = ? WHERE id_inventario = ?',
        [nombre_inventario,id_material, id_ubicacion_inventario, id_inventario,],(err,result) =>{
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
        res.status(200).send("Modificacion exitosa");        
    });    
});

router.delete("/eliminarInventario/:id_inventario", (req, res) => {
    const id_inventario = req.params.id_inventario;
    const deleteQuery = 'DELETE FROM inventario WHERE id_inventario=?';
    db.query(deleteQuery, [id_inventario], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en el servidor");
        } else {
            return res.status(200).send("Eliminacion exitosa");
        }
    });    
});

module.exports = router;