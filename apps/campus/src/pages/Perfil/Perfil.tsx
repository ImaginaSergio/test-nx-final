import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDisclosure } from '@chakra-ui/react';

import PerfilSettings from './views/Settings/Settings';
import { LayoutContext } from '../../shared/context';
import { CalendarDrawer, Header } from '../../shared/components';

import './Perfil.scss';

const Perfil = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { showHeader, setShowHeader, setShowSidebar } = useContext(LayoutContext);

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  return (
    <>
      {showHeader && <Header showSearchbar goBack={() => navigate(-1)} calendarState={{ isOpen, onOpen, onClose }} />}

      <div className="page-container">
        <PerfilSettings />

        <CalendarDrawer state={{ isOpen, onClose }} />
      </div>
    </>
  );
};

export default Perfil;
