const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"mydb"
});

router.post("/registrarProgramaEducativo",(req,res)=>{
    const id_programa_educativo = req.body.id_programa_educativo;
    const nombre_programa_educativo = req.body.nombre_programa_educativo;

    db.query('INSERT INTO programaeducativo(id_programa_educativo, nombre_programa_educativo) VALUES (?, ?)',
        [id_programa_educativo, nombre_programa_educativo], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).send("Registro exitoso");
    });     
});

router.get("/consultarProgramaEducativo", (req, res) => {
    db.query('SELECT * FROM programaeducativo', (err, results) => {
        if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.put("/modificarProgramaEducativo", (req, res) => {
    const id_programa_educativo = req.body.id_programa_educativo;
    const nombre_programa_educativo = req.body.nombre_programa_educativo;

    db.query('UPDATE programaeducativo SET nombre_programa_educativo = ? WHERE id_programa_educativo = ?',
        [nombre_programa_educativo,id_programa_educativo],(err,result) =>{
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
        res.status(200).send("Modificacion exitosa");        
    });    
});

router.delete("/eliminarProgramaEducativo/:id_programa_educativo", (req, res) => {
    const id_programa_educativo = req.params.id_programa_educativo;
    const deleteQuery = 'DELETE FROM programaeducativo WHERE id_programa_educativo=?';
    db.query(deleteQuery, [id_programa_educativo], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en el servidor");
        } else {
            return res.status(200).send("Eliminacion exitosa");
        }
    });    
});

module.exports = router;