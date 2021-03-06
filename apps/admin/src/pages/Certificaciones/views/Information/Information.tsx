import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

import { BiBookContent, BiShow, BiTask } from 'react-icons/bi';
import { Flex, Icon, useToast, Spinner, Center } from '@chakra-ui/react';

import { onFailure } from '@clevery-lms/utils';
import { ICertificacion } from '@clevery-lms/data';
import { PageHeader, PageSidebar } from '../../../../shared/components';
import { getCertificacionByID, updateCertificacion } from '@clevery-lms/data';

import { TabExamenes } from './TabExamenes';
import { TabInformacion } from './TabInformacion';

enum Tab {
  INFORMACION = 'informacion',
  EXAMENES = 'examenes',
}

export default function CursosInformation() {
  const { certificacionID } = useParams();

  const [certificacion, setCertificacion] = useState<ICertificacion>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let hash = (location?.hash || '')?.replaceAll('#', '');

    if (hash === 'examenes') setTab(Tab.EXAMENES);
    else setTab(Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [certificacionID]);

  const refreshState = async () => {
    if (!certificacionID) return;

    let _certificacion = await getCertificacionByID({
      id: +certificacionID,
      client: 'admin',
    });
    setCertificacion(_certificacion);
  };

  const updateValue = (value: any) => {
    if (!certificacionID) return;

    return updateCertificacion({
      id: +certificacionID,
      certificacion: value,
      client: 'admin',
    })
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
        title={'Ficha de la certificación'}
        items={[
          {
            icon: BiBookContent,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(`/certificaciones/${certificacionID}#informacion`);
            },
          },
          {
            icon: BiTask,
            title: 'Exámenes',
            isActive: tab === Tab.EXAMENES,
            onClick: () => {
              setTab(Tab.EXAMENES);
              navigate(`/certificaciones/${certificacionID}#examenes`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{
            title: certificacion?.nombre || '-',
            image: certificacion?.imagen?.url,
          }}
          button={{
            text: 'Previsualizar certificación',
            leftIcon: <Icon as={BiShow} boxSize="21px" />,
            disabled: true,
            onClick: () => {},
          }}
        />

        {!certificacion ? (
          <Center boxSize="100%">
            <Spinner w="40px" h="40px" />
          </Center>
        ) : tab === Tab.INFORMACION ? (
          <TabInformacion
            certificacion={certificacion}
            updateValue={updateValue}
          />
        ) : tab === Tab.EXAMENES ? (
          <TabExamenes certificacion={certificacion} />
        ) : null}
      </Flex>
    </Flex>
  );
}
