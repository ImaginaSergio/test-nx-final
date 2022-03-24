import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiBell, BiChevronDown, BiChevronLeft, BiLogOut } from 'react-icons/bi';
import { Flex, Icon, Box, Image, IconButton, Menu, MenuButton, MenuItem, MenuList, Portal } from '@chakra-ui/react';

import { LoginContext } from '../../../context';

import './Header.scss';

type HeaderProps = {
  head: {
    title: string;
    onClick: () => void;
    children?: { title: string; isActive?: boolean; onClick?: () => void }[];
  };
};

const Header = ({ head }: HeaderProps) => {
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);

  return (
    <div className="header">
      <div className="header--head">
        <Box className={`header--head--item ${!head.children ? 'header--head--item__active' : ''}`} onClick={head.onClick}>
          {head.title}
        </Box>

        {head?.children?.map((child: any, index: number) => (
          <Flex key={`header-breadcrumb-item-${index}`} className="header--head--breadcrumb_item" onClick={child.onClick}>
            <Icon as={BiChevronLeft} boxSize="21px" opacity={0.6} color="#ffffff" />

            <Box className={`header--head--item ${child.isActive ? 'header--head--item__active' : ''}`}>{child.title}</Box>
          </Flex>
        ))}
      </div>

      <Flex className="header-utils" gridColumnGap="30px" align="center">
        <Icon as={BiBell} w="24px" h="24px" />

        <Flex align="center" gridColumnGap="12px">
          <Flex
            align="end"
            fontSize="15px"
            gridRowGap="4px"
            direction="column"
            minW="fit-content"
            fontWeight="bold"
            lineHeight="100%"
            textTransform="capitalize"
          >
            <Box>{loginContext.user?.fullName?.split(' ')[0]}</Box>
            <Box opacity="0.6">{loginContext.user?.fullName?.split(' ').slice(1).toString().replaceAll(',', ' ')}</Box>
          </Flex>

          {loginContext.user?.avatar?.url ? (
            <Image
              fit="cover"
              w="40px"
              h="40px"
              rounded="50%"
              border="2px solid white"
              alt={loginContext.user?.fullName}
              src={loginContext.user?.avatar?.url}
            />
          ) : (
            <Flex bg="#1EE59C" color="#17B482" w="40px" h="40px" align="center" justify="center" textTransform="uppercase">
              {loginContext.user?.fullName?.substring(0, 2)}
            </Flex>
          )}

          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<Icon as={BiChevronDown} w="20px" h="20px" />}
              outline="none"
              bg="transparent"
              _hover={{ bg: 'transparent' }}
              _focus={{ bg: 'transparent' }}
              _active={{ bg: 'transparent' }}
              _expanded={{ bg: 'transparent' }}
            />

            <Portal>
              <MenuList zIndex="dropdown" py={0} color={'black'}>
                <MenuItem
                  as="a"
                  icon={<Icon as={BiLogOut} w="16px" h="16px" />}
                  target="_blank"
                  href={process.env.REACT_APP_CAMPUS_URL || ''}
                >
                  Volver al campus
                </MenuItem>

                <MenuItem
                  icon={<Icon as={BiLogOut} w="16px" h="16px" />}
                  onClick={() => {
                    loginContext.logout();
                    navigate('/login');
                  }}
                >
                  Cerrar sesión
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        </Flex>
      </Flex>
    </div>
  );
};

export { Header };
