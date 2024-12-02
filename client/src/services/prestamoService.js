import Axios from 'axios';

const prestamoService = {
    registroPrestamo: (datos) => {
        return Axios.post("http://localhost:3001/prestamo/registroPrestamo", datos);
    },
    consultaPrestamo:()=>{
        return Axios.get("http://localhost:3001/prestamo/consultaPrestamo");
    },
    modificarPrestamo: (datos)=>{
        return Axios.put("http://localhost:3001/prestamo/modificarPrestamo", datos);
    },
    eliminarPrestamo:(datos)=>{
        return Axios.delete(`http://localhost:3001/prestamo/eliminarPrestamo/${datos}`);
    }    
}

export default prestamoService;