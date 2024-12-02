const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"mydb"
});

router.post("/registrarMaterial",(req,res)=>{
    const id_material = req.body.id_material;
    const nombre_material = req.body.nombre_material;
    const descripcion_material = req.body.descripcion_material;
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const estado = req.body.estado;
    const id_categoria = req.body.id_categoria;

    db.query('INSERT INTO material(id_material, nombre_material, descripcion_material, marca, modelo, estado, id_categoria) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id_material, nombre_material, descripcion_material, marca, modelo, estado, id_categoria ], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).send("Registro exitoso");
    });     
});

router.get("/consultarMaterial", (req, res) => {
    db.query('SELECT * FROM material', (err, results) => {
        if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.put("/modificarMaterial", (req, res) => {
    const id_material = req.body.id_material;
    const nombre_material = req.body.nombre_material;
    const descripcion_material = req.body.descripcion_material;
    const marca = req.body.marca;
    const modelo = req.body.modelo;
    const estado = req.body.estado;
    const id_categoria = req.body.id_categoria;

    db.query('UPDATE material SET nombre_material = ?, descripcion_material = ?, marca = ?, modelo = ?, estado = ?, id_categoria = ? WHERE id_material = ?',
        [nombre_material,descripcion_material, marca, modelo, estado, id_categoria, id_material],(err,result) =>{
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
        res.status(200).send("Modificacion exitosa");        
    });    
});

router.delete("/eliminarMaterial/:id_material", (req, res) => {
    const id_material = req.params.id_material;
    const deleteQuery = 'DELETE FROM material WHERE id_material=?';
    db.query(deleteQuery, [id_material], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en el servidor");
        } else {
            return res.status(200).send("Eliminacion exitosa");
        }
    });    
});


module.exports = router;