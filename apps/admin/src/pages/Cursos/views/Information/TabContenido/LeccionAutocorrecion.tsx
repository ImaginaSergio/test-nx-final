import { useEffect, useState } from 'react';

import { Flex, toast } from '@chakra-ui/react';

import { onFailure } from '@clevery-lms/utils';
import {
  addSolucion,
  getSoluciones,
  ISolucion,
  LeccionTipoEnum,
  updateSolucion,
} from '@clevery-lms/data';
import {
  InformationInput,
  InformationSelect,
  InformationTextEditor,
} from '../../../../../shared/components';

export const LeccionAutocorrecion = ({ leccion, updateValue }: any) => {
  const [solucion, setSolucion] = useState<ISolucion>();

  useEffect(() => {
    refreshState();
  }, [leccion.id]);

  const refreshState = async () => {
    if (!leccion.id) return;

    let _solucion = await getSoluciones({
      query: [{ leccion_id: leccion?.id }],
    });

    if ((_solucion?.data?.length || 0) === 0) {
      addSolucion({
        solucion: { leccionId: leccion?.id, publicado: true, contenido: ' ' },
      })
        .then(async (res: any) => {
          setSolucion(res.value);
        })
        .catch((error: any) => {
          console.error('Todo fue mal D:', { error });
          onFailure(toast, error.title, error.message);

          return error;
        });
    } else {
      setSolucion(_solucion?.data[0]);
    }
  };

  const updateValueSolucion = (value: any) => {
    return !solucion?.id
      ? Promise.reject('solucion_id es indefinido')
      : updateSolucion({ id: solucion.id, solucion: value })
          .then(async (msg: any) => {
            await refreshState();

            return msg;
          })
          .catch((error: any) => {
            console.error('Todo fue mal D:', { error });
            onFailure(toast, error.title, error.message);

            return error;
          });
  };

  return (
    <Flex direction="column" w="100%" gridGap="30px">
      <Flex w="100%" gridGap="30px" direction={{ lg: 'column', xl: 'row' }}>
        <InformationInput
          name="titulo"
          label="Título de la lección"
          defaultValue={leccion?.titulo}
          updateValue={updateValue}
          isDisabled={!leccion}
          style={{ width: '100%' }}
        />

        <InformationSelect
          name="tipo"
          label="Tipo de lección"
          defaultValue={{ label: leccion?.tipo, value: leccion?.tipo }}
          options={Object.values(LeccionTipoEnum).map((k) => ({
            label: k,
            value: k,
          }))}
          updateValue={updateValue}
          isDisabled={!leccion}
          style={{ width: '100%' }}
        />
      </Flex>

      <InformationSelect
        name="publicado"
        label="Estado"
        updateValue={updateValue}
        style={{ width: '100%' }}
        defaultValue={{
          label: leccion.publicado ? 'Publicado' : 'Oculto',
          value: leccion.publicado,
        }}
        options={[
          { label: 'Publicado', value: true },
          { label: 'Oculto', value: false },
        ]}
      />

      <Flex w="100%" gridGap="30px" direction={{ lg: 'column', xl: 'row' }}>
        <InformationInput
          name="duracion"
          label="Tiempo de lectura estimado"
          placeholder="Introduce el tiempo en minutos"
          defaultValue={leccion?.duracion || 0}
          updateValue={updateValue}
          isDisabled={!leccion}
          style={{ width: '100%' }}
        />

        <InformationInput
          name="tiempoDisponible"
          label="Tiempo total para hacer la entrega"
          placeholder="Introduce el tiempo en horas"
          defaultValue={leccion?.tiempoDisponible || 0}
          updateValue={updateValue}
          isDisabled={!leccion}
          style={{ width: '100%' }}
        />
      </Flex>

      <Flex w="100%" gridGap="30px" direction="column">
        <InformationTextEditor
          name="contenido"
          label="Contenido"
          defaultValue={leccion?.contenido}
          updateValue={updateValue}
          isDisabled={!leccion}
          style={{ width: '100%' }}
        />

        <InformationTextEditor
          name="contenido"
          label="Solución del entregable"
          defaultValue={solucion?.contenido}
          updateValue={updateValueSolucion}
          isDisabled={!leccion}
          style={{ width: '100%' }}
        />
      </Flex>
    </Flex>
  );
};
