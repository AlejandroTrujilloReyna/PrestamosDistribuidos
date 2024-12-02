import Axios from 'axios';

const solicitanteService = {
    registrarSolicitante: (datos) => {
        return Axios.post("http://localhost:3001/solicitante/registrarSolicitante", datos);
    },
    consultarSolicitante:()=>{
        return Axios.get("http://localhost:3001/solicitante/consultarSolicitante");
    },
    modificarSolicitante: (datos)=>{
        return Axios.put("http://localhost:3001/solicitante/modificarSolicitante", datos);
    },
    eliminarSolicitante:(datos)=>{
        return Axios.delete(`http://localhost:3001/solicitante/eliminarSolicitante/${datos}`);
    }    
}

export default solicitanteService;