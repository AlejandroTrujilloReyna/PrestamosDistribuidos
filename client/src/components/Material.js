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
import categoriaService from '../services/categoriaService';
import materialService from '../services/materialService';

const Material = () => {
  //VARIABLES PARA MANEJAR MENSAJES
  const toast = useRef(null);  
  //ESTADOS PARA CONDICIONES
  const [abrirDialog,setAbrirDialog] = useState(0);  
  //VARIABLES PARA EL REGISTRO
  const [id_material,setid_material] = useState("");
  const [nombre_material,setnombre_material] = useState("");
  const [descripcion_material,setdescripcion_material] = useState("");
  const [marca,setmarca] = useState("");
  const [modelo,setmodelo] = useState("");
  const [estado,setestado] = useState("");
  const [id_categoria,setid_categoria] = useState("");
  //VARIABLES PARA LA CONSULTA
  const [materialList,setmaterialList] = useState([]);
  const [categorias, setcategorias] = useState([]);
  //VARIABLES PARA MODIFICACIÓN (SIEMPRE SERA UNA COPIA DE LAS VARIABLES DE REGISTRO PARA REALIZAR COMPARACIONES)
  const [datosCopia, setDatosCopia] = useState({
    id_material: "",
    nombre_material: "",
    descripcion_material: "",
    marca: "",
    modelo: "",
    estado: "",
    id_categoria: ""
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
      materialService.registrarMaterial({
        id_material: id_material,
        nombre_material: nombre_material,
        descripcion_material: descripcion_material,
        marca: marca,
        modelo: modelo,
        estado: estado,
        id_categoria: id_categoria
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
    materialService.consultarMaterial().then((response)=>{//CASO EXITOSO
      setmaterialList(response.data);  
    }).catch(error=>{//EXCEPCIONES
      if (error.response.status === 500) {
        //mostrarError("Error del sistema");
      }
    });    
  }

  //FUNCION PARA LA MODIFICACION
  const put = () => {
    if (id_material === datosCopia.id_material
      && nombre_material === datosCopia.nombre_material
      && descripcion_material === datosCopia.descripcion_material
      && marca === datosCopia.marca
      && modelo === datosCopia.modelo
      && estado === datosCopia.estado
      && id_categoria === datosCopia.id_categoria) {
      mostrarInformacion(toast, "No se han realizado cambios");
      setAbrirDialog(0);
      limpiarCampos();
      return;
    }
    const action = () => {
    materialService.modificarMaterial({
      id_material: id_material,
      nombre_material: nombre_material,
      descripcion_material: descripcion_material,
      marca: marca,
      modelo: modelo,
      estado: estado,
      id_categoria: id_categoria
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
    materialService.eliminarMaterial(id).then(()=>{
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
    setid_material("");
    setnombre_material("");
    setdescripcion_material("");
    setmarca("");
    setmodelo("");
    setestado("");
    setid_categoria("");
  }  
  
  //!!!EXTRAS DE CONSULTA

  //COLUMNAS PARA LA TABLA
  const columns = [
    { field: 'id_material', header: 'ID'},
    { field: 'nombre_material', header: 'Nombre'},
    { field: 'descripcion_material', header: 'Descripcion'},
    { field: 'marca', header: 'Marca'},
    { field: 'modelo', header: 'Modelo'},
    { field: 'estado', header: 'Estado'},
    { field: 'id_categoria', header: 'Categoria'},
  ];
  
  //MANDAR A LLAMAR LOS DATOS EN CUANTO SE INGRESA A LA PAGINA
  useEffect(() => {
    get();
  }, []);
  
  //MANDAR A LLAMAR A LA LISTA DE CATEGORIAS
  useEffect(() => {
    categoriaService.consultarCategoria()
      .then(response => {
        setcategorias(response.data);
      })
      .catch(error => {
        console.error("Error fetching unidades académicas:", error);
      });
  }, []);

  //FUNCION PARA QUE SE MUESTRE INFORMACION ESPECIFICA DE LAS LLAVES FORANEAS
  const renderBody = (rowData, field) => {
    if (field === 'id_categoria') {
      const categoria = categorias.find((categoria) => categoria.id_categoria === rowData.id_categoria);
      return categoria ? `${categoria.nombre_categoria}` : '';
    }else {
      return rowData[field]; // Si no es 'clave_UnidadAcademica' ni 'clave_ProgramaEducativo', solo retorna el valor del campo
    }
  };  
  
  //!!!EXTRAS GENERALES

  //ENCABEZADO DEL DIALOG
  const headerTemplate = (
    <div className="formgrid grid justify-content-center border-bottom-1 border-300">
      {abrirDialog===1 && (<h4>Registrar Material</h4>)}
      {abrirDialog===2 && (<h4>Modificar Material</h4>)}
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
            setid_material(rowData.id_material);
            setnombre_material(rowData.nombre_material);
            setdescripcion_material(rowData.descripcion_material);
            setmarca(rowData.marca);
            setmodelo(rowData.modelo);
            setestado(rowData.estado);
            setid_categoria(rowData.id_categoria);
            setDatosCopia({
              id_material: rowData.id_material,
              nombre_material: rowData.nombre_material,
              descripcion_material: rowData.descripcion_material,
              marca: rowData.marca,
              modelo: rowData.modelo,
              estado: rowData.estado,
              id_categoria: rowData.id_categoria
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
            delet(rowData.id_material);
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
                <InputText disabled={abrirDialog===2} type="text" keyfilter="pint" value={id_material} maxLength={10}
                  onChange={(event) => {
                    setid_material(event.target.value);
                  }}
                placeholder="Ej.105"
                className="w-full"/>
            </div>
            <div className="field col-6">
                <label className='font-bold'>Nombre*</label>
                <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={nombre_material} maxLength={255}
                  onChange={(event) => {
                    setnombre_material(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>
            <div className="field col-4">
                <label className='font-bold'>Descripcion*</label>
                <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={descripcion_material} maxLength={255}
                  onChange={(event) => {
                    setdescripcion_material(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>
            <div className="field col-2">
                <label className='font-bold'>Marca*</label>
                <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={marca} maxLength={255}
                  onChange={(event) => {
                    setmarca(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>
            <div className="field col-2">
                <label className='font-bold'>Modelo*</label>
                <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={modelo} maxLength={255}
                  onChange={(event) => {
                    setmodelo(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>
            <div className="field col-2">
                <label className='font-bold'>Estado*</label>
                <InputText type="text" keyfilter={/^[a-zA-Z\s]+$/} value={estado} maxLength={255}
                  onChange={(event) => {
                    setestado(event.target.value);
                  }}
                placeholder="Ej.Laptop"
                className="w-full"/>              
            </div>
            <div className="field col-2">
                <label>Material*</label>
                <Dropdown className="w-full"
                value={id_categoria} 
                options={categorias} 
                onChange={(e) => {
                    setid_categoria(e.value);
                }} 
                optionLabel="nombre_categoria" 
                optionValue="id_categoria"
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
      value={materialList} 
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

export default Material