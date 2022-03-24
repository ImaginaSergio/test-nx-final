import { useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Flex, Image } from '@chakra-ui/react';
import { FiUsers } from 'react-icons/fi';
import {
  BiBriefcase,
  BiBadgeCheck,
  BiBookBookmark,
  BiCog,
  BiBox,
  BiTask,
  BiLineChart,
} from 'react-icons/bi';

import { NavLink } from './NavLink';
import { UserRolEnum } from '@clevery-lms/data';
import { LoginContext } from '../../../context';
import { isRoleAllowed } from '@clevery-lms/utils';

import { Logo } from './Logo';
import Logo_Imagina from '../../../../assets/logos/ImaginaLogoSmall.png';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(LoginContext);

  return (
    <Flex
      height="100vh"
      w="80px"
      direction="column"
      align="flex-start"
      bg="#1B1F31"
      p="0px 0px 15px"
      gridRowGap="20px"
    >
      <Flex
        w="100%"
        py="14px"
        onClick={() => navigate('/')}
        justify="center"
        align="center"
      >
        {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
          <Logo />
        ) : (
          <Image src={Logo_Imagina} />
        )}
      </Flex>

      <Flex direction="column" boxSize="100%">
        {isRoleAllowed([UserRolEnum.ADMIN], user?.rol) && (
          <NavLink
            showLabel={false}
            label="Cursos"
            to="/cursos"
            icon={BiBookBookmark}
            isActive={location.pathname.startsWith('/cursos') ? true : false}
          />
        )}

        {isRoleAllowed([UserRolEnum.ADMIN], user?.rol) && (
          <NavLink
            showLabel={false}
            label="Certificaciones"
            to="/certificaciones"
            icon={BiBadgeCheck}
            isActive={
              location.pathname.startsWith('/certificaciones') ? true : false
            }
          />
        )}

        {isRoleAllowed([UserRolEnum.ADMIN], user?.rol) && (
          <NavLink
            showLabel={false}
            label="Clientes"
            to="/clientes"
            icon={BiBriefcase}
            isActive={location.pathname.startsWith('/clientes') ? true : false}
          />
        )}

        {isRoleAllowed(
          [UserRolEnum.ADMIN, UserRolEnum.SUPERVISOR],
          user?.rol
        ) && (
          <NavLink
            showLabel={false}
            label="Usuarios"
            to="/usuarios"
            icon={FiUsers}
            isActive={location.pathname.startsWith('/usuarios') ? true : false}
          />
        )}

        {isRoleAllowed(
          [UserRolEnum.ADMIN, UserRolEnum.SUPERVISOR],
          user?.rol
        ) && (
          <NavLink
            showLabel={false}
            label="Ejercicios"
            to="/ejercicios"
            icon={BiTask}
            isActive={
              location.pathname.startsWith('/ejercicios') ? true : false
            }
          />
        )}

        {isRoleAllowed(
          [UserRolEnum.ADMIN, UserRolEnum.SUPERVISOR],
          user?.rol
        ) && (
          <NavLink
            showLabel={false}
            label="Estadísticas"
            to="/estadisticas"
            icon={BiLineChart}
            isActive={
              location.pathname.startsWith('/estadisticas') ? true : false
            }
          />
        )}

        {isRoleAllowed([UserRolEnum.ADMIN], user?.rol) && (
          <NavLink
            showLabel={false}
            label="Meta"
            to="/meta/habilidades"
            icon={BiBox}
            isActive={location.pathname.startsWith('/meta') ? true : false}
          />
        )}
      </Flex>

      <Flex direction="column" w="100%" minH="fit-content">
        {isRoleAllowed([UserRolEnum.ADMIN], user?.rol) && (
          <NavLink
            showLabel={false}
            label="Configuración"
            to="/configuracion"
            icon={BiCog}
            isActive={
              location.pathname.startsWith('/configuracion') ? true : false
            }
          />
        )}
      </Flex>
    </Flex>
  );
};

export { Sidebar };
