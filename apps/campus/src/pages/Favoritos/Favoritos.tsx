import { useContext, useEffect } from 'react';

import { useDisclosure } from '@chakra-ui/react';

import FavoritosList from './views/List';
import { LayoutContext } from '../../shared/context';
import { CalendarDrawer, Header } from '../../shared/components';

const Favoritos = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { showHeader, setShowHeader, setShowSidebar } = useContext(LayoutContext);

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  return (
    <>
      {showHeader && <Header showSearchbar title="Favoritos" calendarState={{ isOpen, onOpen, onClose }} />}

      <div className="page-container">
        <FavoritosList />

        <CalendarDrawer state={{ isOpen, onClose }} />
      </div>
    </>
  );
};

export default Favoritos;
