import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import HomePresidente from './pages/HomePresidente/HomePresidente';
import Register from './pages/Register';
import HomeAdmin from './pages/HomeAdmin/HomeAdmin';
import HomeVotante from './pages/HomeVotante/HomeVotante';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/homePresidente" element={<HomePresidente />} />
        <Route path="/homeAdmin" element={<HomeAdmin />} />
        <Route path="/homeVotante" element={<HomeVotante />} />
      </Routes>
    </BrowserRouter>
  );
}
