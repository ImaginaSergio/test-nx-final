import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '../../shared/components';

import CursosInformation from './views/Information/Information';
import CursosMetricas from './views/Metricas';
import CursosTable from './views/Table/Table';
import CursosForm from './views/Form';

import './Cursos.scss';

enum ViewEnum {
  TABLE = 'table',
  FORM = 'form',
  METRICAS = 'metricas',
  INFORMATION = 'information',
}

const Cursos = () => {
  const [view, setView] = useState(ViewEnum.TABLE);
  const [breadcrumbChildren, setBreadcrumbChildren] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let path = location.pathname;

    if (path === '/cursos/new') {
      setView(ViewEnum.FORM);
      setBreadcrumbChildren('Nuevo curso');
    } else if (path === '/cursos/metricas') {
      setView(ViewEnum.METRICAS);
      setBreadcrumbChildren('Métricas');
    } else if (path !== '/cursos') {
      setView(ViewEnum.INFORMATION);
      setBreadcrumbChildren('Información del curso');
    } else {
      setView(ViewEnum.TABLE);
      setBreadcrumbChildren('');
    }
  }, [location.pathname]);

  return (
    <div className="page-container">
      <Header
        head={{
          title: 'Formaciones',
          onClick: () => navigate('/cursos'),
          children: breadcrumbChildren ? [{ title: breadcrumbChildren, isActive: true }] : undefined,
        }}
      />

      <div className="page-body">
        <Routes>
          <Route index element={<CursosTable />} />
          <Route path="metricas" element={<CursosMetricas />} />
          <Route path="new" element={<CursosForm />} />
          <Route path=":cursoID" element={<CursosInformation />} />
        </Routes>
      </div>
    </div>
  );
};

export default Cursos;
