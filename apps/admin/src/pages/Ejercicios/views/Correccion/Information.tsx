import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { es } from 'date-fns/locale';
import { BiBookContent, BiShow } from 'react-icons/bi';
import { format, intervalToDuration } from 'date-fns';
import { Flex, Icon, useToast, Spinner, Center } from '@chakra-ui/react';

import { TabDetalles } from './TabDetalles';
import { onFailure } from '@clevery-lms/utils';
import { PageHeader, PageSidebar } from '../../../../shared/components';
import {
  IEntregable,
  getEntregableByID,
  updateEntregable,
} from '@clevery-lms/data';

enum Tab {
  DETALLES = 'detalles',
}

export default function CursosInformation() {
  const { ejercicioID } = useParams();

  const [entregable, setEntregable] = useState<IEntregable>();
  const [tab, setTab] = useState<any>(Tab.DETALLES);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    refreshState();
  }, [ejercicioID]);

  const refreshState = async () => {
    if (!ejercicioID) return;

    let _entregable = await getEntregableByID({
      id: +ejercicioID,
      client: 'admin',
    });
    setEntregable(_entregable);
  };

  const updateValue = (value: any) => {
    if (!ejercicioID) return;

    return updateEntregable({
      id: +ejercicioID,
      entregable: value,
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
        title={'Ficha del entregable'}
        items={[
          {
            icon: BiBookContent,
            title: 'Detalles',
            isActive: tab === Tab.DETALLES,
            onClick: () => {
              setTab(Tab.DETALLES);
              navigate(`/ejercicios/${ejercicioID}#detalles`);
            },
          },
        ]}
      />
      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader
          head={{
            title: entregable?.leccion?.titulo || 'Entregable',
            subtitle: `Curso: ${
              entregable?.leccion?.modulo?.curso?.titulo
            }  |  Entregado por: ${
              entregable?.user?.nombre +
              ' ' +
              (entregable?.user?.apellidos || ' ')
            }  |  Fecha de Entrega: ${
              entregable?.createdAt
                ? format(
                    new Date(entregable?.createdAt),
                    'dd LLL yyyy, HH:mm',
                    { locale: es }
                  )
                : 'Sin entregar'
            }  |  Tiempo utilizado:
             ${
               entregable?.fechaEntrega
                 ? intervalToDuration({
                     start: new Date(entregable?.createdAt) || new Date(),
                     end: new Date(entregable?.fechaEntrega) || new Date(),
                   })
                 : 'No disponible'
             }`,
          }}
          button={{
            text: 'Ir a lecci??n del ejercicio',
            leftIcon: <Icon as={BiShow} boxSize="21px" />,
            disabled: true,
            onClick: () => {
              navigate(`/cursos/${entregable?.cursoId}#contenido`);
            },
          }}
        />

        {!entregable ? (
          <Center boxSize="100%">
            <Spinner w="40px" h="40px" />
          </Center>
        ) : tab === Tab.DETALLES ? (
          <TabDetalles entregable={entregable} updateValue={updateValue} />
        ) : null}
      </Flex>
    </Flex>
  );
}
