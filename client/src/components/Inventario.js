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
import { Dropdown } from 'primereact/dropdown';
import { Toolbar } from 'primereact/toolbar';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { mostrarExito, mostrarAdvertencia, mostrarError, mostrarInformacion } from '../services/ToastService';
import ubicacioninventarioService from '../services/ubicacioninventarioService';
import materialService from '../services/materialService';
import inventarioService from '../services/inventarioService';

const Inventario = () => {
  //VARIABLES PARA MANEJAR MENSAJES
  const toast = useRef(null);  
  //ESTADOS PARA CONDICIONES
  const [abrirDialog,setAbrirDialog] = useState(0);  
  //VARIABLES PARA EL REGISTRO
  const [id_inventario,setid_inventario] = useState("");
  const [nombre_inventario,setnombre_inventario] = useState("");
  const [id_material,setid_material] = useState("");
  const [id_ubicacion_inventario,setid_ubicacion_inventario] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [inventarioList,setinventarioList] = useState([]);
  const [materiales, setmateriales] = useState([]);
  const [ubicaciones, setubicaciones] = useState([]);
  //VARIABLES PARA MODIFICACIÓN (SIEMPRE SERA UNA COPIA DE LAS VARIABLES DE REGISTRO PARA REALIZAR COMPARACIONES)
  const [datosCopia, setDatosCopia] = useState({
    id_inventario: "",
    nombre_inventario: "",
    id_material: "",
    id_ubicacion_inventario: "",
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
      inventarioService.registrarInventario({
        id_inventario: id_inventario,
        nombre_inventario: nombre_inventario,
        id_material: id_material,
        id_ubicacion_inventario: id_ubicacion_inventario
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
    inventarioService.consultarInventario().then((response)=>{//CASO EXITOSO
      setinventarioList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = () => {
    if (id_inventario === datosCopia.id_inventario
      && nombre_inventario === datosCopia.nombre_inventario
      && id_material === datosCopia.id_material
      && id_ubicacion_inventario === datosCopia.id_ubicacion_inventario) {
      mostrarInformacion(toast, "No se han realizado cambios");
      setAbrirDialog(0);
      limpiarCampos();
      return;
    }
    const action = () => {
    inventarioService.modificarInventario({
      id_inventario: id_inventario,
      nombre_inventario: nombre_inventario,
      id_material: id_material,
      id_ubicacion_inventario: id_ubicacion_inventario
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
    inventarioService.eliminarInventario(id).then(()=>{
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
    setid_inventario("");
    setnombre_inventario("");
    setid_material("");
    setid_ubicacion_inventario("");
  }  
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'id_inventario', header: 'ID'},
    { field: 'nombre_inventario', header: 'Nombre'},
    { field: 'id_material', header: 'Material'},
    { field: 'id_ubicacion_inventario', header: 'Ubicacion'}
  ];
  
  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);
  
  //MANDAR A LLAMAR A LA LISTA DE MATERIALES
  useEffect(() => {
    materialService.consultarMaterial()
      .then(response => {
        setmateriales(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);

  //MANDAR A LLAMAR A LA LISTA DE UBICACIONES
  useEffect(() => {
    ubicacioninventarioService.consultarUbicacionInventario()
      .then(response => {
        setubicaciones(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);  

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'id_material') {
      const material = materiales.find((material) => material.id_material === rowData.id_material);
      return material ? `${material.nombre_material}` : '';
    }else if (field === 'id_ubicacion_inventario') {
        const ubicacion = ubicaciones.find((ubicacion) => ubicacion.id_ubicacion_inventario === rowData.id_ubicacion_inventario);
        return ubicacion ? `${ubicacion.nombre_ubicacion_inventario}` : '';
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };  
  
  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Inventario</h4>)}
      {abrirDialog===2 && (<h4>Modificar Inventario</h4>)}
    </div>
  );
  
  //LISTA DE OPCIONES DE HERRAMIENTAS
  const Herramientas = () => {
    return (<div className="flex justify-content-between flex-wrap gap-2 align-items-center">
            <Button label="Nuevo" icon="pi pi-plus" severity="success" onClick={()=>setAbrirDialog(1)}/>
            </div>              
    );
  }; 
  
  //BOTON PARA MODIFICAR Y ELIMINAR
  const accionesTabla = (rowData) => {
    return (<>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="m-1"
          onClick={() => {
            setid_inventario(rowData.id_inventario);
            setnombre_inventario(rowData.nombre_inventario);
            setid_material(rowData.id_material);
            setid_ubicacion_inventario(rowData.id_ubicacion_inventario);
            setDatosCopia({
              id_inventario: rowData.id_inventario,
              nombre_inventario: rowData.nombre_inventario,
              id_material: rowData.id_material,
              id_ubicacion_inventario: rowData.id_ubicacion_inventario
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
            delet(rowData.id_inventario);
          }}          
        />        
        </>
    );
  };   

  return (
    <>
      <Toast ref={toast} />
      <Toolbar start={<h2 className="m-0">Inventario</h2>} end={Herramientas}/>
      <ConfirmDialog />
      <Dialog header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">
            <div className="field col-2">
                <label className='font-bold'>ID*</label>
                <InputText disabled={abrirDialog===2} type="text" keyfilter="pint" value={id_inventario} maxLength={10}
                  onChange={(event) => {
                    setid_inventario(event.target.value);
                  }}
                placeholder="Ej.105"
                className="w-full"/>
            </div>
            <div className="field col-4">
                <label className='font-bold'>Nombre*</label>
                <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_inventario} maxLength={255}
                  onChange={(event) => {
                    setnombre_inventario(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>
            <div className="field col-2">
                <label>Material*</label>
                <Dropdown className="w-full"
                value={id_material} 
                options={materiales} 
                onChange={(e) => {
                    setid_material(e.value);
                }} 
                optionLabel="nombre_material" 
                optionValue="id_material"
                placeholder="Seleccione una Categoria" 
                />             
            </div>  
            <div className="field col-3">
                <label>Ubicación*</label>
                <Dropdown className="w-full"
                value={id_ubicacion_inventario} 
                options={ubicaciones} 
                onChange={(e) => {
                    setid_ubicacion_inventario(e.value);
                }} 
                optionLabel="nombre_ubicacion_inventario" 
                optionValue="id_ubicacion_inventario"
                placeholder="Seleccione una Categoria" 
                />             
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
      value={inventarioList} 
      size='small'>
         {columns.map(({ field, header }) => {
              return <Column style={{minWidth:'40vh'}} sortable body={(rowData) => renderBody(rowData, field)}
              key={field} field={field} header={header}/>;
          })}
          <Column body={accionesTabla} alignFrozen={'right'} frozen={true} ></Column>
      </DataTable>     
    </>
  )
}

export default Inventario