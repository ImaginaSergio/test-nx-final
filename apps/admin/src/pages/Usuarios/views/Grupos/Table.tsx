import { useRef, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import { useToast, useDisclosure, Flex, Icon, Badge } from '@chakra-ui/react';
import {
  BiBookContent,
  BiBarChartAlt2,
  BiPlus,
  BiBuildings,
  BiGroup,
} from 'react-icons/bi';

import {
  ColumnSettings,
  checkColumn,
  badgeRowTemplate,
  DeleteModal,
  PageSidebar,
  PageHeader,
} from '../../../../shared/components';
import { getHabilidades, getItem, getGrupos } from '@clevery-lms/data';
import { ICertificacion } from '@clevery-lms/data';
import { onFailure, onSuccess_Undo } from '@clevery-lms/utils';
import { LoginContext, QueryContext } from '../../../../shared/context';
import { getCertificaciones, removeCertificacion } from '@clevery-lms/data';

import { format } from 'date-fns/esm';
import { OpenColumn, OpenTable } from '@clevery-lms/ui';
import stc from 'string-to-color';

export default function GruposTable() {
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

    getGruposBy(queryContext).then((res) => {
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
    getGruposBy({ page: currentPage }, queryString)
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
    navigate('/usuarios/grupos/' + e.id || '');

  const getGruposBy = async (params: any, query: string = '') => {
    let page = params.page !== undefined ? params.page : 1;

    let auxQuery = query.split('&').map((item) => {
      let split = item.split('=');
      return { [split[0]]: split[1] };
    });

    let _query = [{ ...auxQuery, page: page }];

    return await getGrupos({ query: _query, client: 'admin' });
  };

  //?Columnas
  const columns: OpenColumn[] = [
    {
      key: 'id',
      field: 'id',
      header: 'ID',
      sortable: true,
    },
    {
      key: 'nombre',
      field: 'nombre',
      header: 'Nombre',
      sortable: true,
      filterable: true,
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
        title={'Usuarios'}
        items={[
          {
            icon: BiBookContent,
            title: 'Alumnos',
            isActive: false,
            onClick: () => navigate('/usuarios'),
          },
          {
            icon: BiGroup,
            title: 'Grupos',
            isActive: true,
            onClick: () => navigate('/usuarios/grupos'),
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{ title: 'Todas las grupos' }}
          button={{
            text: 'Crear nueva grupo',
            leftIcon: <Icon as={BiPlus} boxSize="21px" />,
            onClick: () => navigate('/usuarios/grupos/new'),
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