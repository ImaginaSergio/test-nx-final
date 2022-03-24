import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { format } from 'date-fns';
import {
  useToast,
  useDisclosure,
  Flex,
  Icon,
  Box,
  Badge,
} from '@chakra-ui/react';
import { BiBookContent, BiBarChartAlt2, BiPlus } from 'react-icons/bi';

import {
  ColumnSettings,
  checkColumn,
  DeleteModal,
  FilterInput,
  PageSidebar,
  PageHeader,
  FilterAsyncSelect,
  FilterSelect,
} from '../../../../shared/components';
import { getItem } from '@clevery-lms/data';
import { QueryContext } from '../../../../shared/context';
import { onFailure, onSuccess_Undo } from '@clevery-lms/utils';
import { Avatar, OpenColumn, OpenTable } from '@clevery-lms/ui';
import { getCursos, getUsers, ICurso, removeCurso } from '@clevery-lms/data';

export default function CursosTable() {
  const [elementSelected, setElementSelected] = useState<any>(undefined);

  const toast = useToast();
  const navigate = useNavigate();
  const tableRef = useRef<any>();
  const queryContext = useContext(QueryContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [query, setQuery] = useState<any>();
  const [typing, setTyping] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<any>();

  const [titulo, setTitulo] = useState<any>();
  const [profesor, setProfesor] = useState<any>();
  const [modulos, setModulos] = useState<any>();
  const [publicado, setPublicado] = useState<any>();
  const [creacion, setCreacion] = useState<any>();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState<any>(undefined);
  const [data, setData] = useState<ICurso[]>([]);
  const [queryString, setQueryString] = useState<string>('');

  const [columnSettings, setColumnSettings] = useState<ColumnSettings[]>([
    {
      label: 'Título',
      value: 'titulo',
      checked:
        typeof getItem('user_cursos_titulo') === 'boolean'
          ? getItem('user_cursos_titulo')
          : true,
      onClick: () => {
        checkColumn('cursos', 'titulo', columnSettings, setColumnSettings);
      },
    },
    {
      label: 'Profesor',
      value: 'profesor',
      checked:
        typeof getItem('user_cursos_profesor') === 'boolean'
          ? getItem('user_cursos_profesor')
          : true,
      onClick: () => {
        checkColumn('cursos', 'profesor', columnSettings, setColumnSettings);
      },
    },
    {
      label: 'Módulos',
      value: 'modulos',
      checked:
        typeof getItem('user_cursos_modulos') === 'boolean'
          ? getItem('user_cursos_modulos')
          : true,
      onClick: () => {
        checkColumn('cursos', 'modulos', columnSettings, setColumnSettings);
      },
    },
    {
      label: 'Publicado',
      value: 'publicado',
      checked:
        typeof getItem('user_cursos_publicado') === 'boolean'
          ? getItem('user_cursos_publicado')
          : true,
      onClick: () => {
        checkColumn('cursos', 'publicado', columnSettings, setColumnSettings);
      },
    },
    {
      label: 'Fecha de creación',
      value: 'creacion',
      checked:
        typeof getItem('user_cursos_creacion') === 'boolean'
          ? getItem('user_cursos_creacion')
          : true,
      onClick: () => {
        checkColumn('cursos', 'creacion', columnSettings, setColumnSettings);
      },
    },
  ]);

  useEffect(() => {
    let { page: _page, query: _query } = queryContext;

    getCursosBy({ page: 1 }, queryString).then((res) => {
      setData(res?.data || []);
      setPaginationData(res?.meta);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getCursosBy({ page: currentPage }, queryString)
      .then((res) => {
        setData(res?.data || []);
        setPaginationData(res?.meta);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [queryString, currentPage]);

  useEffect(() => {
    if (
      (titulo !== undefined ||
        modulos !== undefined ||
        profesor !== undefined ||
        creacion !== undefined ||
        publicado !== undefined) &&
      !typing
    )
      updateQuery();
  }, [titulo, modulos, profesor, publicado, creacion, typing]);

  const updateQuery = () => {
    let newQuery = '';

    if (titulo) {
      if (titulo) newQuery += `&titulo=${titulo}`;
      queryContext.setQuery('email', titulo);
    }

    if (modulos !== undefined) {
      if (modulos) newQuery += `&modulos=${modulos}`;
      queryContext.setQuery('precio', modulos);
    }

    if (profesor !== undefined) {
      if (profesor) newQuery += `&profesor_id=${profesor.value}`;
      queryContext.setQuery('precio', profesor);
    }

    if (creacion !== undefined) {
      if (creacion) newQuery += `&created_at=${creacion}`;
      queryContext.setQuery('creacion', creacion);
    }

    if (publicado) {
      if (publicado.value !== 'todos')
        newQuery += `&publicado=${publicado.value}`;
      queryContext.setQuery('publicado', publicado);
    }

    setQuery(newQuery);

    // Si empezamos a filtrar datos, machacamos el valor de la página anterior.
    if (newQuery !== '') queryContext.setPage('cursos');
    else queryContext.resetQuery();
  };

  useEffect(() => {
    if (query !== undefined) tableRef?.current?.refreshData();
  }, [query]);

  const TituloFilter = (
    <FilterInput
      value={titulo || ''}
      placeholder="Filtrar por título"
      onChange={(e: any) => {
        setTyping(true);

        if (typingTimeout) clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => setTyping(false), 500));

        setTitulo(e.target.value);
      }}
    />
  );

  const loadParticipanteByNombre = async (value: string) => {
    let _usuarios = await getUsers({
      client: 'admin',
      query: value.includes('@') ? [{ email: value }] : [{ full_name: value }],
    });

    return _usuarios?.data?.map((user: any) => ({
      value: user.id,
      label: (user?.nombre || ' ') + ' ' + (user?.apellidos || ' '),
    }));
  };

  const ProfesorFilter = (
    <FilterAsyncSelect
      value={profesor}
      onChange={setProfesor}
      placeholder="Filtrar por participante"
      loadOptions={loadParticipanteByNombre}
    />
  );

  const PublicadoFilter = (
    <FilterSelect
      value={publicado}
      onChange={(e: any) => setPublicado(e)}
      placeholder="Filtrar por publicado"
      defaultValue={{ label: 'Todos', value: 'todos' }}
      options={[
        { label: 'Todos', value: 'todos' },
        { label: 'Publicado', value: true },
        { label: 'Oculto', value: false },
      ]}
    />
  );

  const ModulosFilter = (
    <FilterInput
      type="number"
      value={modulos || ''}
      placeholder="Filtrar por nº de módulos"
      onChange={(e: any) => setModulos(e.target.value)}
    />
  );

  const CreacionFilter = (
    <FilterInput
      type="date"
      value={creacion || ''}
      placeholder="Filtrar por fecha de creación"
      onChange={(e: any) => setCreacion(e.target.value)}
    />
  );

  const onRowClick = async (e: any) => navigate('/cursos/' + e?.id || '');

  const getCursosBy = async (params: any, query: string = '') => {
    let page = params.page !== undefined ? params.page : 1;

    let auxQuery = query.split('&').map((item) => {
      let split = item.split('=');
      return { [split[0]]: split[1] };
    });

    let _query = [{ ...auxQuery, page: page }];

    return await getCursos({ query: _query, client: 'admin' });
  };

  const loadUsers = (value: string) => {
    return getUsers({ query: [{ nombre: value }] }).then((res) =>
      res?.data?.map((user: any) => ({
        value: user.id,
        label: (user?.nombre || ' ') + ' ' + (user?.apellidos || ' '),
      }))
    );
  };

  const columns: OpenColumn[] = [
    {
      header: 'Título',
      field: 'titulo',
      key: 'titulo',
      sortable: true,
      filterable: true,
    },
    {
      header: 'Profesor',
      field: 'profesor_id',
      key: 'profesor_id',
      sortable: true,
      filterable: true,
      loadOptions: loadUsers,
      render: (rowData) => (
        <Flex align="center" gap="15px">
          <Avatar
            size="50px"
            src={rowData.profesor.avatar?.url}
            name={
              (rowData?.profesor?.nombre || '')[0] +
              (rowData?.profesor?.apellidos || ' ')[0]
            }
          />

          <Box>
            {(rowData.profesor?.nombre || '') +
              ' ' +
              (rowData.profesor?.apellidos || '')}
          </Box>
        </Flex>
      ),
    },
    {
      header: 'Nº de módulos',
      field: 'modulos',
      key: 'modulos',
      render: (rowData) => <Box>{rowData.modulos.length}</Box>,
    },
    {
      key: 'publicado',
      field: 'publicado',
      header: 'Publicado',
      sortable: true,
      filterable: true,
      options: [
        { label: 'Publicado', value: 'true' },
        { label: 'No publicado', value: 'false' },
      ],
      render: (rowData) => (
        <Badge
          rounded="7px"
          color={rowData.publicado ? 'white' : 'black'}
          bg={rowData.publicado ? 'primary' : '#D9DBE3'}
        >
          {rowData.publicado ? 'Publicado' : 'No publicado'}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      field: 'createdAt',
      header: 'Fecha de creación',
      sortable: true,
      render: (rowData) => (
        <Flex>{format(new Date(rowData.createdAt), 'dd/MM/yyy')}</Flex>
      ),
    },
  ];

  return (
    <Flex width="100%" h="100%">
      <PageSidebar
        title="Cursos"
        items={[
          {
            icon: BiBookContent,
            title: 'Formaciones',
            isActive: true,
            onClick: () => {},
          },
          {
            icon: BiBarChartAlt2,
            title: 'Métricas',
            isActive: false,
            isDisabled: true,
            onClick: () => navigate('/cursos/metricas'),
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{ title: 'Todas las formaciones' }}
          button={{
            text: 'Crear nuevo curso',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/cursos/new'),
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
            ¿Estás seguro de que quieres eliminar el curso{' '}
            <strong>{elementSelected?.titulo}</strong>?
          </div>
        }
        isOpen={isOpen}
        onClose={onClose}
        securityWord={elementSelected?.titulo}
        onAccept={() => {
          let timeout: NodeJS.Timeout = setTimeout(
            () =>
              removeCurso({ id: elementSelected?.id, client: 'admin' })
                .then((e) => tableRef?.current?.refreshData())
                .catch((error: any) =>
                  onFailure(toast, error.title, error.message)
                ),
            5000
          );

          onSuccess_Undo(
            toast,
            `Se va a eliminar el curso ${elementSelected?.titulo}`,
            timeout
          );

          onClose();
        }}
      />
    </Flex>
  );
}
