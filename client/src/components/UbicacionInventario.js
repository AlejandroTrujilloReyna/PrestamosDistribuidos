import React from 'react'
import { useState } from "react";
import { useRef } from 'react';
import { useEffect } from 'react';
import { Toast } from 'primereact/toast';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Toolbar } from 'primereact/toolbar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion } from '../services/ToastService';
import ubicacioninventarioService from '../services/ubicacioninventarioService';

const UbicacionInventario = () => {
  //VARIABLES PARA MANEJAR MENSAJES
  const toast = useRef(null);  
  //ESTADOS PARA CONDICIONES
  const [abrirDialog,setAbrirDialog] = useState(0);  
  //VARIABLES PARA EL REGISTRO
  const [id_ubicacion_inventario,setid_ubicacion_inventario] = useState("");
  const [nombre_ubicacion_inventario,setnombre_ubicacion_inventario] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [ubicacioninventarioList,setubicacioninventarioList] = useState([]);
  //VARIABLES PARA MODIFICACIÓN (SIEMPRE SERA UNA COPIA DE LAS VARIABLES DE REGISTRO PARA REALIZAR COMPARACIONES)
  const [datosCopia, setDatosCopia] = useState({
    id_categoria: "",
    nombre_categoria: ""
  });
  
  const confirmar1 = (action) => {
    confirmDialog({
      message: '¿Seguro que quieres proceder?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      defaultFocus: 'accept',
      accept: action,
      reject: () => mostrarAdvertencia(toast, "Cancelado")
    });
  }; 
  
  //FUNCION PARA REGISTRAR
  const add = () => {
    const action = () => {
      ubicacioninventarioService.registrarUbicacionInventario({
        id_ubicacion_inventario: id_ubicacion_inventario,
        nombre_ubicacion_inventario: nombre_ubicacion_inventario
      }).then(response => {
        if (response.status === 200) {
          mostrarExito(toast, "Registro Exitoso");
          get();
          limpiarCampos();
          setAbrirDialog(0);
        }
      }).catch(error => {
        if (error.response.status === 400) {
          mostrarAdvertencia(toast, "Clave ya Existente");
        }
      });
    };
      confirmar1(action);
  };
  
  //FUNCION PARA LA CONSULTA
  const get = ()=>{
    ubicacioninventarioService.consultarUbicacionInventario().then((response)=>{//CASO EXITOSO
      setubicacioninventarioList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }
  
  //FUNCION PARA LA MODIFICACION
  const put = () => {
    if (id_ubicacion_inventario === datosCopia.id_ubicacion_inventario
      && nombre_ubicacion_inventario === datosCopia.nombre_ubicacion_inventario) {
      mostrarInformacion(toast, "No se han realizado cambios");
      setAbrirDialog(0);
      limpiarCampos();
      return;
    }
    const action = () => {
    ubicacioninventarioService.modificarUbicacionInventario({
      id_ubicacion_inventario: id_ubicacion_inventario,
      nombre_ubicacion_inventario: nombre_ubicacion_inventario
    }).then(response => {
      if (response.status === 200) {
        mostrarExito(toast, "Modificación Exitosa");
        get();
        limpiarCampos();
        setAbrirDialog(0);
      }
    }).catch(error => {
      if (error.response.status === 401) {
        mostrarError(toast, "Error del sistema");
      }
    });
    };
    confirmar1(action);
  };
  
  //FUNCION PARA ELIMINAR
  const delet = (id)=>{
    const action = () => {
    ubicacioninventarioService.eliminarUbicacionInventario(id).then(()=>{
      get();
      mostrarExito(toast, "Eliminación Exitosa");
      limpiarCampos();
    }).catch(error => {
      if (error.response.status === 400) {
        mostrarError(toast, "Existen registros asociados a este elemento");
        get();
      }
    });
    }
    confirmar1(action);
  }  
  
  //!!!EXTRAS DE REGISTRO

  //FUNCION PARA LIMPIAR CAMPOS AL REGISTRAR
  const limpiarCampos = () =>{
    setid_ubicacion_inventario("");
    setnombre_ubicacion_inventario("");
  }

  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'id_ubicacion_inventario', header: 'ID'},
    { field: 'nombre_ubicacion_inventario', header: 'Nombre'},
  ];
  
  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);    
  
  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Ubicacion Inventario</h4>)}
      {abrirDialog===2 && (<h4>Modificar Ubicacion Inventario</h4>)}
    </div>
  );
  
  //LISTA DE OPCIONES DE HERRAMIENTAS
  const Herramientas = () => {
    return (<div className="flex justify-content-between flex-wrap gap-2 align-items-center">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={()=>setAbrirDialog(1)}/>
            </div>              
    );
  };
  
  //BOTON PARA MODIFICAR
  const accionesTabla = (rowData) => {
    return (<>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="m-1"
          onClick={() => {
            setid_ubicacion_inventario(rowData.id_ubicacion_inventario);
            setnombre_ubicacion_inventario(rowData.nombre_ubicacion_inventario);
            setDatosCopia({
              id_ubicacion_inventario: rowData.id_ubicacion_inventario,
              nombre_ubicacion_inventario: rowData.nombre_ubicacion_inventario
            });
            setAbrirDialog(2);
          }}          
        />
        <Button
          icon="pi pi-trash"
          severity='danger'
          rounded
          outlined
          className="m-1"
          onClick={() => {
            delet(rowData.id_ubicacion_inventario);
          }}          
        />        
        </>
    );
  };  

  return (
    <>
      <Toast ref={toast} />
      <Toolbar start={<h2 className="m-0">Ubicacion Inventario</h2>} end={Herramientas}/>
      <ConfirmDialog />
      <Dialog header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">
            <div className="field col-2">
                <label className='font-bold'>ID*</label>
                <InputText disabled={abrirDialog===2} type="text" keyfilter="pint" value={id_ubicacion_inventario} maxLength={10}
                  onChange={(event) => {
                    setid_ubicacion_inventario(event.target.value);
                  }}
                placeholder="Ej.105"
                className="w-full"/>
            </div>
            <div className="field col-10">
                <label className='font-bold'>Nombre*</label>
                <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_ubicacion_inventario} maxLength={255}
                  onChange={(event) => {
                    setnombre_ubicacion_inventario(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>                                         
        </div>
        <div className="formgrid grid justify-content-end">
          <Button label="Cancelar" icon="pi pi-times" outlined className='m-2' onClick={() => {setAbrirDialog(0); limpiarCampos();}} severity='secondary' />
          {abrirDialog===1 && (
            <Button label="Guardar" icon="pi pi-check" className='m-2' onClick={add} severity='success' />
          )}
          {abrirDialog===2 && (
            <Button label="Editar" icon="pi pi-check" className='m-2' onClick={put} severity='success' />
          )}                        
        </div>  
      </Dialog>  
      <DataTable  
      scrollable scrollHeight="78vh"
      value={ubicacioninventarioList} 
      size='small'>
         {columns.map(({ field, header }) => {
              return <Column style={{minWidth:'40vh'}} sortable
              key={field} field={field} header={header}/>;
          })}
          <Column body={accionesTabla} alignFrozen={'right'} frozen={true}></Column>
      </DataTable>           
    </>
  )
}

export default UbicacionInventario