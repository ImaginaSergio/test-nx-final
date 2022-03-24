import { Flex, Box } from '@chakra-ui/react';

import { PerfilSelect } from '../../components';
import { Country, State } from 'country-state-city';

type TabDatosProps = {
  pending: boolean;
  setPending: (e?: any) => void;
  pais: any;
  setPais: (e?: any) => void;
  localidad: any;
  setLocalidad: (e?: any) => void;
  trabajoRemoto: boolean;
  setTrabajoRemoto: (e?: any) => void;
  posibilidadTraslado: boolean;
  setPosibilidadTraslado: (e?: any) => void;
};

export const TabDatos = ({
  pending,
  setPending,
  pais,
  setPais,
  localidad,
  setLocalidad,
  trabajoRemoto,
  setTrabajoRemoto,
  posibilidadTraslado,
  setPosibilidadTraslado,
}: TabDatosProps) => {
  const parseJSON = (inputString: string) => {
    if (inputString) {
      try {
        return State.getStatesOfCountry(JSON.parse(inputString).value).map((c: any) => ({ label: c.name, value: c.name }));
      } catch (e) {
        return console.log('Por favor, actualiza la información de "País"');
      }
    }
  };

  const parseData = (inputString: string) => {
    if (inputString) {
      try {
        return JSON.parse(inputString);
      } catch (e) {
        return { label: inputString, value: inputString };
      }
    }
  };

  return (
    <Flex direction="column">
      <Box fontSize="18px" fontWeight="bold" mb="27.5px">
        Datos
      </Box>

      <PerfilSelect
        label="País"
        name="pais"
        defaultValue={parseData(pais)}
        options={Country.getAllCountries().map((c: any) => ({
          label: c.flag + ' ' + c.name,
          value: `{ "label":"${c.name}", "value":"${c.isoCode}"}`,
        }))}
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setPais(e);
        }}
      />
      <PerfilSelect
        label="Localidad"
        name="localidad"
        options={parseJSON(pais)}
        defaultValue={{ label: localidad, value: localidad }}
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setLocalidad(e);
        }}
      />

      <PerfilSelect
        name="trabajoRemoto"
        label="Presencialidad"
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setTrabajoRemoto(e);
        }}
        options={[
          { label: 'Remoto', value: true },
          { label: 'Presencial', value: false },
        ]}
        defaultValue={{ label: trabajoRemoto ? 'Remoto' : 'Presencial', value: trabajoRemoto }}
      />

      <PerfilSelect
        name="posibilidadTraslado"
        label="Posibilidad de traslado"
        onChange={(e: any) => {
          if (!pending) setPending(true);
          setPosibilidadTraslado(e);
        }}
        options={[
          { label: 'Sí', value: true },
          { label: 'No', value: false },
        ]}
        defaultValue={{ label: posibilidadTraslado ? 'Sí' : 'No', value: posibilidadTraslado }}
      />
    </Flex>
  );
};
