import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BiMenu, BiTrash } from 'react-icons/bi';
import { Flex, Box, Image, Icon } from '@chakra-ui/react';

import { ICurso } from '@clevery-lms/data';

const ItinerarioListItem = ({
  curso,
  onDelete,
}: {
  curso: ICurso;
  onDelete: () => void;
}) => {
  return (
    <Flex
      className="itinerario-list-item"
      align="center"
      p="10px 12px"
      rounded="12px"
      gridGap="20px"
      bg="#FAFAFC"
    >
      <Flex align="center" w="100%" minW="320px">
        <Icon as={BiMenu} w="18px" h="18px" color="#878EA0" mr="12px" />

        <Image
          fit="cover"
          rounded="7px"
          h="40px"
          minW="40px"
          mr="15px"
          src={curso?.imagen?.url}
        />

        <Flex direction="column" gridGap="2px">
          <Box fontWeight="semibold" fontSize="16px" lineHeight="19px">
            {curso.titulo}
          </Box>

          <Box color="#878EA0" fontSize="15px" lineHeight="18px">
            Duración - Nº Sesiones
          </Box>
        </Flex>
      </Flex>

      <Flex align="center" w="100%" gridGap="15px">
        <Image
          fit="cover"
          rounded="7px"
          h="40px"
          minW="40px"
          src={curso?.profesor?.avatar?.url}
        />

        <Flex direction="column" gridGap="2px">
          <Box fontWeight="semibold" fontSize="16px" lineHeight="19px">
            {curso.profesor?.fullName}
          </Box>

          <Box color="#878EA0" fontSize="15px" lineHeight="18px">
            Apellidos
          </Box>
        </Flex>
      </Flex>

      <Flex align="center" w="100%">
        <Box
          bg="#2EDDBE"
          rounded="7px"
          p="2px 7px"
          color="#FFF"
          fontSize="12px"
          lineHeight="14px"
        >
          {curso?.publicado ? 'PUBLICADO' : 'OCULTO'}
        </Box>
      </Flex>

      <Flex align="center" w="100%">
        <Box fontSize="15px" lineHeight="18px">
          {format(new Date(curso.createdAt), 'dd LLL yyyy', { locale: es })}
        </Box>
      </Flex>

      <Flex
        minW="fit-content"
        cursor="pointer"
        opacity={0}
        onClick={onDelete}
        transition="all 0.2s ease"
        sx={{ '.itinerario-list-item:hover &': { opacity: 1 } }}
      >
        <Icon as={BiTrash} w="18px" h="18px" color="#878EA0" />
      </Flex>
    </Flex>
  );
};

export default ItinerarioListItem;
