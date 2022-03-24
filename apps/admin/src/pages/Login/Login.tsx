import { useContext, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';

import { Box, Flex } from '@chakra-ui/react';

import { Logo2 } from './components/logo2';
import loginBg from '../../assets/loginBg.jpg';

import LoginForm from './views/LoginForm';
import NewPassForm from './views/NewPassForm';
import RecoveryForm from './views/RecoveryForm';

import { UserRolEnum } from '@clevery-lms/data';
import { isRoleAllowed } from '@clevery-lms/utils';
import { LoginContext } from '../../shared/context';

import './Login.scss';

const Login = () => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);

  useEffect(() => {
    if (isRoleAllowed([UserRolEnum.ADMIN], user?.rol)) navigate('/');
  }, []);

  return (
    <Flex w="100%" h="100vh" overflow="hidden">
      <Routes>
        <Route index element={<LoginForm />} />

        <Route path="recovery">
          <Route index element={<RecoveryForm />} />
          <Route path=":hashCode" element={<NewPassForm />} />
        </Route>
      </Routes>

      <Flex
        w="100%"
        p="150px"
        align="left"
        bgSize="cover"
        bgPosition="center"
        direction="column"
        justify="flex-start"
        bgImg={`url(${loginBg})`}
        display={{ base: 'none', md: 'none', lg: 'flex' }}
      >
        <Logo2 w="30rem" />

        <Box
          color="#fff"
          mt="31px"
          fontWeight="medium"
          fontSize={[28, 18, 28]}
          letterSpacing="6.8px"
        >
          Y DA EL SALTO AL MUNDO LABORAL
        </Box>
      </Flex>
    </Flex>
  );
};

export default Login;
