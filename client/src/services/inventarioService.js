import Axios from 'axios';

const inventarioService = {
    registrarInventario: (datos) => {
        return Axios.post("http://localhost:3001/inventario/registrarInventario", datos);
    },
    consultarInventario:()=>{
        return Axios.get("http://localhost:3001/inventario/consultarInventario");
    },
    modificarInventario: (datos)=>{
        return Axios.put("http://localhost:3001/inventario/modificarInventario", datos);
    },
    eliminarInventario:(datos)=>{
        return Axios.delete(`http://localhost:3001/inventario/eliminarInventario/${datos}`);
    }    
}

export default inventarioService;