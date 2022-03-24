import { Box, Flex } from '@chakra-ui/react';

import { getHabilidades, ProcesoRemotoEnum } from '@clevery-lms/data';
import { FormTextEditor } from '@clevery-lms/ui';
import {
  FormInput,
  FormAsyncSelect,
  FormTextarea,
  FormSelect,
} from '../../../../../shared/components';

const Step1 = () => {
  const loadHabilidadesByNombre = async (value: any) => {
    let _habilidades = await getHabilidades({
      query: [{ nombre: value }],
      client: 'admin',
    });

    return _habilidades?.data?.map((hab: any) => ({
      value: hab.id,
      label: hab.nombre,
    }));
  };

  return (
    <Flex bg="#ffffff" boxSize="100%" p="30px">
      <Flex direction="column" w="20%" mr="30px" gridRowGap="20px">
        <FormInput name="titulo" label="Título de la vacante *" />

        <FormInput type="number" name="salarioMin" label="Salario mínimo *" />

        <FormInput type="number" name="salarioMax" label="Salario máximo *" />

        <FormInput type="number" name="numPlazas" label="Número de plazas *" />

        <FormInput name="localidad" label="Localidad *" />

        <FormSelect
          name="publicado"
          label="Vacante pública"
          options={[
            { label: 'Pública', value: true },
            { label: 'Oculta', value: false },
          ]}
        />
      </Flex>

      <Flex direction="column" h="100%" w="80%" gridRowGap="20px">
        <Flex gridColumnGap="20px">
          <FormInput name="tipoPuesto" label="Tipo de puesto *" />

          <FormInput name="tipoContrato" label="Tipo de contrato *" />

          <FormSelect
            name="remoto"
            label="Tipo de trabajo"
            options={Object.values(ProcesoRemotoEnum).map((k) => ({
              label: <Box textTransform="capitalize">{k}</Box>,
              value: k,
            }))}
          />
        </Flex>

        <FormAsyncSelect
          isMulti
          name="habilidades"
          label="Habilidades"
          loadOptions={loadHabilidadesByNombre}
        />
        <FormTextEditor name="descripcion" label="Descripción *" />
        <FormTextEditor name="bonificaciones" label="Bonificaciones *" />
      </Flex>
    </Flex>
  );
};

export default Step1;
