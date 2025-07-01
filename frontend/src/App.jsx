import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import HomePresidente from './pages/HomePresidente';
import Register from './pages/Register';
import HomeAdmin from './pages/HomeAdmin';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/home" element={<HomePresidente />} />
        <Route path="/home" element={<HomeAdmin />} />
      </Routes>
    </BrowserRouter>
  );
}
