import { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { BiLeftArrowAlt, BiRightArrowAlt } from 'react-icons/bi';
import { isMobile as isMobileBrowser } from 'react-device-detect';
import { Button, Flex, Icon, useToast, Tooltip } from '@chakra-ui/react';

import { onFailure } from '@clevery-lms/utils';
import {
  getCurso,
  addProgreso,
  getLeccionByID,
  getProgresoGlobalByID,
} from '@clevery-lms/data';
import {
  LayoutContext,
  LoginContext,
  ProgresoGlobalContext,
} from '../../../../shared/context';
import {
  getProgresos,
  ICurso,
  IExamen,
  ILeccion,
  LeccionTipoEnum,
  ProgresoTipoEnum,
} from '@clevery-lms/data';

import { ZoomLeccion } from './ZoomLeccion';
import { VideoLeccion } from './VideoLeccion';
import { SlidesLeccion } from './SlidesLeccion';
import { RecursoLeccion } from './RecursoLeccion';
import { MarkdownLeccion } from './MarkdownLeccion';
import { EntregableLeccion } from './EntregableLeccion/EntregableLeccion';
import { NotasDnd } from '../../components/Leccion/NotasDnd/NotasDnd';
import SidebarLeccion from '../../components/Leccion/Sidebar/Sidebar';
import { LeccionHeader } from '../../components/Leccion/Header/Header';
import ResponsiveSidebarLeccion from '../../components/Leccion/Sidebar/ResponsiveSidebar';

const Leccion = () => {
  const navigate = useNavigate();

  const { cursoId, leccionId } = useParams<any>();

  const { user } = useContext(LoginContext);
  const { setShowHeader, setShowSidebar, isMobile } = useContext(LayoutContext);
  const { progresoGlobal, setProgresoGlobal } = useContext(
    ProgresoGlobalContext
  );

  const [curso, setCurso] = useState<ICurso>();
  const [leccion, setLeccion] = useState<ILeccion>();
  const [openNotas, setOpenNotas] = useState<boolean>(false);
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [nextIsBlocked, setNextIsBlocked] = useState<boolean>(false);
  const [prevIsBlocked, setPrevIsBlocked] = useState<boolean>(false);

  const toast = useToast();

  useEffect(() => {
    setShowHeader(false);
    setShowSidebar(false);
  }, []);

  useEffect(() => {
    refreshState();
  }, [cursoId, leccionId]);

  const refreshState = async (updateProgresoGlobal?: boolean) => {
    let cursoData = await getCurso({ id: +(cursoId || 0), userId: user?.id });

    if (cursoData.error === 404) navigate('/');
    if (!leccionId) return;

    setCurso(cursoData);

    let leccionData = await getLeccionByID({ id: +(leccionId || 0) });
    setLeccion(leccionData);

    if (updateProgresoGlobal) {
      let lastModulo =
        cursoData?.modulos?.length > 0
          ? cursoData.modulos[cursoData.modulos.length - 1]
          : undefined;

      let firstLeccion =
        cursoData?.modulos?.length > 0
          ? cursoData.modulos[0].lecciones[0]
          : undefined;
      let lastLeccion =
        lastModulo?.lecciones?.length > 0
          ? lastModulo?.lecciones[lastModulo?.lecciones?.length - 1]
          : undefined;

      // Si acabamos de empezar un curso, o lo hemos terminado, actualizamos el progresoGlobal de la context.
      if (firstLeccion?.id === +leccionId || lastLeccion?.id === +leccionId) {
        let _progresoGlobal = await getProgresoGlobalByID({
          id: progresoGlobal?.id || 0,
        });

        if (_progresoGlobal) setProgresoGlobal({ ..._progresoGlobal });
      }
    }
  };

  useEffect(() => {
    if (!leccion) return;
    if (!curso) return;

    let _modulo = curso?.modulos?.find((m: any) => leccion?.moduloId === m.id);
    let _leccion = _modulo?.lecciones?.find((l: any) => leccion?.id === l.id);

    if (_leccion?.meta?.isBlocked) {
      onFailure(
        toast,
        'Redirigiendo a la portada del curso',
        'Has intentado entrar en una lección bloqueada'
      );
      navigate(`/cursos/${curso?.id}`);
    }
  }, [leccion, curso]);

  /**
   * Cuando empezamos una nueva lección, creamos un nuevo progreso del tipo "visto".
   *
   * @param leccion Lección sobre la que crear el progreso.
   */
  const onLeccionStarted = async (leccion: ILeccion) => {
    if (user?.id && curso?.id && leccion.id && leccion.moduloId) {
      // Comprobamos que no exista un progreso ya creado para esta lección y este usuario.
      let progresoDuplicado = await getProgresos({
        query: [
          {
            user_id: user?.id,
            leccion_id: leccion.id,
            tipo: ProgresoTipoEnum.VISTO,
          },
        ],
      });

      if (progresoDuplicado?.data) return;

      await addProgreso({
        progreso: {
          userId: user?.id,
          cursoId: curso?.id,
          leccionId: leccion.id,
          moduloId: leccion.moduloId,
          tipo: ProgresoTipoEnum.VISTO,
        },
      }).catch((error) => {
        console.log('Error al crear el progreso', { error });
      });
    }
  };

  /**
   * Cuando hemos terminado la lección, creamos un nuevo progreso del tipo "completado".
   *
   * @param leccion Lección sobre la que crear el progreso.
   */
  const onLeccionCompleted = async (leccion: ILeccion) => {
    if (user?.id && curso?.id && leccion.id && leccion.moduloId) {
      await addProgreso({
        progreso: {
          userId: user?.id,
          cursoId: curso?.id,
          leccionId: leccion.id,
          moduloId: leccion.moduloId,
          tipo: ProgresoTipoEnum.COMPLETADO,
        },
      })
        .then((message: any) => refreshState(true))
        .catch((error) => {
          console.log('Error al crear el progreso', { error });
        });
    }
  };

  const onPrevLeccion = () => {
    if (!leccion) return;

    let prevLeccion: any;

    // Usamos .find para parar el bucle al encontrar la lección.
    curso?.modulos?.find((modulo: any, index: number) => {
      // Buscamos el módulo de la lección seleccionada
      if (leccion?.moduloId === modulo.id) {
        // Si es la primera lección de módulo, seleccionamos el modulo anterior.
        if (leccion?.id === modulo.lecciones[0].id) {
          let prevModulo = curso?.modulos
            ? curso?.modulos[index - 1]
            : undefined;

          if (prevModulo)
            prevLeccion = prevModulo?.lecciones
              ? prevModulo?.lecciones[prevModulo.lecciones.length - 1]
              : undefined;
        } else {
          // Si aún quedan lecciones en el módulo, escogemos la anterior.
          let index = modulo.lecciones?.findIndex(
            (l: any) => l.id === leccion.id
          );

          if (index > -1) prevLeccion = modulo.lecciones[index - 1];
        }
      }

      // Si la lección anterior está bloqueada (O no existe), bloqueamos el botón.
      setPrevIsBlocked(!prevLeccion || prevLeccion?.meta?.isBlocked === true);

      // Si la lección siguiente estaba bloquedada y hemos podido pasar de lección,
      // desbloqueamos el botón de la lección anterior
      if (nextIsBlocked && prevLeccion) setNextIsBlocked(false);

      // Si la hemos encontrado, devolvemos 'true' para terminar con el find
      return prevLeccion !== undefined;
    });

    if (prevLeccion) navigate(`/cursos/${curso?.id}/leccion/${prevLeccion.id}`);
  };

  const getNextLeccion = () => {
    if (!leccion) return undefined;

    let nextLeccion: any;

    // Usamos .find para parar el bucle al encontrar la lección.
    curso?.modulos?.find((modulo: any, index: number) => {
      // Buscamos el módulo de la lección seleccionada
      if (leccion?.moduloId === modulo.id) {
        // Si es la última lección de módulo, seleccionamos el modulo siguiente
        if (leccion?.id === modulo.lecciones[modulo.lecciones?.length - 1].id) {
          let nextModulo = curso?.modulos
            ? curso?.modulos[index + 1]
            : undefined;

          if (nextModulo)
            nextLeccion = nextModulo?.lecciones
              ? nextModulo?.lecciones[0]
              : undefined;
        } else {
          // Si aún quedan lecciones en el módulo, escogemos la siguiente.
          let index = modulo.lecciones?.findIndex(
            (l: any) => l.id === leccion?.id
          );

          if (index > -1) nextLeccion = modulo.lecciones[index + 1];
        }
      }

      // Si la siguiente lección está bloqueada (O no existe), bloqueamos el botón
      setNextIsBlocked(!nextLeccion || nextLeccion?.meta?.isBlocked === true);

      // Si la lección anterior estaba bloquedada, y hemos podido pasar de lección,
      // desbloqueamos el botón de la lección anterior
      if (prevIsBlocked && nextLeccion) setPrevIsBlocked(false);

      // Si la hemos encontrado, devolvemos 'true' para terminar con el find
      return nextLeccion !== undefined;
    });

    return nextLeccion;
  };

  /* Método para navegar a la siguiente lección */
  const onNextLeccion = () => {
    let nextLeccion: ILeccion = getNextLeccion();

    if (nextLeccion) {
      // Si la lección es del tipo recurso, md o slide, autocompletamos la lección al pasar a la siguiente
      switch (nextLeccion?.tipo) {
        case LeccionTipoEnum.RECURSO:
        case LeccionTipoEnum.DIAPOSITIVA:
        case LeccionTipoEnum.MARKDOWN:
          nextLeccion.meta = { ...nextLeccion.meta, isBlocked: false };
          if (leccion) onLeccionCompleted(leccion);
          break;

        default:
          break;
      }

      if (nextLeccion?.meta?.isBlocked === false)
        navigate(`/cursos/${curso?.id}/leccion/${nextLeccion.id}`);
    }
  };

  return (
    <Flex minW="100vw" maxH="100%" overflow="hidden">
      {isMobileBrowser ? (
        <ResponsiveSidebarLeccion
          curso={curso}
          leccion={leccion}
          onLeccionCompleted={onLeccionCompleted}
          state={{ isOpen: openSidebar, onClose: () => setOpenSidebar(false) }}
          onExamenSelect={(examen: IExamen) =>
            navigate(`/cursos/${cursoId}/test/${examen.id}`)
          }
          onLeccionSelect={(leccion: ILeccion) =>
            navigate(`/cursos/${cursoId}/leccion/${leccion.id}`)
          }
        />
      ) : !isMobile ? (
        <Flex
          bg="white"
          maxH="100%"
          overflow="overlay"
          overflowX="hidden"
          w={openSidebar ? '400px' : '0px'}
          minW={openSidebar ? '400px' : '0px'}
          style={{ transition: 'all 0.6s ease-in-out' }}
          borderRight="1px solid var(--chakra-colors-gray_3)"
        >
          <SidebarLeccion
            curso={curso}
            leccion={leccion}
            onLeccionCompleted={onLeccionCompleted}
            state={{
              isOpen: openSidebar,
              onClose: () => setOpenSidebar(false),
            }}
            onExamenSelect={(examen: IExamen) =>
              navigate(`/cursos/${cursoId}/test/${examen.id}`)
            }
            onLeccionSelect={(leccion: ILeccion) =>
              navigate(`/cursos/${cursoId}/leccion/${leccion.id}`)
            }
          />
        </Flex>
      ) : (
        <ResponsiveSidebarLeccion
          curso={curso}
          leccion={leccion}
          onLeccionCompleted={onLeccionCompleted}
          state={{ isOpen: openSidebar, onClose: () => setOpenSidebar(false) }}
          onExamenSelect={(examen: IExamen) =>
            navigate(`/cursos/${cursoId}/test/${examen.id}`)
          }
          onLeccionSelect={(leccion: ILeccion) =>
            navigate(`/cursos/${cursoId}/leccion/${leccion.id}`)
          }
        />
      )}

      <Flex
        direction="column"
        boxSize="100%"
        pb="48px"
        align="center"
        overflowY="scroll"
        overflowX="hidden"
        px={{ base: '0px', sm: '40px' }}
      >
        <LeccionHeader
          curso={curso}
          openNotas={openNotas}
          showSidebar={!openSidebar}
          openNotes={() => setOpenNotas(!openNotas)}
          openSidebar={() => setOpenSidebar(true)}
        />

        <Flex
          w="100%"
          maxW="1740px"
          bg="white"
          rounded={{ base: '0px', sm: '20px' }}
          p={{ base: '20px', sm: '40px' }}
          m={{ base: '5px', sm: '24px 40px 20px' }}
        >
          {leccion?.tipo === LeccionTipoEnum.ENTREGABLE ||
          leccion?.tipo === LeccionTipoEnum.AUTOCORREGIBLE ? (
            <EntregableLeccion
              leccion={leccion}
              onLeccionCompleted={onLeccionCompleted}
            />
          ) : leccion?.tipo === LeccionTipoEnum.ZOOM ? (
            <ZoomLeccion
              leccion={leccion}
              onLeccionCompleted={onLeccionCompleted}
            />
          ) : leccion?.tipo === LeccionTipoEnum.MARKDOWN ? (
            <MarkdownLeccion leccion={leccion} />
          ) : leccion?.tipo === LeccionTipoEnum.DIAPOSITIVA ? (
            <SlidesLeccion leccion={leccion} />
          ) : leccion?.tipo === LeccionTipoEnum.VIDEO ? (
            <VideoLeccion
              leccion={leccion}
              onLeccionStarted={onLeccionStarted}
              onLeccionCompleted={onLeccionCompleted}
            />
          ) : leccion?.tipo === LeccionTipoEnum.RECURSO ? (
            <RecursoLeccion leccion={leccion} />
          ) : (
            <Flex h="500px" />
          )}
        </Flex>

        <Flex
          gap="20px"
          px="10px"
          justify="space-between"
          align="center"
          maxW="1740px"
          w="100%"
        >
          <Tooltip
            label={prevIsBlocked ? '¡No hay más lecciones antes que esta!' : ''}
          >
            <Button
              children={isMobile ? '' : 'Lección anterior'}
              pr={isMobile ? '8px' : ''}
              w="fit-content"
              h="52px"
              bg="gray_3"
              rounded="14px"
              onClick={onPrevLeccion}
              isDisabled={prevIsBlocked}
              leftIcon={<Icon as={BiLeftArrowAlt} boxSize="24px" />}
            />
          </Tooltip>

          <Tooltip
            label={
              nextIsBlocked
                ? '¡Completa el módulo actual para seguir con la siguiente lección!'
                : ''
            }
          >
            <Button
              children={isMobile ? '' : 'Lección siguiente'}
              pl={isMobile && '8px'}
              w="fit-content"
              h="52px"
              bg="gray_3"
              rounded="14px"
              onClick={onNextLeccion}
              isDisabled={nextIsBlocked}
              rightIcon={<Icon as={BiRightArrowAlt} boxSize="24px" />}
            />
          </Tooltip>
        </Flex>
      </Flex>

      <NotasDnd
        leccion={leccion}
        state={{ isOpen: openNotas, onClose: () => setOpenNotas(false) }}
      />
    </Flex>
  );
};

export default Leccion;
