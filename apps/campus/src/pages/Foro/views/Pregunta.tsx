import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { es } from 'date-fns/locale';
import { formatDistance } from 'date-fns';
import {
  Box,
  Flex,
  Button,
  Tooltip,
  Skeleton,
  Icon,
  Menu,
  MenuList,
  MenuItem,
  MenuButton,
  IconButton,
  Badge,
} from '@chakra-ui/react';
import {
  BiChevronDown,
  BiCommentDetail,
  BiDislike,
  BiLike,
  BiPin,
  BiSend,
  BiSortDown,
  BiSortUp,
} from 'react-icons/bi';

import { OpenEditor, OpenParser } from '@clevery-lms/ui';
import { Avatar } from '../../../shared/components';
import { IForoRespuesta, UserRolEnum } from '@clevery-lms/data';
import { LoginContext, VotosContext } from '../../../shared/context';
import {
  addForoRespuesta,
  updateForoPregunta,
  updateForoRespuesta,
  useForoPregunta,
} from '@clevery-lms/data';

enum RespuestasSortEnum {
  RECIENTE = 'Reciente',
  VOTOS = 'Núm. Votos',
}

enum Respuestas0rderEnum {
  ASC = 'asc',
  DESC = 'desc',
}

const ForoQuestion = () => {
  const { preguntaId } = useParams<any>();
  const { user } = useContext(LoginContext);
  const { votos, addVoto, updateVoto, removeVoto, filterVotos } =
    useContext(VotosContext);

  const [refresh, setRefresh] = useState(false);
  const [order, setOrder] = useState<string>('');
  const [sort, setSort] = useState<RespuestasSortEnum>(
    RespuestasSortEnum.VOTOS
  );

  const { data: pregunta } = useForoPregunta({
    id: +(preguntaId || 0),
    query: [{ refresh: refresh }],
  });
  const [preguntaVoto, setPreguntaVoto] = useState(
    votos.find((v) => v.preguntaId == preguntaId)
  );

  const [editorNuevaRespuesta, setEditorNuevaRespuesta] =
    useState<boolean>(false);

  // Cuando cargue el parámetro de la URL, obtenemos los votos
  // del usuario filtrando por esta pregunta en concreto
  useEffect(() => {
    if (preguntaId) filterVotos(`$preguntaId=${preguntaId}`);
  }, [preguntaId]);

  useEffect(() => {
    refreshDataVoto();
  }, [votos]);

  const refreshData = () => setRefresh(!refresh);
  const refreshDataVoto = () =>
    setPreguntaVoto(votos?.find((v) => v.preguntaId == preguntaId));

  const fijarPregunta = () => {
    if (!pregunta?.id) return;

    updateForoPregunta({
      id: +pregunta?.id,
      pregunta: { fijado: pregunta?.fijado ? false : true },
    }).then(() => refreshData());
  };

  const onVote = (like: boolean) => {
    if (!pregunta?.id || !user?.id) return;

    // Si aún no ha votado, creamos el voto.
    if (!preguntaVoto)
      addVoto(
        { positivo: like, preguntaId: pregunta.id, userId: user?.id },
        'pregunta'
      );
    // Si ha pulsado el mismo botón que ya tenia el voto, borramos el voto.
    else if (preguntaVoto.positivo === like)
      removeVoto(preguntaVoto, 'pregunta');
    // Si pulsa un botón diferente, actualizamos el voto.
    else updateVoto({ ...preguntaVoto, positivo: like }, 'pregunta');

    refreshDataVoto();
  };

  return (
    <Flex
      w="100%"
      direction="column"
      p={{ base: '10px', sm: '20px 34px 0px' }}
      gap="60px"
    >
      <Flex
        direction="column"
        gap="24px"
        w="100%"
        bg="white"
        rounded="12px"
        p="24px 32px"
      >
        <Flex direction="column">
          <Badge
            mb="15px"
            bg="primary_light"
            color="primary"
            p="6px 12px"
            rounded="5px"
            w="fit-content"
            textTransform="capitalize"
          >
            {pregunta?.tema?.curso?.titulo}{' '}
            {pregunta?.tema?.modulo
              ? `/ ${pregunta?.tema?.modulo?.titulo}`
              : ''}
          </Badge>

          <Flex w="100%" align="center">
            <Box fontSize="18px" fontWeight="bold" lineHeight="22px" mb="10px">
              {pregunta?.titulo ? (
                <Box
                  w="100%"
                  fontWeight="bold"
                  fontSize="28px"
                  lineHeight="34px"
                >
                  {pregunta?.titulo}
                </Box>
              ) : (
                <Skeleton w="100%" height="24px" />
              )}
            </Box>

            {/* <Button
              isDisabled
              title="¡Próximamente!"
              ml="auto"
              p="10px 16px"
              rounded="10px"
              minW="fit-content"
              bg="white"
              border="1px solid"
              borderColor="gray_4"
              leftIcon={<Icon as={BiUserPlus} boxSize="24px" />}
            >
              Seguir
            </Button> */}
          </Flex>

          {pregunta?.createdAt ? (
            <Box
              color="gray_4"
              fontSize="13px"
              fontWeight="semibold"
              lineHeight="16px"
            >
              Subido por @<strong>{pregunta?.user?.username}</strong> hace{' '}
              {formatDistance(new Date(pregunta?.createdAt), new Date(), {
                locale: es,
              })}
            </Box>
          ) : (
            <Skeleton w="100%" height="24px" />
          )}
        </Flex>

        <Box h="1px" bg="gray_3" />

        <Box fontSize="15px" lineHeight="22px">
          <OpenParser value={pregunta?.contenido || ''} />
        </Box>

        <Box h="1px" bg="gray_3" />

        <Flex
          align="center"
          gap="12px"
          direction={{ base: 'column', sm: 'row' }}
        >
          <Flex gap="10px">
            <Button
              rounded="42px"
              border="1px solid var(--chakra-colors-primary)"
              _hover={{ transform: 'scale(1.05) translate(0px, -5px)' }}
              transition="all 0.3s linear"
              leftIcon={<Icon as={BiLike} boxSize="20px" />}
              onClick={() => onVote(true)}
              bg={preguntaVoto?.positivo === true ? 'primary' : 'white'}
              color={preguntaVoto?.positivo === true ? '#fff' : 'primary'}
            >
              {pregunta?.meta?.totalVotosPositivos || 0}
            </Button>

            <Button
              rounded="42px"
              _hover={{ transform: 'scale(1.05) translate(0px, -5px)' }}
              transition="all 0.3s linear"
              leftIcon={<Icon as={BiDislike} boxSize="20px" />}
              onClick={() => onVote(false)}
              bg={preguntaVoto?.positivo === false ? 'cancel' : 'white'}
              color={preguntaVoto?.positivo === false ? '#fff' : 'cancel'}
              border="1px solid var(--chakra-colors-cancel)"
            >
              {pregunta?.meta?.totalVotosNegativos || 0}
            </Button>
          </Flex>

          <Button
            bg="white"
            rounded="10px"
            border="1px solid"
            borderColor="gray_4"
            leftIcon={<BiCommentDetail />}
            onClick={() => {
              setEditorNuevaRespuesta(true);
              setTimeout(() => {
                document
                  .getElementById('nueva_respuesta')
                  ?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
              }, 200);

              setTimeout(() => {
                setEditorNuevaRespuesta(false);
              }, 1000);
            }}
          >
            Responder
          </Button>

          {(user?.rol === UserRolEnum.ADMIN ||
            user?.meta?.rol === UserRolEnum.ADMIN) && (
            <Tooltip
              label={pregunta?.fijado ? 'Desfijar pregunta' : 'Fijar pregunta'}
              placement="top"
            >
              <IconButton
                ml="auto"
                rounded="8px"
                p="7px 24px"
                icon={<Icon as={BiPin} boxSize="20px" />}
                onClick={fijarPregunta}
                color={pregunta?.fijado ? 'primary' : 'black'}
                bg={pregunta?.fijado ? 'primary_light' : 'gray_3'}
                _hover={{ transform: 'scale(1.05) translate(0px, -5px)' }}
                transition="all 0.3s linear"
                aria-label={
                  pregunta?.fijado ? 'Desfijar pregunta' : 'Fijar pregunta'
                }
              />
            </Tooltip>
          )}
        </Flex>
      </Flex>

      <Flex gap="20px" direction="column">
        <Flex justify="space-between" gap="10px" align="end">
          <Box fontWeight="bold" lineHeight="22px" fontSize="18px">
            {pregunta?.respuestas?.length || 0} respuestas
          </Box>

          <Menu>
            <MenuButton
              isDisabled
              as={Button}
              bg="gray_2"
              p="5px 10px"
              rounded="8px"
              minW="fit-content"
              _hover={{ filter: 'brightness(90%)' }}
              rightIcon={<Icon as={BiChevronDown} boxSize="20px" />}
              leftIcon={
                <Icon
                  as={
                    order === Respuestas0rderEnum.DESC ? BiSortDown : BiSortUp
                  }
                  boxSize="20px"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOrder(
                      order === Respuestas0rderEnum.DESC
                        ? Respuestas0rderEnum.ASC
                        : Respuestas0rderEnum.DESC
                    );
                  }}
                />
              }
            >
              {sort}
            </MenuButton>

            <MenuList color="black" bg="white">
              {Object.values(RespuestasSortEnum).map((value, index) => (
                <MenuItem
                  cursor="pointer"
                  fontSize="16px"
                  fontWeight="bold"
                  _hover={{ bg: 'gray_1' }}
                  _focus={{ bg: 'gray_1' }}
                  key={'cursos-filter-' + index}
                  onClick={() => setSort(value)}
                >
                  {value}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </Flex>

        <Flex
          direction="column"
          gap="24px"
          w="100%"
          bg="white"
          rounded="12px"
          p="24px 32px"
          mb="30px"
          transition="all 0.6s linear"
          h="fit-content"
        >
          {pregunta?.respuestas?.map((r: IForoRespuesta, index: number) => (
            <RespuestaItem
              respuesta={r}
              onSave={refreshData}
              key={'respuesta-' + index}
            />
          ))}

          <NuevaRespuestaItem
            preguntaId={preguntaId}
            onSave={refreshData}
            openEditor={editorNuevaRespuesta}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ForoQuestion;

const RespuestaItem = ({
  respuesta,
  onSave,
}: {
  respuesta: IForoRespuesta;
  onSave: () => void;
}) => {
  const { user } = useContext(LoginContext);

  const { votos, addVoto, updateVoto, removeVoto } = useContext(VotosContext);

  const [respuestaVoto, setRespuestaVoto] = useState(
    votos?.find((v) => v.respuestaId == respuesta.id)
  );

  useEffect(() => {
    refreshDataVoto();
  }, [respuesta, votos]);

  const refreshDataVoto = () => {
    setRespuestaVoto(votos?.find((v) => v.respuestaId == respuesta.id));
  };

  const onVote = (like: boolean) => {
    if (!respuesta?.id || !user?.id) return;

    // Si aún no ha votado, creamos el voto
    if (!respuestaVoto)
      addVoto(
        { positivo: like, respuestaId: respuesta.id, userId: user?.id },
        'respuesta'
      );
    // Si ha pulsado el mismo botón que ya tenia el voto, borramos el voto
    else if (respuestaVoto.positivo === like)
      removeVoto(respuestaVoto, 'respuesta');
    else updateVoto({ ...respuestaVoto, positivo: like }, 'respuesta');

    refreshDataVoto();
  };

  const fijarRespuesta = () => {
    if (!respuesta.id) return;

    updateForoRespuesta({
      id: respuesta.id,
      respuesta: { fijado: respuesta?.fijado ? false : true },
    }).then(() => onSave());
  };

  return (
    <Flex
      pb="24px"
      gap="20px"
      _last={{ borderBottom: 'none' }}
      borderBottom="1px solid var(--chakra-colors-gray_3)"
    >
      <Avatar
        src={respuesta?.user?.avatar?.url}
        name={respuesta?.user?.username?.substring(0, 2)}
        size="40px"
      />

      <Flex direction="column" w="100%" gap="25px">
        <Flex w="100%" justify="space-between">
          <Flex direction="column" gap="6px">
            {respuesta?.createdAt ? (
              <Box
                fontSize="16px"
                fontWeight="semibold"
                lineHeight="16px"
                textTransform="capitalize"
              >
                {respuesta?.user?.username}
              </Box>
            ) : (
              <Skeleton w="100%" height="24px" />
            )}

            {respuesta?.createdAt ? (
              <Box
                color="gray_4"
                fontSize="13px"
                fontWeight="semibold"
                lineHeight="16px"
              >
                Publicado hace{' '}
                {formatDistance(new Date(respuesta?.createdAt), new Date(), {
                  locale: es,
                })}
              </Box>
            ) : (
              <Skeleton w="100%" height="24px" />
            )}
          </Flex>

          {respuesta.fijado && (
            <Flex align="center" gap="10px">
              <Icon as={BiPin} color="primary" boxSize="20px" />

              <Box
                fontSize="13px"
                lineHeight="16px"
                fontWeight="semibold"
                color="gray_5"
              >
                FIJADO POR MODERADORES
              </Box>
            </Flex>
          )}
        </Flex>

        <Box>
          <OpenParser value={respuesta?.contenido} />
        </Box>

        <Flex align="center" gap="12px">
          <Button
            rounded="42px"
            border="1px solid var(--chakra-colors-primary)"
            _hover={{ transform: 'scale(1.05) translate(0px, -5px)' }}
            transition="all 0.3s linear"
            leftIcon={<Icon as={BiLike} boxSize="20px" />}
            onClick={() => onVote(true)}
            bg={respuestaVoto?.positivo === true ? 'primary' : 'white'}
            color={respuestaVoto?.positivo === true ? '#fff' : 'primary'}
          >
            {respuesta?.meta?.totalVotosPositivos || 0}
          </Button>

          <Button
            rounded="42px"
            _hover={{ transform: 'scale(1.05) translate(0px, -5px)' }}
            transition="all 0.3s linear"
            leftIcon={<Icon as={BiDislike} boxSize="20px" />}
            onClick={() => onVote(false)}
            bg={respuestaVoto?.positivo === false ? 'cancel' : 'white'}
            color={respuestaVoto?.positivo === false ? '#fff' : 'cancel'}
            border="1px solid var(--chakra-colors-cancel)"
          >
            {respuesta?.meta?.totalVotosNegativos || 0}
          </Button>

          {(user?.rol === UserRolEnum.ADMIN ||
            user?.meta?.rol === UserRolEnum.ADMIN) && (
            <Tooltip
              label={
                respuesta.fijado ? 'Desfijar respuesta' : 'Fijar respuesta'
              }
              placement="left"
            >
              <IconButton
                ml="auto"
                p="7px 24px"
                _hover={{ transform: 'scale(1.05) translate(0px, -5px)' }}
                transition="all 0.3s linear"
                rounded="8px"
                icon={<BiPin />}
                onClick={fijarRespuesta}
                color={respuesta.fijado ? 'primary' : 'black'}
                bg={respuesta.fijado ? 'primary_light' : 'gray_3'}
                aria-label={
                  respuesta.fijado ? 'Desfijar respuesta' : 'Fijar respuesta'
                }
              />
            </Tooltip>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};

const NuevaRespuestaItem = ({
  onSave,
  preguntaId,
  isDisabled = false,
  openEditor = false,
}: {
  onSave: () => void;
  isDisabled?: boolean;
  openEditor?: boolean;
  preguntaId?: number | string;
}) => {
  const { user } = useContext(LoginContext);
  const [estado, setEstado] = useState<'idle' | 'editing'>('idle');

  const [contenido, setContenido] = useState<string>('');
  useEffect(() => {
    if (openEditor) setEstado('editing');
  }, [openEditor]);

  const subirRespuesta = () => {
    if (!preguntaId || !user?.id) return;

    addForoRespuesta({
      respuesta: {
        preguntaId: +preguntaId,
        contenido: contenido,
        userId: user?.id,
        fijado: false,
      },
    }).then((data) => {
      clearState();
      onSave();
    });
  };

  const clearState = () => {
    setContenido('');
    setEstado('idle');
  };

  return estado === 'idle' ? (
    <Flex w="100%" gap="20px" align="center">
      <Avatar
        src={user?.avatar?.url}
        name={user?.username?.substring(0, 2)}
        size="40px"
      />

      <Box
        w="100%"
        p="10px"
        bg="gray_1"
        color="gray_4"
        rounded="12px"
        cursor={isDisabled ? 'not-allowed' : 'pointer'}
        border="1px solid var(--chakra-colors-gray_3)"
        onClick={
          isDisabled
            ? undefined
            : () => {
                setEstado('editing');
                setTimeout(() => {
                  document
                    .getElementById('nueva_respuesta')
                    ?.scrollIntoView({ behavior: 'smooth' });
                }, 50);
              }
        }
      >
        Escribe una respuesta
      </Box>
    </Flex>
  ) : (
    <Flex
      w="100%"
      gap="20px"
      align="start"
      direction={{ base: 'column', sm: 'row' }}
    >
      <Avatar
        src={user?.avatar?.url}
        name={user?.username?.substring(0, 2)}
        size="40px"
      />

      <Flex w="100%" gap="24px" direction="column" color="black">
        <OpenEditor
          placeholder="Escribe una respuesta"
          value={contenido}
          onChange={(e: any) => setContenido(e)}
        />

        <Flex gap="12px">
          <Button
            bg="white"
            p="10px 16px"
            rounded="10px"
            border="1px solid"
            borderColor="gray_4"
            onClick={clearState}
          >
            Cancelar
          </Button>

          <Button
            id="nueva_respuesta"
            bg="primary"
            color="#fff"
            leftIcon={<BiSend />}
            rounded="10px"
            p="10px 16px"
            onClick={subirRespuesta}
            _hover={{ opacity: '0.7' }}
          >
            Subir respuesta
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
