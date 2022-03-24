import { useEffect, useState } from 'react';

import { BiClipboard, BiEnvelope, BiX } from 'react-icons/bi';
import {
  Icon,
  Flex,
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Box,
  Button,
  useToast,
} from '@chakra-ui/react';

import { getUsersStats } from '@clevery-lms/data';
import { onSuccess } from '@clevery-lms/utils';

export default function UsuariosInactivosModal({
  state,
}: {
  state: { isOpen: boolean; onOpen: () => void; onClose: () => void };
}) {
  const toast = useToast();
  const [usuarios, setUsuarios] = useState<any[]>([]);

  useEffect(() => {
    if (state.isOpen) getUsuariosInactivos();
  }, [state.isOpen]);

  const getUsuariosInactivos = async () => {
    let _data = await getUsersStats({
      query: [{ inactivo: true }, { limit: 10000 }],
    });

    setUsuarios(
      _data?.data?.filter((u: any) => ({
        email: u.email,
        nombre: u?.nombre || '',
        apellidos: u.apellidos || '',
      })) || []
    );
  };

  const copyUsuarios = () => {
    navigator.clipboard.writeText(
      usuarios?.reduce(
        (acc, u) =>
          (acc +=
            (u.nombre || '') +
            ' ' +
            (u.apellidos || '') +
            ',' +
            u.email +
            '\n'),
        ''
      )
    );
  };

  return (
    <Modal onClose={state.onClose} isOpen={state.isOpen} isCentered>
      <ModalOverlay />

      <ModalContent maxW="56em" maxH="56em">
        <ModalHeader p="30px 30px 0px">
          <Flex justify="space-between" align="center">
            <Box fontSize="19px">Listado alumnos inactivos</Box>

            <Icon
              as={BiX}
              w="32px"
              h="32px"
              cursor="pointer"
              onClick={state.onClose}
            />
          </Flex>
        </ModalHeader>

        <ModalBody p="30px">
          <Flex direction="column" gridGap="30px">
            <Flex w="100%" gap="20px">
              <Button
                w="100%"
                leftIcon={<BiClipboard />}
                onClick={copyUsuarios}
              >
                Copiar listado al portapapeles
              </Button>

              {/* <Button w="100%" leftIcon={<BiEnvelope />} onClick={() => onSuccess(toast, 'Email enviado correctamente')}>
                Enviar email
              </Button> */}
            </Flex>

            <Flex direction="column" w="100%" overflow="overlay" maxH="500px">
              <Flex fontWeight="semibold" gridGap="20px">
                <Box w="100%">Nombre completo</Box>
                <Box w="100%">Email</Box>
              </Flex>

              {usuarios?.map((u) => (
                <Flex gridGap="20px">
                  <Box w="100%">
                    {(u.nombre || '') + ' ' + (u.apellidos || '')}
                  </Box>
                  <Box w="100%">{u.email}</Box>
                </Flex>
              ))}
            </Flex>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
