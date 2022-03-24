import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast, useDisclosure, Flex, Icon, Badge } from '@chakra-ui/react';
import { BiBookContent, BiBarChartAlt2, BiPlus } from 'react-icons/bi';

import {
  ColumnSettings,
  checkColumn,
  badgeRowTemplate,
  DeleteModal,
  PageSidebar,
  PageHeader,
} from '../../../shared/components';
import { getHabilidades, getItem } from '@clevery-lms/data';
import { ICertificacion } from '@clevery-lms/data';
import { onFailure, onSuccess_Undo } from '@clevery-lms/utils';
import { QueryContext } from '../../../shared/context';
import { getCertificaciones, removeCertificacion } from '@clevery-lms/data';

import { format } from 'date-fns/esm';
import { OpenColumn, OpenTable } from '@clevery-lms/ui';

export default function CertificacionesTable() {
  const [elementSelected] = useState<any>(undefined);

  const toast = useToast();
  const navigate = useNavigate();
  const tableRef = useRef<any>();
  const queryContext = useContext(QueryContext);

  const { isOpen, onClose } = useDisclosure();

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

    getCertificacionesBy(queryContext).then((res) => {
      setData(res?.data || []);
      setPaginationData(res?.meta);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getCertificacionesBy({ page: currentPage }, queryString)
      .then((res) => {
        setData(res?.data || []);
        setPaginationData(res?.meta);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [queryString, currentPage]);

  const loadHabilidades = (value: string) => {
    return getHabilidades({ query: [{ nombre: value }] }).then((res) =>
      res?.data?.map((hab: any) => ({ value: hab.id, label: hab.nombre }))
    );
  };

  const onRowClick = async (e: any) =>
    navigate('/certificaciones/' + e.id || '');

  const getCertificacionesBy = async (params: any, query: string = '') => {
    let page = params.page !== undefined ? params.page : 1;

    let auxQuery = query.split('&').map((item) => {
      let split = item.split('=');
      return { [split[0]]: split[1] };
    });

    let _query = [{ ...auxQuery, page: page }];

    return await getCertificaciones({ query: _query, client: 'admin' });
  };

  //?Columnas
  const columns: OpenColumn[] = [
    {
      key: 'nombre',
      field: 'nombre',
      header: 'Nombre',
      sortable: true,
      filterable: true,
    },
    {
      key: 'nivel',
      field: 'nivel',
      header: 'Nivel',
      sortable: true,
      filterable: true,
      options: [
        { label: '1', value: '1' },
        { label: '2', value: '2' },
        { label: '3', value: '3' },
      ],
      render: (rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: { text: rowData?.nivel || 0 },
              style: {
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '14px',
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor:
                  rowData?.nivel === 1
                    ? '#26C8AB'
                    : rowData?.nivel === 2
                    ? '#338B7B'
                    : rowData?.nivel === 3
                    ? '#145448'
                    : '#D9DBE3',
              },
            },
          ],
        }),
    },
    {
      key: 'examenes',
      field: 'examenes',
      header: 'Num. Exámenes',
      sortable: false,
      render: (rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: { text: rowData?.meta?.examenesCount || 0 },
              style: {
                color: 'white',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '14px',
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor:
                  rowData?.meta?.examenesCount === 1
                    ? '#26C8AB'
                    : rowData?.meta?.examenesCount === 2
                    ? '#338B7B'
                    : rowData?.meta?.examenesCount === 3
                    ? '#145448'
                    : '#D9DBE3',
              },
            },
          ],
        }),
    },
    {
      key: 'publicado',
      field: 'publicado',
      header: 'Publicado',
      sortable: true,
      filterable: true,
      options: [
        { label: 'Publicada', value: 'true' },
        { label: 'No publicada', value: 'false' },
      ],
      render: (rowData) => (
        <Badge
          rounded="7px"
          color={rowData.publicado ? 'white' : 'black'}
          bg={rowData.publicado ? 'primary' : '#D9DBE3'}
        >
          {rowData.publicado ? 'Publicada' : 'No publicada'}
        </Badge>
      ),
    },
    {
      key: 'habilidad_id',
      field: 'habilidad_id',
      header: 'Habilidad',
      sortable: false,
      filterable: true,
      loadOptions: loadHabilidades,
      render: (rowData: any) =>
        badgeRowTemplate({
          badges: [
            {
              content: { text: rowData?.habilidad?.nombre || '' },
              style: {
                color: '#878EA0',
                fontSize: '12px',
                fontWeight: 'bold',
                lineHeight: '14px',
                padding: '4px 8px',
                borderRadius: '6px',
                backgroundColor: '#E6E8EE',
              },
            },
          ],
        }),
    },
    {
      key: 'createdAt',
      field: 'createdAt',
      header: 'Fecha creación',
      sortable: true,
      render: (rowData) => (
        <Flex>{format(new Date(rowData.createdAt), 'dd/MM/yyy')}</Flex>
      ),
    },
  ];

  //!Render
  return (
    <Flex width="100%" h="100%">
      <PageSidebar
        title="Certificaciones"
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
            onClick: () => navigate('/certificaciones/metricas'),
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{ title: 'Todas las certificaciones' }}
          button={{
            text: 'Crear nueva certificación',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/certificaciones/new'),
          }}
        />

        <OpenTable
          onQueryChange={setQueryString}
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
                .then(() => tableRef?.current?.refreshData())
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
