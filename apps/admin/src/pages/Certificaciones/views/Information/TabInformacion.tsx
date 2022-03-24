import { Box, Flex } from '@chakra-ui/react';
import {
  InformationInput,
  InformationSelect,
  InformationFilepond,
  InformationTextEditor,
  InformationAsyncSelect,
} from '../../../../shared/components';
import { ICertificacion } from '@clevery-lms/data';
import { getHabilidades } from '@clevery-lms/data';

type TabInformacionProps = {
  certificacion: ICertificacion;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({
  certificacion,
  updateValue,
}: TabInformacionProps) => {
  const loadHabilidades = async (value: string) => {
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
          Información sobre la certificación, como el título del mismo,
          descripción, logotipo, etc...
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gridGap="30px" w="100%">
        <Flex direction="column" w="100%" gridGap="30px">
          <InformationInput
            name="nombre"
            label="Nombre"
            defaultValue={certificacion.nombre}
            updateValue={updateValue}
          />

          <Flex w="100%" gridGap="20px">
            <InformationSelect
              name="publicado"
              label="Estado"
              updateValue={updateValue}
              style={{ width: '100%' }}
              defaultValue={{
                label: certificacion.publicado ? 'Publicada' : 'Privada',
                value: certificacion.publicado,
              }}
              options={[
                { label: 'Publicada', value: true },
                { label: 'Privada', value: false },
              ]}
            />

            <InformationSelect
              name="nivel"
              label="Nivel"
              updateValue={updateValue}
              style={{ width: '100%' }}
              defaultValue={{
                label:
                  certificacion.nivel === 1
                    ? 'Nivel Inicial (1)'
                    : certificacion.nivel === 2
                    ? 'Nivel Intermedio (2)'
                    : 'Nivel Avanzado (3)',
                value: certificacion.nivel,
              }}
              options={[
                { label: 'Nivel Inicial (1)', value: 1 },
                { label: 'Nivel Intermedio (2)', value: 2 },
                { label: 'Nivel Avanzado (3)', value: 3 },
              ]}
            />
          </Flex>

          <InformationTextEditor
            name="descripcion"
            label="Descripción del certificación"
            placeholder="Introduce el texto"
            updateValue={updateValue}
            defaultValue={certificacion.descripcion}
          />
        </Flex>

        <Flex direction="column" w="100%" gridGap="30px">
          <InformationFilepond
            name="imagen"
            label="Portada"
            isDisabled={!certificacion?.id}
            putEP={'/godAPI/certificaciones/' + certificacion.id}
          />

          <InformationAsyncSelect
            name="habilidadId"
            label="Habilidad"
            updateValue={updateValue}
            loadOptions={loadHabilidades}
            defaultValue={{
              label: certificacion.habilidad?.nombre,
              value: certificacion.habilidadId,
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
