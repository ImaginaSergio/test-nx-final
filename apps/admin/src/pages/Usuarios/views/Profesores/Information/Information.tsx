import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import { BiEnvelope, BiIdCard } from 'react-icons/bi';
import { Flex, Icon, useToast, Spinner, Center } from '@chakra-ui/react';

import {
  getUserByID,
  IUser,
  resendCredentials,
  updateUser,
  UserRolEnum,
} from '@clevery-lms/data';
import { isRoleAllowed, onFailure, onSuccess } from '@clevery-lms/utils';
import { PageHeader, PageSidebar } from '../../../../../shared/components';

import { TabInformacion } from './TabInformacion';
import { LoginContext } from '../../../../../shared/context';

enum Tab {
  INFORMACION = 'informacion',
}

export default function ProfesoresInformation() {
  const toast = useToast();

  const { userID } = useParams<any>();
  const { user } = useContext(LoginContext);

  const [alumno, setAlumno] = useState<IUser>();
  const [tab, setTab] = useState<any>(Tab.INFORMACION);

  useEffect(() => {
    refreshState();
  }, [userID]);

  const refreshState = async () => {
    if (!userID) return;

    let _user = await getUserByID({ id: +userID, client: 'admin' });
    setAlumno(_user);
  };

  const updateValue = (value: any) => {
    if (!userID) return;

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
        title="Ficha del user"
        items={[
          {
            icon: BiIdCard,
            title: 'Información',
            isActive: tab === Tab.INFORMACION,
            onClick: () => setTab(Tab.INFORMACION),
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
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
        ) : (
          <TabInformacion
            user={alumno}
            updateValue={updateValue}
            refreshState={refreshState}
          />
        )}
      </Flex>
    </Flex>
  );
}
