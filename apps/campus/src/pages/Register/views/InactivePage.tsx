import { Center, Flex, Text } from '@chakra-ui/react';

import { Logo, LogoImagina } from '../components';
import { InactiveVector } from '../components/UI/inactive_vector';

export const InactivePage = () => {
  return (
    <Flex direction="column" boxSize="100%" p="75px" gap="60px" align="center" justify="start">
      {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <Logo /> : <LogoImagina />}

      <Flex h="100%" direction="column" align="center" justify="center" gap="28px">
        <Text variant="h1_heading">¡Ya está casi!</Text>

        <InactiveVector />

        <Text variant="card_title" fontSize="18px" lineHeight="22px" textAlign="center" color="gray_4">
          Estamos validando tu cuenta para darte acceso al campus, te avisaremos en cuanto tengas acceso.
        </Text>
      </Flex>
    </Flex>
  );
};
