import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Column } from 'primereact/column';
import { useToast, useDisclosure, Flex, Icon } from '@chakra-ui/react';
import { BiPlus, BiDirections, BiBrain, BiEnvelope } from 'react-icons/bi';

import {
  ColumnSettings,
  checkColumn,
  textRowTemplate,
  FilterUndefined,
  dateRowTemplate,
  TableSettings,
  rowQuickActions,
  LazyTable,
  DeleteModal,
  FilterInput,
  PageHeader,
  PageSidebar,
} from '../../../../shared/components';
import { IRuta } from '@clevery-lms/data';
import { QueryContext } from '../../../../shared/context';
import { onFailure, onSuccess_Undo } from '@clevery-lms/utils';
import { getItem, getRutas, removeRuta } from '@clevery-lms/data';
import { OpenColumn, OpenTable } from '@clevery-lms/ui';

export default function RutasTable() {
  const [elementSelected, setElementSelected] = useState<any>(undefined);

  const toast = useToast();
  const navigate = useNavigate();
  const tableRef = useRef<any>();
  const queryContext = useContext(QueryContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [data, setData] = useState<IRuta[]>([]);
  const [query, setQuery] = useState<any>();
  const [typing, setTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState<any>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [nombre, setNombre] = useState<any>();

  useEffect(() => {
    setIsLoading(true);
    getRutasBy({ page: currentPage }, query)
      .then((res) => {
        setData(res?.data || []);
        setPaginationData(res?.meta);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [query, currentPage]);

  useEffect(() => {
    let { page: _page, query: _query } = queryContext;

    if (_page !== 'rutas') {
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
    if (newQuery !== '') queryContext.setPage('rutas');
    else queryContext.resetQuery();
  };

  useEffect(() => {
    if (query !== undefined) tableRef?.current?.refreshData();
  }, [query]);

  const onRowClick = async (e: any) => navigate('/meta/rutas/' + e.id || '');

  const getRutasBy = async (params: any, query: string = '') => {
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
    else
      _query += params.sortField
        ? `&orderBy=${params.sortField}`
        : `&orderBy=nombre`;

    let auxQuery = _query.split('&').map((item) => {
      let split = item.split('=');
      return { [split[0]]: split[1] };
    });

    return await getRutas({ query: [{ ...auxQuery, page }], client: 'admin' });
  };

  const columns: OpenColumn[] = [
    {
      key: 'nombre',
      field: 'nombre',
      header: 'Nombre',
      sortable: true,
      filterable: true,
      render: (rowData: IRuta) =>
        textRowTemplate({
          content: { text: rowData?.nombre, link: `/rutas/${rowData?.id}` },
        }),
    },
    {
      key: 'itinerario',
      field: 'itinerario',
      header: 'Itinerario ',
      sortable: true,
      filterable: true,
      render: (rowData: IRuta) =>
        textRowTemplate({
          content: { text: rowData?.itinerario, link: `/rutas/${rowData?.id}` },
        }),
    },
    {
      key: 'createdAt',
      field: 'createdAt',
      header: 'Fecha de creación',
      sortable: true,
      filterable: true,
      render: (rowData: any) =>
        dateRowTemplate({ content: { date: rowData?.createdAt } }),
    },
    {
      key: '',
      field: '',
      header: '',
      render: (rowData: any) =>
        rowQuickActions({
          remove: {
            title: 'Borrar ruta',
            onClick: () => {
              setElementSelected(rowData);
              onOpen();
            },
          },
        }),
    },
  ];

  return (
    <Flex boxSize="100%">
      <PageSidebar
        title={'Meta'}
        items={[
          {
            icon: BiBrain,
            title: 'Habilidades',
            isActive: false,
            onClick: () => navigate('/meta/habilidades'),
          },
          {
            icon: BiDirections,
            title: 'Hojas de ruta',
            isActive: true,
            onClick: () => navigate('/meta/rutas'),
          },
          {
            icon: BiEnvelope,
            title: 'Plantillas',
            isActive: false,
            onClick: () => navigate('/meta/plantillas'),
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{ title: 'Todas las hojas de ruta' }}
          button={{
            text: 'Crear nueva hoja de ruta',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/meta/rutas/new'),
          }}
        />

        <OpenTable
          onQueryChange={setQuery}
          columns={columns}
          isLoading={isLoading}
          data={data}
          onPageChange={setCurrentPage}
          currentPage={currentPage}
          total={paginationData?.total || 1}
          maxPages={paginationData?.last_page || '-'}
          onRowClick={onRowClick}
        />
      </Flex>

      <DeleteModal
        title={
          <div>
            ¿Estás seguro de que quieres eliminar la ruta{' '}
            <strong>{elementSelected?.nombre}</strong>?
          </div>
        }
        isOpen={isOpen}
        onClose={onClose}
        securityWord={elementSelected?.nombre}
        onAccept={() => {
          let timeout: NodeJS.Timeout = setTimeout(
            () =>
              removeRuta(elementSelected?.id)
                .then((e) => tableRef?.current?.refreshData())
                .catch((error: any) =>
                  onFailure(toast, error.title, error.message)
                ),
            5000
          );

          onSuccess_Undo(
            toast,
            `Se va a eliminar la ruta ${elementSelected?.nombre}`,
            timeout
          );

          onClose();
        }}
      />
    </Flex>
  );
}
