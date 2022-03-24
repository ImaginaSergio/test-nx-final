import { Field } from 'formik';
import { Flex, FormControl, Text, Image, FormErrorMessage } from '@chakra-ui/react';

import { Logo, Stepper } from '..';
import { LogoImagina } from '../UI/LogoImagina';
import AvanzadoIMG from '../../../../assets/onboarding/AvanzadoIMG.png';
import PrincipianteIMG from '../../../../assets/onboarding/PrincipianteIMG.png';

import '../../Register.scss';

const StepConocimientos = ({ totalSteps, currentStep }: { totalSteps: number; currentStep: number }) => {
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
      {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <Logo /> : <LogoImagina />}

      <Stepper steps={totalSteps} currentStep={currentStep} />

      <Flex direction="column" align={{ base: 'start', sm: 'center' }} gap="10px" p="30px">
        <Text variant="h1_heading">¿Sabes programar?</Text>

        <Text variant="card_title" fontSize="16px" color="gray_4">
          Utilizaremos tu respuesta para crear una hoja de ruta personalizada que se adecúe a tu nivel de conocimientos y
          experiencia.
        </Text>
      </Flex>

      <Flex gap="30px" mb="30px" align="center">
        <StepsFormConocimientos name="preferencias.conocimientos" />
      </Flex>
    </Flex>
  );
};

export default StepConocimientos;

const StepsFormConocimientos = ({ name }: any) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl className="steps-form--form-control" isInvalid={form.errors[name] && form.touched[name]}>
          <Flex gap="20px" align="center" direction={{ base: 'column', sm: 'row' }}>
            <Card
              title="Ya cuento con conocimientos"
              isActive={field.value === 'avanzado'}
              onClick={() => form.setFieldValue(name, 'avanzado')}
              icon={AvanzadoIMG}
            />

            <Card
              title="Soy principiante"
              isActive={field.value === 'principiante'}
              onClick={() => form.setFieldValue(name, 'principiante')}
              icon={PrincipianteIMG}
            />
          </Flex>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const Card = ({ title, icon, isActive, onClick }: { title: string; icon: any; isActive: boolean; onClick: () => any }) => {
  return (
    <Flex
      overflow="visible"
      direction="column"
      align="center"
      p="20px 24px"
      zIndex={1}
      cursor="pointer"
      transition="all 0.2s ease"
      mb={{ base: '20px', sm: '' }}
      onClick={onClick}
      gap="19px"
      rounded="13px"
      border="1px solid"
      minH="223px"
      bg="white"
      minW={{ base: '290', sm: '396px' }}
      boxShadow={isActive ? '0px 2px 4px rgba(0, 0, 0, 0.22)' : ''}
      borderColor={isActive ? 'primary' : 'gray_5'}
      _hover={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.22)', zIndex: 2, transform: 'translate(0px, -5px)' }}
      position="relative"
    >
      <Image src={icon} alt={title} position="absolute" bottom="52px" maxW="300px" />

      <Text variant="card_title" position="absolute" bottom="30px">
        {title}
      </Text>
    </Flex>
  );
};
