import { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { es } from 'date-fns/locale';
import { formatDistance } from 'date-fns';
import { BiChat, BiCommentAdd, BiDislike, BiLike, BiPin } from 'react-icons/bi';
import {
  Text,
  Flex,
  Box,
  Icon,
  Button,
  Center,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';

import { LoginContext } from '../../../shared/context';
import { IForoPregunta, UserRolEnum } from '@clevery-lms/data';
import { updateForoTema, useForoTema } from '@clevery-lms/data';

const ForoTopic = () => {
  const navigate = useNavigate();

  const { temaId } = useParams<any>();
  const { user } = useContext(LoginContext);

  const [refresh, setRefresh] = useState(false);
  const [filter, setFilter] = useState<'tendencia' | 'recientes'>('tendencia');

  const { data: tema } = useForoTema({
    id: +(temaId || 0),
    query: [{ refresh: refresh }],
  });

  const refreshData = () => setRefresh(!refresh);
  const getFijadas = () =>
    tema?.preguntas?.filter((p: IForoPregunta) => p.fijado) || [];
  const getNoFijadas = (filter: 'tendencia' | 'recientes') =>
    tema?.preguntas
      ?.filter((p: IForoPregunta) => !p.fijado)
      ?.sort((a, b) => sortPreguntas(a, b, filter)) || [];

  const sortPreguntas = (
    a: IForoPregunta,
    b: IForoPregunta,
    filter: 'tendencia' | 'recientes'
  ) => {
    if (!a || !b) return -1;

    if (filter === 'recientes')
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    else
      return (
        (b.meta?.totalVotosPositivos || 0) - (a.meta?.totalVotosPositivos || 0)
      );
  };

  const fijarTema = () => {
    if (!tema?.id) return;

    updateForoTema({
      id: +tema?.id,
      tema: { fijado: tema?.fijado ? false : true },
    }).then(() => refreshData());
  };

  return (
    <Flex w="100%" direction="column" p="20px 34px 0px" gap="40px">
      <Flex
        align={{ base: 'start', sm: 'center' }}
        direction={{ base: 'column', sm: 'row' }}
      >
        <Flex
          w="100%"
          direction="column"
          gap={{ base: '16px', sm: '32px' }}
          align="start"
        >
          <Flex direction="column" gap="7px" align="start">
            <Text variant="h1_heading">{tema?.titulo}</Text>

            <Box fontSize="21px" fontWeight="medium" lineHeight="25px">
              {tema?.descripcion}
            </Box>
          </Flex>

          <Flex gap="5px" align={{ base: 'center', sm: 'start' }}>
            <Icon as={BiChat} boxSize="20px" color="gray_6" />

            <Box
              fontWeight="semibold"
              fontSize="13px"
              lineHeight="16px"
              color="gray_4"
            >
              {tema?.preguntas?.length || 0} preguntas
            </Box>
          </Flex>
        </Flex>

        <Flex gap="8px" mt={{ base: '16px', sm: '0px' }}>
          {/* <Button
            isDisabled
            title="¡Próximamente!"
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

          <Button
            bg="primary"
            color="#fff"
            p="10px 16px"
            rounded="10px"
            minW="fit-content"
            onClick={() => navigate(`/foro/${temaId}/new`)}
            leftIcon={<Icon as={BiCommentAdd} boxSize="24px" />}
          >
            Añadir pregunta
          </Button>

          {(user?.rol === UserRolEnum.ADMIN ||
            user?.meta?.rol === UserRolEnum.ADMIN) &&
            tema && (
              <Tooltip
                label={tema?.fijado ? 'Desfijar tema' : 'Fijar tema'}
                placement="top"
              >
                <IconButton
                  aria-label={tema?.fijado ? 'Desfijar tema' : 'Fijar tema'}
                  bg={tema?.fijado ? 'primary_light' : 'gray_3'}
                  color={tema?.fijado ? 'primary' : 'black'}
                  onClick={fijarTema}
                  rounded="8px"
                  icon={<BiPin />}
                  p="7px 24px"
                />
              </Tooltip>
            )}
        </Flex>
      </Flex>

      {getFijadas().length > 0 && (
        <Flex direction="column" w="100%" bg="white" rounded="12px">
          <Box p="24px" fontSize="18px" fontWeight="bold" lineHeight="22px">
            Discusiones fijadas
          </Box>

          <Box h="1px" bg="gray_3" />

          <Flex direction="column">
            {getFijadas().map((p: IForoPregunta) => (
              <PreguntaItem
                key={`pregunta-fijada-${p.id}`}
                pregunta={p}
                onClick={() => navigate(`/foro/${temaId}/${p.id}`)}
              />
            ))}
          </Flex>
        </Flex>
      )}

      <Flex direction="column" w="100%" bg="white" rounded="12px">
        <Flex
          gap="40px"
          p="24px 24px 0px"
          fontSize="18px"
          fontWeight="bold"
          lineHeight="22px"
        >
          <Box
            pb="22px"
            px="5px"
            cursor="pointer"
            borderBottom="2px solid"
            onClick={() => setFilter('tendencia')}
            color={filter === 'tendencia' ? 'black' : 'gray_6'}
            borderBottomColor={filter === 'tendencia' ? 'primary' : 'white'}
          >
            En Tendencia
          </Box>

          <Box
            pb="22px"
            px="5px"
            cursor="pointer"
            borderBottom="2px solid"
            onClick={() => setFilter('recientes')}
            color={filter === 'recientes' ? 'black' : 'gray_6'}
            borderBottomColor={filter === 'recientes' ? 'primary' : 'white'}
          >
            Más Recientes
          </Box>
        </Flex>

        <Box h="1px" bg="gray_3" />

        <Flex direction="column">
          {getNoFijadas(filter).map((p: IForoPregunta) => (
            <PreguntaItem
              key={`pregunta-${p.id}`}
              pregunta={p}
              onClick={() => navigate(`/foro/${temaId}/${p.id}`)}
            />
          ))}
          {getNoFijadas(filter).length === 0 && <Flex h="100px" />}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ForoTopic;

const PreguntaItem = ({
  pregunta,
  onClick,
}: {
  pregunta: IForoPregunta;
  onClick: () => void;
}) => {
  const calcVotos = () =>
    (pregunta?.meta?.totalVotosPositivos || 0) -
    (pregunta?.meta?.totalVotosNegativos || 0);

  return (
    <Flex
      p="24px"
      gap="20px"
      cursor="pointer"
      onClick={onClick}
      _last={{
        borderBottom: 'none',
        borderBottomLeftRadius: '12px',
        borderBottomRightRadius: '12px',
      }}
      _hover={{ bg: 'gray_2' }}
      borderBottom="1px solid var(--chakra-colors-gray_3)"
    >
      <Center
        p="7px"
        gap="2px"
        minW="54px"
        rounded="12px"
        boxSize="54px"
        bg="primary_light"
        color={calcVotos() >= 0 ? 'primary' : 'cancel'}
      >
        <Icon as={calcVotos() >= 0 ? BiLike : BiDislike} boxSize="20px" />

        <Box fontSize="14px" lineHeight="17px" fontWeight="bold">
          {calcVotos() >= 0
            ? pregunta?.meta?.totalVotosPositivos || 0
            : '-' + pregunta?.meta?.totalVotosNegativos || 0}
        </Box>
      </Center>

      <Flex direction="column" w="100%" gap="6px">
        {pregunta?.fijado && (
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

        <Box fontSize="16px" fontWeight="bold" lineHeight="20px">
          {pregunta?.titulo}
        </Box>

        <Box
          color="gray_4"
          fontSize="13px"
          fontWeight="semibold"
          lineHeight="16px"
        >
          Publicado por{' '}
          <strong>@{pregunta?.user?.username || 'username'}</strong> hace{' '}
          {formatDistance(new Date(pregunta?.createdAt), new Date(), {
            locale: es,
          })}
        </Box>
      </Flex>

      <Flex minW="fit-content" gap="4px" align="center">
        <Icon as={BiChat} color="gray_4" boxSize="20px" />

        <Box
          fontSize="13px"
          lineHeight="16px"
          fontWeight="semibold"
          color="gray_5"
        >
          {pregunta?.meta?.totalRespuestas || 0}
        </Box>
      </Flex>
    </Flex>
  );
};
