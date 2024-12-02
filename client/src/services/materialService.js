import Axios from 'axios';

const materialService = {
    registrarMaterial: (datos) => {
        return Axios.post("http://localhost:3001/material/registrarMaterial", datos);
    },
    consultarMaterial:()=>{
        return Axios.get("http://localhost:3001/material/consultarMaterial");
    },
    modificarMaterial: (datos)=>{
        return Axios.put("http://localhost:3001/material/modificarMaterial", datos);
    },
    eliminarMaterial:(datos)=>{
        return Axios.delete(`http://localhost:3001/material/eliminarMaterial/${datos}`);
    }    
}

export default materialService;