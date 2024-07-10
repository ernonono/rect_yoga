import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import './index.css';
import 'react-calendar/dist/Calendar.css'
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Poli from './pages/Dashboard/Poli';
import Dokter from './pages/halaman/dokter';
import Riwayat from'./pages/Dashboard/Riwayat';
import Beranda from'./pages/Dashboard/Beranda';
import PilihTanggal from './pages/halaman/kalender';
import Konfirmasi from './pages/halaman/konfirmasi';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/poli' element={<Poli />} />
        <Route path='/dokter' element={<Dokter />} />
        <Route path='/riwayat' element={<Riwayat />} />
        <Route path='/beranda' element={<Beranda />} />
        <Route path='/tanggal' element={<PilihTanggal />} />
        <Route path='/konfirmasi' element={<Konfirmasi />} />
        
        
               
      </Routes>
    </BrowserRouter>
  );
}

export default App;