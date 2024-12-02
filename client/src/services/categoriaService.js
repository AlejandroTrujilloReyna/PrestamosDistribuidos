import Axios from 'axios';

const categoriaService = {
    registrarCategoria: (datos) => {
        return Axios.post("http://localhost:3001/categoria/registrarCategoria", datos);
    },
    consultarCategoria:()=>{
        return Axios.get("http://localhost:3001/categoria/consultarCategoria");
    },
    modificarCategoria: (datos)=>{
        return Axios.put("http://localhost:3001/categoria/modificarCategoria", datos);
    },
    eliminarCategoria:(datos)=>{
        return Axios.delete(`http://localhost:3001/categoria/eliminarCategoria/${datos}`);
    }    
}

export default categoriaService;