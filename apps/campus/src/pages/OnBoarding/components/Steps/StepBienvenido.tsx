import { useState } from 'react';

import { Flex } from '@chakra-ui/layout';
import { Box, Button } from '@chakra-ui/react';

import { Logo } from '..';
import { LogoImagina } from '../UI/LogoImagina';

import '../../OnBoarding.scss';

const StepBienvenido = ({ onNextStep }: { onNextStep: (value: any) => void }) => {
  const [loading, setLoading] = useState(false);

  return (
    <Flex direction="column" boxSize="100%" pt="75px" gap="60px" align="center" justify="start">
      {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <Logo /> : <LogoImagina />}

      <Flex direction="column" align="center" gap="10px">
        <Box fontSize="34px" fontWeight="bold" lineHeight="40px" textTransform="capitalize">
          ¡Bienvenido {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? 'a OpenBootcamp!' : 'al Campus!'}
        </Box>

        <Box fontSize="16px" fontWeight="medium" lineHeight="19px" color="gray_4">
          {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP'
            ? '¡Ya puedes disfrutar de todas las ventajas que tiene ser un alumno de OpenBootcamp! Esperamos que tu experiencia de aprendizaje sea lo mejor posible. '
            : '¡Ya puedes disfrutar de todas las ventajas del campus! Esperamos que tu experiencia de aprendizaje sea lo mejor posible.'}
        </Box>
      </Flex>

      <Button
        w="fit-content"
        minW="380px"
        h="50px"
        p="15px"
        bg="primary"
        color="#fff"
        rounded="13px"
        isLoading={loading}
        onClick={() => {
          setLoading(false);
          onNextStep({ onboardingCompletado: true });
        }}
      >
        Empezar
      </Button>
    </Flex>
  );
};

export default StepBienvenido;
