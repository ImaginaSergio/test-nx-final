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
import { QueryContext } from '../../../../shared/context';
import { onFailure, onSuccess_Undo } from '@clevery-lms/utils';
import { getPlantillas, removePlantilla, IPlantilla } from '@clevery-lms/data';
import { OpenColumn, OpenTable } from '@clevery-lms/ui';

export default function PlantillasTable() {
  const [elementSelected, setElementSelected] = useState<any>(undefined);

  const toast = useToast();
  const navigate = useNavigate();
  const tableRef = useRef<any>();
  const queryContext = useContext(QueryContext);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const [data, setData] = useState<IPlantilla[]>([]);
  const [query, setQuery] = useState<any>();
  const [typing, setTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [paginationData, setPaginationData] = useState<any>(undefined);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const [titulo, setTitulo] = useState<any>();

  // const [columnSettings, setColumnSettings] = useState<ColumnSettings[]>([
  //   {
  //     label: 'Título',
  //     value: 'titulo',
  //     checked: typeof getItem('user_plantillas_titulo') === 'boolean' ? getItem('user_plantillas_titulo') : true,
  //     onClick: () => {
  //       checkColumn('plantillas', 'titulo', columnSettings, setColumnSettings);
  //     },
  //   },
  //   {
  //     label: 'Publicado',
  //     value: 'publicado',
  //     checked: typeof getItem('user_plantillas_publicado') === 'boolean' ? getItem('user_plantillas_publicado') : true,
  //     onClick: () => {
  //       checkColumn('plantillas', 'publicado', columnSettings, setColumnSettings);
  //     },
  //   },
  //   {
  //     label: 'Fecha de creación',
  //     value: 'createdAt',
  //     checked: typeof getItem('user_plantillas_createdAt') === 'boolean' ? getItem('user_plantillas_createdAt') : true,
  //     onClick: () => {
  //       checkColumn('plantillas', 'createdAt', columnSettings, setColumnSettings);
  //     },
  //   },
  // ]);

  useEffect(() => {
    setIsLoading(true);
    getplantillasBy({ page: currentPage }, query)
      .then((res) => {
        setData(res?.data || []);
        setPaginationData(res?.meta);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [query, currentPage]);

  useEffect(() => {
    let { page: _page, query: _query } = queryContext;

    if (_page !== 'plantillas') {
      // Con inicializar un valor es suficiente para empezar el ciclo.
      setTitulo('');
    } else {
      setTitulo(_query.get('titulo') || '');
    }
  }, []);

  useEffect(() => {
    if (titulo !== undefined && !typing) updateQuery();
  }, [titulo, typing]);

  const updateQuery = () => {
    let newQuery = '';

    if (titulo !== undefined) {
      if (titulo) newQuery += `&titulo=${titulo}`;
      queryContext.setQuery('titulo', titulo);
    }

    setQuery(newQuery);

    // Si empezamos a filtrar datos, machacamos el valor de la página anterior.
    if (newQuery !== '') queryContext.setPage('plantillas');
    else queryContext.resetQuery();
  };

  useEffect(() => {
    if (query !== undefined) tableRef?.current?.refreshData();
  }, [query]);

  const onRowClick = async (e: any) =>
    navigate('/meta/plantillas/' + e.id || '');

  const getplantillasBy = async (params: any, query: string = '') => {
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
        : `&orderBy=titulo`;

    let auxQuery = _query.split('&').map((item) => {
      let split = item.split('=');
      return { [split[0]]: split[1] };
    });

    return await getPlantillas({
      query: [{ ...auxQuery, page }],
      client: 'admin',
    });
  };

  const columns: OpenColumn[] = [
    {
      key: 'titulo',
      field: 'titulo',
      header: 'Título',
      sortable: true,
      filterable: true,
      render: (rowData: IPlantilla) =>
        textRowTemplate({
          content: {
            text: rowData?.titulo,
            link: `/plantillas/${rowData?.id}`,
          },
        }),
    },
    {
      key: 'publicado',
      field: 'publicado',
      header: 'Publicado',
      sortable: true,
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
            title: 'Borrar plantilla',
            onClick: () => {
              setElementSelected(rowData);
              onOpen();
            },
          },
        }),
    },
  ];

  //   <Column
  //     className="lazytable-actionscolumn"
  //     filter
  //     filterElement={<TableSettings columns={columnSettings} />}
  //     body={(rowData: any) =>
  //       rowQuickActions({
  //         remove: {
  //           title: 'Borrar plantilla',
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
            isActive: false,
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
            isActive: true,
            onClick: () => navigate('/meta/plantillas'),
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{ title: 'Todas las plantillas' }}
          button={{
            text: 'Crear nueva plantilla',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/meta/plantillas/new'),
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
            ¿Estás seguro de que quieres eliminar la plantilla{' '}
            <strong>{elementSelected?.titulo}</strong>?
          </div>
        }
        isOpen={isOpen}
        onClose={onClose}
        securityWord={elementSelected?.titulo}
        onAccept={() => {
          let timeout: NodeJS.Timeout = setTimeout(
            () =>
              removePlantilla(elementSelected?.id)
                .then((e) => tableRef?.current?.refreshData())
                .catch((error: any) =>
                  onFailure(toast, error.title, error.message)
                ),
            5000
          );

          onSuccess_Undo(
            toast,
            `Se va a eliminar la plantilla ${elementSelected?.titulo}`,
            timeout
          );

          onClose();
        }}
      />
    </Flex>
  );
}
