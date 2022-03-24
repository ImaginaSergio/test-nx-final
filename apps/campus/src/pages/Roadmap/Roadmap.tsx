import { useContext, useEffect } from 'react';
import { useDisclosure } from '@chakra-ui/react';

import RoadmapList from './views/Listado';
import { LayoutContext } from '../../shared/context';
import { CalendarDrawer, Header } from '../../shared/components';

const Roadmap = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { showHeader, setShowHeader, setShowSidebar } = useContext(LayoutContext);

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  return (
    <>
      {showHeader && <Header showSearchbar title="Hoja de ruta" calendarState={{ isOpen, onOpen, onClose }} />}

      <div className="page-container">
        <RoadmapList />

        <CalendarDrawer state={{ isOpen, onClose }} />
      </div>
    </>
  );
};

export default Roadmap;
