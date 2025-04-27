import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import Layout from '../components/Layout';
import Register from '../pages/guest/Register';
import Login from '../pages/guest/Login';
import RequireAuth from './RequireAuth';
import NewDirective from '../pages/NewDirective';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/register" element={<Layout><Register /></Layout>} />
      <Route path="/login" element={<Layout><Login /></Layout>} />

      <Route path="*" element={<Layout><></></Layout>}/>

      <Route path="/new-directive" element={<Layout><NewDirective /></Layout>}/>
      
      <Route path="/" element={<RequireAuth allowedRoles={['ROLE_USER']}><Layout><Home /></Layout></RequireAuth>} />
      <Route path="/about" element={<RequireAuth allowedRoles={['ROLE_ADMIN']}><Layout><About /></Layout></RequireAuth>} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
