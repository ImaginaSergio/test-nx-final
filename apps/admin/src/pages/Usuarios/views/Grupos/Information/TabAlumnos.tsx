import { Box, Flex } from '@chakra-ui/react';

import { IGrupo, IUser } from '@clevery-lms/data';

type TabAlumnosProps = {
  grupo: IGrupo;
  updateValue: (value: any) => void;
};

export const TabAlumnos = ({ grupo, updateValue }: TabAlumnosProps) => {
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
          Listado de alumnos
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Listado de los alumnos asociados al grupo
        </Box>
      </Flex>

      <Flex direction="column" gridGap="30px" w="100%">
        {grupo?.users?.map((u: IUser) => (
          <Flex direction="column" gap="4px" w="100%">
            <Box fontWeight="bold">
              {(u.nombre || '') + ' ' + (u.apellidos || '')}
            </Box>
            <Box fontWeight="semibold" color="gray_5">
              {u.email}
            </Box>
          </Flex>
        ))}
      </Flex>
    </Flex>
  );
};
