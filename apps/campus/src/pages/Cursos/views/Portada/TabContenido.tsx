import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  BiBookOpen,
  BiCheck,
  BiChevronDown,
  BiChevronUp,
  BiListOl,
  BiLock,
  BiPlay,
  BiPlayCircle,
  BiTask,
  BiTimeFive,
} from 'react-icons/bi';
import {
  Flex,
  Box,
  Icon,
  Button,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';

import { fmtMnts } from '@clevery-lms/utils';
import { IModulo, ILeccion, LeccionTipoEnum } from '@clevery-lms/data';
import { LayoutContext } from '../../../../shared/context/layout.context';

export const TabContenido = ({ modulos = [] }: { modulos: IModulo[] }) => {
  return (
    <Flex w="100%" direction="column" gap="14px" overflow="overlay">
      {/* MODULOS */}

      {modulos?.map((modulo: IModulo, index: number) => (
        <DesplegableModulo
          key={`curso-modulo-${index}`}
          modulo={modulo}
          index={index}
        />
      ))}
    </Flex>
  );
};

const DesplegableModulo = ({
  modulo,
  index,
}: {
  modulo: IModulo;
  index: number;
}) => {
  const [isUnfolded, setIsUnfolded] = useState<boolean>(false);

  const navigate = useNavigate();
  const { isMobile } = useContext(LayoutContext);

  return (
    <Flex
      p={{ base: '14px', sm: '20px' }}
      bg="white"
      gap="20px"
      mb="10px"
      rounded="20px"
      align="center"
      direction="column"
      maxW="100%"
      minH={!isUnfolded ? '85px' : ''}
      maxH={!isUnfolded ? '85px' : ''}
    >
      <Flex
        align="center"
        justify="space-between"
        cursor={'pointer'}
        onClick={() => setIsUnfolded(!isUnfolded)}
        maxW="100%"
        w="100%"
      >
        <Flex gap={{ base: '10px', sm: '20px' }} align="center">
          <CircularProgress
            size={isMobile ? '30px' : '45px'}
            rounded="full"
            color="primary"
            trackColor="#F3F3F5"
            fontWeight="extrabold"
            value={
              ((modulo.meta?.progresos_count || 0) /
                (modulo.meta?.leccionesCount || 0)) *
              100
            }
          >
            <CircularProgressLabel
              fontWeight="extrabold"
              fontSize={{ base: '16px', sm: '18px' }}
              color={
                modulo.meta &&
                modulo.meta?.progresos_count >= modulo.meta?.leccionesCount
                  ? 'primary'
                  : ''
              }
            >
              {modulo.orden}
            </CircularProgressLabel>
          </CircularProgress>

          <Flex direction="column" w="100%">
            <Flex
              wrap="wrap"
              fontWeight="bold"
              fontSize={{ base: '14px', sm: '16px' }}
              textOverflow="ellipsis"
              maxW="100%"
              noOfLines={1}
            >
              {modulo.titulo}
            </Flex>

            <Box fontWeight="bold" fontSize="16px">
              <Flex
                gap={{ base: '0px', sm: '14px' }}
                fontWeight="normal"
                fontSize="13px"
                color="gray_4"
                direction={{ base: 'column', sm: 'row' }}
              >
                <Flex align="center" gap="4px">
                  <Icon as={BiListOl} />
                  {modulo.lecciones?.length} lecciones
                </Flex>

                <Flex align="center" gap="4px">
                  <Icon as={BiTimeFive} />
                  {fmtMnts(modulo?.meta?.duracionTotal || 0)}
                </Flex>
              </Flex>
            </Box>
          </Flex>
        </Flex>

        <Flex align="center" gap={{ base: '5px', sm: '20px' }}>
          {modulo.meta &&
            modulo.meta?.progresos_count >= modulo.meta?.leccionesCount && (
              <Icon
                color="#fff"
                bg="primary"
                boxSize="20px"
                rounded="full"
                as={BiCheck}
              />
            )}

          <Button
            bg="transparent"
            onClick={() => setIsUnfolded(!isUnfolded)}
            px="2px"
            maxW="20px"
            boxSize="20px"
            minW="20px"
            _hover={{ backgroundColor: 'transparent' }}
          >
            <Icon
              color="gray_4"
              _hover={{ color: 'var(--chakra-colors-primary)' }}
              boxSize="22px"
              as={isUnfolded ? BiChevronUp : BiChevronDown}
            />
          </Button>
        </Flex>
      </Flex>

      <Flex direction="column" gap="8px" w="100%">
        {isUnfolded &&
          modulo.lecciones?.map((leccion: ILeccion, i: number) => (
            <Flex
              w="100%"
              p={{ base: '8px', sm: '12px' }}
              bg="gray_2"
              rounded="14px"
              align="center"
              justify="space-between"
              key={`curso-modulo-${index}-leccion-${i}`}
              cursor={modulo.meta?.isBlocked ? 'not-allowed' : 'pointer'}
              _hover={
                modulo.meta?.isBlocked ? {} : { filter: 'brightness(90%)' }
              }
              onClick={
                modulo.meta?.isBlocked
                  ? undefined
                  : () =>
                      navigate(
                        `/cursos/${modulo.cursoId}/leccion/${leccion.id}`
                      )
              }
            >
              <Flex align="center" gap="14px">
                <Icon
                  boxSize="20px"
                  color="gray_5"
                  as={
                    leccion.tipo === LeccionTipoEnum.VIDEO
                      ? BiPlayCircle
                      : leccion.tipo === LeccionTipoEnum.ENTREGABLE
                      ? BiTask
                      : BiBookOpen
                  }
                />

                <Box fontSize="14px">{leccion.titulo}</Box>
              </Flex>

              <Flex align="center" gap="14px">
                {leccion.duracion && (
                  <Box fontSize="15px">{fmtMnts(leccion.duracion || 0)}</Box>
                )}

                <Icon
                  boxSize="20px"
                  as={
                    !leccion.meta?.isBlocked && !leccion.meta?.isCompleted
                      ? BiPlay
                      : leccion.meta?.isCompleted
                      ? BiCheck
                      : BiLock
                  }
                />
              </Flex>
            </Flex>
          ))}
      </Flex>
    </Flex>
  );
};

export default TabContenido;
