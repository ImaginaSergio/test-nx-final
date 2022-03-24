import { Flex } from '@chakra-ui/react';

import { LeccionTipoEnum } from '@clevery-lms/data';
import {
  InformationInput,
  InformationSelect,
  InformationTextEditor,
} from '../../../../../shared/components';

export const LeccionMarkdown = ({ leccion, updateValue }: any) => (
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

    <Flex w="100%" gridGap="30px">
      <InformationTextEditor
        name="contenido"
        label="Contenido"
        defaultValue={leccion?.contenido}
        updateValue={updateValue}
        isDisabled={!leccion}
        style={{ width: '100%' }}
      />
    </Flex>
  </Flex>
);
