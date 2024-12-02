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
import programaeducativoService from '../services/programaeducativoService';

const Solicitante = () => {
  //VARIABLES PARA MANEJAR MENSAJES
  const toast = useRef(null);  
  //ESTADOS PARA CONDICIONES
  const [abrirDialog,setAbrirDialog] = useState(0);  
  //VARIABLES PARA EL REGISTRO
  const [id_solicitante,setid_solicitante] = useState("");
  const [nombre_solicitante,setnombre_solicitante] = useState("");
  const [apellidop_solicitante,setapellidop_solicitante] = useState("");
  const [apellidom_solicitante,setapellidom_solicitante] = useState("");
  const [semestre,setsemestre] = useState("");
  const [id_programa_educativo,setid_programa_educativo] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [solicitanteList,setsolicitanteList] = useState([]);
  const [programas, setprogramas] = useState([]);
  //VARIABLES PARA MODIFICACIÓN (SIEMPRE SERA UNA COPIA DE LAS VARIABLES DE REGISTRO PARA REALIZAR COMPARACIONES)
  const [datosCopia, setDatosCopia] = useState({
    id_solicitante: "",
    nombre_solicitante: "",
    apellidop_solicitante: "",
    apellidom_solicitante: "",
    semestre: "",
    id_programa_educativo: ""
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
      solicitanteService.registrarSolicitante({
        id_solicitante: id_solicitante,
        nombre_solicitante: nombre_solicitante,
        apellidop_solicitante: apellidop_solicitante,
        apellidom_solicitante: apellidom_solicitante,
        semestre: semestre,
        id_programa_educativo: id_programa_educativo
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
    solicitanteService.consultarSolicitante().then((response)=>{//CASO EXITOSO
      setsolicitanteList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = () => {
    if (id_solicitante === datosCopia.id_solicitante
      && nombre_solicitante === datosCopia.nombre_solicitante
      && apellidop_solicitante === datosCopia.apellidop_solicitante
      && apellidom_solicitante === datosCopia.apellidom_solicitante
      && semestre === datosCopia.semestre
      && id_programa_educativo === datosCopia.id_programa_educativo) {
      mostrarInformacion(toast, "No se han realizado cambios");
      setAbrirDialog(0);
      limpiarCampos();
      return;
    }
    const action = () => {
    solicitanteService.modificarSolicitante({
      id_solicitante: id_solicitante,
      nombre_solicitante: nombre_solicitante,
      apellidop_solicitante: apellidop_solicitante,
      apellidom_solicitante: apellidom_solicitante,
      semestre: semestre,
      id_programa_educativo: id_programa_educativo,
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
    solicitanteService.eliminarSolicitante(id).then(()=>{
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
    setid_solicitante("");
    setnombre_solicitante("");
    setapellidop_solicitante("");
    setapellidom_solicitante("");
    setsemestre("");
    setid_programa_educativo("");
  }  
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'id_solicitante', header: 'ID'},
    { field: 'nombre_solicitante', header: 'Nombre'},
    { field: 'apellidop_solicitante', header: 'Apellido P'},
    { field: 'apellidom_solicitante', header: 'Apellido M'},
    { field: 'semestre', header: 'Semestre'},
    { field: 'id_programa_educativo', header: 'Programa Educativo'}
  ];
  
  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);
  
  //MANDAR A LLAMAR A LA LISTA DE CATEGORIAS
  useEffect(() => {
    programaeducativoService.consultarProgramaEducativo()
      .then(response => {
        setprogramas(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'id_programa_educativo') {
      const programa = programas.find((programa) => programa.id_programa_educativo === rowData.id_programa_educativo);
      return programa ? `${programa.nombre_programa_educativo}` : '';
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };  
  
  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Solicitante</h4>)}
      {abrirDialog===2 && (<h4>Modificar Solicitante</h4>)}
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
            setid_programa_educativo(rowData.id_solicitante);
            setnombre_solicitante(rowData.nombre_solicitante);
            setapellidop_solicitante(rowData.apellidop_solicitante);
            setapellidom_solicitante(rowData.apellidom_solicitante);
            setsemestre(rowData.semestre);
            setid_programa_educativo(rowData.id_programa_educativo);
            setDatosCopia({
              id_solicitante: rowData.id_solicitante,
              nombre_solicitante: rowData.nombre_solicitante,
              apellidop_solicitante: rowData.apellidop_solicitante,
              apellidom_solicitante: rowData.apellidom_solicitante,
              semestre: rowData.semestre,
              id_programa_educativo: rowData.id_programa_educativo,
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
            delet(rowData.id_solicitante);
          }}          
        />        
        </>
    );
  };   

  return (
    <>
      <Toast ref={toast} />
      <Toolbar start={<h2 className="m-0">Material</h2>} end={Herramientas}/>
      <ConfirmDialog />
      <Dialog header={headerTemplate} closable={false} visible={abrirDialog!==0} onHide={() => {setAbrirDialog(0)}}>
        <div className="formgrid grid justify-content-center">
            <div className="field col-2">
                <label className='font-bold'>ID*</label>
                <InputText disabled={abrirDialog===2} type="text" keyfilter="pint" value={id_solicitante} maxLength={10}
                  onChange={(event) => {
                    setid_solicitante(event.target.value);
                  }}
                placeholder="Ej.105"
                className="w-full"/>
            </div>
            <div className="field col-6">
                <label className='font-bold'>Nombre*</label>
                <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_solicitante} maxLength={255}
                  onChange={(event) => {
                    setnombre_solicitante(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>
            <div className="field col-4">
                <label className='font-bold'>Apellido P*</label>
                <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={apellidop_solicitante} maxLength={255}
                  onChange={(event) => {
                    setapellidop_solicitante(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>
            <div className="field col-2">
                <label className='font-bold'>Apellido M*</label>
                <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={apellidom_solicitante} maxLength={255}
                  onChange={(event) => {
                    setapellidom_solicitante(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>
            <div className="field col-2">
                <label className='font-bold'>Semestre*</label>
                <InputText type="text" value={semestre} maxLength={255}
                  onChange={(event) => {
                    setsemestre(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>
            <div className="field col-2">
                <label>Programa Educativo*</label>
                <Dropdown className="w-full"
                value={id_programa_educativo} 
                options={programas} 
                onChange={(e) => {
                    setid_programa_educativo(e.value);
                }} 
                optionLabel="nombre_programa_educativo" 
                optionValue="id_programa_educativo"
                placeholder="Seleccione una Programa E." 
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
      value={solicitanteList} 
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

export default Solicitante