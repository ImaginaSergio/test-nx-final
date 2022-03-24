import { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

import { Flex, Icon, useToast, Spinner, Center } from '@chakra-ui/react';
import { BiBookContent, BiBookReader, BiCog, BiShow } from 'react-icons/bi';

import { IEmpresa } from '@clevery-lms/data';
import { onFailure } from '@clevery-lms/utils';
import { getEmpresa, updateEmpresa } from '@clevery-lms/data';
import { PageHeader, PageSidebar } from '../../../../../shared/components';

import { TabVacantes } from './TabVacantes';
import { TabInformacion } from './TabInformacion';
import { TabConfiguracion } from './TabConfiguracion';

enum Tab {
  INFORMACION = 'informacion',
  VACANTES = 'vacantes',
  CONFIGURACION = 'configuracion',
}

export default function EmpresasInformation() {
  const { empresaID } = useParams<any>();

  const [empresa, setEmpresa] = useState<IEmpresa>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let hash = (location?.hash || '')?.replaceAll('#', '');

    if (hash === 'vacantes') setTab(Tab.VACANTES);
    else if (hash === 'configuracion') setTab(Tab.CONFIGURACION);
    else setTab(Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [empresaID]);

  const refreshState = async () => {
    if (!empresaID) return;

    let _empresa = await getEmpresa({ id: +empresaID, client: 'admin' });
    setEmpresa(_empresa);
  };

  const updateValue = (value: any) => {
    if (!empresaID) return;

    return updateEmpresa({ id: +empresaID, empresa: value, client: 'admin' })
      .then(async (msg: any) => {
        await refreshState();

        return msg;
      })
      .catch((error: any) => {
        console.error('Todo fue mal D:', { error });
        onFailure(toast, error.title, error.message);

        return error;
      });
  };

  return (
    <Flex width="100%" h="100%">
      <PageSidebar
        title="Ficha de la empresa"
        items={[
          {
            icon: BiBookContent,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(`/clientes/empresas/${empresaID}#informacion`);
            },
          },
          {
            icon: BiBookReader,
            title: 'Vacantes',
            isDisabled: true,
            isActive: tab === Tab.VACANTES,
            onClick: () => {
              setTab(Tab.VACANTES);
              navigate(`/clientes/empresas/${empresaID}#vacantes`);
            },
          },
          {
            icon: BiCog,
            title: 'Configuración',
            isActive: tab === Tab.CONFIGURACION,
            onClick: () => {
              setTab(Tab.CONFIGURACION);
              navigate(`/clientes/empresas/${empresaID}#configuracion`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{ title: empresa?.nombre || '-' }}
          button={{
            text: 'Previsualizar empresa',
            leftIcon: <Icon as={BiShow} boxSize="21px" />,
            disabled: true,
            onClick: () => {},
          }}
        />

        {!empresa ? (
          <Center boxSize="100%">
            <Spinner w="40px" h="40px" />
          </Center>
        ) : tab === Tab.INFORMACION ? (
          <TabInformacion empresa={empresa} updateValue={updateValue} />
        ) : tab === Tab.VACANTES ? (
          <TabVacantes empresa={empresa} updateValue={updateValue} />
        ) : (
          <TabConfiguracion empresa={empresa} updateValue={updateValue} />
        )}
      </Flex>
    </Flex>
  );
}
