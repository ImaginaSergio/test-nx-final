import { useState } from 'react';

import { Flex, Box } from '@chakra-ui/react';

import { IForoTema } from '@clevery-lms/data';
import { useForoTemas } from '@clevery-lms/data';

export const TabForo = ({ cursoId }: { cursoId?: any }) => {
  const { data: temas } = useForoTemas({ query: [{ curso_id: cursoId }] });

  return (
    <Flex w="100%" direction="column" gap="14px" overflow="overlay">
      {temas?.map((tema: IForoTema, index: number) => (
        <DesplegableModulo
          key={`foro-tema-${index}`}
          tema={tema}
          index={index}
        />
      ))}
    </Flex>
  );
};

const DesplegableModulo = ({
  tema,
  index,
}: {
  tema: IForoTema;
  index: number;
}) => {
  const [isUnfolded, setIsUnfolded] = useState<boolean>(false);

  return (
    <Flex
      bg="white"
      p="20px"
      direction="column"
      rounded="20px"
      gap="20px"
      minH={!isUnfolded ? '85px' : ''}
      maxH={!isUnfolded ? '85px' : ''}
    >
      <Flex
        align="center"
        justify="space-between"
        cursor="pointer"
        onClick={() => setIsUnfolded(!isUnfolded)}
      >
        <Flex direction="column" overflow="hidden">
          <Box
            fontWeight="bold"
            fontSize="16px"
            whiteSpace="nowrap"
            overflow="hidden"
            textOverflow="ellipsis"
          >
            {tema.titulo}
          </Box>

          <Box fontWeight="normal" fontSize="13px" color="gray_4">
            {tema.descripcion}
          </Box>
        </Flex>

        <Flex align="center" gap="20px"></Flex>
      </Flex>
    </Flex>
  );
};

export default TabForo;
