import React from 'react';
import { Menubar } from 'primereact/menubar';
//import './BarraMenuPersonalizado.css';  // Importa tu archivo CSS personalizado

const Menu = () => {
    const items = [
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Sistema de prestamos</span>,
            command: () => { window.location.href = '/'; }
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Categoria</span>,
            command: () => { window.location.href = '/Categoria'; }
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Inventario</span>,
            command: () => { window.location.href = '/Inventario'; }
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Material</span>,
            command: () => { window.location.href = '/Material'; }
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Prestamo</span>,
            command: () => { window.location.href = '/Prestamo'; }
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Programa Educativo</span>,
            command: () => { window.location.href = '/ProgramaEducativo'; }
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Solicitante</span>,
            command: () => { window.location.href = '/Solicitante'; }
        },
        {
            label: <span style={{ color: "white", fontWeight: "bold", flex: "2", fontFamily: 'Arial, sans-serif' }}>Ubicacion Inventario</span>,
            command: () => { window.location.href = '/UbicacionInventario'; }
        }        
    ];
 
   
    return (
        <>
            <Menubar model={items} className="custom-menubar" />
        </>
    );
}

export default Menu;