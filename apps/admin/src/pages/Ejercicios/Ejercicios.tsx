import { useEffect, useState } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';

import { Header } from '../../shared/components';

import Listado from './views/Table';
import Correccion from './views/Correccion/Information';

import './Ejercicios.scss';

const Ejercicios = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [breadcrumbChildren, setBreadcrumbChildren] = useState<string>('');

  useEffect(() => {
    let path = location.pathname;

    if (path !== '/ejercicios') setBreadcrumbChildren('Corrección del ejercicio');
    else setBreadcrumbChildren('');
  }, [location.pathname]);

  return (
    <div className="page-container">
      <Header
        head={{
          title: 'Ejercicios',
          onClick: () => navigate('/ejercicios'),
          children: breadcrumbChildren ? [{ title: breadcrumbChildren, isActive: true }] : undefined,
        }}
      />

      <div className="page-body">
        <Routes>
          <Route index element={<Listado />} />
          <Route path=":ejercicioID" element={<Correccion />} />
        </Routes>
      </div>
    </div>
  );
};

export default Ejercicios;
