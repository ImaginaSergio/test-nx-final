import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { formatDistance } from 'date-fns';
import { es } from 'date-fns/locale';
import { Column } from 'primereact/column';
import { Box, Flex, Icon, Progress } from '@chakra-ui/react';
import { BiBookContent, BiPlus, BiGlasses, BiGroup } from 'react-icons/bi';

import {
  LazyTable,
  PageHeader,
  checkColumn,
  FilterInput,
  PageSidebar,
  badgeRowTemplate,
  TableSettings,
  ColumnSettings,
  rowQuickActions,
  textRowTemplate,
  FilterUndefined,
  dateRowTemplate,
} from '../../../../shared/components';
import { fmtTiempoTotal } from '@clevery-lms/utils';
import { QueryContext } from '../../../../shared/context';
import {
  getItem,
  getUsersStats,
  UsuarioActividadEnum,
} from '@clevery-lms/data';

export default function ProfesoresTable() {
  const navigate = useNavigate();
  const tableRef = useRef<any>();
  const queryContext = useContext(QueryContext);

  const [query, setQuery] = useState<any>();
  const [typing, setTyping] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<any>();

  const [nombre, setNombre] = useState<any>();

  const [columnSettings, setColumnSettings] = useState<ColumnSettings[]>([
    {
      label: 'Nombre',
      value: 'nombre',
      checked:
        typeof getItem('user_profesores_nombre') === 'boolean'
          ? getItem('user_profesores_nombre')
          : true,
      onClick: () => {
        checkColumn('profesores', 'nombre', columnSettings, setColumnSettings);
      },
    },
    {
      label: 'Cursos',
      value: 'cursos',
      checked:
        typeof getItem('user_profesores_cursos') === 'boolean'
          ? getItem('user_profesores_cursos')
          : true,
      onClick: () => {
        checkColumn('profesores', 'cursos', columnSettings, setColumnSettings);
      },
    },
    {
      label: 'Lecciones',
      value: 'lecciones',
      checked:
        typeof getItem('user_profesores_lecciones') === 'boolean'
          ? getItem('user_profesores_lecciones')
          : true,
      onClick: () => {
        checkColumn(
          'profesores',
          'lecciones',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: '% Total',
      value: 'progreso_total',
      checked:
        typeof getItem('user_profesores_progreso_total') === 'boolean'
          ? getItem('user_profesores_progreso_total')
          : true,
      onClick: () => {
        checkColumn(
          'profesores',
          'progreso_total',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: 'Tiempo total',
      value: 'tiempototal',
      checked:
        typeof getItem('user_profesores_tiempototal') === 'boolean'
          ? getItem('user_profesores_tiempototal')
          : false,
      onClick: () => {
        checkColumn(
          'profesores',
          'tiempototal',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: 'Puntuación',
      value: 'score',
      checked:
        typeof getItem('user_profesores_score') === 'boolean'
          ? getItem('score')
          : true,
      onClick: () => {
        checkColumn('profesores', 'score', columnSettings, setColumnSettings);
      },
    },
    {
      label: 'Proyectos',
      value: 'proyectos',
      checked:
        typeof getItem('user_profesores_proyectos') === 'boolean'
          ? getItem('user_profesores_proyectos')
          : true,
      onClick: () => {
        checkColumn(
          'profesores',
          'proyectos',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: 'Actividad reciente',
      value: 'actividad_reciente',
      checked:
        typeof getItem('user_profesores_actividad_reciente') === 'boolean'
          ? getItem('user_profesores_actividad_reciente')
          : true,
      onClick: () => {
        checkColumn(
          'profesores',
          'actividad_reciente',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: 'Fecha de último acceso',
      value: 'ultimo_acceso',
      checked:
        typeof getItem('user_profesores_ultimo_acceso') === 'boolean'
          ? getItem('user_profesores_ultimo_acceso')
          : true,
      onClick: () => {
        checkColumn(
          'profesores',
          'ultimo_acceso',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: 'Fecha de creación',
      value: 'createdAt',
      checked:
        typeof getItem('user_profesores_createdAt') === 'boolean'
          ? getItem('user_profesores_createdAt')
          : false,
      onClick: () => {
        checkColumn(
          'profesores',
          'createdAt',
          columnSettings,
          setColumnSettings
        );
      },
    },
  ]);

  useEffect(() => {
    let { page: _page, query: _query } = queryContext;

    if (_page !== 'profesores') {
      // Con inicializar un valor es suficiente para empezar el ciclo.
      setNombre('');
    } else {
      setNombre(_query.get('nombre') || '');
    }
  }, []);

  useEffect(() => {
    if (nombre !== undefined && !typing) updateQuery();
  }, [nombre, typing]);

  const updateQuery = () => {
    let newQuery = '';

    if (nombre !== undefined) {
      if (nombre) newQuery += `&nombre=${nombre}`;
      queryContext.setQuery('nombre', nombre);
    }

    setQuery(newQuery);

    // Si empezamos a filtrar datos, machacamos el valor de la página anterior.
    if (newQuery !== '') queryContext.setPage('profesores');
    else queryContext.resetQuery();
  };

  useEffect(() => {
    if (query !== undefined) tableRef?.current?.refreshData();
  }, [query]);

  const getUsuariosBy = async (params: any, query: string = '') => {
    let page = (params.page !== undefined ? params.page : 0) + 1;

    let _query = `?page=${page}${query}`;

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

  const NombreFilter = (
    <FilterInput
      value={nombre || ''}
      placeholder="Filtrar por nombre"
      onChange={(e: any) => {
        setTyping(true);

        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => setTyping(false), 500));

        setNombre(e.target.value);
      }}
    />
  );

  const onRowClick = async (e: any) =>
    navigate('/usuarios/profesores/' + e.data?.id || '');

  const columns = [
    <Column
      key="id"
      field="id"
      header="#"
      style={{ width: '90px' }}
      body={(rowData: any) =>
        textRowTemplate({
          content: { text: '#' + (rowData?.id + '').padStart(3, '0') },
        })
      }
    />,

    <Column
      key="nombre"
      field="nombre"
      header="Nombre / Email"
      style={{ width: '400px' }}
      filter
      filterElement={NombreFilter}
      body={(rowData: any) =>
        textRowTemplate({
          content: { text: rowData?.fullName, subtext: rowData?.email },
        })
      }
    />,
    <Column
      key="cursos"
      field="cursos"
      header="Cursos"
      filter
      filterElement={<FilterUndefined />}
      style={{ width: '120px' }}
      body={(rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: {
                text: rowData.meta?.total_cursos || '',
                style: { color: 'white' },
              },
              style: {
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#338B7B',
              },
            },
          ],
        })
      }
    />,
    <Column
      key="lecciones"
      field="lecciones"
      header="Lecciones"
      style={{ width: '120px' }}
      filter
      filterElement={<FilterUndefined />}
      body={(rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: {
                text: rowData.meta?.total_lecciones_completadas || '',
                style: { color: 'white' },
              },
              style: {
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#878EA0',
              },
            },
          ],
        })
      }
    />,
    <Column
      key="progreso_total"
      field="progreso_total"
      header="% Hoja de ruta"
      style={{ width: '180px' }}
      filter
      filterElement={<FilterUndefined />}
      body={(rowData: any) => (
        <Flex w="100%" align="center">
          <Box
            minW="fit-content"
            whiteSpace="nowrap"
            mr="6px"
            fontSize="15px"
            fontWeight="medium"
            lineHeight="18px"
          >
            {Math.min(100, (rowData?.porcentajeCompletadoRuta || 0) * 100)} %
          </Box>

          <Progress
            value={rowData.porcentajeCompletadoRuta ? 100 : 0}
            w="100%"
            h="8px"
            rounded="7px"
            sx={{
              '& > div': {
                background: `linear-gradient(90deg, #26C8AB 0%, #0FFFA9 ${
                  Math.min(
                    100,
                    (rowData?.porcentajeCompletadoRuta || 0) * 100
                  ) + '%'
                }, #F6F7F8 ${
                  Math.min(
                    100,
                    (rowData?.porcentajeCompletadoRuta || 0) * 100
                  ) + '%'
                }, #F6F7F8 100%)`,
              },
            }}
          />
        </Flex>
      )}
    />,

    <Column
      key="tiempototal"
      field="tiempototal"
      header="Tiempo formando"
      style={{ width: '160px' }}
      filter
      filterElement={<FilterUndefined />}
      body={(rowData: any) =>
        textRowTemplate({
          content: {
            text: fmtTiempoTotal(
              Math.floor((rowData?.progresoGlobal?.tiempoTotal || 0) / 60)
            ),
          },
        })
      }
    />,
    <Column
      key="score"
      field="score"
      header="Puntuación"
      filter
      filterElement={<FilterUndefined />}
      style={{ width: '90px' }}
      body={(rowData: any) =>
        textRowTemplate({
          content: { text: Math.floor(+(rowData.score || 0) * 100) + '' },
        })
      }
    />,
    <Column
      key="proyectos"
      field="proyectos"
      header="Proyectos"
      filter
      filterElement={<FilterUndefined />}
      style={{ width: '120px' }}
      body={(rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: {
                text: rowData.meta?.total_proyectos || '',
                style: { color: 'white' },
              },
              style: {
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#878EA0',
              },
            },
          ],
        })
      }
    />,
    <Column
      key="actividad_reciente"
      field="actividad_reciente"
      header="Actividad reciente"
      filter
      filterElement={<FilterUndefined />}
      style={{ width: '160px' }}
      body={(rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: {
                text: rowData.actividadReciente?.replaceAll('_', ' '),
                style: { textDecoration: 'capitalize', color: 'white' },
              },
              style: {
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor:
                  rowData.actividadReciente === UsuarioActividadEnum.MUY_ACTIVO
                    ? '#26C8AB'
                    : rowData.actividadReciente ===
                      UsuarioActividadEnum.MUY_ACTIVO
                    ? '#145448'
                    : '#878EA0',
              },
            },
          ],
        })
      }
    />,
    <Column
      key="ultimo_acceso"
      field="ultimo_acceso"
      header="Fecha de último acceso"
      style={{ width: '220px' }}
      sortable
      filter
      filterElement={<FilterUndefined />}
      body={(rowData: any) =>
        textRowTemplate({
          content: {
            text:
              rowData?.sesiones?.length > 0 && rowData?.sesiones[0].updatedAt
                ? formatDistance(
                    new Date(rowData?.sesiones[0].updatedAt),
                    new Date(),
                    { locale: es }
                  )
                : '',
          },
        })
      }
    />,
    <Column
      key="createdAt"
      field="createdAt"
      header="Fecha de creación"
      style={{ width: '220px' }}
      sortable
      filter
      filterElement={<FilterUndefined />}
      body={(rowData: any) =>
        dateRowTemplate({ content: { date: rowData?.createdAt } })
      }
    />,
    <Column
      className="lazytable-actionscolumn"
      filter
      filterElement={<TableSettings columns={columnSettings} />}
      body={(rowData: any) => rowQuickActions({})}
    />,
  ];

  return (
    <Flex width="100%" h="100%">
      <PageSidebar
        title="Usuarios"
        items={[
          {
            icon: BiBookContent,
            title: 'Alumnos',
            isActive: false,
            onClick: () => navigate('/usuarios'),
          },
          {
            icon: BiGlasses,
            title: 'Profesores',
            isActive: true,
            onClick: () => navigate('/usuarios/profesores'),
            isDisabled: true,
          },
          {
            icon: BiGroup,
            title: 'Grupos',
            isActive: false,
            onClick: () => navigate('/usuarios/grupos'),
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader head={{ title: 'Profesores' }} />

        <LazyTable
          query={query}
          ref={tableRef}
          getData={getUsuariosBy}
          onRowClick={onRowClick}
          columns={columns.filter(
            (c: any) =>
              !columnSettings.find(
                (cs: any) => cs.value === c.key && !cs?.checked
              )
          )}
        />
      </Flex>
    </Flex>
  );
}
