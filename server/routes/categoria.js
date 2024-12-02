const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"mydb"
});

router.post("/registrarCategoria",(req,res)=>{
    const id_categoria = req.body.id_categoria;
    const nombre_categoria = req.body.nombre_categoria;

    db.query('INSERT INTO categoria(id_categoria, nombre_categoria) VALUES (?, ?)',
        [id_categoria, nombre_categoria], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).send("Registro exitoso");
    });     
});

router.get("/consultarCategoria", (req, res) => {
    db.query('SELECT * FROM categoria', (err, results) => {
        if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.put("/modificarCategoria", (req, res) => {
    const id_categoria = req.body.id_categoria;
    const nombre_categoria = req.body.nombre_categoria;

    db.query('UPDATE categoria SET nombre_categoria = ? WHERE id_categoria = ?',
        [nombre_categoria,id_categoria],(err,result) =>{
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
        res.status(200).send("Modificacion exitosa");        
    });    
});

router.delete("/eliminarCategoria/:id_categoria", (req, res) => {
    const id_categoria = req.params.id_categoria;
    const deleteQuery = 'DELETE FROM categoria WHERE id_categoria=?';
    db.query(deleteQuery, [id_categoria], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en el servidor");
        } else {
            return res.status(200).send("Eliminacion exitosa");
        }
    });    
});

module.exports = router;