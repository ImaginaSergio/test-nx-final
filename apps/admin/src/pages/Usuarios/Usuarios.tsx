import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';

import { Header } from '../../shared/components';

import GruposTable from './views/Grupos/Table';
import AlumnosTable from './views/Alumnos/Table';
import ProfesoresTable from './views/Profesores/Table';
import AlumnosInformation from './views/Alumnos/Information/Information';
import GruposInformation from './views/Grupos/Information/Information';
import ProfesoresInformation from './views/Profesores/Information/Information';

import './Usuarios.scss';

const Usuarios = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [breadcrumbChildren, setBreadcrumbChildren] = useState<string>('');
  const [breadcrumbNavigate, setBreadcrumbNavigate] = useState<string>('');

  useEffect(() => {
    let path = location.pathname;

    if (path.startsWith('/usuarios/profesores')) {
      if (path === '/usuarios/profesores') {
        setBreadcrumbChildren('');
        setBreadcrumbNavigate('');
      } else {
        setBreadcrumbChildren('Información del profesor');
        setBreadcrumbNavigate('/usuarios/profesores');
      }
    } else if (path.startsWith('/usuarios/grupos')) {
      if (path === '/usuarios/grupos') {
        setBreadcrumbChildren('');
        setBreadcrumbNavigate('');
      } else {
        setBreadcrumbChildren('Información del grupo');
        setBreadcrumbNavigate('/usuarios/grupos');
      }
    } else {
      if (path === '/usuarios') {
        setBreadcrumbChildren('');
        setBreadcrumbNavigate('');
      } else {
        setBreadcrumbChildren('Información del alumno');
        setBreadcrumbNavigate('/usuarios');
      }
    }
  }, [location.pathname]);

  return (
    <div className="page-container">
      <Header
        head={{
          title: 'Usuarios',
          onClick: () => navigate(breadcrumbNavigate),
          children: breadcrumbChildren ? [{ title: breadcrumbChildren, isActive: true }] : undefined,
        }}
      />

      <div className="page-body">
        <Routes>
          <Route index element={<AlumnosTable />} />
          <Route path=":userID" element={<AlumnosInformation />} />

          <Route path="profesores">
            <Route index element={<ProfesoresTable />} />
            <Route path=":userID" element={<ProfesoresInformation />} />
          </Route>

          <Route path="grupos">
            <Route index element={<GruposTable />} />
            <Route path=":grupoID" element={<GruposInformation />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default Usuarios;
