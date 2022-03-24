import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '../../shared/components';

import VacantesTable from './views/Vacantes/Table';
import VacantesForm from './views/Vacantes/Form/Form';
import VacantesInformation from './views/Vacantes/Information/Information';

import EmpresasTable from './views/Empresas/Table';
import EmpresasForm from './views/Empresas/Form/Form';
import EmpresasInformation from './views/Empresas/Information/Information';

import './Clientes.scss';

const Clientes = () => {
  const [breadcrumbChildren, setBreadcrumbChildren] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let path = location.pathname;

    if (path.startsWith('/clientes/vacantes')) {
      if (path === '/clientes/vacantes/new') setBreadcrumbChildren('Nueva vacante');
      else if (path !== '/clientes/vacantes') setBreadcrumbChildren('Información de la vacante');
      else setBreadcrumbChildren('');
    } else if (path.startsWith('/clientes/empresas')) {
      if (path === '/clientes/empresas/new') setBreadcrumbChildren('Nueva empresa');
      else if (path !== '/clientes/empresas') setBreadcrumbChildren('Información de la empresa');
      else setBreadcrumbChildren('');
    }
  }, [location.pathname]);

  return (
    <div className="page-container">
      <Header
        head={{
          title: 'Clientes',
          onClick: location.pathname.startsWith('/clientes/empresas')
            ? () => navigate('/clientes/empresas')
            : () => navigate('/clientes/vacantes'),
          children: breadcrumbChildren ? [{ title: breadcrumbChildren, isActive: true }] : undefined,
        }}
      />

      <div className="page-body">
        <Routes>
          <Route path="vacantes">
            <Route index element={<VacantesTable />} />
            <Route path="new" element={<VacantesForm />} />
            <Route path=":vacanteID" element={<VacantesInformation />} />
          </Route>

          <Route path="empresas">
            <Route index element={<EmpresasTable />} />
            <Route path="new" element={<EmpresasForm />} />
            <Route path=":empresaID" element={<EmpresasInformation />} />
          </Route>

          <Route path="*" element={<Navigate to="/clientes/vacantes" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Clientes;
