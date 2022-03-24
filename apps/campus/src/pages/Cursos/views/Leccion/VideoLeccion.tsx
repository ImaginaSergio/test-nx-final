import { useContext, useEffect, useRef, useState } from 'react';

import { BiTimeFive, BiPlayCircle } from 'react-icons/bi';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Text, Flex, Box, Icon, Tooltip } from '@chakra-ui/react';

import { fmtMnts, fmtSnds } from '@clevery-lms/utils';
import {
  FavoritosContext,
  LayoutContext,
  LoginContext,
} from '../../../../shared/context';
import { LeccionesPlayer } from '../../components/Leccion/Player/LeccionesPlayer';
import {
  FavoritoTipoEnum,
  IFavorito,
  ILeccion,
  IPuntoClave,
} from '@clevery-lms/data';
import { OpenParser } from '@clevery-lms/ui';

export const VideoLeccion = ({
  leccion,
  onLeccionStarted,
  onLeccionCompleted,
}: {
  leccion?: ILeccion;
  onLeccionStarted: (e?: any) => any;
  onLeccionCompleted: (e?: any) => any;
}) => {
  const playerRef = useRef<any>();
  const [leccionFavorito, setLeccionFavorito] = useState<IFavorito>();

  const { user } = useContext(LoginContext);
  const { favoritos, addFavorito, removeFavorito } =
    useContext(FavoritosContext);
  const { isMobile } = useContext(LayoutContext);

  useEffect(() => {
    if (favoritos?.length > 0 && leccion?.id)
      setLeccionFavorito(
        favoritos?.find(
          (f) =>
            f.tipo === FavoritoTipoEnum.LECCION && f.objetoId === leccion?.id
        )
      );
  }, [favoritos, leccion?.id]);

  const onNavigateSeconds = async (seconds: number) => {
    playerRef?.current?.seekTo(seconds);
  };

  return !isMobile ? (
    <Flex direction="column" boxSize="100%" gap="40px">
      <Flex direction="column" gap="10px">
        <Flex align="center" justify="space-between" gap="40px">
          <Text variant="h1_heading" fontSize={{ base: '18px', sm: '24px' }}>
            {leccion?.titulo}
          </Text>

          <Tooltip
            shouldWrapChildren
            label={leccionFavorito ? 'Borrar marcador' : 'Guardar marcador'}
          >
            <Icon
              boxSize={{ base: '18px', sm: '28px' }}
              cursor="pointer"
              color={leccionFavorito ? 'primary' : 'gray_5'}
              as={leccionFavorito ? FaBookmark : FaRegBookmark}
              onClick={
                leccionFavorito
                  ? () => removeFavorito(leccionFavorito)
                  : () => {
                      if (leccion?.id && user?.id)
                        addFavorito({
                          objetoId: leccion?.id,
                          tipo: FavoritoTipoEnum.LECCION,
                          userId: user?.id,
                          objeto: leccion,
                        });
                    }
              }
            />
          </Tooltip>
        </Flex>

        <Flex
          align={{ base: 'start', sm: 'center' }}
          gap={{ base: '6px', sm: '14px' }}
          direction={{ base: 'column', sm: 'row' }}
          justify="flex-start"
        >
          <Flex align="center" gap={{ base: '6px', sm: '10px' }}>
            <Icon as={BiPlayCircle} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              Vídeo
            </Box>
          </Flex>

          <Box
            w={{ base: '100%', sm: '1px' }}
            h={{ base: '1px', sm: '100%' }}
            bg="gray_3"
          />

          <Flex align="center" gap="10px">
            <Icon as={BiTimeFive} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              {fmtMnts(leccion?.duracion)} aproximadamente
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <LeccionesPlayer
        player={playerRef}
        leccion={leccion}
        onLeccionStarted={onLeccionStarted}
        onLeccionCompleted={onLeccionCompleted}
      />

      <Flex
        justify="space-between"
        bg="white"
        gap="40px"
        direction={{ base: 'column', md: 'row' }}
      >
        <Flex w="100%" direction="column" gridRowGap="20px">
          <Box fontWeight="semibold" fontSize="16px">
            Descripción
          </Box>

          {leccion?.descripcion ? (
            <Box fontSize="15px" lineHeight="22px">
              {leccion?.descripcion}
            </Box>
          ) : (
            <Box
              color="gray_4"
              fontWeight="bold"
              fontSize="16px"
              lineHeight="100%"
            >
              No hay descripción disponible
            </Box>
          )}
        </Flex>

        <Flex w="fit-content" minW="350px" direction="column" gridRowGap="20px">
          <Box fontWeight="semibold" fontSize="16px">
            Capítulos
          </Box>

          <Flex
            direction="column"
            fontWeight="normal"
            fontSize="16px"
            lineHeight="175%"
          >
            {leccion?.puntosClave && leccion.puntosClave.length > 0 ? (
              leccion.puntosClave
                .sort((a: any, b: any) => a.segundos - b.segundos)
                .map((pC: IPuntoClave, index: number) => (
                  <Flex gridColumnGap="5px" key={`puntoclave-${index}`}>
                    <Box
                      color="#1444EF"
                      fontWeight="medium"
                      cursor="pointer"
                      onClick={() => onNavigateSeconds(pC.segundos)}
                    >
                      {fmtSnds(pC.segundos || 0)}
                    </Box>

                    <Box>{` - ${pC.titulo}`}</Box>
                  </Flex>
                ))
            ) : (
              <Box
                color="gray_4"
                fontWeight="bold"
                fontSize="16px"
                lineHeight="100%"
              >
                No hay capítulos disponibles
              </Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  ) : (
    <Flex direction="column" boxSize="100%" gap="40px">
      <LeccionesPlayer
        player={playerRef}
        leccion={leccion}
        onLeccionStarted={onLeccionStarted}
        onLeccionCompleted={onLeccionCompleted}
      />
      <Flex direction="column" gap="10px" mx="10px">
        <Flex align="center" justify="space-between" gap="40px">
          <Text variant="h1_heading" fontSize={{ base: '18px', sm: '24px' }}>
            {leccion?.titulo}
          </Text>

          <Tooltip
            shouldWrapChildren
            label={leccionFavorito ? 'Borrar marcador' : 'Guardar marcador'}
          >
            <Icon
              boxSize={{ base: '18px', sm: '28px' }}
              cursor="pointer"
              color={leccionFavorito ? 'primary' : 'gray_5'}
              as={leccionFavorito ? FaBookmark : FaRegBookmark}
              onClick={
                leccionFavorito
                  ? () => removeFavorito(leccionFavorito)
                  : () => {
                      if (leccion?.id && user?.id)
                        addFavorito({
                          objetoId: leccion?.id,
                          tipo: FavoritoTipoEnum.LECCION,
                          userId: user?.id,
                          objeto: leccion,
                        });
                    }
              }
            />
          </Tooltip>
        </Flex>

        <Flex
          align={{ base: 'start', sm: 'center' }}
          gap={{ base: '6px', sm: '14px' }}
          direction={{ base: 'column', sm: 'row' }}
          justify="flex-start"
        >
          <Flex align="center" gap={{ base: '6px', sm: '10px' }}>
            <Icon as={BiPlayCircle} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              Vídeo
            </Box>
          </Flex>

          <Box
            w={{ base: '100%', sm: '1px' }}
            h={{ base: '1px', sm: '100%' }}
            bg="gray_3"
          />

          <Flex align="center" gap="10px">
            <Icon as={BiTimeFive} color="gray_4" />

            <Box fontSize="15px" fontWeight="semibold" color="gray_5">
              {fmtMnts(leccion?.duracion)} aproximadamente
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        justify="space-between"
        mx="10px"
        bg="white"
        gap="40px"
        direction={{ base: 'column', md: 'row' }}
      >
        <Flex w="100%" direction="column" gridRowGap="20px">
          <Box fontWeight="semibold" fontSize="16px">
            Descripción
          </Box>

          {leccion?.descripcion ? (
            <Box fontSize="15px" lineHeight="22px">
              <OpenParser value={leccion?.descripcion} />
            </Box>
          ) : (
            <Box
              color="gray_4"
              fontWeight="bold"
              fontSize="16px"
              lineHeight="100%"
            >
              No hay descripción disponible
            </Box>
          )}
        </Flex>

        <Flex w="fit-content" minW="350px" direction="column" gridRowGap="20px">
          <Box fontWeight="semibold" fontSize="16px">
            Capítulos
          </Box>

          <Flex
            direction="column"
            fontWeight="normal"
            fontSize="16px"
            lineHeight="175%"
          >
            {leccion?.puntosClave && leccion.puntosClave.length > 0 ? (
              leccion.puntosClave
                .sort((a: any, b: any) => a.segundos - b.segundos)
                .map((pC: IPuntoClave, index: number) => (
                  <Flex gridColumnGap="5px" key={`puntoclave-${index}`}>
                    <Box
                      color="#1444EF"
                      fontWeight="medium"
                      cursor="pointer"
                      onClick={() => onNavigateSeconds(pC.segundos)}
                    >
                      {fmtSnds(pC.segundos || 0)}
                    </Box>

                    <Box>{` - ${pC.titulo}`}</Box>
                  </Flex>
                ))
            ) : (
              <Box
                color="gray_4"
                fontWeight="bold"
                fontSize="16px"
                lineHeight="100%"
              >
                No hay capítulos disponibles
              </Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};
