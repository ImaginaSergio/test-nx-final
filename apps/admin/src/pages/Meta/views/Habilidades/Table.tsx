import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { Column } from 'primereact/column';
import { useToast, useDisclosure, Flex, Icon } from '@chakra-ui/react';
import {
  BiShow,
  BiHide,
  BiPlus,
  BiBrain,
  BiDirections,
  BiEnvelope,
} from 'react-icons/bi';

import {
  ColumnSettings,
  checkColumn,
  textRowTemplate,
  FilterUndefined,
  badgeRowTemplate,
  dateRowTemplate,
  TableSettings,
  rowQuickActions,
  LazyTable,
  DeleteModal,
  FilterInput,
  PageHeader,
  PageSidebar,
} from '../../../../shared/components';
import { getItem } from '@clevery-lms/data';
import { IHabilidad } from '@clevery-lms/data';
import { QueryContext } from '../../../../shared/context';
import { onFailure, onSuccess_Undo } from '@clevery-lms/utils';
import { getHabilidades, removeHabilidad } from '@clevery-lms/data';
import { OpenColumn, OpenTable } from '@clevery-lms/ui';

export default function HabilidadesTable() {
  const [elementSelected, setElementSelected] = useState<any>(undefined);

  const toast = useToast();
  const navigate = useNavigate();
  const tableRef = useRef<any>();
  const queryContext = useContext(QueryContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [data, setData] = useState<IHabilidad[]>([]);
  const [query, setQuery] = useState<any>();
  const [typing, setTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState<any>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [nombre, setNombre] = useState<any>();

  useEffect(() => {
    setIsLoading(true);
    gethabilidadesBy({ page: currentPage }, query)
      .then((res) => {
        setData(res?.data || []);
        setPaginationData(res?.meta);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [query, currentPage]);

  useEffect(() => {
    let { page: _page, query: _query } = queryContext;

    if (_page !== 'habilidades') {
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
    if (newQuery !== '') queryContext.setPage('habilidades');
    else queryContext.resetQuery();
  };

  useEffect(() => {
    if (query !== undefined) tableRef?.current?.refreshData();
  }, [query]);

  const onRowClick = async (e: any) =>
    navigate('/meta/habilidades/' + e.id || '');

  const gethabilidadesBy = async (params: any, query: string = '') => {
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

    return await getHabilidades({
      query: [{ ...auxQuery, page }],
      client: 'admin',
    });
  };

  const columns: OpenColumn[] = [
    {
      key: 'nombre',
      field: 'nombre',
      header: 'Nombre ',
      sortable: true,
      filterable: true,
      render: (rowData: any) =>
        textRowTemplate({
          content: {
            text: rowData?.nombre,
            link: `/habilidades/${rowData?.id}`,
          },
        }),
    },
    {
      key: 'publicado',
      field: 'publicado',
      header: 'Publicado ',
      sortable: false,
      filterable: true,
      options: [
        { label: 'Publicado', value: true },
        { label: 'Oculto', value: false },
      ],
      render: (rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: {
                text: (
                  <Flex color="#ffffff" align="center">
                    <Icon
                      w="14px"
                      h="14px"
                      mr="8px"
                      as={rowData?.publicado ? BiShow : BiHide}
                    />
                    {rowData?.publicado ? 'Publicado' : 'Oculto'}
                  </Flex>
                ),
              },
              style: {
                padding: '6px 12px',
                borderRadius: '8px',
                backgroundColor: rowData?.publicado ? '#3182FC' : '#DBDDDF',
              },
            },
          ],
        }),
    },
    {
      key: 'createdAt',
      field: 'createdAt',
      header: 'Fecha de creación ',
      sortable: true,
      filterable: true,
      render: (rowData: any) =>
        dateRowTemplate({ content: { date: rowData?.createdAt } }),
    },
    {
      key: '',
      field: '',
      header: '',
      sortable: false,
      filterable: false,
      render: (rowData: any) =>
        rowQuickActions({
          remove: {
            title: 'Borrar habilidad',
            onClick: () => {
              setElementSelected(rowData);
              onOpen();
            },
          },
        }),
    },
  ];

  //   <Column
  //     key="createdAt"
  //     field="createdAt"
  //     header="Fecha de creación"
  //     style={{ width: '220px' }}
  //     sortable
  //     filter
  //     filterElement={<FilterUndefined />}
  //     body={(rowData: any) => dateRowTemplate({ content: { date: rowData?.createdAt } })}
  //   />,
  //   <Column
  //     className="lazytable-actionscolumn"
  //     filter
  //     filterElement={<TableSettings columns={columnSettings} />}
  //     body={(rowData: any) =>
  //       rowQuickActions({
  //         remove: {
  //           title: 'Borrar habilidad',
  //           onClick: () => {
  //             setElementSelected(rowData);
  //             onOpen();
  //           },
  //         },
  //       })
  //     }
  //   />,
  // ];

  return (
    <Flex width="100%" h="100%">
      <PageSidebar
        title={'Meta'}
        items={[
          {
            icon: BiBrain,
            title: 'Habilidades',
            isActive: true,
            onClick: () => navigate('/meta/habilidades'),
          },
          {
            icon: BiDirections,
            title: 'Hojas de ruta',
            isActive: false,
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
          head={{ title: 'Todas las habilidades' }}
          button={{
            text: 'Crear nueva habilidad',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/meta/habilidades/new'),
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
            ¿Estás seguro de que quieres eliminar la habilidad{' '}
            <strong>{elementSelected?.nombre}</strong>?
          </div>
        }
        isOpen={isOpen}
        onClose={onClose}
        securityWord={elementSelected?.nombre}
        onAccept={() => {
          let timeout: NodeJS.Timeout = setTimeout(
            () =>
              removeHabilidad({ id: elementSelected?.id, client: 'admin' })
                .then((e) => tableRef?.current?.refreshData())
                .catch((error: any) =>
                  onFailure(toast, error.title, error.message)
                ),
            5000
          );

          onSuccess_Undo(
            toast,
            `Se va a eliminar la habilidad ${elementSelected?.nombre}`,
            timeout
          );

          onClose();
        }}
      />
    </Flex>
  );
}
