import { useContext } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { useDisclosure } from '@chakra-ui/react';

import { LayoutContext } from '../../shared/context';
import { CalendarDrawer, Header } from '../../shared/components';

import CertificacionesList from './views/Listado';
import CertificacionesExam from './views/Examen/Examen';
import CertificacionesCover from './views/Portada/Portada';

import './Certificaciones.scss';

const Certificaciones = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { showHeader } = useContext(LayoutContext);

  return (
    <>
      {showHeader && (
        <Header
          showSearchbar
          title="Certificaciones"
          calendarState={{ isOpen, onOpen, onClose }}
          goBack={pathname !== '/certificaciones' ? () => navigate('/certificaciones') : undefined}
        />
      )}

      <div className="page-container">
        <Routes>
          <Route index element={<CertificacionesList />} />
          <Route path=":certificacionId" element={<CertificacionesCover />} />
          <Route path=":certificacionId/examen/:examenId" element={<CertificacionesExam />} />
        </Routes>

        <CalendarDrawer state={{ isOpen, onClose }} />
      </div>
    </>
  );
};

export default Certificaciones;
