import { useEffect, useState } from 'react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Box, Flex, Icon } from '@chakra-ui/react';
import { BiBadge, BiUser, BiX } from 'react-icons/bi';

import {
  badgeRowTemplate,
  InformationTable,
  LineChart,
  progressRowTemplate,
  textRowTemplate,
} from '../../../../../shared/components';
import { IUser, UserRolEnum, useUserStats } from '@clevery-lms/data';
import { fmtTiempoTotal, isRoleAllowed } from '@clevery-lms/utils';

type TabProgresoProps = {
  user: IUser;
  refreshState: () => void;
  updateValue: (value: any) => void;
};

export const TabProgreso = ({
  user,
  updateValue,
  refreshState,
}: TabProgresoProps) => {
  const [queryId, setQueryId] = useState(user?.id || 0);

  const { data: stats } = useUserStats({ id: queryId });

  useEffect(() => {
    setQueryId(user?.id || 0);
  }, [user?.id]);

  return (
    <Flex
      direction="column"
      p="30px"
      boxSize="100%"
      gridGap="30px"
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

      <Flex align="center" gridGap="27px">
        <Flex
          w="100%"
          gridGap="3px"
          rounded="8px"
          direction="column"
          p="10px 20px"
          border="1px solid #E6E8EE"
          bg="#FAFAFC"
        >
          <Box
            textTransform="uppercase"
            lineHeight="18px"
            fontSize="15px"
            fontWeight="semibold"
          >
            Cursos superados
          </Box>

          <Box lineHeight="33px" fontSize="28px" fontWeight="bold">
            {stats?.meta?.cursosCompletados?.length || 0}
          </Box>
        </Flex>

        <Flex
          w="100%"
          gridGap="3px"
          rounded="8px"
          direction="column"
          p="10px 20px"
          border="1px solid #E6E8EE"
          bg="#FAFAFC"
        >
          <Box
            textTransform="uppercase"
            lineHeight="18px"
            fontSize="15px"
            fontWeight="semibold"
          >
            Certificaciones
          </Box>

          <Box lineHeight="33px" fontSize="28px" fontWeight="bold">
            {stats?.meta?.certificacionesCompletadas?.length || 0}
          </Box>
        </Flex>

        {/* <Flex w="100%" gridGap="3px" rounded="8px" direction="column" p="10px 20px" border="1px solid #E6E8EE" bg="#FAFAFC">
          <Box textTransform="uppercase" lineHeight="18px" fontSize="15px" fontWeight="semibold">
            Puntuación total
          </Box>

          <Box lineHeight="33px" fontSize="28px" fontWeight="bold">
            {stats?.meta?.cursosCompletados?.length || 0} / 100
          </Box>
        </Flex> */}

        <Flex
          w="100%"
          gridGap="3px"
          rounded="8px"
          direction="column"
          p="10px 20px"
          border="1px solid #E6E8EE"
          bg="#FAFAFC"
        >
          <Box
            textTransform="uppercase"
            lineHeight="18px"
            fontSize="15px"
            fontWeight="semibold"
          >
            Tiempo total
          </Box>

          <Box lineHeight="33px" fontSize="28px" fontWeight="bold">
            {fmtTiempoTotal(stats?.progresoGlobal?.tiempoTotal) || '0 min'}
          </Box>
        </Flex>
      </Flex>

      <InformationTable
        label={`Hoja de ruta - ${stats?.progresoGlobal?.ruta?.nombre}`}
        data={[
          ...(stats?.meta?.cursosIniciados || [])?.filter((c: any) =>
            stats?.progresoGlobal?.ruta?.itinerario?.includes(c.id)
          ),
          ...(stats?.meta?.cursosCompletados || [])
            ?.filter((c: any) =>
              stats?.progresoGlobal?.ruta?.itinerario?.includes(c.id)
            )
            ?.map((c: any) => ({
              ...c,
              meta: { ...c.meta, progresos_count: c.meta.total_lecciones || 0 },
            })),
        ]}
        style={{
          width: '100%',
          minHeight: '400px',
          cursor: isRoleAllowed([UserRolEnum.ADMIN], user?.rol)
            ? undefined
            : 'default',
        }}
        columns={[
          {
            field: 'curso',
            header: 'Título ejercicio / curso',
            body: (rowData: any) =>
              textRowTemplate({
                content: { text: rowData?.titulo },
                prefix: { svg: rowData?.icono },
              }),
          },
          {
            field: 'progreso',
            header: 'Progreso',
            body: (rowData: any) =>
              progressRowTemplate({
                content: {
                  value: Math.min(
                    100,
                    Math.floor(
                      ((rowData.meta?.progresos_count || 0) /
                        (rowData.meta?.total_lecciones || 0)) *
                        100
                    )
                  ),
                  label: `${Math.min(
                    100,
                    Math.floor(
                      ((rowData.meta?.progresos_count || 0) /
                        (rowData.meta?.total_lecciones || 0)) *
                        100
                    )
                  )}% completo`,
                },
              }),
          },
          {
            field: 'entregas',
            header: 'Entregas',
            body: (rowData: any) =>
              textRowTemplate({
                content: {
                  text: rowData.meta?.total_entregables
                    ? `${rowData.meta?.entregables_count || 0} / ${
                        rowData.meta?.total_entregables
                      }`
                    : '-',
                },
              }),
          },
          {
            field: 'puntuacion',
            header: 'Puntuación',
            body: (rowData: any) =>
              badgeRowTemplate({
                badges: [
                  {
                    content: {
                      text: Math.min(
                        100,
                        Math.floor(rowData?.meta?.puntuacion_avg || 0)
                      ),
                    },
                    style: {
                      height: '40px',
                      minWidth: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      lineHeight: '19px',
                      borderRadius: '56px',
                      background:
                        (rowData?.meta?.puntuacion_avg || 0) > 50
                          ? '#2EDDBE'
                          : '#D8335B',
                    },
                  },
                ],
              }),
          },
        ]}
      />

      <InformationTable
        label="Otros cursos"
        data={[
          ...(stats?.meta?.cursosIniciados || [])?.filter(
            (c: any) => !stats?.progresoGlobal?.ruta?.itinerario?.includes(c.id)
          ),
          ...(stats?.meta?.cursosCompletados || [])
            ?.filter(
              (c: any) =>
                !stats?.progresoGlobal?.ruta?.itinerario?.includes(c.id)
            )
            ?.map((c: any) => ({
              ...c,
              meta: { ...c.meta, progresos_count: c.meta.total_lecciones || 0 },
            })),
        ]}
        style={{
          width: '100%',
          minHeight: '400px',
          cursor: isRoleAllowed([UserRolEnum.ADMIN], user?.rol)
            ? undefined
            : 'default',
        }}
        columns={[
          {
            field: 'curso',
            header: 'Título ejercicio / curso',
            body: (rowData: any) =>
              textRowTemplate({
                content: { text: rowData?.titulo },
                prefix: { svg: rowData?.icono },
              }),
          },
          {
            field: 'progreso',
            header: 'Progreso',
            body: (rowData: any) =>
              progressRowTemplate({
                content: {
                  value: Math.min(
                    100,
                    Math.floor(
                      ((rowData.meta?.progresos_count || 0) /
                        (rowData.meta?.total_lecciones || 0)) *
                        100
                    )
                  ),
                  label: `${Math.min(
                    100,
                    Math.floor(
                      ((rowData.meta?.progresos_count || 0) /
                        (rowData.meta?.total_lecciones || 0)) *
                        100
                    )
                  )}% completo`,
                },
              }),
          },
          {
            field: 'entregas',
            header: 'Entregas',
            body: (rowData: any) =>
              textRowTemplate({
                content: {
                  text: rowData.meta?.total_entregables
                    ? `${rowData.meta?.entregables_count || 0} / ${
                        rowData.meta?.total_entregables
                      }`
                    : '-',
                },
              }),
          },
          {
            field: 'puntuacion',
            header: 'Puntuación',
            body: (rowData: any) =>
              badgeRowTemplate({
                badges: [
                  {
                    content: {
                      text: Math.min(
                        100,
                        Math.floor(rowData?.meta?.puntuacion_avg || 0)
                      ),
                    },
                    style: {
                      height: '40px',
                      minWidth: '40px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      lineHeight: '19px',
                      borderRadius: '56px',
                      background:
                        (rowData?.meta?.puntuacion_avg || 0) > 50
                          ? '#2EDDBE'
                          : '#D8335B',
                    },
                  },
                ],
              }),
          },
        ]}
      />

      <InformationTable
        label="Certificaciones obtenidas"
        data={stats?.certificaciones
          // Filtramos todos los intentos para sacar siempre el último
          ?.filter(
            (c1: any) =>
              !stats?.certificaciones?.find(
                (c2: any) =>
                  c2.id === c1.id &&
                  c2.meta.pivot_intento > c1.meta.pivot_intento
              )
          )
          // Filtramos de nuevo para sacar siempre el aprobado, si es que está.
          ?.filter((c1: any) =>
            stats?.certificaciones?.find(
              (c2: any) =>
                c2.id === c1.id &&
                c1.meta.pivot_createdAt !== c2.meta.pivot_createdAt
            )
              ? c1.meta.pivot_aprobada
              : true
          )}
        style={{
          width: '100%',
          minHeight: '400px',
          cursor: isRoleAllowed([UserRolEnum.ADMIN], user?.rol)
            ? undefined
            : 'default',
        }}
        columns={[
          {
            field: 'curso',
            header: 'Título ejercicio / curso',
            body: (rowData: any) =>
              textRowTemplate({
                content: { text: rowData?.nombre },
                prefix: { imagen: rowData?.imagen?.url },
                suffix: {
                  content: <Box color="#84889A">Nivel {rowData?.nivel}</Box>,
                },
              }),
          },
          {
            field: 'estado',
            header: 'Estado',
            body: (rowData: any) =>
              badgeRowTemplate({
                badges: [
                  {
                    content: {
                      text: (
                        <Flex align="center" gridGap="5px">
                          <Icon
                            as={rowData?.meta.pivot_aprobada ? BiBadge : BiX}
                            boxSize="21px"
                          />

                          {rowData?.meta.pivot_aprobada
                            ? 'Superada'
                            : 'Suspendida'}
                        </Flex>
                      ),
                    },
                    style: {
                      fontSize: '14px',
                      lineHeight: '16px',
                      borderRadius: '7px',
                      padding: '2px 10px 2px 7px',
                      background: rowData?.meta?.pivot_aprobada
                        ? '#2EDDBE'
                        : '#D8335B',
                    },
                  },
                ],
              }),
          },
          {
            field: 'intentos',
            header: 'Intentos utilizados',
            body: (rowData: any) =>
              textRowTemplate({
                content: { text: rowData?.meta.pivot_intento + ' / 3' },
              }),
          },
        ]}
      />

      <Flex
        p="10px"
        bg="#FAFAFC"
        rounded="12px"
        direction="column"
        w="100%"
        gridGap="10px"
      >
        <Flex p="10px" align="center" gridGap="14px">
          <Icon as={BiUser} boxSize="21px" />

          <Box fontSize="16px" fontWeight="semibold">
            Actividad del último mes
          </Box>
        </Flex>

        <LineChart
          labels={stats?.sesiones?.map((s: any) =>
            format(new Date(s.dia), 'dd LLL', { locale: es })
          )}
          dataset={{
            label: 'Total de sesiones',
            data: stats?.sesiones?.map((s: any) => s.count),
            fill: true,
            borderColor: '#0BDEAC',
            backgroundColor: 'rgba(11, 222, 172, 0.17)',
          }}
        />
      </Flex>
    </Flex>
  );
};
