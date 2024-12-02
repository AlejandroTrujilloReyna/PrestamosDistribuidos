const express = require("express");
const router = express.Router();
const mysql = require("mysql");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"root",
    database:"mydb"
});

router.post("/registrarSolicitante",(req,res)=>{
    const id_solicitante = req.body.id_solicitante;
    const nombre_solicitante = req.body.nombre_solicitante;
    const apellidop_solicitante = req.body.apellidop_solicitante;
    const apellidom_solicitante = req.body.apellidom_solicitante;
    const semestre = req.body.semestre;
    const id_programa_educativo = req.body.id_programa_educativo;

    db.query('INSERT INTO solicitante(id_solicitante, nombre_solicitante, apellidop_solicitante, apellidom_solicitante, semestre, id_programa_educativo) VALUES (?, ?, ?, ?, ?, ?)',
        [id_solicitante, nombre_solicitante, apellidop_solicitante, apellidom_solicitante, semestre, id_programa_educativo], (err, result) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
        }
        res.status(200).send("Registro exitoso");
    });     
});

router.get("/consultarSolicitante", (req, res) => {
    db.query('SELECT * FROM solicitante', (err, results) => {
        if (err) {
        console.log(err);
        return res.status(500).send("Error interno del servidor");
        }
        res.status(200).json(results);
    });
});

router.put("/modificarSolicitante", (req, res) => {
    const id_solicitante = req.body.id_solicitante;
    const nombre_solicitante = req.body.nombre_solicitante;
    const apellidop_solicitante = req.body.apellidop_solicitante;
    const apellidom_solicitante = req.body.apellidom_solicitante;
    const semestre = req.body.semestre;
    const id_programa_educativo = req.body.id_programa_educativo;

    db.query('UPDATE solicitante SET nombre_solicitante = ?, apellidop_solicitante = ?, apellidom_solicitante = ?, semestre = ?, id_programa_educativo = ? WHERE id_solicitante = ?',
        [nombre_solicitante,apellidop_solicitante, apellidom_solicitante, semestre, id_programa_educativo, id_solicitante],(err,result) =>{
        if (err) {
            console.log(err);
            return res.status(500).send("Error interno del servidor");
          }
        res.status(200).send("Modificacion exitosa");        
    });    
});

router.delete("/eliminarSolicitante/:id_solicitante", (req, res) => {
    const id_solicitante = req.params.id_solicitante;
    const deleteQuery = 'DELETE FROM solicitante WHERE id_solicitante=?';
    db.query(deleteQuery, [id_solicitante], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).send("Error en el servidor");
        } else {
            return res.status(200).send("Eliminacion exitosa");
        }
    });    
});

module.exports = router;