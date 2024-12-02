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
import solicitanteService from '../services/solicitanteService';
import materialService from '../services/materialService';
import prestamoService from '../services/prestamoService';

const Prestamo = () => {
  //VARIABLES PARA MANEJAR MENSAJES
  const toast = useRef(null);  
  //ESTADOS PARA CONDICIONES
  const [abrirDialog,setAbrirDialog] = useState(0);  
  //VARIABLES PARA EL REGISTRO
  const [id_prestamo,setid_prestamo] = useState("");
  const [fecha_prestamo,setfecha_prestamo] = useState("");
  const [fecha_devolucion,setfecha_devolucion] = useState("");
  const [id_material,setid_material] = useState("");
  const [id_solicitante,setid_solicitante] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [prestamoList,setprestamoList] = useState([]);
  const [solicitantes, setsolicitantes] = useState([]);
  const [materiales, setmateriales] = useState([]);
  //VARIABLES PARA MODIFICACIÓN (SIEMPRE SERA UNA COPIA DE LAS VARIABLES DE REGISTRO PARA REALIZAR COMPARACIONES)
  const [datosCopia, setDatosCopia] = useState({
    id_prestamo: "",
    fecha_prestamo: "",
    fecha_devolucion: "",
    id_material: "",
    id_solicitante: "",
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
      prestamoService.registroPrestamo({
        id_prestamo: id_prestamo,
        fecha_prestamo: fecha_prestamo,
        fecha_devolucion: fecha_devolucion,
        id_material: id_material,
        id_solicitante: id_solicitante
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
    prestamoService.consultaPrestamo().then((response)=>{//CASO EXITOSO
      setprestamoList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = () => {
    if (id_prestamo === datosCopia.id_prestamo
      && fecha_prestamo === datosCopia.fecha_prestamo
      && fecha_devolucion === datosCopia.fecha_devolucion
      && id_material === datosCopia.id_material
      && id_solicitante === datosCopia.id_solicitante) {
      mostrarInformacion(toast, "No se han realizado cambios");
      setAbrirDialog(0);
      limpiarCampos();
      return;
    }
    const action = () => {
    prestamoService.modificarPrestamo({
      id_prestamo: id_prestamo,
      fecha_prestamo: fecha_prestamo,
      fecha_devolucion: fecha_devolucion,
      id_material: id_material,
      id_solicitante: id_solicitante
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
    prestamoService.eliminarPrestamo(id).then(()=>{
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
    setid_prestamo("");
    setfecha_prestamo("");
    setfecha_devolucion("");
    setid_material("");
    setid_solicitante("");
  }  
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'id_prestamo', header: 'ID'},
    { field: 'fecha_prestamo', header: 'Fecha de prestamo'},
    { field: 'fecha_devolucion', header: 'Fecha de devolucion'},
    { field: 'id_material', header: 'Material'},
    { field: 'id_solicitante', header: 'Solicitante'}
  ];
  
  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);
  
  //MANDAR A LLAMAR A LA LISTA DE CATEGORIAS
  useEffect(() => {
    materialService.consultarMaterial()
      .then(response => {
        setmateriales(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);

  //MANDAR A LLAMAR A LA LISTA DE CATEGORIAS
  useEffect(() => {
    solicitanteService.consultarSolicitante()
      .then(response => {
        setsolicitantes(response.data);
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
    }
    else if (field === 'id_solicitante') {
        const solicitante = solicitantes.find((solicitante) => solicitante.id_solicitante === rowData.id_solicitante);
        return solicitante ? `${solicitante.nombre_solicitante}` : '';
    }    
    else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };  
  
  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Prestamo</h4>)}
      {abrirDialog===2 && (<h4>Modificar Prestamo</h4>)}
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
            setid_prestamo(rowData.id_prestamo);
            setfecha_prestamo(rowData.fecha_prestamo);
            setfecha_devolucion(rowData.fecha_devolucion);
            setid_material(rowData.id_material);
            setid_solicitante(rowData.id_solicitante);
            setDatosCopia({
              id_prestamo: rowData.id_prestamo,
              fecha_prestamo: rowData.fecha_prestamo,
              fecha_devolucion: rowData.fecha_devolucion,
              id_material: rowData.id_material,
              id_solicitante: rowData.id_solicitante
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
            delet(rowData.id_prestamo);
          }}          
        />        
        </>
    );
  };   

  return (
    <>
      <Toast ref={toast} />
      <Toolbar start={<h2 className="m-0">Prestamo</h2>} end={Herramientas}/>
      <ConfirmDialog />
      <Dialog header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">
            <div className="field col-2">
                <label className='font-bold'>ID*</label>
                <InputText disabled={abrirDialog===2} type="text" keyfilter="pint" value={id_prestamo} maxLength={10}
                  onChange={(event) => {
                    setid_prestamo(event.target.value);
                  }}
                placeholder="Ej.105"
                className="w-full"/>
            </div>
            <div className="field col-2">
                <label className='font-bold'>Fecha de Prestamo*</label>
                <InputText type="text" value={fecha_prestamo} maxLength={255}
                  onChange={(event) => {
                    setfecha_prestamo(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>
            <div className="field col-2">
                <label className='font-bold'>Fecha de Devolucion*</label>
                <InputText type="text" value={fecha_devolucion} maxLength={255}
                  onChange={(event) => {
                    setfecha_devolucion(event.target.value);
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
                placeholder="Seleccione un Material" 
                />               
            </div>
            <div className="field col-2">
                <label>Solicitante*</label>
                <Dropdown className="w-full"
                value={id_solicitante} 
                options={solicitantes} 
                onChange={(e) => {
                    setid_solicitante(e.value);
                }} 
                optionLabel="nombre_solicitante" 
                optionValue="id_solicitante"
                placeholder="Seleccione un Solicitante" 
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
      value={prestamoList} 
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

export default Prestamo