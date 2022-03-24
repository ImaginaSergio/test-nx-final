import { Box, Flex } from '@chakra-ui/react';

import { IUser } from '@clevery-lms/data';
import {
  InformationInput,
  InformationSelect,
} from '../../../../../shared/components';

type TabInformacionProps = {
  user: IUser;
  refreshState: () => void;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({
  user,
  updateValue,
  refreshState,
}: TabInformacionProps) => {
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
            name="fullName"
            label="Nombre del Alumno"
            defaultValue={user.fullName}
            updateValue={updateValue}
          />

          <Flex
            direction={{ base: 'column', md: 'row' }}
            gridGap="30px"
            w="100%"
          >
            <InformationInput
              name="pais"
              label="País"
              defaultValue={user.pais}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />

            <InformationInput
              name="localidad"
              label="Ciudad"
              defaultValue={user.localidad}
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
              name="trabajoRemoto"
              label="Presencialidad"
              options={[
                { label: 'En remoto', value: true },
                { label: 'Presencial', value: false },
              ]}
              defaultValue={{
                label: user.trabajoRemoto ? 'En remoto' : 'Presencial',
                value: user.trabajoRemoto,
              }}
              updateValue={updateValue}
              style={{ width: '100%' }}
            />

            <InformationSelect
              name="posibilidadTraslado"
              label="Posibilidad de traslado"
              options={[
                { label: 'Sí', value: true },
                { label: 'No', value: false },
              ]}
              defaultValue={{
                label: user.posibilidadTraslado ? 'Sí' : 'No',
                value: user.posibilidadTraslado,
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
            defaultValue={user.username}
            updateValue={updateValue}
          />

          <InformationInput
            name="email"
            label="Email del alumno"
            isDisabled
            defaultValue={user.email}
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
            defaultValue={{
              label: user.activo ? 'Usuario activo' : 'Usuario inactivo',
              value: user.activo,
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
