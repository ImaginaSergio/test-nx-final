import { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { BiEnvelope, BiIdCard, BiRedo, BiTask } from 'react-icons/bi';
import { Flex, useToast, Spinner, Center, Icon } from '@chakra-ui/react';

import { LoginContext } from '../../../../../shared/context';
import { isRoleAllowed, onFailure, onSuccess } from '@clevery-lms/utils';
import { PageHeader, PageSidebar } from '../../../../../shared/components';
import {
  getUserByID,
  IUser,
  resendCredentials,
  updateUser,
  UserRolEnum,
} from '@clevery-lms/data';

import { TabProgreso } from './TabProgreso';
import { TabProyectos } from './TabProyectos';
import { TabEjercicios } from './TabEjercicios';
import { TabInformacion } from './TabInformacion';

enum Tab {
  INFORMACION = 'informacion',
  PROGRESO = 'progreso',
  EJERCICIOS = 'ejercicios',
  PROYECTOS = 'proyectos',
}

export default function AlumnosInformation() {
  const { userID } = useParams<any>();
  const { user } = useContext(LoginContext);

  const [alumno, setAlumno] = useState<IUser>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  const toast = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    let hash = (location?.hash || '')?.replaceAll('#', '');

    setTab(hash || Tab.INFORMACION);
  }, []);

  useEffect(() => {
    refreshState();
  }, [userID]);

  const refreshState = async () => {
    if (!userID) {
      onFailure(
        toast,
        'Error inesperado',
        'El ID de usuario es undefined. Por favor, contacte con soporte.'
      );
      return;
    }

    let _user = await getUserByID({ id: +userID, client: 'admin' });
    setAlumno(_user);
  };

  const updateValue = (value: any) => {
    if (!userID) {
      onFailure(
        toast,
        'Error inesperado',
        'El ID de usuario es undefined. Por favor, contacte con soporte.'
      );
      return;
    }

    return updateUser({ id: +userID, user: value, client: 'admin' })
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
        title="Ficha del alumno"
        items={[
          {
            icon: BiIdCard,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => {
              setTab(Tab.INFORMACION);
              navigate(`/usuarios/${userID}#${Tab.INFORMACION}`);
            },
          },
          {
            icon: BiRedo,
            title: 'Progreso',
            isActive: tab === Tab.PROGRESO,
            onClick: () => {
              setTab(Tab.PROGRESO);
              navigate(`/usuarios/${userID}#${Tab.PROGRESO}`);
            },
          },
          // {
          //   icon: BiBookContent,
          //   title: 'Proyectos',
          //   isActive: tab === Tab.PROYECTOS,
          //   onClick: () => {
          //     setTab(Tab.PROYECTOS);
          //     navigate(`/usuarios/${userID}#proyectos`);
          //   },
          // },
          {
            icon: BiTask,
            title: 'Ejercicios',
            isActive: tab === Tab.EJERCICIOS,
            onClick: () => {
              setTab(Tab.EJERCICIOS);
              navigate(`/usuarios/${userID}#${Tab.EJERCICIOS}`);
            },
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="hidden">
        <PageHeader
          head={{ title: alumno?.username || '-', image: alumno?.avatar?.url }}
          button={{
            text: 'Reenviar credenciales',
            leftIcon: <Icon as={BiEnvelope} boxSize="21px" />,
            disabled: !isRoleAllowed([UserRolEnum.ADMIN], user?.rol),
            onClick: () => {
              resendCredentials({ id: +(userID || 0), client: 'admin' })
                .then(() =>
                  onSuccess(toast, 'Email de credenciales reenviado.')
                )
                .catch(() =>
                  onFailure(
                    toast,
                    'Algo ha fallado',
                    'Contacta con el administrador.'
                  )
                );
            },
          }}
        />

        {!alumno ? (
          <Center boxSize="100%">
            <Spinner w="40px" h="40px" />
          </Center>
        ) : tab === Tab.INFORMACION ? (
          <TabInformacion
            user={alumno}
            updateValue={updateValue}
            refreshState={refreshState}
          />
        ) : tab === Tab.EJERCICIOS ? (
          <TabEjercicios
            user={alumno}
            updateValue={updateValue}
            refreshState={refreshState}
          />
        ) : tab === Tab.PROGRESO ? (
          <TabProgreso
            user={alumno}
            updateValue={updateValue}
            refreshState={refreshState}
          />
        ) : (
          <TabProyectos
            user={alumno}
            updateValue={updateValue}
            refreshState={refreshState}
          />
        )}
      </Flex>
    </Flex>
  );
}
