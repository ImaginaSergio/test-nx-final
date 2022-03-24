import { Box, Flex } from '@chakra-ui/react';

import { IEmpresa } from '@clevery-lms/data';
import { InformationInput } from '../../../../../shared/components';

type TabInformacionProps = {
  empresa: IEmpresa;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({
  empresa,
  updateValue,
}: TabInformacionProps) => {
  return (
    <Flex
      direction="column"
      p="30px"
      boxSize="100%"
      gridRowGap="30px"
      overflow="overlay"
    >
      <Flex minH="fit-content" w="100%" direction="column" gridRowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre la empresa, como el nombre del misma, su cif, sector
          y datos de contacto
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gridGap="30px" w="100%">
        <Flex direction="column" w="100%" gridGap="30px">
          <InformationInput
            name="cif"
            label="CIF"
            defaultValue={empresa.cif}
            updateValue={updateValue}
          />

          <InformationInput
            name="sector"
            label="Sector"
            defaultValue={empresa.sector}
            updateValue={updateValue}
          />
        </Flex>

        <Flex direction={{ base: 'column', lg: 'row' }} gridGap="30px" w="100%">
          <InformationInput
            name="persona_contacto"
            label="Persona de contacto"
            updateValue={updateValue}
            defaultValue={empresa.personaContacto}
          />

          <InformationInput
            name="email"
            label="Email de contacto"
            defaultValue={empresa.email}
            updateValue={updateValue}
          />

          <InformationInput
            name="telefono"
            label="Teléfono de contacto"
            defaultValue={empresa.telefono}
            updateValue={updateValue}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
