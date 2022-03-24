import { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiDirections } from 'react-icons/bi';
import {
  Flex,
  Box,
  Text,
  Icon,
  Image,
  CircularProgress,
  Center,
} from '@chakra-ui/react';

import { ICurso } from '@clevery-lms/data';
import { filterCursosByRuta, useCursos } from '@clevery-lms/data';
import {
  LoginContext,
  ProgresoGlobalContext,
  RoadmapContext,
} from '../../../../shared/context';

export const RoadmapWidget = () => {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const { ruta } = useContext(RoadmapContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);
  const { cursos: cursos_Roadmap } = useCursos({
    userId: user?.id,
    query: [{ ruta: ruta?.itinerario }],
  });

  const [cursoSelected, setCursoSelected] = useState<ICurso>();
  const [cursoSelectedID, setCursoSelectedID] = useState<number>(0);

  useEffect(() => {
    if ((cursos_Roadmap?.length || 0) > 0) {
      const cursosSorted = filterCursosByRuta(
        ruta?.meta?.itinerario,
        cursos_Roadmap
      );
      const index = cursosSorted.findIndex((c: ICurso) =>
        progresoGlobal?.meta?.cursosIniciados?.includes(c.id || 0)
      );

      if (index !== -1) {
        setCursoSelected(cursosSorted[index]);
        setCursoSelectedID(index);
      } else {
        setCursoSelected(cursosSorted[0]);
        setCursoSelectedID(0);
      }
    }
  }, [cursos_Roadmap]);

  return (
    <Flex direction="column" gap="20px">
      <Flex w="100%" align="center" gap="20px" justify="space-between">
        <Text variant="h2_heading" isTruncated>
          Tu hoja de ruta
        </Text>

        <Box
          color="#8B8FA1"
          textDecoration="underline"
          fontWeight="semibold"
          fontSize="15px"
          lineHeight="18px"
          whiteSpace="nowrap"
          cursor="pointer"
          onClick={() => navigate('/roadmap')}
        >
          Ver entera
        </Box>
      </Flex>

      <Flex
        w="100%"
        bg="white"
        direction="column"
        rounded="20px"
        p="24px"
        border="1px solid var(--chakra-colors-gray_3)"
      >
        <Flex gap="20px">
          <Flex
            position="relative"
            align="center"
            justify="center"
            w="45px"
            h="45px"
            rounded="full"
            bg="primary_light"
          >
            <Icon boxSize="20px" color="primary" as={BiDirections} />

            <CircularProgress
              position="absolute"
              color="primary"
              trackColor="primary_light"
              value={progresoGlobal?.meta?.progresoCursos || 0}
            />
          </Flex>

          <Flex direction="column">
            <Box fontSize="21px" fontWeight="bold" lineHeight="25px">
              {progresoGlobal?.meta?.progresoCursos || 0}%
            </Box>

            <Box
              fontSize="14px"
              fontWeight="bold"
              color="gray_4"
              lineHeight="16px"
              textTransform="uppercase"
            >
              {ruta?.nombre}
            </Box>
          </Flex>
        </Flex>

        {/* SEPARADOR */}
        <Box w="100%" h="1px" bg="gray_2" my="24px" />

        {/* SIGUIENTE CURSO */}
        {cursoSelected && (
          <Flex direction="column">
            <Box
              fontWeight="semibold"
              fontSize="14px"
              lineHeight="16px"
              color="gray_4"
              mb="10px"
            >
              Curso seleccionado:
            </Box>

            <Flex
              align="center"
              w="100%"
              bg="gray_2"
              p="13px"
              rounded="12px"
              mb="14px"
              gap="15px"
              cursor="pointer"
              transition="all 0.2s ease"
              _hover={{ boxShadow: '0px 3px 10px rgba(0, 0, 0, 0.25)' }}
              onClick={() => navigate(`/cursos/${cursoSelected?.id}`)}
            >
              <Box fontWeight="bold" fontSize="16px" lineHeight="19px">
                {cursoSelectedID + 1}
              </Box>

              <Image
                src={cursoSelected.imagen?.url}
                h="45px"
                w="67px"
                rounded="10px"
              />

              <Flex
                direction="column"
                overflow="hidden"
                title={cursoSelected.titulo}
              >
                <Box
                  fontSize="16px"
                  fontWeight="bold"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  textOverflow="ellipsis"
                >
                  {cursoSelected.titulo}
                </Box>
              </Flex>
            </Flex>

            <Flex w="100%" wrap="wrap" gap="10px">
              {filterCursosByRuta(ruta?.meta?.itinerario, cursos_Roadmap)?.map(
                (c: ICurso, index: number) => (
                  <RoadmapItem
                    id={index + 1}
                    key={`roadmap_widget-item-${index}`}
                    onClick={() => {
                      setCursoSelected(c);
                      setCursoSelectedID(index);
                    }}
                    state={
                      c.meta?.isCompleted
                        ? 'completed'
                        : c.id === cursoSelected.id
                        ? 'current'
                        : 'idle'
                    }
                  />
                )
              )}
            </Flex>
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

const RoadmapItem = ({
  id = 0,
  state = 'idle',
  onClick,
}: {
  id: number;
  state: 'current' | 'completed' | 'idle';
  onClick: () => void;
}) => {
  const getStyle = (): React.CSSProperties => {
    switch (state) {
      case 'current':
        return {
          backgroundColor: 'var(--chakra-colors-primary)',
          border: '4px solid var(--chakra-colors-primary_light)',
          color: '#fff',
        };
      case 'completed':
        return {
          backgroundColor: 'var(--chakra-colors-primary_light)',
          color: 'var(--chakra-colors-primary)',
        };
      default:
        return {
          backgroundColor: 'var(--chakra-colors-gray_2)',
          color: 'var(--chakra-colors-gray_5)',
        };
    }
  };

  return (
    <Center
      h="34px"
      minW="34px"
      rounded="64px"
      fontSize="16px"
      cursor="pointer"
      fontWeight="bold"
      lineHeight="19px"
      onClick={onClick}
      transition="all 0.2s ease"
      _hover={{ boxShadow: 'var(--chakra-colors-primary_light)' }}
      style={getStyle()}
    >
      {id}
    </Center>
  );
};
