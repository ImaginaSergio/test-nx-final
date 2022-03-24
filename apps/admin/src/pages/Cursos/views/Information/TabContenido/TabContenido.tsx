import { useState } from 'react';

import { Box, Flex, Icon, useDisclosure } from '@chakra-ui/react';
import {
  BiBookOpen,
  BiFolder,
  BiNews,
  BiPlayCircle,
  BiWebcam,
} from 'react-icons/bi';

import { fmtMnts } from '@clevery-lms/utils';
import ModuloModalForm from '../../../components/ModuloModalForm';
import {
  ListItemProps,
  InformationDragDropList,
} from '../../../../../shared/components';
import { ICurso, ILeccion, IModulo, LeccionTipoEnum } from '@clevery-lms/data';
import {
  addLeccion,
  addModulo,
  removeLeccion,
  removeModulo,
  updateLeccion,
  updateModulo,
} from '@clevery-lms/data';

import { LeccionZoom } from './LeccionZoom';
import { LeccionVideo } from './LeccionVideo';
import { LeccionSlides } from './LeccionSlides';
import { LeccionRecurso } from './LeccionRecurso';
import { LeccionMarkdown } from './LeccionMarkdown';
import { LeccionEntregable } from './LeccionEntregable';
import { LeccionAutocorrecion } from './LeccionAutocorrecion';

type TabContenidoProps = {
  curso: ICurso;
  refreshState: () => void;
  updateValue: (value: any) => void;
};

