import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BiBookContent, BiPlus, BiGroup, BiUserVoice } from 'react-icons/bi';
import {
  Box,
  Flex,
  Icon,
  Image,
  Progress,
  Spinner,
  useDisclosure,
} from '@chakra-ui/react';

import { getRutas, IUser } from '@clevery-lms/data';
import { UserRolEnum } from '@clevery-lms/data';
import { getUsersStats } from '@clevery-lms/data';
import { OpenColumn, OpenTable } from '@clevery-lms/ui';
import { fmtTiempoTotal, isRoleAllowed } from '@clevery-lms/utils';
import { LoginContext, QueryContext } from '../../../../shared/context';
import {
  LineChart,
  PageHeader,
  PageSidebar,
  textRowTemplate,
  progressRowTemplate,
} from '../../../../shared/components';

import UsuariosModalForm from '../../components/UsuariosModalForm';
import UsuariosInactivosModal from '../../components/UsuariosInactivosModal';

export default function UsuariosTable() {
  const navigate = useNavigate();
  const tableRef = useRef<any>();
  const { user } = useContext(LoginContext);
  const queryContext = useContext(QueryContext);

  const [data, setData] = useState<IUser[]>([]);
  const [queryString, setQueryString] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState<any>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [typing, setTyping] = useState<boolean>(false);

  const [nombre, setNombre] = useState<any>();
  const [ruta, setRuta] = useState<any>();

  useEffect(() => {
    setIsLoading(true);

    getUsuariosBy({ page: currentPage }, queryString)
      .then((res) => {
        setData(res?.data || []);
        setPaginationData(res?.meta);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [queryString, currentPage]);

  useEffect(() => {
    let { page: _page, query: _query } = queryContext;

    if (_page !== 'alumnos') {
      // Con inicializar un valor es suficiente para empezar el ciclo.
      setNombre('');
    } else {
      setNombre(_query.get('nombre') || '');
      setRuta(_query.get('ruta') || null);
    }
  }, []);

  useEffect(() => {
    if ((nombre !== undefined || ruta !== undefined) && !typing) updateQuery();
  }, [nombre, ruta, typing]);

  const updateQuery = () => {
    let newQuery = '';

    if (nombre !== undefined) {
      if (nombre?.includes('@')) newQuery += `&email=${nombre}`;
      else if (nombre) newQuery += `&full_name=${nombre}`;

      queryContext.setQuery('nombre', nombre);
    }

    if (ruta !== undefined) {
      if (ruta) newQuery += `&ruta=${ruta?.value}`;

      queryContext.setQuery('ruta', ruta);
    }

    setQueryString(newQuery);

    // Si empezamos a filtrar datos, machacamos el valor de la página anterior.
    if (newQuery !== '') queryContext.setPage('alumnos');
    else queryContext.resetQuery();
  };

  useEffect(() => {
    if (queryString !== undefined) tableRef?.current?.refreshData();
  }, [queryString]);

  const onRowClick = async (e: any) => navigate('/usuarios/' + e.id || '');

  const getUsuariosBy = async (params: any, query: string = '') => {
    let page = params.page !== undefined ? params.page : 1;

    let _query = `?page=${page}&${query}`;

    if (params.sortOrder) {
      _query += `&direction=${params.sortOrder === -1 ? 'DESC' : 'ASC'}`;
      queryContext.setQuery(
        'direction',
        params.sortOrder === -1 ? 'DESC' : 'ASC'
      );
    }

    if (params.sortField) _query += `&orderBy=${params.sortField}`;
    else _query += params.sortField ? `&orderBy=${params.sortField}` : ``;

    let auxQuery = _query.split('&').map((item) => {
      let split = item.split('=');
      return { [split[0]]: split[1] };
    });

    return await getUsersStats({
      query: [{ ...auxQuery, page }],
      client: 'admin',
    });
  };

  const loadRutas = async (search: string) => {
    let _rutas = await getRutas({ query: [{ nombre: search }] });
    return _rutas?.data?.map((ruta: any) => ({
      value: ruta.id,
      label: ruta.nombre,
    }));
  };

  const columns: OpenColumn[] = [
    {
      key: 'nombre',
      field: 'nombre',
      header: 'Nombre / Email',
      sortable: true,
      filterable: true,
      render: (rowData: any) =>
        textRowTemplate({
          prefix: {
            content: rowData?.hot
              ? '🔥 '
              : `#${(rowData?.id + '').padStart(3, '0')}`,
          },
          content: {
            text: (rowData.nombre || '') + ' ' + (rowData.apellidos || ''),
            subtext: rowData?.email,
          },
        }),
    },
    {
      key: 'ruta',
      field: 'ruta',
      header: 'Hoja de ruta',
      sortable: true,
      filterable: true,
      loadOptions: loadRutas,
      render: (rowData: any) =>
        progressRowTemplate({
          content: {
            value: Math.min(
              100,
              (rowData?.porcentajeCompletadoRuta || 0) * 100
            ),
            label: rowData?.progresoGlobal?.ruta?.nombre || '-',
          },
        }),
    },
  ];

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpen_copy,
    onOpen: onOpen_copy,
    onClose: onClose_copy,
  } = useDisclosure();

  return (
    <Flex width="100%" h="100%">
      <PageSidebar
        title="Usuarios"
        items={[
          {
            icon: BiBookContent,
            title: 'Alumnos',
            isActive: true,
            onClick: () => navigate('/usuarios'),
          },
          {
            icon: BiGroup,
            title: 'Grupos',
            isActive: false,
            isDisabled: !isRoleAllowed([UserRolEnum.ADMIN], user?.rol),
            onClick: () => navigate('/usuarios/grupos'),
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{ title: 'Alumnos' }}
          buttonGroup={[
            {
              text: 'Alumnos inactivos',
              leftIcon: <Icon as={BiUserVoice} boxSize="21px" />,
              onClick: onOpen_copy,
              disabled: !isRoleAllowed(
                [UserRolEnum.ADMIN, UserRolEnum.SUPERVISOR],
                user?.rol
              ),
            },
            {
              text: 'Agregar alumnos',
              leftIcon: <Icon as={BiPlus} boxSize="21px" />,
              onClick: onOpen,
              disabled: !isRoleAllowed([UserRolEnum.ADMIN], user?.rol),
            },
          ]}
        />

        <OpenTable
          isExpandable
          data={data}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          onRowClick={onRowClick}
          onPageChange={setCurrentPage}
          onQueryChange={setQueryString}
          total={paginationData?.total || 1}
          maxPages={paginationData?.last_page || '-'}
          rowExpansionTemplate={rowExpansionTemplate}
        />
      </Flex>

      <UsuariosModalForm state={{ isOpen, onOpen, onClose }} />
      <UsuariosInactivosModal
        state={{
          isOpen: isOpen_copy,
          onOpen: onOpen_copy,
          onClose: onClose_copy,
        }}
      />
    </Flex>
  );
}

const rowExpansionTemplate = (rowData: any) => {
  return (
    <Flex direction={{ base: 'column', lg: 'row' }} py="15px" gridGap="15px">
      <Flex direction="column" gridGap="5px" w="100%">
        <Flex p="10px 15px" bg="white" rounded="8px">
          <Box
            minW="190px"
            color="#84889A"
            fontSize="15px"
            fontWeight="semibold"
          >
            Tiempo total dedicado
          </Box>

          <Box w="100%" fontSize="15px" fontWeight="medium">
            {fmtTiempoTotal(rowData?.progresoGlobal?.tiempoTotal)}
          </Box>
        </Flex>

        <Flex p="10px 15px" bg="white" rounded="8px">
          <Box
            minW="190px"
            color="#84889A"
            fontSize="15px"
            fontWeight="semibold"
          >
            Proyectos subidos
          </Box>

          <Box w="100%" fontSize="15px" fontWeight="medium">
            {rowData?.meta?.total_proyectos || '0'}
          </Box>
        </Flex>

        {/* <Flex p="10px 15px" bg="white" rounded="8px">
          <Box minW="190px" color="#84889A" fontSize="15px" fontWeight="semibold">
            Asistencia
          </Box>

          <Box w="100%" fontSize="15px" fontWeight="medium">
            0% de asistencia
          </Box>
        </Flex> */}

        <Flex p="10px 15px" bg="white" rounded="8px">
          <Box
            minW="190px"
            color="#84889A"
            fontSize="15px"
            fontWeight="semibold"
          >
            Cursos actuales
          </Box>

          <Flex
            direction="column"
            w="100%"
            fontSize="15px"
            fontWeight="medium"
            gridGap="10px"
          >
            {rowData?.meta?.cursosIniciados?.map((c: any) => {
              const progressValue =
                c.meta?.progresos_count && c.meta?.total_lecciones
                  ? Math.floor(
                      ((c.meta?.progresos_count || 0) /
                        (c.meta?.total_lecciones || 0)) *
                        100
                    )
                  : 0;

              return (
                <Flex
                  p="10px 15px 10px"
                  border="1px solid #E6E8EE"
                  rounded="12px"
                  align="center"
                  gridGap="12px"
                >
                  <Image
                    alt=""
                    minW="40px"
                    h="40px"
                    src={`data:image/svg+xml;utf8,${c.icono}`}
                  />

                  <Flex direction="column" w="100%" gridGap="4px">
                    <Box fontSize="15px" lineHeight="18px" fontWeight="medium">
                      {c.titulo}
                    </Box>

                    <Progress
                      w="100%"
                      h="10px"
                      rounded="58px"
                      value={100}
                      sx={{
                        '& > div': {
                          background: `linear-gradient(90deg, #25CBAB 0%, #0FFFA9 ${
                            progressValue + '%'
                          }, #E6E8EE ${progressValue + '%'}, #E6E8EE 100%)`,
                        },
                      }}
                    />
                  </Flex>

                  <Box
                    minW="fit-content"
                    alignSelf="end"
                    color="#12BE94"
                    fontSize="15px"
                    lineHeight="15px"
                    fontWeight="bold"
                  >
                    {progressValue}%
                  </Box>
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      </Flex>

      <Flex direction="column" gridGap="5px" w="100%">
        <Flex
          p="10px 15px"
          bg="white"
          rounded="8px"
          direction="column"
          h="100%"
        >
          <Box
            minW="190px"
            color="#84889A"
            fontSize="15px"
            fontWeight="semibold"
          >
            Actividad del último mes
          </Box>

          <LineChart
            labels={rowData?.sesiones?.map((s: any) =>
              format(new Date(s.dia), 'dd LLL', { locale: es })
            )}
            dataset={{
              label: 'Total de sesiones',
              data: rowData?.sesiones?.map((s: any) => s.count),
              fill: true,
              borderColor: '#0BDEAC',
              backgroundColor: 'rgba(11, 222, 172, 0.17)',
            }}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
