import { useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { isMobile as isMobileBrowser } from 'react-device-detect';

import {
  BiChevronDown,
  BiLogOut,
  BiChevronLeft,
  BiCog,
  BiLeftArrowAlt,
  BiCalendar,
  BiChevronsRight,
  BiMenu,
} from 'react-icons/bi';
import {
  Menu,
  MenuButton,
  Icon,
  MenuList,
  MenuItem,
  Box,
  Flex,
  Portal,
  Button,
  Text,
  IconButton,
  useMediaQuery,
} from '@chakra-ui/react';

import { Avatar } from '../..';
import { LayoutContext, LoginContext } from '../../../context';
import { useHover } from '@clevery-lms/utils';

type HeaderProps = {
  title?: string;
  showSearchbar?: boolean;
  goBack?: (event: any) => void;
  breadcrumb?: {
    text: string;
    isActive?: boolean;
    onClick?: (event: any) => void;
  }[];
  hasAlerts?: boolean;
  calendarState: { isOpen: boolean; onOpen: () => void; onClose: () => void };
};

export const Header = ({
  title,
  goBack,
  breadcrumb,
  showSearchbar,
  calendarState,
}: HeaderProps) => {
  const navigate = useNavigate();

  const { showHeader, onOpenSidebar, isMobile } = useContext(LayoutContext);
  const { user, logout } = useContext(LoginContext);

  const hoverRef = useRef(null);
  const isHover = useHover(hoverRef);

  const disabledPages = process.env.REACT_APP_DISABLE_PAGES?.split(' ');

  return (
    <Flex
      align="center"
      w="100%"
      minH="80px"
      h="80px"
      display={showHeader ? 'flex' : 'none'}
      justify="space-between"
    >
      <Flex
        w="100%"
        align="center"
        p={isMobile ? '0px 10px' : '0px 34px'}
        gap={isMobile ? '0px' : '30px'}
      >
        {(isMobileBrowser || isMobile) && (
          <IconButton
            ref={hoverRef}
            bg="transparent"
            onClick={onOpenSidebar}
            aria-label="Abrir sidebar"
            icon={
              <Icon
                as={isHover ? BiChevronsRight : BiMenu}
                color="gray_4"
                boxSize={6}
              />
            }
            _hover={{ backgroundColor: 'transparent' }}
          />
        )}

        {goBack ? (
          <Button
            leftIcon={<BiLeftArrowAlt />}
            bg="gray_3"
            rounded="10px"
            _hover={{ bg: 'gray_2' }}
            _focus={{ bg: 'gray_2' }}
            onClick={goBack}
            children="Volver"
          />
        ) : breadcrumb ? (
          breadcrumb?.map((item, index) => (
            <Flex
              key={'header-breadcrumb-' + index}
              align="center"
              cursor={!item.isActive ? 'pointer' : undefined}
              onClick={!item.isActive ? item.onClick : undefined}
            >
              {index > 0 && (
                <Icon
                  as={BiChevronLeft}
                  boxSize="30px"
                  mx="6px"
                  opacity={0.4}
                />
              )}

              <Box
                fontSize="24px"
                fontWeight="bold"
                lineHeight="29px"
                opacity={item.isActive ? 1 : 0.4}
                _hover={
                  !item.isActive
                    ? { textDecoration: 'underline', opacity: 0.6 }
                    : undefined
                }
              >
                {item.text}
              </Box>
            </Flex>
          ))
        ) : title ? (
          <Text
            variant="h1_heading"
            fontSize={{ base: '16px', sm: '20px', md: '26px' }}
          >
            {title}
          </Text>
        ) : undefined}
      </Flex>

      <Flex
        w="fit-content"
        align="center"
        justify="flex-end"
        gap={isMobile ? '0px' : '30px'}
        p={isMobile ? '0px 10px' : '0px 34px'}
      >
        {/* {showSearchbar && <Searchbar />} */}

        <Icon
          as={BiCalendar}
          boxSize="24px"
          cursor="pointer"
          color="gray_4"
          onClick={calendarState.onOpen}
        />

        <Menu>
          {({ isOpen }) => (
            <>
              <MenuButton
                as={Button}
                aria-label="Options"
                outline="none"
                bg="transparent"
                w="fit-content"
                _hover={{ bg: 'transparent' }}
                _focus={{ bg: 'transparent' }}
                _active={{ bg: 'transparent' }}
                _expanded={{ bg: 'transparent' }}
              >
                <Flex
                  align="center"
                  bg="white"
                  color="black"
                  gap="10px"
                  // pr={isMobile ? '0px' : '10px'}
                  pr={{ base: '0px', sm: '10px' }}
                  h="40px"
                  rounded="91px"
                >
                  <Flex align="center" gap="15px">
                    <Avatar
                      size="40px"
                      src={user?.avatar?.url}
                      name={
                        (user?.nombre || ' ')[0] +
                        ' ' +
                        (user?.apellidos || ' ')[0]
                      }
                    />

                    {!isMobile && (
                      <Box
                        minW="fit-content"
                        mr="12px"
                        fontSize="16px"
                        fontWeight="semibold"
                        textTransform="capitalize"
                      >
                        {user?.username}
                      </Box>
                    )}
                  </Flex>
                  {!isMobile && <Box minW="1px" h="100%" bg="white" />}

                  {!isMobile && (
                    <Icon
                      as={BiChevronDown}
                      transform={isOpen ? 'rotate(180deg)' : 'rotate(0deg)'}
                      transition="all 0.2s ease"
                      w="20px"
                      h="20px"
                      color="gray_4"
                    />
                  )}
                </Flex>
              </MenuButton>

              <Portal>
                <MenuList zIndex="dropdown" py={0} color="black" bg="white">
                  {!disabledPages?.includes('perfil') && (
                    <MenuItem
                      icon={<Icon as={BiCog} boxSize="16px" />}
                      onClick={() => navigate('/perfil')}
                    >
                      Configuración
                    </MenuItem>
                  )}

                  <MenuItem
                    icon={<Icon as={BiLogOut} boxSize="16px" />}
                    onClick={logout}
                  >
                    Cerrar sesión
                  </MenuItem>
                </MenuList>
              </Portal>
            </>
          )}
        </Menu>
      </Flex>
    </Flex>
  );
};
