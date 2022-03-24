import { useContext, useEffect, useState } from 'react';
import { Route, useNavigate, useLocation, Routes } from 'react-router-dom';

import { useDisclosure } from '@chakra-ui/react';

import ComunidadList from './views/Listado';
import { LayoutContext } from '../../shared/context';
import { CalendarDrawer, Header } from '../../shared/components';

import './Comunidad.scss';
import { NuevoProyecto } from './views/NuevoProyecto';

const Comunidad = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const [lastQuery, setLastQuery] = useState<string>('');

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { showHeader, setShowHeader, setShowSidebar } = useContext(LayoutContext);

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  return (
    <>
      {showHeader && (
        <Header
          showSearchbar
          title="Comunidad"
          calendarState={{ isOpen, onOpen, onClose }}
          goBack={pathname !== '/comunidad' ? () => navigate('/comunidad') : undefined}
        />
      )}

      <div className="page-container">
        <Routes>
          <Route index element={<ComunidadList setLastQuery={setLastQuery} />} />
          <Route path="new" element={<NuevoProyecto />} />
          <Route path="edit/:proyecto" element={<NuevoProyecto />} />

          <Route path=":proyectoID" element={<ComunidadList setLastQuery={setLastQuery} />} />
        </Routes>

        <CalendarDrawer state={{ isOpen, onClose }} />
      </div>
    </>
  );
};

export default Comunidad;
