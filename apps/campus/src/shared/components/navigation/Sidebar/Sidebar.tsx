import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import {
  BiStar,
  BiHome,
  BiBriefcase,
  BiDirections,
  BiBadgeCheck,
  BiBookBookmark,
  BiNetworkChart,
  BiConversation,
} from 'react-icons/bi';
import { Flex, Image } from '@chakra-ui/react';

import { NavLink } from './NavLink';
import { Logo, LogoOBFullBlack, LogoOBFullWhite } from './Logo';
import { RoadmapContext, ThemeContext } from '../../../context';

import Logo_Imagina from '../../../../assets/logos/ImaginaLogoSmall.png';
import LogoDark_Imagina from '../../../../assets/logos/ImaginaLogoLarge.png';
import LogoLight_Imagina from '../../../../assets/logos/LogoImaginaWhite.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { ruta } = useContext(RoadmapContext);
  const themeMode = useContext(ThemeContext);

  const disabledPages = process.env.REACT_APP_DISABLE_PAGES?.split(' ');

  return (
    <>
      <Flex
        transition="all 0.1s linear"
        minW={{ base: '86px', '2xl': '230px' }}
        bg="white"
        height="100vh"
        direction="column"
        borderRight="1px solid"
        borderRightColor="gray_3"
        w={{ base: '86px', '2xl': '230px' }}
      >
        <Flex
          h="90px"
          cursor="pointer"
          align="center"
          onClick={() => navigate('/')}
          pl={{ base: '0px', '2xl': '24px' }}
          justify={{ base: 'center', '2xl': 'flex-start' }}
        >
          {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
            themeMode.themeMode === 'light' ? (
              <LogoOBFullBlack display={{ base: 'none', '2xl': 'flex' }} />
            ) : (
              <LogoOBFullWhite display={{ base: 'none', '2xl': 'flex' }} />
            )
          ) : (
            <Image
              display={{ base: 'none', '2xl': 'flex' }}
              src={themeMode.themeMode === 'light' ? LogoLight_Imagina : LogoDark_Imagina}
            />
          )}

          <Flex display={{ base: 'flex', '2xl': 'none' }}>
            {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <Logo /> : <Image src={Logo_Imagina} />}
          </Flex>
        </Flex>

        <Flex direction="column" h="100%" w="100%" gap="7px" overflowY="hidden" p="30px 0px 20px 0px" align="flex-start">
          <NavLink title="Inicio" to="/" icon={BiHome} isActive={location.pathname === '/'} />

          {!disabledPages?.includes('roadmap') && (
            <NavLink
              title="Hoja de ruta"
              to="/roadmap"
              icon={BiDirections}
              isActive={location.pathname.startsWith('/roadmap')}
            />
          )}

          {!disabledPages?.includes('cursos') && (
            <NavLink title="Cursos" to="/cursos" icon={BiBookBookmark} isActive={location.pathname.startsWith('/cursos')} />
          )}

          {!disabledPages?.includes('certificaciones') && (
            <NavLink
              title="Certificaciones"
              to="/certificaciones"
              icon={BiBadgeCheck}
              isActive={location.pathname.startsWith('/certificaciones')}
            />
          )}

          {!disabledPages?.includes('procesos') && (
            <NavLink title="Vacantes" to="/procesos" icon={BiBriefcase} isActive={location.pathname.startsWith('/procesos')} />
          )}

          {!disabledPages?.includes('foro') && (
            <NavLink
              title="Foros"
              to="/foro"
              state={{ cursoId: ruta?.meta?.itinerario[0] }}
              icon={BiConversation}
              isActive={location.pathname.startsWith('/foro')}
            />
          )}

          {!disabledPages?.includes('comunidad') && (
            <NavLink
              title="Comunidad"
              to="/comunidad"
              icon={BiNetworkChart}
              isActive={location.pathname.startsWith('/comunidad')}
            />
          )}

          {!disabledPages?.includes('favoritos') && (
            <NavLink title="Favoritos" to="/favoritos" icon={BiStar} isActive={location.pathname.startsWith('/favoritos')} />
          )}
        </Flex>
      </Flex>
    </>
  );
};

export { Sidebar };
