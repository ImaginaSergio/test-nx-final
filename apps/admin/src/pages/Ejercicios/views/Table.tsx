import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  useToast,
  useDisclosure,
  Flex,
  Icon,
  Box,
  Spinner,
} from '@chakra-ui/react';
import { BiBookContent, BiBarChartAlt2, BiPlus } from 'react-icons/bi';

import {
  ColumnSettings,
  checkColumn,
  badgeRowTemplate,
  DeleteModal,
  PageSidebar,
  PageHeader,
} from '../../../shared/components';
import {
  EntregableEstadoEnum,
  getCursos,
  getHabilidades,
  getItem,
  getUsers,
  LeccionTipoEnum,
} from '@clevery-lms/data';
import { ICertificacion } from '@clevery-lms/data';
import { onFailure, onSuccess_Undo } from '@clevery-lms/utils';
import { LoginContext, QueryContext } from '../../../shared/context';
import { getEntregables, removeCertificacion } from '@clevery-lms/data';

import { format, formatDistance } from 'date-fns/esm';
import * as Locale from 'date-fns/esm/locale';
import { OpenColumn, OpenTable } from '@clevery-lms/ui';

export default function EjerciciosTable() {
  const [elementSelected, setElementSelected] = useState<any>(undefined);

  const toast = useToast();
  const navigate = useNavigate();
  const tableRef = useRef<any>();
  const loginContext = useContext(LoginContext);
  const queryContext = useContext(QueryContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  //const [query, setQuery] = useState<any>();
  const [typing, setTyping] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<any>();

  const [nombre, setNombre] = useState<any>();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState<any>(undefined);
  const [data, setData] = useState<ICertificacion[]>([]);
  const [queryString, setQueryString] = useState<string>('');

  //?Configuracion Columnas
  const [columnSettings, setColumnSettings] = useState<ColumnSettings[]>([
    {
      label: 'Nombre',
      value: 'nombre',
      checked:
        typeof getItem('user_certificaciones_nombre') === 'boolean'
          ? getItem('user_certificaciones_nombre')
          : true,
      onClick: () => {
        checkColumn(
          'certificaciones',
          'nombre',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: 'Nivel',
      value: 'nivel',
      checked:
        typeof getItem('user_certificaciones_nivel') === 'boolean'
          ? getItem('user_certificaciones_nivel')
          : true,
      onClick: () => {
        checkColumn(
          'certificaciones',
          'nivel',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: 'Exámenes',
      value: 'examenes',
      checked:
        typeof getItem('user_certificaciones_examenes') === 'boolean'
          ? getItem('user_certificaciones_examenes')
          : true,
      onClick: () => {
        checkColumn(
          'certificaciones',
          'examenes',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: 'Habilidad',
      value: 'habilidad',
      checked:
        typeof getItem('user_certificaciones_habilidad') === 'boolean'
          ? getItem('user_certificaciones_habilidad')
          : true,
      onClick: () => {
        checkColumn(
          'certificaciones',
          'habilidad',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: 'Publicado',
      value: 'publicado',
      checked:
        typeof getItem('user_certificaciones_publicado') === 'boolean'
          ? getItem('user_certificaciones_publicado')
          : true,
      onClick: () => {
        checkColumn(
          'certificaciones',
          'publicado',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: 'Habilidad',
      value: 'habilidad',
      checked:
        typeof getItem('user_certificaciones_habilidad') === 'boolean'
          ? getItem('user_certificaciones_habilidad')
          : true,
      onClick: () => {
        checkColumn(
          'certificaciones',
          'habilidad',
          columnSettings,
          setColumnSettings
        );
      },
    },
    {
      label: 'Fecha de creación',
      value: 'createdAt',
      checked:
        typeof getItem('user_certificaciones_createdAt') === 'boolean'
          ? getItem('user_certificaciones_createdAt')
          : true,
      onClick: () => {
        checkColumn(
          'certificaciones',
          'createdAt',
          columnSettings,
          setColumnSettings
        );
      },
    },
  ]);

  useEffect(() => {
    let { page: _page, query: _query } = queryContext;

    getEntregablesBy(queryContext).then((res) => {
      setData(res?.data || []);
      setPaginationData(res?.meta);
    });
    if (_page !== 'ejercicios') {
      // Con inicializar un valor es suficiente para empezar el ciclo.
      setNombre('');
    } else {
      setNombre(_query.get('nombre') || '');
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getEntregablesBy({ page: currentPage }, queryString)
      .then((res) => {
        setData(res?.data || []);
        setPaginationData(res?.meta);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [queryString, currentPage]);

  const loadCursos = (value: string) => {
    return getCursos({ query: [{ titulo: value }] }).then((res) =>
      res?.data?.map((curso: any) => ({ value: curso.id, label: curso.titulo }))
    );
  };

  const onRowClick = async (e: any) => navigate('/ejercicios/' + e.id || '');

  const getEntregablesBy = async (params: any, query: string = '') => {
    let page = params.page !== undefined ? params.page : 1;

    let auxQuery = query.split('&').map((item) => {
      let split = item.split('=');
      return { [split[0]]: split[1] };
    });

    let _query = [{ ...auxQuery, page: page }];

    return await getEntregables({ query: _query, client: 'admin' });
  };

  const loadUsers = (value: string) => {
    return getUsers({ query: [{ nombre: value }] }).then((res) =>
      res?.data?.map((user: any) => ({
        value: user.id,
        label: (user?.nombre || ' ') + ' ' + (user?.apellidos || ' '),
      }))
    );
  };

  //?Columnas
  const columns: OpenColumn[] = [
    {
      key: 'user_id',
      field: 'user_id',
      header: 'Alumno',
      sortable: true,
      filterable: true,
      loadOptions: loadUsers,
      render: (rowData) => <Box>{rowData.user.fullName}</Box>,
    },
    {
      key: 'curso',
      field: 'curso',
      header: 'Curso',
      sortable: true,
      filterable: true,
      loadOptions: loadCursos,
      render: (rowData) => <Box>{rowData.leccion.modulo.curso.titulo}</Box>,
    },
    {
      key: 'fecha_entrega',
      field: 'fecha_entrega',
      header: 'Fecha de entrega',
      sortable: true,
      render: (rowData) => (
        <Box>{format(new Date(rowData.updatedAt), 'dd/MM/yyy')}</Box>
      ),
    },
    {
      key: 'tiempo_empleado',
      field: 'tiempo_empleado',
      header: 'Tiempo empleado',
      render: (rowData) => (
        <Box>
          {formatDistance(
            new Date(rowData.updatedAt),
            new Date(rowData.createdAt),
            { locale: Locale.es }
          )}
        </Box>
      ),
    },
    {
      key: 'tipo_leccion',
      field: 'tipo_leccion',
      header: 'Tipo ejercicio',
      sortable: false,
      filterable: true,
      options: [
        { label: 'Entrega', value: LeccionTipoEnum.ENTREGABLE },
        { label: 'Autocorreción', value: LeccionTipoEnum.AUTOCORREGIBLE },
      ],
      render: (rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: {
                text:
                  rowData?.leccion?.tipo === LeccionTipoEnum.ENTREGABLE
                    ? 'ENTREGABLE'
                    : 'AUTOCORRECION',
              },
              style: {
                background:
                  rowData?.leccion?.tipo === LeccionTipoEnum.ENTREGABLE
                    ? '#2EDDBE'
                    : '#DDB72E',
              },
            },
          ],
        }),
    },
    {
      key: 'estado',
      field: 'estado',
      header: 'Estado',
      sortable: false,
      filterable: true,
      options: [
        { label: 'Correcto', value: EntregableEstadoEnum.CORRECTO },
        { label: 'Error', value: EntregableEstadoEnum.ERROR },
        {
          label: 'Pendiente de entrega',
          value: EntregableEstadoEnum.PENDIENTE_ENTREGA,
        },
        {
          label: 'Pendiente de correción',
          value: EntregableEstadoEnum.PENDIENTE_CORRECCION,
        },
      ],
      render: (rowData: any) =>
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
      key: 'puntuacion',
      field: 'puntuacion',
      header: 'Puntuación',
      sortable: true,
      filterable: true,
      render: (rowData: any) =>
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
  ];

  console.log(data[0]);
  //!Render
  return (
    <Flex width="100%" h="100%">
      <PageSidebar
        title={'Ejercicios'}
        items={[
          {
            icon: BiBookContent,
            title: 'Listado',
            isActive: true,
            onClick: () => {},
          },
          {
            icon: BiBarChartAlt2,
            title: 'Métricas',
            isActive: false,
            isDisabled: true,
            onClick: () => navigate('/ejercicios/metricas'),
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{ title: 'Todas los ejercicios' }}
          button={{
            text: 'Crear nueva certificación',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/ejercicios/new'),
          }}
        />

        <OpenTable
          data={data}
          columns={columns}
          isLoading={isLoading}
          currentPage={currentPage}
          onRowClick={onRowClick}
          onPageChange={setCurrentPage}
          onQueryChange={setQueryString}
          total={paginationData?.total || 1}
          maxPages={paginationData?.last_page || '-'}
        />
      </Flex>

      <DeleteModal
        title={
          <div>
            ¿Estás seguro de que quieres eliminar la certificación{' '}
            <strong>{elementSelected?.nombre}</strong>?
          </div>
        }
        isOpen={isOpen}
        onClose={onClose}
        securityWord={elementSelected?.nombre}
        onAccept={() => {
          let timeout: NodeJS.Timeout = setTimeout(
            () =>
              removeCertificacion({ id: elementSelected?.id })
                .then((e) => tableRef?.current?.refreshData())
                .catch((error: any) =>
                  onFailure(toast, error.title, error.message)
                ),
            5000
          );

          onSuccess_Undo(
            toast,
            `Se va a eliminar la certificación ${elementSelected?.nombre}`,
            timeout
          );

          onClose();
        }}
      />
    </Flex>
  );
}
