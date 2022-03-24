import {
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Flex,
  Image,
  IconButton,
  Icon,
} from '@chakra-ui/react';
import React, { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { NavLink } from './NavLink';
import { Logo, LogoOBFullBlack, LogoOBFullWhite } from './Logo';
import { LayoutContext, LoginContext, ThemeContext } from '../../../context';

import Logo_Imagina from '../../../../assets/logos/ImaginaLogoSmall.png';
import LogoDark_Imagina from '../../../../assets/logos/ImaginaLogoLarge.png';
import LogoLight_Imagina from '../../../../assets/logos/LogoImaginaWhite.png';
import {
  BiBadgeCheck,
  BiBookBookmark,
  BiBriefcase,
  BiConversation,
  BiDirections,
  BiHome,
  BiNetworkChart,
  BiStar,
  BiX,
} from 'react-icons/bi';
type MovilSidebarProps = {
  state: { isOpenSidebar: boolean; onCloseSidebar: () => void };
};
const MovilSidebar = ({ state }: MovilSidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(LoginContext);

  const disabledPages = process.env.REACT_APP_DISABLE_PAGES?.split(' ');

  return (
    <Drawer isOpen={state.isOpenSidebar} placement="left" onClose={state.onCloseSidebar}>
      <DrawerOverlay />
      <DrawerContent bg="white">
        <DrawerHeader>
          <Flex w="100%" align="center" direction="row" justify="space-between">
            <Flex
              pl="10px"
              h="90px"
              cursor="pointer"
              align="center"
              onClick={() => navigate('/')}
              style={{ transition: 'all 0.6s ease-in-out' }}
            >
              {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <Logo /> : <Image src={Logo_Imagina} />}
            </Flex>

            <IconButton
              aria-label="Cerrar Sidebar"
              bg="transparent"
              icon={<Icon as={BiX} boxSize="30px" color="gray_4" />}
              onClick={state.onCloseSidebar}
            />
          </Flex>
        </DrawerHeader>

        <DrawerBody p="0px">
          <Flex direction="column" h="100%" w="100%" gap="7px" overflow="overlay" p="30px 0px 20px 0px" align="flex-start">
            <NavLink title="Inicio" to="/" icon={BiHome} isActive={location.pathname === '/'} onClose={state.onCloseSidebar} />

            {!disabledPages?.includes('roadmap') && (
              <NavLink
                title="Hoja de ruta"
                to="/roadmap"
                icon={BiDirections}
                isActive={location.pathname.startsWith('/roadmap')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('cursos') && (
              <NavLink
                title="Cursos"
                to="/cursos"
                icon={BiBookBookmark}
                isActive={location.pathname.startsWith('/cursos')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('certificaciones') && (
              <NavLink
                title="Certificaciones"
                to="/certificaciones"
                icon={BiBadgeCheck}
                isActive={location.pathname.startsWith('/certificaciones')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('procesos') && (
              <NavLink
                title="Vacantes"
                to="/procesos"
                icon={BiBriefcase}
                isActive={location.pathname.startsWith('/procesos')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('foro') && (
              <NavLink
                title="Foros"
                to="/foro"
                icon={BiConversation}
                isActive={location.pathname.startsWith('/foro')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('comunidad') && (
              <NavLink
                title="Comunidad"
                to="/comunidad"
                icon={BiNetworkChart}
                isActive={location.pathname.startsWith('/comunidad')}
                onClose={state.onCloseSidebar}
              />
            )}

            {!disabledPages?.includes('favoritos') && (
              <NavLink
                title="Favoritos"
                to="/favoritos"
                icon={BiStar}
                isActive={location.pathname.startsWith('/favoritos')}
                onClose={state.onCloseSidebar}
              />
            )}
          </Flex>{' '}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export { MovilSidebar };
