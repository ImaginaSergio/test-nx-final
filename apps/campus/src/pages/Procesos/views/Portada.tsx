import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import ReactMarkdown from 'react-markdown';
import {
  Box,
  Button,
  Flex,
  Icon,
  Progress,
  useToast,
  useDisclosure,
} from '@chakra-ui/react';
import {
  BiBriefcase,
  BiBarChart,
  BiDirections,
  BiMapPin,
  BiUserPlus,
  BiX,
} from 'react-icons/bi';

import {
  getCursos,
  useProceso,
  getRutaByID,
  applyToProceso,
  useCheckProceso,
  removeFromProceso,
  filterCursosByRuta,
  updateProgresoGlobal,
  getCertificacionesRequeridas,
} from '@clevery-lms/data';
import { GlobalCard } from '../../../shared/components';
import { RoadmapModal } from '../components/RoadmapModal';
import { onFailure, onSuccess } from '@clevery-lms/utils';
import { ICertificacion, ICurso, IHabilidad } from '@clevery-lms/data';
import {
  LoginContext,
  ProgresoGlobalContext,
  RoadmapContext,
} from '../../../shared/context';
import {
  Avatar,
  CardCertificacionLoader,
  GlobalCardType,
  ItemLoader,
} from '../../../shared/components';
import { OpenParser } from '@clevery-lms/ui';

