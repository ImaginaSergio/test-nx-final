import { Field } from 'formik';
import { Flex, Text, Image } from '@chakra-ui/react';
import { FormControl, FormErrorMessage } from '@chakra-ui/react';

import AvanzadoIMG from '../../../../assets/onboarding/AvanzadoIMG.png';
import PrincipianteIMG from '../../../../assets/onboarding/PrincipianteIMG.png';

import '../../Register.scss';

export const StepsFormConocimientos = ({ name }: any) => {
  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl className="steps-form--form-control" isInvalid={form.errors[name] && form.touched[name]}>
          <Flex gap="20px" align="center" direction={{ base: 'column', sm: 'row' }}>
            <Card
              icon={AvanzadoIMG}
              title="Sí, ya cuento con conocimientos"
              isActive={field.value === 1}
              onClick={() => form.setFieldValue(name, 1)}
            />

            <Card
              icon={PrincipianteIMG}
              title="No, soy principiante"
              isActive={field.value === 2}
              onClick={() => form.setFieldValue(name, 2)}
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
      onClick={onClick}
      gap="19px"
      rounded="13px"
      border="1px solid"
      minH="223px"
      minW="396px"
      bg="white"
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
