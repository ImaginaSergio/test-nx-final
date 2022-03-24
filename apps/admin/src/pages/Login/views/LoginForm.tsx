import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Formik, Form } from 'formik';
import {
  Flex,
  Box,
  Button,
  useToast,
  Stack,
  HStack,
  PinInputField,
  PinInput,
} from '@chakra-ui/react';

import { Logo1 } from '../components/logo1';
import { Logo3 } from '../components/logo3';

import { login } from '@clevery-lms/data';
import { onFailure } from '@clevery-lms/utils';
import { LoginContext } from '../../../shared/context';
import { FormCheckbox, FormInput } from '../../../shared/components';

const LoginForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const loginContext = useContext(LoginContext);

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [requires2FA, setRequires2FA] = useState<boolean>(false);

  const loginUser = async (
    email: string,
    password: string,
    remember: boolean,
    code?: string
  ) => {
    login({ email, password, code })
      .then(({ token, data }) => {
        loginContext
          .login(token, data.id, remember)
          .then(() => navigate('/'))
          .catch((error: any) => {
            console.log({ error });

            setIsLoggingIn(false);
            onFailure(
              toast,
              'Error al iniciar sesión',
              error.message ||
                'Actualice la página y contacte con soporte si el error persiste..'
            );
          });
      })
      .catch((error) => {
        console.log({ error });
        setIsLoggingIn(false);

        if (error?.error?.response?.data?.requires2FA) setRequires2FA(true);
        else if (error?.response?.data === 'Error 2FA')
          onFailure(
            toast,
            'Error al iniciar sesión',
            'El código del authenticator no es correcto.'
          );
        else
          onFailure(
            toast,
            'Error al iniciar sesión',
            'Credenciales incorrectas.'
          );

        return;
      });
  };

  return (
    <Flex
      bg="#161822"
      color="white"
      align="center"
      direction="column"
      justify="space-between"
      p="30px 30px 30px 20px"
      minW={{ lg: '30rem' }}
      w={{ base: '100%', lg: '20rem' }}
      boxShadow="0px 4px 71px rgba(7, 15, 48, 0.15)"
    >
      <Flex direction="column" p={[0, 20, 120]} align="center">
        {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
          <Logo1 />
        ) : (
          <Logo3 />
        )}

        <FormLoginForm
          login={loginUser}
          requires2FA={requires2FA}
          isLoggingIn={isLoggingIn}
          setIsLoggingIn={setIsLoggingIn}
          onPassRecovery={() => navigate('/login/recovery')}
        />
      </Flex>

      <Box
        textAlign="center"
        mt="30px"
        fontSize="12px"
        fontWeight="medium"
        color="rgba(255, 255, 255, 0.75)"
      >
        <Box>
          Copyright © {new Date().getFullYear()}
          {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
            ? ' Open Bootcamp SL, Imagina Group'
            : ' Imagina Group'}
        </Box>

        <Box>Todos los derechos reservados.</Box>

        <Box
          as="a"
          target="_blank"
          textDecoration="underline"
          href={
            process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
              ? 'https://open-bootcamp.com/politica-privacidad'
              : 'https://imaginaformacion.com/politica-privacidad'
          }
        >
          Política de Privacidad
        </Box>
      </Box>
    </Flex>
  );
};

export default LoginForm;

const FormLoginForm = ({
  login,
  isLoggingIn,
  onPassRecovery,
  setIsLoggingIn,
  requires2FA,
}: {
  login: any;
  onPassRecovery: () => void;
  isLoggingIn: boolean;
  setIsLoggingIn: Function;
  requires2FA: boolean;
}) => {
  const initialValues = { email: '', password: '', remember: false };
  const [code, setCode] = useState<string | undefined>(undefined);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email('Introduce una dirección de correo válida.')
      .required('Introduce una dirección de correo.')
      .typeError('Introduce una dirección de correo.'),
    password: Yup.string()
      .required('Introduce una contraseña.')
      .typeError('Introduce tu contraseña.'),
    remember: Yup.boolean().notRequired().nullable(),
  });

  const submitForm = async (values: any) => {
    setIsLoggingIn(true);
    await login(values.email, values.password, values.remember, code);
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={submitForm}
      validationSchema={validationSchema}
    >
      {(formik) => {
        const { handleSubmit } = formik;

        if (requires2FA)
          return (
            <Form onSubmit={handleSubmit}>
              <Flex color="#FFF" direction="column" w="100%" gap="30px">
                <Stack>
                  <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
                    Introduce el pin de tu Authenticator
                  </Box>

                  <HStack>
                    <PinInput type="number" onChange={setCode}>
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                      <PinInputField />
                    </PinInput>
                  </HStack>
                </Stack>

                <Flex align="center" justify="space-between">
                  <Button
                    isLoading={isLoggingIn}
                    h="auto"
                    bg="primary"
                    w="100%"
                    p="12px 20px"
                    type="submit"
                    rounded="12px"
                    color={
                      process.env.REACT_APP_ORIGEN_CAMPUS === 'IMAGINA'
                        ? '#fff'
                        : '#000'
                    }
                    _hover={{
                      bg: 'var(--chakra-colors-primary)',
                      opacity: 0.7,
                      color: '#000',
                    }}
                  >
                    <Box
                      fontSize="16px"
                      fontWeight="semibold"
                      lineHeight="29px"
                    >
                      Iniciar sesión
                    </Box>
                  </Button>
                </Flex>
              </Flex>
            </Form>
          );

        return (
          <Form onSubmit={handleSubmit}>
            <Flex direction="column" w="100%" gap="30px">
              <FormInput
                name="email"
                label="Email"
                type="email"
                color="#fff"
                labelColor="#fff"
                background="transparent"
                placeholder="Introduce tu email"
                gradient="linear(to-l, rgba(58, 61, 78, 0), rgba(60, 63, 79, 0.6))"
              />

              <FormInput
                name="password"
                label="Contraseña"
                type="password"
                color="#fff"
                labelColor="#fff"
                background="transparent"
                placeholder="Introduce tu contraseña"
                gradient="linear(to-l, rgba(58, 61, 78, 0), rgba(60, 63, 79, 0.6))"
              />

              <Flex w="100%" align="center" justify="space-between" gap="10px">
                <FormCheckbox
                  name="remember"
                  label="Recuérdame"
                  style={{ color: '#fff', fontSize: '14px' }}
                  controlStyle={{
                    textAlign: 'left',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}
                />

                <Box
                  whiteSpace="nowrap"
                  color="primary_neon"
                  fontSize="14px"
                  cursor="pointer"
                  fontWeight="semibold"
                  onClick={onPassRecovery}
                  _hover={{ textDecoration: 'underline' }}
                >
                  ¿Has olvidado la contraseña?
                </Box>
              </Flex>

              <Flex align="center" justify="space-between">
                <Button
                  h="auto"
                  w="100%"
                  bg="primary"
                  p="12px 20px"
                  type="submit"
                  rounded="12px"
                  isLoading={isLoggingIn}
                  color={
                    process.env.REACT_APP_ORIGEN_CAMPUS === 'IMAGINA'
                      ? '#fff'
                      : '#000'
                  }
                  _hover={{
                    bg: 'var(--chakra-colors-primary)',
                    opacity: 0.7,
                    color: '#000',
                  }}
                >
                  <Box fontSize="16px" fontWeight="semibold" lineHeight="29px">
                    Iniciar sesión
                  </Box>
                </Button>
              </Flex>
            </Flex>
          </Form>
        );
      }}
    </Formik>
  );
};
