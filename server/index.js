const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

const categoriaRoutes = require("./routes/categoria");
app.use("/categoria", categoriaRoutes);

const inventarioRoutes = require("./routes/inventario");
app.use("/inventario", inventarioRoutes);

const materialRoutes = require("./routes/material");
app.use("/material", materialRoutes);

const prestamoRoutes = require("./routes/prestamo");
app.use("/prestamo", prestamoRoutes);

const programaeducativoRoutes = require("./routes/programaeducativo");
app.use("/programaeducativo", programaeducativoRoutes);

const solicitanteRoutes = require("./routes/solicitante");
app.use("/solicitante", solicitanteRoutes);

const ubicacioninventarioRoutes = require("./routes/ubicacioninventario");
app.use("/ubicacioninventario", ubicacioninventarioRoutes);

app.listen(3001,()=>{
    console.log("Corriendo en el puerto 3001");
});