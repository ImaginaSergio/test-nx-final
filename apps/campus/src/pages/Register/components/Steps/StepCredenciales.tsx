import { Flex, Text } from '@chakra-ui/react';

import { LogoImagina } from '../UI/LogoImagina';
import { Logo, Stepper, StepsTextInput } from '..';
import { checkIfUsernameExists } from '@clevery-lms/data';

import '../../Register.scss';

const StepCredenciales = ({
  totalSteps,
  currentStep,
}: {
  totalSteps: number;
  currentStep: number;
}) => {
  const validateUsername = async (value: string) => {
    let error;
    const res: any = await checkIfUsernameExists({ username: value });

    if (res?.isAxiosError || res.isError) error = res.message;

    return error;
  };

  return (
    <Flex
      w="100%"
      h="100%"
      align="center"
      justify="start"
      direction="column"
      pt={{ base: '45px', sm: '75px' }}
      gap={{ base: '30px', sm: '60px' }}
    >
      {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
        <Logo />
      ) : (
        <LogoImagina />
      )}

      <Stepper steps={totalSteps} currentStep={currentStep} />

      <Flex
        direction="column"
        align={{ base: 'start', sm: 'center' }}
        gap="10px"
      >
        <Text variant="h1_heading">Elige tus credenciales</Text>

        <Text variant="card_title" color="gray_4">
          Indícanos tu nombre de usuario y tu contraseña para acceder al campus.
        </Text>
      </Flex>

      <Flex direction="column" gap="30px" mb="30px" w="100%">
        <StepsTextInput
          name="username"
          label="Nombre de usuario:"
          placeholder="desarrolladorpro14"
          validate={validateUsername}
        />

        <StepsTextInput
          type="password"
          name="password"
          label="Contraseña:"
          placeholder="Debe contener 8 carácteres mínimo."
        />

        <StepsTextInput
          type="password"
          name="password_confirmation"
          label="Repite la contraseña:"
          placeholder="Debe coinicidir con la anterior."
        />
      </Flex>
    </Flex>
  );
};

export default StepCredenciales;
