import { Flex, Box, Text } from '@chakra-ui/react';
import { IEntregable, ILeccion } from '@clevery-lms/data';
import { OpenParser } from '@clevery-lms/ui';

const CorregidoItem = ({
  leccion,
  entregable,
}: {
  leccion: ILeccion;
  entregable?: IEntregable;
}) => {
  return (
    <Flex direction="column" fontSize="15px" whiteSpace="pre-line">
      <Box fontSize="15px" whiteSpace="pre-line">
        <Text variant="h4_heading" mb="20px">
          Observaciones del ejercicio:
        </Text>
        <Flex
          bg="gray_1"
          border="1px solid var(--chakra-colors-gray_3)"
          p="12px"
          rounded="12px"
        >
          <OpenParser
            value={
              entregable?.observaciones || 'No hay observaciones del ejercicio'
            }
          />
        </Flex>
      </Box>

      <Box my="15px" bg="gray_3" h="1px" />
      <Box fontSize="15px" whiteSpace="pre-line">
        <Text variant="h4_heading" mb="20px">
          Enunciado del ejercicio:{' '}
        </Text>
        <Flex
          bg="gray_1"
          border="1px solid var(--chakra-colors-gray_3)"
          p="12px"
          rounded="12px"
        >
          <OpenParser value={leccion?.contenido || ''} />
        </Flex>
      </Box>
    </Flex>
  );
};

export { CorregidoItem };
