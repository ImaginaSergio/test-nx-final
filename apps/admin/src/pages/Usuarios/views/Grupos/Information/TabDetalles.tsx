import { Box, Flex } from '@chakra-ui/react';

import { IGrupo, UserRolEnum } from '@clevery-lms/data';
import {
  InformationInput,
  InformationTextEditor,
} from '../../../../../shared/components';
import { useContext } from 'react';
import { LoginContext } from '../../../../../shared/context';
import { isRoleAllowed } from '@clevery-lms/utils';

type TabDetallesProps = {
  grupo: IGrupo;
  updateValue: (value: any) => void;
};

export const TabDetalles = ({ grupo, updateValue }: TabDetallesProps) => {
  const { user } = useContext(LoginContext);

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
          Información sobre el alumno como su nombre, datos de contacto,
          ajustes...
        </Box>
      </Flex>

      <Flex direction="column" gridGap="30px" w="100%">
        <InformationInput
          name="nombre"
          label="Nombre del grupo"
          updateValue={updateValue}
          defaultValue={grupo?.nombre}
          isDisabled={!isRoleAllowed([UserRolEnum.SUPERVISOR], user?.rol)}
        />

        <InformationTextEditor
          name="descripcion"
          label="Descripción del grupo"
          updateValue={updateValue}
          defaultValue={grupo?.descripcion}
          isDisabled={!isRoleAllowed([UserRolEnum.SUPERVISOR], user?.rol)}
        />
      </Flex>
    </Flex>
  );
};
