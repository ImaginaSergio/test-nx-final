import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

import { AiFillStar } from 'react-icons/ai';
import {
  BiTimeFive,
  BiStar,
  BiTrophy,
  BiBarChart,
  BiListOl,
  BiPlay,
} from 'react-icons/bi';
import {
  Box,
  Button,
  Flex,
  Image,
  Icon,
  Progress,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Skeleton,
} from '@chakra-ui/react';

import TabContenido from './TabContenido';

import { fmtMnts } from '@clevery-lms/utils';
import { Avatar, CardExamen } from '../../../../shared/components';
import { useCurso, useExamenes } from '@clevery-lms/data';
import { IExamen, FavoritoTipoEnum, IFavorito } from '@clevery-lms/data';
import {
  FavoritosContext,
  LayoutContext,
  LoginContext,
} from '../../../../shared/context';
import { OpenParser } from '@clevery-lms/ui';
import { FaRegEyeSlash } from 'react-icons/fa';

const Portada = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(LoginContext);
  const { setShowHeader, setShowSidebar } = useContext(LayoutContext);
  const { favoritos, addFavorito, removeFavorito } =
    useContext(FavoritosContext);

  const [cursoFavorito, setCursoFavorito] = useState<IFavorito>();

  const { cursoId } = useParams<any>();
  const { curso, isLoading, isError } = useCurso({
    id: +(cursoId || 0),
    userId: user?.id,
  });
  const { examenes } = useExamenes({
    query: [{ cursos: `[${cursoId}]` }, { es_certificacion: false }],
  });

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  useEffect(() => {
    const state: any = location.state;

    if (curso?.id && state?.moduloId) {
      const modulo = curso?.modulos?.find((m: any) => m.id == state?.moduloId);

      if (modulo?.lecciones?.length > 0)
        navigate(`/cursos/${cursoId}/leccion/${modulo.lecciones[0].id}`);
    }
  }, [curso]);

  useEffect(() => {
    if (isError) navigate('/');
  }, [isError]);

  useEffect(() => {
    if (favoritos?.length > 0 && curso?.id)
      setCursoFavorito(
        favoritos?.find(
          (f) => f.tipo === FavoritoTipoEnum.CURSO && f.objetoId === curso?.id
        )
      );
  }, [favoritos, curso?.id]);

  const onContinueLeccion = () => {
    if (!curso || !curso?.modulos || !curso.modulos[0].lecciones) return;

    let leccionId = curso?.modulos[0].lecciones[0].id;
    curso?.modulos?.find((modulo: any) =>
      modulo.lecciones?.find((leccion: any) => {
        if (!leccion.meta?.isCompleted) {
          leccionId = leccion.id;

          return true;
        }

        return false;
      })
    );

    navigate(`/cursos/${cursoId}/leccion/${leccionId}`);
  };

  return !isLoading ? (
    <Flex
      maxW="100%"
      w="100%"
      direction={{ base: 'column', lg: 'row' }}
      gap="40px"
      p={{ base: '20px', sm: '40px' }}
    >
      <Flex
        gap="28px"
        minW={{ base: '', sm: '480px' }}
        direction="column"
        maxW={{ base: '100%', lg: '500px' }}
        w={{ base: '100%', lg: 'fit-content' }}
      >
        {/* PORCENTAJE DEL CRUSO */}

        <Flex
          maxW="100%"
          w="100%"
          h={{ base: '55px', sm: '90px' }}
          rounded="20px"
          bg="gray_2"
          align="center"
          border="1px solid var(--chakra-colors-gray_3)"
        >
          <Image
            bg="white"
            boxSize={{ base: '55px', sm: '90px' }}
            rounded="20px"
            border="4px solid var(--chakra-colors-gray_1)"
            src={`data:image/svg+xml;utf8,${curso?.icono}`}
          />

          <Flex
            m={{ base: '10px', sm: '24px' }}
            direction="column"
            w="100%"
            maxW="100%"
            gap="8px"
          >
            <Flex justify="space-between" align="center" w="100%">
              <Flex gap="4px" align="center">
                <Box fontWeight="bold" fontSize={{ base: '14px', sm: '21px' }}>
                  {curso?.meta?.progreso_count}%
                </Box>

                <Box
                  fontSize={{ base: '10px', sm: '13px' }}
                  fontWeight="bold"
                  color="gray_5"
                >
                  DEL CURSO COMPLETADO
                </Box>
              </Flex>

              <Icon
                color="gray_5"
                boxSize={{ base: '15px', sm: '20px' }}
                as={BiTrophy}
              />
            </Flex>

            <Progress
              value={curso?.meta?.progreso_count || 0}
              bg="white"
              maxW="100%"
              w="100%"
              h={{ base: '6px', sm: '8px' }}
              rounded="full"
              sx={{ '& > div': { background: 'var(--chakra-colors-primary)' } }}
            />
          </Flex>
        </Flex>

        {/* DETALLES DEL CURSO */}
        <Flex direction="column" gap={{ base: '18px', sm: '28px' }} w="100%">
          <Flex direction="column" fontWeight="bold">
            <Box
              fontWeight="semibold"
              fontSize="14px"
              textOverflow="ellipsis"
              textTransform="uppercase"
              color="gray_5"
            >
              Curso
            </Box>

            <Box
              fontWeight="bold"
              fontSize={{ base: '20px', sm: '24px' }}
              textOverflow="ellipsis"
            >
              {curso?.titulo}
            </Box>

            <Flex
              w="100%"
              gap={{ base: '8px', sm: '12px' }}
              fontSize="14px"
              wrap="wrap"
              mt={{ base: '10px', sm: '0px' }}
            >
              <Flex
                align="center"
                gap={{ base: '4px', sm: '8px' }}
                color="gray_5"
                w="fit-content"
              >
                <Icon boxSize="20px" as={BiBarChart} color="gray_6" />
                {curso?.nivel.charAt(0).toUpperCase() + curso?.nivel.slice(1)}
              </Flex>

              <Flex
                align="center"
                gap={{ base: '4px', sm: '8px' }}
                color="gray_5"
                w="fit-content"
              >
                <Icon boxSize="20px" as={BiListOl} color="gray_6" />
                {curso?.meta?.leccionesCount} lecciones
              </Flex>

              <Flex
                align="center"
                gap={{ base: '4px', sm: '8px' }}
                color="gray_5"
                w="fit-content"
              >
                <Icon boxSize="20px" as={BiTimeFive} color="gray_6" />
                {fmtMnts(curso?.meta?.duracionTotal)}
              </Flex>
            </Flex>
          </Flex>

          {/* DESCRIPCION DEL CURSO */}
          <Box fontSize="15px" fontWeight="medium" lineHeight="22px">
            <OpenParser value={curso?.descripcion} />
          </Box>

          {!curso?.publicado && (
            <Flex align="center" gap="5px">
              <Icon as={FaRegEyeSlash} boxSize="20px" color="cancel" />

              <Box
                whiteSpace="nowrap"
                fontSize="14px"
                fontWeight="semibold"
                lineHeight="16px"
                color="cancel"
              >
                No publicado
              </Box>
            </Flex>
          )}

          <Button
            h="42px"
            w="fit-content"
            border="none"
            rounded="10px"
            _hover={{ bg: 'gray_2' }}
            color={cursoFavorito ? 'primary' : undefined}
            bg={cursoFavorito ? 'primary_light' : 'gray_3'}
            onClick={
              cursoFavorito
                ? () => removeFavorito(cursoFavorito)
                : () => {
                    if (curso?.id && user?.id)
                      addFavorito({
                        objetoId: curso?.id,
                        tipo: FavoritoTipoEnum.CURSO,
                        userId: user?.id,
                        objeto: curso,
                      });
                  }
            }
            leftIcon={
              <Icon
                as={cursoFavorito ? AiFillStar : BiStar}
                color={cursoFavorito ? 'primary' : undefined}
                boxSize="21px"
              />
            }
          >
            <Box lineHeight="18px">
              {cursoFavorito ? 'Favorito' : 'Añadir favorito'}
            </Box>
          </Button>

          <Box w="100%" h="1px" bg="gray_3" />

          {/* TUTOR DEL CURSO */}
          <Flex direction="column" gap="16px">
            <Box fontWeight="bold" fontSize="16px">
              Tutor del curso
            </Box>

            <Flex gap="18px" align="center">
              <Avatar
                size="45px"
                src={curso?.profesor?.avatar?.url}
                name={curso?.profesor?.username?.substring(0, 1)}
              />

              <Flex direction="column" gap="4px">
                <Box fontWeight="bold" fontSize="16px">
                  {curso?.profesor.fullName.split(' ')[0]}
                </Box>

                <Box fontSize="14px" color="gray_5">
                  {curso?.profesor.fullName.replace(
                    curso?.profesor.fullName.split(' ')[0],
                    ''
                  )}
                </Box>
              </Flex>
            </Flex>
          </Flex>

          <Box w="100%" h="1px" bg="gray_3" />

          {/* TESTS DEL CURSO */}
          <Flex direction="column" gap="20px">
            <Box fontWeight="bold" fontSize="16px">
              Tests del curso
            </Box>

            <Flex direction="column" gridRowGap="10px">
              {examenes?.length > 0 ? (
                examenes?.map((examen: IExamen) => (
                  <CardExamen
                    key={`contenidotab-examen-${examen.id}`}
                    examen={examen}
                    icon={curso?.imagen?.url}
                    onClick={() =>
                      navigate(`/cursos/${cursoId}/test/${examen.id}`)
                    }
                    isCompleted={
                      !!user?.examenes?.find(
                        (ex: any) =>
                          ex.meta?.pivot_aprobado === true &&
                          ex.id === examen.id
                      )
                    }
                  />
                ))
              ) : (
                <Box
                  color="gray_4"
                  fontWeight="bold"
                  fontSize="16px"
                  lineHeight="100%"
                >
                  No hay tests disponibles
                </Box>
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <Box
        minH={{ base: '1px', lg: 'unset' }}
        minW={{ base: '100%', lg: '1px' }}
        bg="gray_3"
      />

      <Tabs w="100%">
        <TabList
          w="100%"
          p="0px"
          borderBottom="none"
          display="flex"
          flexDirection={{ base: 'column-reverse', sm: 'row' }}
          alignContent="start"
        >
          <Tab
            w="fit-content"
            color="gray_4"
            fontSize="15px"
            fontWeight="bold"
            _selected={{
              color: 'primary',
              borderBottom: '4px solid var(--chakra-colors-primary)',
            }}
          >
            Contenido del curso
          </Tab>

          {/* <Tab
            isDisabled={user?.rol !== UserRolEnum.ADMIN}
            color="gray_4"
            fontSize="15px"
            fontWeight="bold"
            title="¡Próximamente!"
            _selected={{ color: 'primary', borderBottom: '4px solid #26C8AB' }}
          >
            Foro
          </Tab> */}

          <Button
            w="fit-content"
            ml="auto"
            mb={{ base: '20px', sm: 'auto' }}
            bg="primary"
            color="white"
            fontWeight="bold"
            _hover={{ bg: 'var(--chakra-colors-primary_dark)' }}
            onClick={onContinueLeccion}
            rightIcon={<Icon boxSize="20px" as={BiPlay} />}
          >
            {curso?.meta?.progreso_count > 0
              ? 'Continuar curso'
              : 'Empezar curso'}
          </Button>
        </TabList>

        <TabPanels w="100%" pt="20px">
          <TabPanel p="0px" w="100%">
            <TabContenido modulos={curso?.modulos} />
          </TabPanel>

          {/* <TabPanel w="100%">
            <TabForo cursoId={cursoId} />
          </TabPanel> */}
        </TabPanels>
      </Tabs>
    </Flex>
  ) : (
    <Flex w="100%" direction={{ base: 'column', lg: 'row' }} p="40px">
      <Flex
        gap="28px"
        minW="480px"
        direction="column"
        maxW={{ base: '100%', lg: '500px' }}
        w={{ base: '100%', lg: 'fit-content' }}
      >
        <Flex h="90px" rounded="20px" align="center">
          <Skeleton h="90px" rounded="20px" w={{ base: '300px', sm: '100%' }} />
        </Flex>
        <Flex direction="column" gap="20px" mt={{ base: '0px', sm: '20px' }}>
          <Skeleton h="20px" w="60px" />
          <Skeleton h="40px" w="100px" />
          <Flex direction="row" align="start" gap="5px">
            <Skeleton h="20px" w="95px" />
            <Skeleton h="20px" w="95px" />
            <Skeleton h="20px" w="95px" />
          </Flex>
          <Skeleton
            h="120px"
            w={{ base: '300px', sm: '100%' }}
            mt={{ base: '0px', sm: '20px' }}
            mb="20px"
          />
          <Skeleton h="40px" w="80px" mb="20px" />
        </Flex>
        <Flex direction="column" gap="20px" mt="20px">
          <Flex>
            <Skeleton boxSize="60px" rounded="full" mr="15px" />
            <Flex direction="column" gap="20px">
              <Skeleton h="20px" w="60px" />
              <Skeleton h="20px" w="60px" />
            </Flex>
          </Flex>
          <Flex direction="column" gap="20px" mb="40px">
            <Skeleton h="20px" w="60px" />
            <Skeleton h="20px" w="60px" />
          </Flex>
        </Flex>
      </Flex>
      <Flex direction="column" gap="20px" w="100%">
        <Flex w="100%" justify="space-between" gap={{ base: '5px', sm: '0px' }}>
          <Skeleton h="40px" w="150px" rounded="10px" />
          <Skeleton h="40px" w="150px" rounded="10px" />
        </Flex>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((x) => (
          <Skeleton h="100px" w="100%" rounded="20px" />
        ))}
      </Flex>
    </Flex>
  );
};

export default Portada;
