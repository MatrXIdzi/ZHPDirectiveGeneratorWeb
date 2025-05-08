import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import About from '../pages/About';
import LayoutGuest from '../components/layout/LayoutGuest';
import LayoutUser from '../components/layout/LayoutUser';
import Register from '../pages/guest/Register';
import Login from '../pages/guest/Login';
import RequireAuth from './RequireAuth';
import NewDirective from '../pages/NewDirective';
import Main from '../pages/client/Main';
import DirectiveList from '../pages/DirectiveList';
import PersonalData from '../pages/PersonalData';

const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/register" element={<RequireAuth noToken><LayoutGuest><Register /></LayoutGuest></RequireAuth>} />
      <Route path="/login" element={<RequireAuth noToken><LayoutGuest><Login /></LayoutGuest></RequireAuth>} />

      <Route path="*" element={<LayoutGuest><></></LayoutGuest>}/>
      <Route path="/main" element={<LayoutUser><Main /></LayoutUser>}/>

      <Route path="/personal-data" element={<RequireAuth allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}><LayoutUser><PersonalData /></LayoutUser></RequireAuth>} />

      <Route path="/new-directive" element={<RequireAuth allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}><LayoutUser><NewDirective /></LayoutUser></RequireAuth>}/>
      
      <Route path="/directive-list" element={<RequireAuth allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}><LayoutUser><DirectiveList /></LayoutUser></RequireAuth>} />

      <Route path="/" element={<RequireAuth allowedRoles={['ROLE_USER', 'ROLE_ADMIN']}><LayoutUser><Home /></LayoutUser></RequireAuth>} />
      <Route path="/about" element={<RequireAuth allowedRoles={['ROLE_ADMIN']}><LayoutUser><About /></LayoutUser></RequireAuth>} />
    </Routes>
  </BrowserRouter>
);

export default AppRouter;
