import { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import {
  BiBookContent,
  BiBookReader,
  BiListUl,
  BiShow,
  BiTask,
} from 'react-icons/bi';
import { Flex, Icon, useToast, Spinner, Center } from '@chakra-ui/react';

import { onFailure } from '@clevery-lms/utils';
import { ICurso, getCurso, updateCurso } from '@clevery-lms/data';
import { PageHeader, PageSidebar } from '../../../../shared/components';

import { TabTests } from './TabTests';
import { TabInformacion } from './TabInformacion';
import { TabParticipantes } from './TabParticipantes';
import { TabContenido } from './TabContenido/TabContenido';

enum Tab {
  INFORMACION = 'informacion',
  CONTENIDO = 'contenido',
  TESTS = 'tests',
  PARTICIPANTES = 'participantes',
}

export default function CursosInformation() {
  const { cursoID } = useParams<any>();

  const [curso, setCurso] = useState<ICurso>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let hash = (location?.hash || '')?.replaceAll('#', '');

    if (hash === 'contenido') setTab(Tab.CONTENIDO);
    else if (hash === 'tests') setTab(Tab.TESTS);
    else if (hash === 'participantes') setTab(Tab.PARTICIPANTES);
    else setTab(Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [cursoID]);

  const refreshState = async () => {
    if (!cursoID) return;

    let _curso = await getCurso({ id: +cursoID, client: 'admin' });
    setCurso(_curso);
  };

  const updateValue = (value: any) => {
    if (!cursoID) return;

    return updateCurso({ id: +cursoID, curso: value, client: 'admin' })
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
        title={'Ficha del curso'}
        items={[
          {
            icon: BiBookContent,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(`/cursos/${cursoID}#informacion`);
            },
          },
          {
            icon: BiListUl,
            title: 'Contenido',
            isActive: tab === Tab.CONTENIDO,
            onClick: () => {
              setTab(Tab.CONTENIDO);
              navigate(`/cursos/${cursoID}#contenido`);
            },
          },
          {
            icon: BiTask,
            title: 'Tests',
            isActive: tab === Tab.TESTS,
            onClick: () => {
              setTab(Tab.TESTS);
              navigate(`/cursos/${cursoID}#tests`);
            },
          },
          {
            icon: BiBookReader,
            title: 'Participantes',
            isDisabled: true,
            isActive: tab === Tab.PARTICIPANTES,
            onClick: () => {
              setTab(Tab.PARTICIPANTES);
              navigate(`/cursos/${cursoID}#participantes`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{ title: curso?.titulo || '-', image: curso?.imagen?.url }}
          button={{
            text: 'Previsualizar curso',
            leftIcon: <Icon as={BiShow} boxSize="21px" />,
            disabled: true,
            onClick: () => {},
          }}
        />

        {!curso ? (
          <Center boxSize="100%">
            <Spinner w="40px" h="40px" />
          </Center>
        ) : tab === Tab.INFORMACION ? (
          <TabInformacion curso={curso} updateValue={updateValue} />
        ) : tab === Tab.CONTENIDO ? (
          <TabContenido
            curso={curso}
            updateValue={updateValue}
            refreshState={refreshState}
          />
        ) : tab === Tab.TESTS ? (
          <TabTests
            curso={curso}
            updateValue={updateValue}
            refreshState={refreshState}
          />
        ) : (
          <TabParticipantes curso={curso} updateValue={updateValue} />
        )}
      </Flex>
    </Flex>
  );
}
