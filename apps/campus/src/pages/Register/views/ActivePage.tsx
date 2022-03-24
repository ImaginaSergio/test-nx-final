import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BsDiscord } from 'react-icons/bs';
import {
  Button,
  Flex,
  Box,
  Text,
  useDisclosure,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalBody,
} from '@chakra-ui/react';

import { Logo, LogoImagina } from '../components';
import { ActiveVector } from '../components/UI/active_vector';
import { LayoutContext } from 'apps/campus/src/shared/context';

export const ActivePage = () => {
  const navigate = useNavigate();

  const { isMobile } = useContext(LayoutContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (isMobile) onOpen();
  }, [isMobile]);

  return (
    <Flex direction="column" boxSize="100%" p="75px" gap="60px" align="center" justify="start">
      {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <Logo /> : <LogoImagina />}

      <Flex h="100%" direction="column" align="center" justify="center" gap="60px">
        <Flex h="100%" direction="column" align="center" justify="center" gap="28px">
          <Text variant="h1_heading">¡Bienvenido a OpenBootcamp!</Text>

          <ActiveVector />

          <Text variant="card_title" maxW="750px" fontSize="21px" lineHeight="32px" textAlign="center" color="gray_6">
            Gran parte del éxito de OpenBootcamp lo tiene su Comunidad. Entra y aprende junto a nuestro equipo y a tus nuev@s
            compañer@s.
          </Text>
        </Flex>

        <Flex w="100%" maxW="380px" direction="column" align="center" justify="center" gap="20px">
          {process.env.REACT_APP_SHOW_DISCORD !== 'FALSE' && (
            <Box as="a" w="100%" href="https://discord.gg/tzDGcwkn4R" target="_blank" rel="noreferrer">
              <Button
                w="100%"
                h="auto"
                p="15px"
                bg="#475AE1"
                rounded="14px"
                color="white"
                fontSize="18px"
                fontWeight="bold"
                lineHeight="22px"
                _hover={{ opacity: '0.8' }}
                rightIcon={<BsDiscord />}
              >
                Ir a Discord
              </Button>
            </Box>
          )}

          <Button
            w="100%"
            h="auto"
            p="15px"
            color="white"
            bg="primary"
            rounded="14px"
            fontSize="18px"
            fontWeight="bold"
            lineHeight="22px"
            _hover={{ opacity: '0.8' }}
            onClick={() => navigate('/')}
          >
            Empezar a formarme
          </Button>
        </Flex>
      </Flex>

      <RedirectToPCModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};

const RedirectToPCModal = ({ isOpen, onClose }: any) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>¡Estás desde el móvil!</ModalHeader>

        <ModalBody>
          Nuestro campus virtual está hecho especialmente para trabajarse desde un ordenador de sobremesa o portatil, no un
          dispositivo móvil.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={onClose}>
            Cerrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
