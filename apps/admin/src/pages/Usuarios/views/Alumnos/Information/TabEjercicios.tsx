import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { es } from 'date-fns/locale';
import { Box, Center, Flex, Spinner } from '@chakra-ui/react';
import { formatDuration, intervalToDuration } from 'date-fns';

import {
  EntregableEstadoEnum,
  IUser,
  UserRolEnum,
  useEntregables,
} from '@clevery-lms/data';
import {
  badgeRowTemplate,
  dateRowTemplate,
  InformationTable,
  textRowTemplate,
} from '../../../../../shared/components';
import { isRoleAllowed } from '@clevery-lms/utils';

type TabEjerciciosProps = {
  user: IUser;
  refreshState: () => void;
  updateValue: (value: any) => void;
};

export const TabEjercicios = ({
  user,
  updateValue,
  refreshState,
}: TabEjerciciosProps) => {
  const navigate = useNavigate();

  const [query, setQuery] = useState([{ user_id: user?.id }, { limit: 1000 }]);
  const { data: entregables, isLoading } = useEntregables({
    query: query,
    client: 'admin',
  });

  useEffect(() => {
    setQuery([{ user_id: user?.id }, { limit: 1000 }]);
  }, [user?.id]);

  return (
    <Flex direction="column" boxSize="100%" overflow="overlay">
      <Flex
        minH="fit-content"
        w="100%"
        direction="column"
        gridRowGap="8px"
        p="30px"
      >
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Listado de ejercicios entregados por el alumno
        </Box>
      </Flex>

      {isLoading ? (
        <Flex
          align="center"
          justify="center"
          direction="column"
          boxSize="100%"
          gap="8px"
        >
          <Box fontWeight="semibold" fontSize="14px">
            Cargando ejercicios del alumno, por favor espere un momento...
          </Box>

          <Spinner />
        </Flex>
      ) : (entregables?.data?.length || 0) === 0 ? (
        <Center boxSize="100%">
          <Box fontWeight="semibold" fontSize="14px">
            El alumno aún no ha entregado ningún ejercicio
          </Box>
        </Center>
      ) : (
        <InformationTable
          data={entregables?.data}
          style={{
            width: '100%',
            cursor: isRoleAllowed([UserRolEnum.ADMIN], user?.rol)
              ? undefined
              : 'default',
          }}
          onRowClick={(item) => navigate(`/ejercicios/${item.data.id}`)}
          columns={[
            {
              field: 'curso',
              header: 'Título ejercicio / curso',
              body: (rowData: any) =>
                textRowTemplate({
                  content: {
                    text: rowData?.titulo || `Entregable nº ${rowData.id}`,
                    subtext: 'Curso de ' + rowData?.meta?.curso?.titulo,
                    link: `/ejercicios/${rowData.id}`,
                    isDisabled: !isRoleAllowed([UserRolEnum.ADMIN], user?.rol),
                  },
                }),
            },
            {
              field: 'fechaEntrega',
              header: 'Fecha de Entrega',
              body: (rowData: any) =>
                dateRowTemplate({
                  content: {
                    date: rowData?.fechaEntrega,
                    format: 'dd LLL yyyy',
                    isDistance: true,
                    maxDistanceInDays: 9,
                  },
                }),
            },
            {
              field: 'tiempoEmpleado',
              header: 'Tiempo empleado',
              body: (rowData: any) =>
                textRowTemplate({
                  content: {
                    text: rowData.fechaEntrega
                      ? formatDuration(
                          intervalToDuration({
                            start: new Date(rowData.createdAt),
                            end: new Date(rowData.fechaEntrega),
                          }),
                          {
                            locale: es,
                            format: ['months', 'days', 'hours', 'minutes'],
                          }
                        )
                      : undefined,
                  },
                }),
            },
            {
              field: 'estado',
              header: 'Estado ejercicio',
              body: (rowData: any) =>
                badgeRowTemplate({
                  badges: [
                    {
                      content: {
                        text:
                          rowData?.estado === EntregableEstadoEnum.CORRECTO ||
                          rowData?.estado === EntregableEstadoEnum.ERROR
                            ? 'CORREGIDO'
                            : rowData?.estado ===
                              EntregableEstadoEnum.PENDIENTE_CORRECCION
                            ? 'PENDIENTE DE CORRECCIÓN'
                            : 'PENDIENTE DE ENTREGA',
                      },
                      style: {
                        background:
                          rowData?.estado === EntregableEstadoEnum.CORRECTO ||
                          rowData?.estado === EntregableEstadoEnum.ERROR
                            ? '#2EDDBE'
                            : rowData?.estado ===
                              EntregableEstadoEnum.PENDIENTE_CORRECCION
                            ? '#DDB72E'
                            : 'var(--chakra-colors-gray_4)',
                      },
                    },
                  ],
                }),
            },
            {
              field: 'puntuacion',
              header: 'Puntuación',
              body: (rowData: any) =>
                badgeRowTemplate({
                  badges: [
                    {
                      content: { text: rowData?.puntuacion || '-' },
                      style: {
                        height: '40px',
                        minWidth: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '16px',
                        lineHeight: '19px',
                        borderRadius: '56px',
                        background: !rowData?.puntuacion
                          ? 'var(--chakra-colors-gray_4)'
                          : rowData?.puntuacion > 50
                          ? '#2EDDBE'
                          : '#D8335B', // #DDB72E
                      },
                    },
                  ],
                }),
            },
          ]}
        />
      )}
    </Flex>
  );
};
