import { Flex } from '@chakra-ui/react';

import {
  InformationInput,
  InformationSelect,
  InformationTextEditor,
  InformationPuntosclave,
} from '../../../../../shared/components';
import { LeccionTipoEnum } from '@clevery-lms/data';

export const LeccionVideo = ({ leccion, updateValue }: any) => (
  <Flex direction="column" w="100%" gridGap="30px">
    <Flex w="100%" gridGap="30px" direction={{ lg: 'column', xl: 'row' }}>
      <InformationInput
        name="titulo"
        label="Título de la lección"
        defaultValue={leccion?.titulo || ''}
        updateValue={updateValue}
        isDisabled={!leccion}
        style={{ width: '100%' }}
      />

      <InformationSelect
        name="tipo"
        label="Tipo de lección"
        defaultValue={{ label: leccion?.tipo, value: leccion?.tipo }}
        options={Object.values(LeccionTipoEnum).map((value) => ({
          label: value,
          value: value,
        }))}
        updateValue={updateValue}
        isDisabled={!leccion}
        style={{ width: '100%' }}
      />

      <InformationInput
        name="duracion"
        label="Duración"
        defaultValue={leccion?.duracion || 0}
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

    <Flex w="100%" gridGap="30px">
      <InformationInput
        name="contenido"
        label="Enlace al video (VIMEO)"
        defaultValue={leccion?.contenido || ''}
        updateValue={updateValue}
        isDisabled={!leccion}
        style={{ width: '100%' }}
      />
    </Flex>

    <Flex w="100%" gridGap="30px" direction={{ lg: 'column', xl: 'row' }}>
      <InformationTextEditor
        name="descripcion"
        label="Descripción"
        defaultValue={leccion?.descripcion || ''}
        updateValue={updateValue}
        isDisabled={!leccion}
        style={{ width: '100%' }}
      />

      <InformationPuntosclave isDisabled={!leccion} leccionId={leccion?.id} />
    </Flex>
  </Flex>
);
