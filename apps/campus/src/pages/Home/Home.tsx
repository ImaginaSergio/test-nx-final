import { useContext, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';

import { HomeDashboard } from './views/Dashboard';
import { LayoutContext } from '../../shared/context';
import { CalendarDrawer, Header } from '../../shared/components';

const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { showHeader, setShowHeader, setShowSidebar } = useContext(LayoutContext);

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  return (
    <>
      {showHeader && <Header showSearchbar title="Inicio" calendarState={{ isOpen, onOpen, onClose }} />}

      <div className="page-container">
        <HomeDashboard />

        <CalendarDrawer state={{ isOpen, onClose }} />
      </div>
    </>
  );
};

export default Home;
