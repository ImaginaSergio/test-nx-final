import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast, Flex, Box, Button } from '@chakra-ui/react';

import { onFailure } from '@clevery-lms/utils';
import { PerfilAsyncSelect } from '../../components';
import { getUsers, loginViaId } from '@clevery-lms/data';
import { LoginContext } from '../../../../shared/context';

export const TabAdmin = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const { login } = useContext(LoginContext);

  const [userId, setUserId] = useState<number>();
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>();

  const loadUsersByEmail = async (value: string) => {
    let _users = await getUsers({ query: [{ email: value }] });
    return _users?.data?.map((user: any) => ({
      value: user.id,
      label: user.email,
    }));
  };

  const handleLoginViaId = async () => {
    setIsLoggingIn(true);

    if (userId)
      loginViaId({ userId: userId })
        .then((res) => {
          login(res, userId, true)
            .then(() => navigate('/'))
            .catch((error: any) => {
              setIsLoggingIn(false);
              onFailure(
                toast,
                'Error al iniciar sesión',
                error.message ||
                  'Actualice la página y contacte con soporte si el error persiste..'
              );
            });
        })
        .catch((e) => {
          setIsLoggingIn(false);
          onFailure(toast, 'Error', e.error.message);
        });
  };

  return (
    <Flex direction="column" gap="24px">
      <Box fontSize="18px" fontWeight="bold">
        Admin
      </Box>

      <PerfilAsyncSelect
        name="id_usuario"
        label="Iniciar sesión por email de usuario"
        placeholder="Escribe para buscar..."
        loadOptions={loadUsersByEmail}
        onChange={(e: any) => setUserId(e)}
      />

      <Button
        isLoading={isLoggingIn}
        onClick={handleLoginViaId}
        color="white"
        bg="primary"
      >
        Iniciar sesión
      </Button>
    </Flex>
  );
};
