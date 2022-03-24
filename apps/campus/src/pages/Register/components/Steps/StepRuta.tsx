import { Field } from 'formik';
import { Flex, FormControl, Text, Image, FormErrorMessage } from '@chakra-ui/react';

import { Logo, Stepper } from '..';
import { LogoImagina } from '../UI/LogoImagina';
import Backend from '../../../../assets/onboarding/Backend.png';
import Frontend from '../../../../assets/onboarding/Frontend.png';
import Fullstack from '../../../../assets/onboarding/Fullstack.png';

import '../../Register.scss';

const StepRuta = ({ totalSteps, currentStep }: { totalSteps: number; currentStep: number }) => {
  return (
    <Flex
      w="100%"
      h="100%"
      align="center"
      justify="flex-start"
      direction="column"
      pt={{ base: '45px', sm: '75px' }}
      gap={{ base: '30px', sm: '60px' }}
    >
      {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? <Logo /> : <LogoImagina />}

      <Stepper steps={totalSteps} currentStep={currentStep} />

      <Flex direction="column" align="center" gap="10px" p="30px">
        <Text variant="h1_heading">Ya casi está, unos últimos ajustes</Text>

        <Text variant="card_title" fontSize="16px" color="gray_4">
          Necesitemos que nos indiques el tipo de desarrollador que eres para ofrecerte diferentes especializaciones.
        </Text>
      </Flex>

      <Flex gap="30px" mb="30px" align="center">
        <StepsFormRuta name="preferencias.ruta" />
      </Flex>
    </Flex>
  );
};

export default StepRuta;

const StepsFormRuta = ({ name }: any) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl className="steps-form--form-control" isInvalid={form.errors[name] && form.touched[name]}>
          <Flex gap="20px" align="start" wrap="wrap" justify="center">
            <Card
              icon={Fullstack}
              title="Fullstack"
              description="Aprende tanto Front como Back para poder hacer aplicaciones web."
              isActive={field.value === 'fullstack'}
              onClick={() => form.setFieldValue(name, 'fullstack')}
            />

            <Card
              icon={Frontend}
              title="Frontend"
              description="Céntrate en el Desarrollo Front con los frameworks más modernos."
              isActive={field.value === 'frontend'}
              onClick={() => form.setFieldValue(name, 'frontend')}
            />

            <Card
              icon={Backend}
              title="Backend"
              description="Adquiere conocimientos en la tecnología de back más novedosa."
              isActive={field.value === 'backend'}
              onClick={() => form.setFieldValue(name, 'backend')}
            />
          </Flex>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const Card = ({
  title,
  description,
  icon,
  isActive,
  onClick,
}: {
  title: string;
  description: string;
  icon: any;
  isActive: boolean;
  onClick: () => any;
}) => {
  return (
    <Flex
      overflow="visible"
      direction="column"
      align="start"
      bg="white"
      p="20px 24px"
      zIndex={1}
      cursor="pointer"
      transition="all 0.2s ease"
      onClick={onClick}
      gap="19px"
      rounded="13px"
      border="1px solid"
      minH="201px"
      maxW="256px"
      borderColor={isActive ? 'primary' : 'gray_5'}
      boxShadow={isActive ? '0px 2px 4px rgba(0, 0, 0, 0.22)' : ''}
      _hover={{ boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.22)', zIndex: 2, transform: 'translate(0px, -5px)' }}
    >
      <Image src={icon} alt={title} w="75px" />
      <Text variant="card_title">{title}</Text>
      <Text variant="card_text">{description}</Text>
    </Flex>
  );
};