const ProcesosCover = () => {
  const { procesoId } = useParams<any>();

  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { setRuta } = useContext(RoadmapContext);
  const { user, setUser } = useContext(LoginContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);

  const { proceso, isLoading } = useProceso({ id: +(procesoId || 0) });
  const { isAbleToApply: isAbleToApply, isLoading: isCheckingApplyability } =
    useCheckProceso({
      id: +(procesoId || 0),
    });

  const [rutaProceso, setRutaProceso] = useState<any>([]);
  const [isInscrito, setIsInscrito] = useState<boolean | null>(null);
  const [certificaciones, setCertificaciones] = useState<ICertificacion[]>([]);
  const [totalCompletadas, setTotalCompletadas] = useState<number>(0);
  const [progresoProceso, setProgresoProceso] = useState<number>(0);

  useEffect(() => {
    (async () => {
      if ((proceso?.habilidades?.length || 0) > 0) {
        let ids = proceso?.habilidades?.map(
          (habilidad: IHabilidad) => habilidad.id
        );
        let niveles = proceso?.habilidades?.map(
          (habilidad: IHabilidad) => habilidad.meta?.pivot_nivel
        );

        let certis = await getCertificacionesRequeridas({
          query: [{ habilidades: `${[ids]}` }, { nivel: `[${niveles}]` }],
          certificacionesCompletadas:
            progresoGlobal?.meta?.certificacionesCompletadas || [],
          certificacionesIniciadas:
            progresoGlobal?.meta?.certificacionesIniciadas || [],
        });

        setTotalCompletadas(
          progresoGlobal?.meta?.certificacionesCompletadas?.filter(
            (n) => !!certis?.find((c: any) => c.id === n)
          )?.length || 0
        );
        setProgresoProceso((totalCompletadas / certis?.length) * 100 || 0);
        setCertificaciones(certis);
      } else {
        setCertificaciones([]);
        setTotalCompletadas(0);
        setProgresoProceso(0);
      }
    })();
  }, [proceso]);

  const followProcesoRoadmap = async () => {
    if (user?.progresoGlobal.id && proceso?.rutaId)
      updateProgresoGlobal({
        id: user?.progresoGlobal.id,
        progresoGlobal: { rutaId: proceso?.rutaId },
      })
        .then(async (response) => {
          let dataRuta = await getRutaByID(proceso?.rutaId);

          setRuta({ ...dataRuta });
          onSuccess(toast, 'Se ha actualizado la hoja de ruta');

          onClose();
        })
        .catch((error) => console.error('Error al cambiar de ruta', { error }));
  };

  const handleInscribirse = async () => {
    if (user?.id && procesoId) {
      applyToProceso({ id: +procesoId })
        .then(() => {
          setIsInscrito(true);
          let _user = { ...user };
          _user.procesos?.push(proceso);

          setUser({ ..._user });
        })
        .catch(() =>
          onFailure(
            toast,
            'Error interno',
            'No se ha podido procesar la solicitud'
          )
        );
    }
  };

  const handleRemoveFromProceso = async () => {
    if (user?.id && procesoId) {
      removeFromProceso({ id: +procesoId })
        .then(() => {
          setIsInscrito(false);
          let _user = { ...user };
          _user.procesos = _user.procesos?.filter((p) => p.id !== proceso?.id);

          setUser({ ..._user });
        })
        .catch(() =>
          onFailure(
            toast,
            'Error interno',
            'No se ha podido procesar la solicitud'
          )
        );
    }
  };

  useEffect(() => {
    refreshRuta();
  }, [proceso]);

  const refreshRuta = async () => {
    let dataRuta = await getRutaByID(proceso?.rutaId);
    let dataItinerario = await getCursos({
      query: [{ ruta: dataRuta?.itinerario }],
      userId: user?.id,
    });
    setRutaProceso(dataItinerario);
  };

  return (
    <>
      <Flex
        w="100%"
        direction={{ base: 'column', lg: 'row' }}
        gap="40px"
        p="40px"
      >
        <Flex direction="column" gap="28px" w="100%">
          <Flex direction="column" gridRowGap="30px">
            <Flex
              w="100%"
              justify="space-between"
              align="center"
              direction={{ base: 'column', sm: 'row' }}
              gap={{ base: '20px', sm: '' }}
            >
              <Flex
                w="100%"
                direction={{ base: 'column', sm: 'row' }}
                align={{ base: 'center', sm: '' }}
              >
                <Box
                  border="4px solid var(--chakra-colors-gray_3)"
                  rounded="20px"
                  mr={{ base: '', sm: '30px' }}
                >
                  <Avatar
                    src={proceso?.imagen?.url}
                    rounded="18px"
                    size="90px"
                    name={proceso?.titulo?.substring(0, 2)}
                    fontSize="32px"
                  />
                </Box>
                <Flex
                  direction="column"
                  gap="10px"
                  align={{ base: 'center', sm: '' }}
                  mt={{ base: '20px', sm: '' }}
                >
                  <Box
                    fontWeight="semibold"
                    fontSize="14px"
                    lineHeight="16px"
                    color="gray_5"
                  >
                    VACANTE
                  </Box>

                  <Box
                    fontWeight="bold"
                    fontSize="24px"
                    textOverflow="ellipsis"
                  >
                    {proceso?.titulo}
                  </Box>

                  <Flex gap="12px" fontSize="14px" color="gray_5">
                    <Flex
                      align="center"
                      fontSize="14px"
                      lineHeight="16px"
                      gap="8px"
                    >
                      <Icon boxSize="20px" as={BiBarChart} color="gray_6" />

                      {proceso?.tipoContrato}
                    </Flex>

                    <Flex
                      align="center"
                      fontSize="14px"
                      lineHeight="16px"
                      gap="8px"
                    >
                      <Icon boxSize="20px" as={BiMapPin} color="gray_6" />
                      {proceso?.localidad}
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>

              <Flex direction="column" align={{ base: 'center', sm: 'end' }}>
                {isCheckingApplyability && <ItemLoader />}

                {(isInscrito === null &&
                  user?.procesos
                    ?.map((p) => `${p.id}`)
                    .includes(procesoId || '0')) ||
                isInscrito ? (
                  <Button
                    w="fit-content"
                    minW="218px"
                    onClick={handleRemoveFromProceso}
                    bgColor="white"
                    color="gray_5"
                    rightIcon={<Icon as={BiX} boxSize="20px" />}
                  >
                    Cancelar inscripción
                  </Button>
                ) : (
                  <Button
                    w="fit-content"
                    minW="218px"
                    onClick={handleInscribirse}
                    disabled={!isAbleToApply}
                    bgColor="gray_3"
                    rightIcon={<Icon as={BiUserPlus} boxSize="20px" />}
                  >
                    Inscribirse
                  </Button>
                )}

                {!isAbleToApply && (
                  <Box
                    fontWeight="semibold"
                    color="gray_4"
                    fontSize="14px"
                    mt="10px"
                  >
                    Te faltan certificaciones
                  </Box>
                )}
              </Flex>
            </Flex>

            <CaracteristicasVacante
              remoto={proceso?.remoto}
              tipoPuesto={proceso?.tipoPuesto}
              salarioMin={proceso?.salarioMin}
              salarioMax={proceso?.salarioMax}
            />

            <Flex direction="column" gap="10px">
              <Box fontWeight="extrabold" fontSize="14px" lineHeight="16px">
                Descripción del puesto
              </Box>

              <Box
                fontSize="15px"
                fontWeight="medium"
                lineHeight="22px"
                pl="20px"
              >
                <OpenParser value={proceso?.descripcion || ''} />
              </Box>
            </Flex>

            <Box w="100%" h="1px" bg="gray_3" />

            <Flex
              w="100%"
              direction={{ base: 'column', sm: 'row' }}
              gap={{ base: '0px', sm: '24px' }}
            >
              <Flex
                justify="center"
                align="center"
                direction={{ base: 'column', sm: 'row' }}
              >
                <Box
                  fontWeight="extrabold"
                  fontSize="14px"
                  lineHeight="16px"
                  pb={{ base: '5px', sm: '' }}
                  w={{ base: 'auto', sm: '200px' }}
                >
                  Hoja de ruta de la vacante
                </Box>
                <Button
                  h="42px"
                  w="fit-content"
                  bg="white"
                  minW="200px"
                  rounded="12px"
                  p="10px 25px 10px 25px"
                  fontSize="15px"
                  lineHeight="18px"
                  border="1px solid var(--chakra-colors-gray_4)"
                  rightIcon={
                    <Icon as={BiDirections} boxSize="20px" color="black" />
                  }
                  onClick={onOpen}
                >
                  Seguir hoja de ruta
                </Button>
              </Flex>

              <Flex
                w="100%"
                wrap="wrap"
                gridColumnGap="28px"
                gridRowGap="24px"
                mt={{ base: '', sm: '40px' }}
                mb={{ base: '40px', sm: '40px' }}
              >
                {isLoading || !rutaProceso
                  ? Array.from(Array(8).keys()).map((n) => (
                      <GlobalCard
                        maxPerRow={1}
                        gapBetween="12px"
                        type={GlobalCardType.ROADMAP}
                        props={{
                          key: 'roadmap-card-placeholder-' + n,
                          isLoading: true,
                        }}
                      />
                    ))
                  : filterCursosByRuta(
                      proceso?.ruta?.meta?.itinerario,
                      rutaProceso
                    )?.map((curso: ICurso, index: number) => (
                      <GlobalCard
                        maxPerRow={1}
                        gapBetween="12px"
                        type={GlobalCardType.ROADMAP}
                        onClick={() => navigate(`/cursos/${curso.id}`)}
                        props={{
                          key: 'roadmap-card-' + index,
                          curso: curso,
                          isCompleted: curso.meta?.isCompleted,
                          isBlocked: curso.meta?.isBlocked,
                        }}
                      />
                    ))}
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Box
          minH={{ base: '1px', lg: 'unset' }}
          minW={{ base: '100%', lg: '1px' }}
          bg="gray_3"
        />

        <Flex
          w={{ base: '100%', lg: 'fit-content' }}
          minW={{ base: '', sm: '480px' }}
          h="100%"
          direction="column"
          gap="30px"
        >
          <ProgresoVacante value={progresoProceso} />

          <Flex w="100%" direction="column" gap="16px">
            <Flex
              w="100%"
              whiteSpace="nowrap"
              gap="10px"
              justify="space-between"
            >
              <Box fontSize="14px" fontWeight="extrabold" lineHeight="16px">
                Certificaciones requeridas
              </Box>

              <Box color="primary" fontSize="14px" lineHeight="16px">
                {totalCompletadas}/{certificaciones?.length} superadas
              </Box>
            </Flex>

            <Flex direction="column" gap="20px">
              {isLoading ? (
                [1, 2, 3]?.map((id) => (
                  <CardCertificacionLoader
                    key={'certificacion_placeholder-item-' + id}
                  />
                ))
              ) : certificaciones?.length === 0 ? (
                <Box
                  color="gray_4"
                  fontWeight="bold"
                  fontSize="16px"
                  lineHeight="100%"
                >
                  Aún no hay certificaciones disponibles para esta vacante
                </Box>
              ) : (
                certificaciones?.map((c: ICertificacion) => (
                  <GlobalCard
                    maxPerRow={1}
                    gapBetween="20px"
                    type={GlobalCardType.CERTIFICACION}
                    onClick={() => navigate('/certificaciones/' + c.id)}
                    props={{
                      certificacion: c,
                      key: 'certificacion-item-' + c.id,
                    }}
                  />
                ))
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>

      <RoadmapModal
        proceso={proceso}
        onClose={onClose}
        isOpen={isOpen}
        followProcesoRoadmap={followProcesoRoadmap}
      />
    </>
  );
};

export default ProcesosCover;

const CaracteristicasVacante = ({
  remoto,
  tipoPuesto,
  salarioMin,
  salarioMax,
}: {
  remoto: string;
  tipoPuesto: string;
  salarioMin: number;
  salarioMax: number;
}) => {
  return (
    <Flex
      direction={{ base: 'column', sm: 'row' }}
      rounded="14px"
      gap="24px"
      border="1px solid"
      borderColor="gray_3"
      bg="white"
      p="24px"
    >
      <Flex
        w="100%"
        direction="column"
        whiteSpace="nowrap"
        justify="center"
        gap={{ base: '2px', sm: '8px' }}
        color="black"
        align={{ base: 'center', sm: '' }}
      >
        <Box fontWeight="bold" fontSize="14px" lineHeight="16px">
          Presencial / Remoto
        </Box>

        <Box fontSize="14px" lineHeight="16px">
          {remoto ? 'En remoto' : 'Presencial'}
        </Box>
      </Flex>

      <Box minW="1px" bg="gray_3" />

      <Flex
        w="100%"
        direction="column"
        whiteSpace="nowrap"
        justify="center"
        gap={{ base: '2px', sm: '8px' }}
        align={{ base: 'center', sm: '' }}
      >
        <Box fontWeight="bold" fontSize="14px" lineHeight="16px">
          Tipo de puesto
        </Box>

        <Box fontSize="14px" lineHeight="16px">
          {tipoPuesto}
        </Box>
      </Flex>

      <Box minW="1px" bg="gray_3" />

      <Flex
        w="100%"
        direction="column"
        whiteSpace="nowrap"
        justify="center"
        gap={{ base: '2px', sm: '8px' }}
        align={{ base: 'center', sm: '' }}
      >
        <Box fontWeight="bold" fontSize="14px" lineHeight="16px">
          Rango salarial
        </Box>

        <Box fontSize="14px" lineHeight="16px">
          {salarioMin} - {salarioMax}€ / Año
        </Box>
      </Flex>
    </Flex>
  );
};

const ProgresoVacante = ({ value }: { value: number }) => {
  return (
    <Flex
      h="90px"
      direction="column"
      p="24px"
      gap="8px"
      rounded="20px"
      bg="gray_2"
      border="1px solid var(--chakra-colors-gray_3)"
    >
      <Flex justify="space-between" align="center">
        <Flex gap="4px" align="center">
          <Box fontWeight="bold" fontSize="21px">
            {value}%
          </Box>

          <Box fontSize="13px" fontWeight="bold" color="gray_5">
            COMPATIBLE
          </Box>
        </Flex>

        <Icon color="gray_5" boxSize="20px" as={BiBriefcase} />
      </Flex>

      <Progress
        value={value}
        w="100%"
        minH="8px"
        rounded="full"
        bg="white"
        sx={{ '& > div': { background: 'primary' } }}
      />
    </Flex>
  );
};
