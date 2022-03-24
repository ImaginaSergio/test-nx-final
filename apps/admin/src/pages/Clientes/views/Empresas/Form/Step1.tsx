import { Flex } from '@chakra-ui/react';

import { FormInput } from '../../../../../shared/components';

const Step1 = () => {
  return (
    <Flex bg="#fff" boxSize="100%" p="30px">
      <Flex direction="column" w="20%" mr="30px" gridRowGap="20px">
        <FormInput name="nombre" label="Nombre de la empresa *" />

        <FormInput name="cif" label="Cif de la empresa" />

        <FormInput name="sector" label="Sector" />
      </Flex>

      <Flex direction="column" h="100%" w="80%" gridRowGap="20px">
        <FormInput name="personaContacto" label="Persona de contacto *" />

        <FormInput name="email" label="Email de contacto *" />

        <FormInput name="telefono" label="Teléfono de contacto *" />
      </Flex>
    </Flex>
  );
};

export default Step1;
