import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '../../shared/components';

import CertificacionesForm from './views/Form';
import CertificacionesTable from './views/Table';
import CertificacionesMetricas from './views/Metricas';
import CertificacionesInformation from './views/Information/Information';

import './Certificaciones.scss';

const Certificaciones = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [breadcrumbChildren, setBreadcrumbChildren] = useState<string>('');

  useEffect(() => {
    let path = location.pathname;

    if (path === '/certificaciones/new') setBreadcrumbChildren('Nuevo curso');
    else if (path === '/certificaciones/metricas') setBreadcrumbChildren('Métricas');
    else if (path !== '/certificaciones') setBreadcrumbChildren('Información del curso');
    else setBreadcrumbChildren('');
  }, [location.pathname]);

  return (
    <div className="page-container">
      <Header
        head={{
          title: 'Formaciones',
          onClick: () => navigate('/certificaciones'),
          children: breadcrumbChildren ? [{ title: breadcrumbChildren, isActive: true }] : undefined,
        }}
      />

      <div className="page-body">
        <Routes>
          <Route index element={<CertificacionesTable />} />
          <Route path="metricas" element={<CertificacionesMetricas />} />
          <Route path="new" element={<CertificacionesForm />} />
          <Route path=":certificacionID" element={<CertificacionesInformation />} />
        </Routes>
      </div>
    </div>
  );
};

export default Certificaciones;
