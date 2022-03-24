import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import stc from 'string-to-color';
import { BiBookContent, BiPlus, BiBuildings } from 'react-icons/bi';
import { useToast, useDisclosure, Flex, Icon, Badge } from '@chakra-ui/react';

import { format } from 'date-fns/esm';
import { ICertificacion } from '@clevery-lms/data';
import { OpenColumn, OpenTable } from '@clevery-lms/ui';
import { removeCertificacion } from '@clevery-lms/data';
import { onFailure, onSuccess_Undo } from '@clevery-lms/utils';
import { getHabilidades, getItem, getProcesos } from '@clevery-lms/data';
import { LoginContext, QueryContext } from '../../../../shared/context';
import {
  ColumnSettings,
  checkColumn,
  DeleteModal,
  PageSidebar,
  PageHeader,
} from '../../../../shared/components';

export default function VacantesTable() {
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

    getProcesosBy(queryContext).then((res) => {
      setData(res?.data || []);
      setPaginationData(res?.meta);
    });
    if (_page !== 'certificaciones') {
      // Con inicializar un valor es suficiente para empezar el ciclo.
      setNombre('');
    } else {
      setNombre(_query.get('nombre') || '');
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    getProcesosBy({ page: currentPage }, queryString)
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
    navigate('/clientes/vacantes/' + e.id || '');

  const getProcesosBy = async (params: any, query: string = '') => {
    let page = params.page !== undefined ? params.page : 1;

    let auxQuery = query.split('&').map((item) => {
      let split = item.split('=');
      return { [split[0]]: split[1] };
    });

    let _query = [{ ...auxQuery, page: page }];

    return await getProcesos({ query: _query, client: 'admin' });
  };

  //?Columnas
  const columns: OpenColumn[] = [
    {
      key: 'titulo',
      field: 'titulo',
      header: 'Título',
      sortable: true,
      filterable: true,
    },
    {
      key: 'remoto',
      field: 'remoto',
      header: 'Presencialidad',
      sortable: true,
      filterable: true,
      options: [
        { label: 'Presencial', value: 'presencial' },
        { label: 'Remoto', value: 'remoto' },
        { label: 'Mixto', value: 'mixto' },
      ],
      render: (rowData) => (
        <Badge
          rounded="7px"
          color={rowData.remoto ? 'white' : 'black'}
          bg={stc(rowData.remoto)}
        >
          {rowData.remoto}
        </Badge>
      ),
    },
    {
      key: 'createdAt',
      field: 'createdAt',
      header: 'Fecha creación',
      sortable: true,
      render: (rowData) => (
        <Flex>{format(new Date(rowData.createdAt), 'dd/MM/yyyy')}</Flex>
      ),
    },
  ];

  //!Render
  return (
    <Flex width="100%" h="100%">
      <PageSidebar
        title={'Clientes'}
        items={[
          {
            icon: BiBookContent,
            title: 'Vacantes',
            isActive: true,
            onClick: () => navigate('/clientes/vacantes'),
          },
          {
            icon: BiBuildings,
            title: 'Empresas',
            isActive: false,
            onClick: () => navigate('/clientes/empresas'),
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{ title: 'Todas las vacantes' }}
          button={{
            text: 'Crear nueva vacante',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/clientes/vacantes/new'),
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
