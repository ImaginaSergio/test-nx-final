import { useContext } from 'react';

import { Box, Flex } from '@chakra-ui/react';
import { Country, State } from 'country-state-city';

import { isRoleAllowed } from '@clevery-lms/utils';
import { LoginContext } from '../../../../../shared/context';
import { IGrupo, IUser, UserRolEnum, getGrupos } from '@clevery-lms/data';
import {
  InformationAsyncSelectMulti,
  InformationInput,
  InformationSelect,
} from '../../../../../shared/components';

type TabInformacionProps = {
  user: IUser;
  refreshState: () => void;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({
  user: alumno,
  updateValue,
  refreshState,
}: TabInformacionProps) => {
  const { user } = useContext(LoginContext);

  const loadGruposByName = async (value: string) => {
    let _grupos = await getGrupos({
      query: [{ nombre: value }],
      client: 'admin',
    });

    return _grupos?.data?.map((exp: any) => ({
      value: exp.id,
      label: exp.nombre,
    }));
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
  const parseJSON = (inputString: string) => {
    if (inputString) {
      try {
        return State.getStatesOfCountry(JSON.parse(inputString).value).map(
          (c: any) => ({ label: c.name, value: c.name })
        );
      } catch (e) {
        return console.log('Por favor, actualiza la información de "País"');
      }
    }
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
          Información sobre el alumno como su nombre, datos de contacto,
          ajustes...
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', md: 'row' }} gridGap="30px" w="100%">
        <Flex direction="column" w="100%" gridGap="30px">
          <InformationInput
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            name="fullName"
            label="Nombre del Alumno"
            defaultValue={
              (alumno.nombre || '') + ' ' + (alumno.apellidos || '')
            }
            updateValue={updateValue}
          />

          <Flex
            direction={{ base: 'column', md: 'row' }}
            gridGap="30px"
            w="100%"
          >
            <InformationSelect
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              name="pais"
              label="País"
              options={Country.getAllCountries().map((c: any) => {
                return {
                  label: c.flag + ' ' + c.name,
                  value: `{ "label":"${c.name}", "value":"${c.isoCode}"}`,
                };
              })}
              defaultValue={parseData(alumno.pais)}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />

            <InformationSelect
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              name="localidad"
              label="Ciudad"
              options={parseJSON(alumno.pais)}
              defaultValue={{
                label: alumno.localidad,
                value: alumno.localidad,
              }}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />
          </Flex>

          <Flex
            direction={{ base: 'column', md: 'row' }}
            gridGap="30px"
            w="100%"
          >
            <InformationSelect
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              name="trabajoRemoto"
              label="Presencialidad"
              options={[
                { label: 'En remoto', value: true },
                { label: 'Presencial', value: false },
              ]}
              defaultValue={{
                label: alumno.trabajoRemoto ? 'En remoto' : 'Presencial',
                value: alumno.trabajoRemoto,
              }}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />

            <InformationSelect
              isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
              name="posibilidadTraslado"
              label="Posibilidad de traslado"
              options={[
                { label: 'Sí', value: true },
                { label: 'No', value: false },
              ]}
              defaultValue={{
                label: alumno.posibilidadTraslado ? 'Sí' : 'No',
                value: alumno.posibilidadTraslado,
              }}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />
          </Flex>
        </Flex>

        <Flex direction="column" w="100%" gridGap="30px">
          <InformationInput
            name="username"
            label="Nombre de usuario"
            defaultValue={alumno.username}
            updateValue={updateValue}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
          />

          <InformationInput
            name="email"
            label="Email del alumno"
            isDisabled
            defaultValue={alumno.email}
            updateValue={updateValue}
          />

          <InformationSelect
            name="activo"
            label="Acceso al campus"
            updateValue={updateValue}
            options={[
              { label: 'Usuario activo', value: true },
              { label: 'Usuario inactivo', value: false },
            ]}
            isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
            defaultValue={{
              label: alumno.activo ? 'Usuario activo' : 'Usuario inactivo',
              value: alumno.activo,
            }}
          />
        </Flex>
      </Flex>

      <InformationAsyncSelectMulti
        name="grupos"
        label="Grupos asociados"
        updateValue={updateValue}
        loadOptions={loadGruposByName}
        isDisabled={!isRoleAllowed([UserRolEnum.ADMIN], user?.rol)}
        defaultValue={
          alumno?.grupos?.map((gr: IGrupo) => ({
            label: gr.nombre,
            value: gr.id,
          })) || []
        }
      />
    </Flex>
  );
};
