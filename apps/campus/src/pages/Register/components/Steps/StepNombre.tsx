import { Flex, Text } from '@chakra-ui/react';

import { Logo } from '../UI/Logo';
import { Stepper } from '../UI/Stepper';
import { LogoImagina } from '../UI/LogoImagina';
import { checkIfEmailExists } from '@clevery-lms/data';
import { StepsTextInput } from '../Form/StepsTextInput';
import { StepsFormCheckbox } from '../Form/StepsFormCheckbox';

const StepNombre = ({
  totalSteps,
  currentStep,
}: {
  totalSteps: number;
  currentStep: number;
}) => {
  const validateEmail = async (value: string) => {
    let error;
    const res: any = await checkIfEmailExists({ email: value });

    if (res?.isAxiosError || res.isError) error = res.message;

    return error;
  };

  return (
    <Flex
      h="100%"
      w="100%"
      maxW="100%"
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
        <Text variant="h1_heading">¡Bienvenido/a! Vamos a crear tu perfil</Text>

        <Text variant="card_title" fontSize="16px" color="gray_4">
          Necesitamos que nos indiques unos datos antes de empezar.
        </Text>
      </Flex>

      <Flex direction="column" gap="20px" mb="30px" w="100%" maxW="100%">
        <StepsTextInput
          name="email"
          label="Indícanos tu email:"
          placeholder="ejemplo@gmail.com"
          validate={validateEmail}
        />

        <StepsTextInput name="nombre" label="Nombre:" placeholder="Nombre" />

        <StepsTextInput
          name="apellidos"
          label="Apellidos:"
          placeholder="Apellido Apellido"
        />

        <StepsFormCheckbox name="politica_privacidad" label="Privacidad" />
      </Flex>
    </Flex>
  );
};

export default StepNombre;