export const TabContenido = ({
  curso,
  updateValue,
  refreshState,
}: TabContenidoProps) => {
  const [modulo, setModulo] = useState<IModulo>();
  const [leccion, setLeccion] = useState<ILeccion>();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const updateLeccionValue = (value: any) => {
    if (!leccion?.id) return Promise.reject('leccion_id es indefinido');

    return updateLeccion({
      id: leccion.id,
      leccion: value,
      client: 'admin',
    }).then((res: any) => {
      setLeccion({ ...res.value.data });
      refreshState();
    });
  };

  const updateModuloValue = (value: any) => {
    if (!modulo?.id) return Promise.reject('modulo_id es indefinido');

    return updateModulo({ id: modulo.id, modulo: value, client: 'admin' }).then(
      (res: any) => {
        setModulo({ ...res.value.data });
        refreshState();
      }
    );
  };

  const onNewModulo = async () => {
    if (!curso?.id) return Promise.reject('curso_id es indefinido');

    return await addModulo({
      modulo: {
        titulo: 'Módulo nuevo',
        cursoId: curso.id,
        publicado: true,
        orden: (curso?.modulos?.length || 0) + 1,
      },
    }).then(() => refreshState());
  };

  const onNewLeccion = async (mod: IModulo) => {
    if (!curso?.id) return Promise.reject('curso_id es indefinido');
    if (!mod?.id) return Promise.reject('modulo_id es indefinido');

    return await addLeccion({
      leccion: {
        titulo: 'Lección nueva',
        moduloId: mod.id,
        publicado: true,
        contenido: ' ',
        descripcion: ' ',
        duracion: 0,
        tipo: LeccionTipoEnum.VIDEO,
        orden: (mod.lecciones?.length || 0) + 1,
      },
    }).then(() => refreshState());
  };

  const onDeleteModulo = (mod: IModulo) => {
    if (!mod.id) return Promise.reject('Módulo ID es indefinida');
    if (mod.lecciones && mod.lecciones?.length > 0)
      return Promise.reject('¡El módulo tiene lecciones asociadas!');

    removeModulo({ id: mod.id, client: 'admin' }).then(() => refreshState());
  };

  const transformModulosToDnDItems = (
    modulos: IModulo[] = []
  ): ListItemProps[] => {
    return modulos
      ?.sort((a, b) => a.orden - b.orden)
      ?.map((mod: IModulo) => ({
        title: mod.titulo,
        showIndex: true,
        foot: fmtMnts(mod.meta?.duracionTotal || 0),
        onEdit: () => {
          setModulo(mod);
          onOpen();
        },
        onDelete: () => onDeleteModulo(mod),
        onCreate: () => onNewLeccion(mod),
        createTitle: 'Añadir lección',
        subitems: mod.lecciones
          ?.sort((a, b) => a.orden - b.orden)
          ?.map((lec: ILeccion) => ({
            title: lec.titulo,
            foot: fmtMnts(lec.duracion || 0),
            isSelected: lec.id === leccion?.id,
            icon: (
              <Icon
                as={
                  lec.tipo === LeccionTipoEnum.VIDEO
                    ? BiPlayCircle
                    : lec.tipo === LeccionTipoEnum.ZOOM
                    ? BiWebcam
                    : lec.tipo === LeccionTipoEnum.MARKDOWN
                    ? BiNews
                    : lec.tipo === LeccionTipoEnum.ENTREGABLE ||
                      lec.tipo === LeccionTipoEnum.RECURSO ||
                      lec.tipo === LeccionTipoEnum.AUTOCORREGIBLE
                    ? BiFolder
                    : BiBookOpen
                }
                w="18px"
                h="18px"
              />
            ),
            onClick: () => setLeccion(lec),
            onDelete: () => removeLeccion(lec.id).then(() => refreshState()),
          })),
      }));
  };

  return (
    <>
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        p="30px"
        boxSize="100%"
        gridGap="30px"
        overflow="overlay"
      >
        <Flex direction="column" minW="400px" gridGap="30px">
          <Flex minH="fit-content" w="100%" direction="column" gridRowGap="8px">
            <Box fontSize="18px" fontWeight="semibold">
              Contenido del curso
            </Box>

            <Box fontSize="14px" fontWeight="medium" color="#84889A">
              Desde aquí se añade todo el contenido del curso, tanto los módulos
              como las lecciones.
            </Box>
          </Flex>

          <InformationDragDropList
            label="Módulos y Lecciones"
            onCreate={onNewModulo}
            createTitle="Añadir módulo"
            items={transformModulosToDnDItems(curso.modulos)}
          />
        </Flex>

        <Flex direction="column" w="100%" gridGap="30px">
          <Flex minH="fit-content" w="100%" direction="column" gridRowGap="8px">
            <Box fontSize="18px" fontWeight="semibold">
              {leccion
                ? `Contenido de la lección - ${leccion.titulo}`
                : 'Sin lección seleccionada'}
            </Box>

            <Box fontSize="14px" fontWeight="medium" color="#84889A">
              Aquí se añaden los contenidos de las lecciones, como el material,
              documentos, el temario, etc...
            </Box>
          </Flex>

          {!leccion ? (
            <Box>Por favor, escoge una lección del listado.</Box>
          ) : leccion?.tipo === LeccionTipoEnum.VIDEO ? (
            <LeccionVideo leccion={leccion} updateValue={updateLeccionValue} />
          ) : leccion?.tipo === LeccionTipoEnum.ENTREGABLE ? (
            <LeccionEntregable
              leccion={leccion}
              updateValue={updateLeccionValue}
            />
          ) : leccion?.tipo === LeccionTipoEnum.ZOOM ? (
            <LeccionZoom leccion={leccion} updateValue={updateLeccionValue} />
          ) : leccion?.tipo === LeccionTipoEnum.DIAPOSITIVA ? (
            <LeccionSlides leccion={leccion} updateValue={updateLeccionValue} />
          ) : leccion?.tipo === LeccionTipoEnum.MARKDOWN ? (
            <LeccionMarkdown
              leccion={leccion}
              updateValue={updateLeccionValue}
            />
          ) : leccion?.tipo === LeccionTipoEnum.AUTOCORREGIBLE ? (
            <LeccionAutocorrecion
              leccion={leccion}
              updateValue={updateLeccionValue}
            />
          ) : (
            <LeccionRecurso
              leccion={leccion}
              updateValue={updateLeccionValue}
            />
          )}
        </Flex>
      </Flex>

      <ModuloModalForm
        isOpen={isOpen}
        defaultValue={modulo}
        updateValue={updateModuloValue}
        onClose={() => {
          onClose();
          setModulo(undefined);
        }}
      />
    </>
  );
};
