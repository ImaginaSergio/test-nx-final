import { Flex, Box } from '@chakra-ui/react';
import { IProceso } from '@clevery-lms/data';

type TabInscritosProps = {
  proceso: IProceso;
  updateValue: (value: any) => void;
};

export const TabInscritos = ({ proceso, updateValue }: TabInscritosProps) => {
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
          Alumnos inscritos en el proceso
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre el proceso, como el título del mismo, descripción,
          logotipo, etc...
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gridGap="30px" w="100%">
        Coming soon...
      </Flex>
    </Flex>
  );
};
