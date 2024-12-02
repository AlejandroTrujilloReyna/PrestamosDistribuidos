import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import 'primereact/resources/themes/arya-green/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import Menu from './components/Menu';
import Inicio from './components/Inicio';
import Categoria from './components/Categoria';
import Inventario from './components/Inventario';
import Material from './components/Material';
import Prestamo from './components/Prestamo';
import ProgramaEducativo from './components/ProgramaEducativo';
import Solicitante from './components/Solicitante';
import UbicacionInventario from './components/UbicacionInventario';

function App() {
  return (
    <div className="App">
      <Menu/>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Inicio/>}/>
          <Route path='/Categoria' element={<Categoria/>}/>
          <Route path='/Inventario' element={<Inventario/>}/>
          <Route path='/Material' element={<Material/>}/>
          <Route path='/Prestamo' element={<Prestamo/>}/>
          <Route path='/ProgramaEducativo' element={<ProgramaEducativo/>}/>
          <Route path='/Solicitante' element={<Solicitante/>}/>
          <Route path='/UbicacionInventario' element={<UbicacionInventario/>}/>
        </Routes>
      </BrowserRouter>    
    </div>
  );
}

export default App;
