import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiTimeFive } from 'react-icons/bi';
import { Text, Flex, Box, Image, Icon, Button } from '@chakra-ui/react';

import { fmtMnts } from '@clevery-lms/utils';
import { ICurso, ICertificacion, UserRolEnum } from '@clevery-lms/data';
import { useCertificaciones, useCurso, useCursos } from '@clevery-lms/data';
import { GlobalCard, GlobalCardType } from '../../../shared/components';
import { LoginContext, ProgresoGlobalContext } from '../../../shared/context';

import { EventsWidget } from '../components/DashboardWidgets/Events';
import { MetricsWidget } from '../components/DashboardWidgets/Metrics';
import { RoadmapWidget } from '../components/DashboardWidgets/Roadmap';
import { DiscordWidget } from '../components/DashboardWidgets/Discord';
import { AdminWidget } from '../components/DashboardWidgets/Admin';

export const HomeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useContext(LoginContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);

  const disabledPages = process.env.REACT_APP_DISABLE_PAGES?.split(' ');
  const cursoInicialId = progresoGlobal?.ruta?.meta?.itinerario[0] || 3;

  const { curso: cursoBienvenida } = useCurso({ id: 57, userId: user?.id });
  const { curso: cursoInicial, isLoading: isLoading_inicial } = useCurso({
    id: cursoInicialId,
    userId: user?.id,
  });

  const { cursos, isLoading: loading_cursos } = useCursos({
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
    query: [{ ruta: progresoGlobal?.cursosIniciados }],
  });

  const { cursos: cursoActivo } = useCursos({
    userId: user?.id,
    strategy: 'invalidate-on-undefined',
    query: [{ leccion_id: progresoGlobal?.progresoLecciones?.lastPlayed }],
  });

  const { certificaciones, isLoading: loading_certis } = useCertificaciones({
    strategy: 'invalidate-on-undefined',
    query: [{ lista: progresoGlobal?.certificacionesIniciadas }],
    certificacionesIniciadas:
      progresoGlobal?.meta?.certificacionesIniciadas || [],
    certificacionesCompletadas:
      progresoGlobal?.meta?.certificacionesCompletadas || [],
  });

  return (
    <Flex
      w="100%"
      direction={{ base: 'column', md: 'row' }}
      gap="80px"
      p={{ base: '20px', sm: '34px' }}
      align="flex-start"
    >
      {/* LEFT WIDE COLUMN */}
      <Flex
        direction="column"
        w={{ base: '100%', md: '70%' }}
        gap="62px"
        pb={{ base: '0px', md: '40px' }}
      >
        {/* BIENVENIDO AL CAMPUS */}
        {cursoBienvenida &&
          user?.grupos?.some((item) => item.nombre === 'Incubacion') &&
          !user?.progresoGlobal?.cursosCompletados?.includes('57') && (
            <Flex direction="column">
              <Box fontWeight="bold" fontSize="18px" pb="20px">
                Bienvenido/a al Campus
              </Box>

              <Flex
                p="12px"
                bg="white"
                align="center"
                rounded="2xl"
                border="1px solid var(--chakra-colors-gray_3)"
                direction={{ base: 'column', sm: 'row' }}
              >
                <Image
                  src={cursoBienvenida?.imagen?.url}
                  maxH={{ base: '', sm: '207px' }}
                  rounded="xl"
                />

                <Flex
                  gap="24px"
                  direction="column"
                  p="24px"
                  w="100%"
                  justify="space-between"
                >
                  <Flex direction="column">
                    <Text variant="card_title" pb="9.5px">
                      {cursoBienvenida?.titulo}
                    </Text>

                    <Text
                      variant="card_details"
                      color="gray_4"
                      display="flex"
                      justifySelf="center"
                      align="center"
                      gap="6px"
                    >
                      <Icon as={BiTimeFive} boxSize="20px" color="gray_6" />

                      {fmtMnts(cursoBienvenida?.meta?.duracionTotal, false)}
                    </Text>
                  </Flex>

                  <Text
                    variant="p_text"
                    color="gray_4"
                    pb="23.5px"
                    w="100%"
                    noOfLines={1}
                  >
                    {cursoBienvenida?.descripcion}
                  </Text>

                  <Button
                    _hover={{ opacity: '0.8' }}
                    bg="black"
                    color="white"
                    onClick={() => navigate(`/cursos/57`)}
                  >
                    Ver guía
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          )}
        <DiscordWidget />

        {/* EMPIEZA TU HOJA DE RUTA */}
        {user?.progresoGlobal?.meta?.cursosIniciados?.length === 0 && (
          <Flex direction="column" gap="20px">
            <Box fontWeight="bold" fontSize="18px">
              Empieza tu hoja de ruta
            </Box>

            <GlobalCard
              maxPerRow={1}
              gapBetween="28px"
              type={GlobalCardType.CURSO_ACTIVO}
              props={{ curso: cursoInicial, isLoading: isLoading_inicial }}
              onClick={() => navigate(`/cursos/${cursoInicial?.id || ''}`)}
            />
          </Flex>
        )}

        {/* CONTINUA POR DONDE LO DEJASTE */}
        {!loading_cursos
          ? cursoActivo?.length === 1 &&
            cursoActivo[0] &&
            !cursoActivo[0]?.meta?.isCompleted && (
              <Flex direction="column" gap="20px">
                <Box fontWeight="bold" fontSize={{ base: '16px', sm: '18px' }}>
                  Continúa por dónde lo dejaste
                </Box>

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  props={{ curso: cursoActivo[0] }}
                  onClick={() =>
                    progresoGlobal?.progresoLecciones?.lastPlayed
                      ? navigate(
                          `/cursos/${cursoActivo[0].id}/leccion/${progresoGlobal?.progresoLecciones?.lastPlayed}`
                        )
                      : navigate(`/cursos/${cursoActivo[0].id}`)
                  }
                />
              </Flex>
            )
          : cursoActivo?.length === 1 &&
            cursoActivo[0] &&
            !cursoActivo[0]?.meta?.isCompleted && (
              <Flex direction="column" gap="20px">
                <Box fontWeight="bold" fontSize={{ base: '16px', sm: '18px' }}>
                  Continúa por dónde lo dejaste
                </Box>

                <GlobalCard
                  maxPerRow={1}
                  gapBetween="28px"
                  type={GlobalCardType.CURSO_ACTIVO}
                  props={{ isLoading: true }}
                />
              </Flex>
            )}

        {/* CURSOS EN PROGRESO */}
        {!disabledPages?.includes('cursos') &&
          (progresoGlobal?.meta?.cursosIniciados?.length || 0) > 0 && (
            <Flex
              direction="column"
              w="100%"
              gap="20px"
              h="100%"
              overflow="visible"
              align="center"
            >
              <Flex
                w="100%"
                gap={{ base: '5px', sm: '20px' }}
                align={{ base: 'start', sm: 'center' }}
                justify="space-between"
                h="100%"
                direction={{ base: 'column', sm: 'row' }}
              >
                <Text variant="h2_heading" isTruncated>
                  Cursos en progreso
                </Text>

                <Box
                  color="#8B8FA1"
                  fontSize="15px"
                  cursor="pointer"
                  lineHeight="18px"
                  whiteSpace="nowrap"
                  fontWeight="semibold"
                  textDecoration="underline"
                  onClick={() => navigate('/cursos')}
                >
                  Ver todos
                </Box>
              </Flex>

              <Flex gap="28px" w="100%" wrap="wrap" h="100%">
                {(progresoGlobal?.meta?.cursosIniciados?.length || 0) > 0 ? (
                  loading_cursos ? (
                    [1, 2, 3].map((id) => (
                      <GlobalCard
                        maxPerRow={5}
                        gapBetween="28px"
                        style={{ width: '267px' }}
                        type={GlobalCardType.CURSO}
                        props={{ isLoading: true }}
                        key={'curso_placeholder-dashboard-' + id}
                      />
                    ))
                  ) : (
                    cursos?.map((c: ICurso) => (
                      <GlobalCard
                        maxPerRow={4}
                        width={{
                          base: '100%',
                          sm:
                            4 - 2 <= 1
                              ? '100%'
                              : `calc((100% - (28px * ${Math.max(
                                  1,
                                  4 - 3
                                )})) / ${4 - 2})`,
                          md:
                            4 - 2 <= 1
                              ? '100%'
                              : `calc((100% - (28px * ${Math.max(
                                  1,
                                  4 - 3
                                )})) / ${4 - 2})`,
                          lg:
                            4 - 1 <= 1
                              ? '100%'
                              : `calc((100% - (28px * ${Math.max(
                                  1,
                                  4 - 2
                                )})) / ${4 - 1})`,
                          '2xl':
                            4 <= 1
                              ? '100%'
                              : `calc((100% - (28px * ${Math.max(
                                  1,
                                  4 - 1
                                )})) / ${4})`,
                        }}
                        gapBetween="10px"
                        type={GlobalCardType.CURSO}
                        onClick={() => navigate(`/cursos/${c.id}`)}
                        props={{ curso: c }}
                        key={'curso-dashboard-' + c.id}
                      />
                    ))
                  )
                ) : (
                  <Box
                    color="gray_4"
                    fontWeight="bold"
                    fontSize="16px"
                    lineHeight="100%"
                  >
                    Aún no has empezado ningún curso
                  </Box>
                )}
              </Flex>
            </Flex>
          )}

        {/* CERTIFICACIONES EN PROGRESO */}
        {!disabledPages?.includes('certificaciones') &&
          (progresoGlobal?.meta?.certificacionesIniciadas?.length || 0) > 0 && (
            <Flex direction="column" w="100%" gap="20px">
              <Flex
                w="100%"
                gap={{ base: '5px', sm: '20px' }}
                align={{ base: 'start', sm: 'center' }}
                justify="space-between"
                h="100%"
                direction={{ base: 'column', sm: 'row' }}
              >
                {' '}
                <Text variant="h2_heading" isTruncated>
                  Certificaciones en progreso
                </Text>
                <Box
                  color="#8B8FA1"
                  cursor="pointer"
                  fontSize="15px"
                  lineHeight="18px"
                  whiteSpace="nowrap"
                  fontWeight="semibold"
                  textDecoration="underline"
                  onClick={() => navigate('/certificaciones')}
                >
                  Ver todas
                </Box>
              </Flex>

              <Flex w="100%" gap="28px" wrap="wrap">
                {(progresoGlobal?.meta?.certificacionesIniciadas?.length || 0) >
                0 ? (
                  loading_certis ? (
                    [1, 2].map((id) => (
                      <GlobalCard
                        maxPerRow={3}
                        gapBetween="28px"
                        type={GlobalCardType.CERTIFICACION}
                        props={{ isLoading: true }}
                        key={'certificacion_placeholder-dashboard-' + id}
                      />
                    ))
                  ) : (
                    certificaciones?.map((c: ICertificacion) => (
                      <GlobalCard
                        maxPerRow={3}
                        gapBetween="28px"
                        type={GlobalCardType.CERTIFICACION}
                        onClick={() => navigate(`/certificaciones/${c.id}`)}
                        props={{ certificacion: c }}
                        key={'certificacion-dashboard-' + c.id}
                        width={{
                          base: '100%',
                          sm:
                            4 - 2 <= 1
                              ? '100%'
                              : `calc((100% - (28px * ${Math.max(
                                  1,
                                  4 - 3
                                )})) / ${4 - 2})`,
                          md:
                            4 - 2 <= 1
                              ? '100%'
                              : `calc((100% - (28px * ${Math.max(
                                  1,
                                  4 - 3
                                )})) / ${4 - 2})`,
                          lg:
                            4 - 1 <= 1
                              ? '100%'
                              : `calc((100% - (28px * ${Math.max(
                                  1,
                                  4 - 2
                                )})) / ${4 - 1})`,
                          '2xl':
                            4 <= 1
                              ? '100%'
                              : `calc((100% - (28px * ${Math.max(
                                  1,
                                  4 - 1
                                )})) / ${4})`,
                        }}
                      />
                    ))
                  )
                ) : (
                  <Box
                    color="gray_4"
                    fontWeight="bold"
                    fontSize="16px"
                    lineHeight="100%"
                  >
                    Aún no has empezado ninguna certificación
                  </Box>
                )}
              </Flex>
            </Flex>
          )}
      </Flex>

      {/* RIGHT THIN COLUMN */}
      <Flex
        gap="60px"
        direction="column"
        w={{ base: '100%', md: '30%' }}
        pb={{ base: '40px', md: '0px' }}
        minW={{ base: '100%', md: '30%' }}
      >
        {user?.rol && user?.rol !== UserRolEnum.ESTUDIANTE && <AdminWidget />}

        {/* TU HOJA DE RUTA */}
        {!disabledPages?.includes('roadmap') && <RoadmapWidget />}

        <EventsWidget />

        <MetricsWidget />
      </Flex>
    </Flex>
  );
};
