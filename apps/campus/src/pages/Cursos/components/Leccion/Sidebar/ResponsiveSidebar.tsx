import { useRef } from 'react';

import { BiChevronsLeft, BiMenu } from 'react-icons/bi';
import {
  Flex,
  Icon,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';

import TabTests from './TabTests';
import TabLecciones from './TabLecciones';
import TabEjercicios from './TabEjercicios';
import { useHover } from '@clevery-lms/utils';
import { ICurso, IExamen, ILeccion } from '@clevery-lms/data';

const ResponsiveSidebarLeccion = ({
  state,
  curso,
  leccion,
  onExamenSelect,
  onLeccionSelect,
  onLeccionCompleted,
}: {
  curso?: ICurso;
  leccion?: ILeccion;
  state: { isOpen: boolean; onClose: () => void };
  onExamenSelect: (examen: IExamen) => void;
  onLeccionSelect: (leccion: ILeccion) => void;
  onLeccionCompleted: (leccion: ILeccion) => void;
}) => {
  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  const disabledPages = process.env.REACT_APP_DISABLE_PAGES?.split(' ');

  return (
    <Drawer isOpen={state.isOpen} onClose={state.onClose} placement="left">
      <DrawerOverlay />
      <DrawerContent w="100%" overflow="overlay">
        <DrawerCloseButton />

        <Flex
          h="100%"
          w="100%"
          bg="white"
          direction="column"
          gridRowGap="30px"
          style={{ transition: 'all 0.6s ease-in-out' }}
        >
          <Tabs>
            <TabList
              maxW="400px"
              p={{ base: '10px 10px', sm: '15px 20px' }}
              borderBottom="1px solid var(--chakra-colors-gray_3)"
              position="sticky"
              top="0"
              bg="white"
            >
              <Tab
                color="gray_4"
                fontSize="14px"
                fontWeight="bold"
                _selected={{ color: 'black' }}
                p={{ base: '8px', sm: '' }}
              >
                Contenido
              </Tab>

              <Tab
                p={{ base: '8px', sm: '' }}
                color="gray_4"
                fontSize="14px"
                fontWeight="bold"
                _selected={{ color: 'black' }}
              >
                Ejercicios
              </Tab>

              {!disabledPages?.includes('certificaciones') && (
                <Tab
                  p={{ base: '8px', sm: '' }}
                  color="gray_4"
                  fontSize="14px"
                  fontWeight="bold"
                  _selected={{ color: 'black' }}
                >
                  Tests
                </Tab>
              )}

              <IconButton
                ref={hoverRef}
                ml="auto"
                bg="transparent"
                onClick={state.onClose}
                aria-label="Cerrar sidebar"
                icon={
                  <Icon
                    as={isHover ? BiChevronsLeft : BiMenu}
                    color="gray_4"
                    boxSize={6}
                  />
                }
                _hover={{ backgroundColor: 'transparent' }}
              />
            </TabList>

            <TabPanels p="0px">
              <TabPanel p="0px">
                <TabLecciones
                  curso={curso}
                  leccionId={leccion?.id}
                  onLeccionSelect={onLeccionSelect}
                  onLeccionCompleted={onLeccionCompleted}
                />
              </TabPanel>

              <TabPanel p="0px">
                <TabEjercicios
                  curso={curso}
                  leccionId={leccion?.id}
                  onLeccionSelect={onLeccionSelect}
                  onLeccionCompleted={onLeccionCompleted}
                />
              </TabPanel>

              {!disabledPages?.includes('certificaciones') && (
                <TabPanel p="0px">
                  <TabTests
                    cursoId={curso?.id}
                    onExamenSelect={onExamenSelect}
                  />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </Flex>
      </DrawerContent>
    </Drawer>
  );
};

export default ResponsiveSidebarLeccion;
