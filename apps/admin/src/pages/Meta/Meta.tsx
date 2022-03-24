import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import { Header } from '../../shared/components';

import RutasForm from './views/Rutas/Form';
import RutasTable from './views/Rutas/Table';
import RutasInformation from './views/Rutas/Information';
import HabilidadesForm from './views/Habilidades/Form';
import HabilidadesTable from './views/Habilidades/Table';
import HabilidadesInformation from './views/Habilidades/Information';
import PlantillasTable from './views/Plantillas/Table';
import PlantillasForm from './views/Plantillas/Form';
import PlantillasInformation from './views/Plantillas/Information';

import './Meta.scss';

const Meta = () => {
  const [headerTitle, setHeaderTitle] = useState('Habilidades');
  const [headerTitlePath, setHeaderTitlePath] = useState<any>('');
  const [breadcrumbChildren, setBreadcrumbChildren] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let path = location.pathname;

    if (path.startsWith('/meta/habilidades')) {
      setHeaderTitle('Habilidades');
      setHeaderTitlePath('/meta/habilidades');

      if (path === '/meta/habilidades/new') setBreadcrumbChildren('Nueva habilidad');
      else if (path !== '/meta/habilidades') setBreadcrumbChildren('Información de la habilidad');
      else setBreadcrumbChildren('');
    } else if (path.startsWith('/meta/rutas')) {
      setHeaderTitle('Hojas de ruta');
      setHeaderTitlePath('/meta/rutas');

      if (path === '/meta/rutas/new') setBreadcrumbChildren('Nueva hoja de ruta');
      else if (path !== '/meta/rutas') setBreadcrumbChildren('Información de la hoja de ruta');
      else setBreadcrumbChildren('');
    } else if (path.startsWith('/meta/plantillas')) {
      setHeaderTitle('Plantillas');
      setHeaderTitlePath('/meta/plantillas');

      if (path === '/meta/plantillas/new') setBreadcrumbChildren('Nueva plantilla');
      else if (path !== '/meta/plantillas') setBreadcrumbChildren('Información de la plantilla');
      else setBreadcrumbChildren('');
    } else {
      setHeaderTitle('');
      setHeaderTitlePath('');
      setBreadcrumbChildren('');
    }
  }, [location.pathname]);

  return (
    <div className="page-container">
      <Header
        head={{
          title: headerTitle,
          onClick: () => navigate(headerTitlePath),
          children: breadcrumbChildren ? [{ title: breadcrumbChildren, isActive: true }] : undefined,
        }}
      />

      <div className="page-body">
        <Routes>
          <Route path="habilidades">
            <Route index element={<HabilidadesTable />} />
            <Route path="new" element={<HabilidadesForm />} />
            <Route path=":habilidadID" element={<HabilidadesInformation />} />
          </Route>

          <Route path="rutas">
            <Route index element={<RutasTable />} />
            <Route path="new" element={<RutasForm />} />
            <Route path=":rutaID" element={<RutasInformation />} />
          </Route>

          <Route path="plantillas">
            <Route index element={<PlantillasTable />} />
            <Route path="new" element={<PlantillasForm />} />
            <Route path=":plantillaID" element={<PlantillasInformation />} />
          </Route>

          <Route path="*" element={<Navigate to="/meta/habilidades" />} />
        </Routes>
      </div>
    </div>
  );
};

export default Meta;
