import { Box, Flex } from '@chakra-ui/react';

import {
  InformationFilepond,
  InformationInput,
  InformationSelect,
  InformationTextEditor,
} from '../../../../../shared/components';
import { getHabilidades } from '@clevery-lms/data';
import { IProceso, ProcesoRemotoEnum } from '@clevery-lms/data';
import { InformationHabilidades } from '../../../components/InformationHabilidades/InformationHabilidades';

type TabInformacionProps = {
  proceso: IProceso;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({
  proceso,
  updateValue,
}: TabInformacionProps) => {
  const loadHabilidadesByNombre = async (value: string) => {
    let _habilidades = await getHabilidades({
      query: [{ nombre: value }],
      client: 'admin',
    });

    return _habilidades?.data?.map((hab: any) => ({
      ...hab,
      value: hab.id,
      label: hab.nombre,
    }));
  };

  return (
    <Flex
      direction="column"
      p="30px"
      boxSize="100%"
      gridRowGap="30px"
      overflow="overlay"
    >
      <Flex minH="fit-content" w="100%" direction="column" gridRowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre el proceso, como el título del mismo, descripción,
          logotipo, etc...
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gridGap="30px" w="100%">
        <Flex direction="column" w="100%" gridGap="30px">
          <InformationInput
            name="titulo"
            label="Titulo del proceso"
            defaultValue={proceso.titulo}
            updateValue={updateValue}
          />

          <InformationInput
            name="localidad"
            label="Ubicación"
            defaultValue={proceso.localidad}
            updateValue={updateValue}
          />

          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gridGap="30px"
            w="100%"
          >
            <InformationInput
              name="tipoContrato"
              label="Tipo de contrato"
              defaultValue={proceso.tipoContrato}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />

            <InformationInput
              name="tipoPuesto"
              label="Tipo de puesto"
              defaultValue={proceso.tipoPuesto}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />
          </Flex>

          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gridGap="30px"
            w="100%"
          >
            <InformationSelect
              name="publicado"
              label="Estado"
              options={[
                { label: 'Publicado', value: true },
                { label: 'Oculto', value: false },
              ]}
              defaultValue={{
                label: proceso.publicado ? 'Publicado' : 'Oculto',
                value: proceso.publicado,
              }}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />

            <InformationSelect
              name="remoto"
              label="Remoto"
              options={Object.values(ProcesoRemotoEnum).map((k) => ({
                label: k,
                value: k,
              }))}
              defaultValue={{ label: proceso.remoto, value: proceso.remoto }}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />
          </Flex>

          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gridGap="30px"
            w="100%"
          >
            <InformationInput
              type="number"
              name="salarioMin"
              label="Salario mínimo"
              defaultValue={proceso.salarioMin}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />

            <InformationInput
              type="number"
              name="salarioMax"
              label="Salario máximo"
              defaultValue={proceso.salarioMax}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />
          </Flex>

          <Flex
            direction={{ base: 'column', lg: 'row' }}
            gridGap="30px"
            w="100%"
          >
            <InformationHabilidades
              label="Habilidades"
              updateValue={updateValue}
              loadOptions={loadHabilidadesByNombre}
              style={{ width: '100%' }}
              defaultValue={proceso.habilidades}
            />

            <InformationInput
              name="numPlazas"
              label="Número de plazas"
              defaultValue={proceso.numPlazas}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />
          </Flex>
        </Flex>

        <Flex direction="column" w="100%" gridGap="30px">
          <InformationFilepond
            name="imagen"
            label="Portada"
            putEP={'/godAPI/procesos/' + proceso.id}
            isDisabled={!proceso?.id}
          />

          <InformationTextEditor
            name="descripcion"
            label="Descripción del proceso"
            placeholder="Introduce el texto"
            defaultValue={proceso.descripcion}
            updateValue={updateValue}
          />

          <InformationTextEditor
            name="bonificaciones"
            label="Bonificaciones"
            placeholder="Introduce las bonificaciones"
            defaultValue={proceso.bonificaciones}
            updateValue={updateValue}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
