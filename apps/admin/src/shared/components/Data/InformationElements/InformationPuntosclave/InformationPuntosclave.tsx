import { useEffect, useState } from 'react';

import { BiPlus, BiTrash } from 'react-icons/bi';
import { Flex, Box, Icon } from '@chakra-ui/react';

import { InformationInput } from '..';
import { IPuntoClave } from '@clevery-lms/data';
import {
  addPuntoClave,
  getPuntosClave,
  removePuntoClave,
  updatePuntoClave,
} from '@clevery-lms/data';

export interface InformationPuntosclaveProps {
  leccionId: number;
  isDisabled?: boolean;
}

export const InformationPuntosclave = ({
  leccionId,
  isDisabled,
}: InformationPuntosclaveProps) => {
  const [puntosClave, setPuntosClave] = useState<IPuntoClave[]>([]);

  useEffect(() => {
    if (leccionId) refreshState();
  }, [leccionId]);

  const refreshState = async () => {
    let _puntosClave = await getPuntosClave({
      query: [{ leccion_id: leccionId }, { limit: 100 }],
      client: 'admin',
    });

    setPuntosClave([..._puntosClave]);
  };

  const updateValue = (id?: number, value?: any) => {
    if (!id || !leccionId) return Promise.reject('ID es indefinida');

    return updatePuntoClave({ id, puntoClave: value, client: 'admin' }).then(
      () => refreshState()
    );
  };

  const onNewPuntoclave = () => {
    if (!leccionId) return Promise.reject('ID es indefinida');

    addPuntoClave({
      puntoClave: {
        titulo: 'Nuevo punto clave',
        segundos: 0,
        publicado: true,
        leccionId: leccionId,
      },
    })
      .then((e) => refreshState())
      .catch((error) => console.log({ error }));
  };

  const onRemovePuntoclave = (id?: number) => {
    if (!leccionId || !id) return Promise.reject('ID es indefinida');

    removePuntoClave({ id, client: 'admin' })
      .then((e) => refreshState())
      .catch((error) => console.log({ error }));
  };

  return (
    <Flex w="100%" direction="column" gap="10px">
      <Flex w="100%" direction="column" gap="10px">
        {puntosClave?.length > 0 && (
          <Flex w="100%" gridGap="10px">
            <Box as="label" minW="100px" className="information-block-label">
              Minutos
            </Box>

            <Box as="label" w="100%" className="information-block-label">
              Título
            </Box>

            <Box
              as="label"
              minW="30px"
              w="fit-content"
              className="information-block-label"
            />
          </Flex>
        )}

        {puntosClave
          ?.sort((a, b) => a.segundos - b.segundos)
          ?.map((pc: IPuntoClave) => (
            <Flex w="100%" gridGap="10px">
              <InformationInput
                noHead
                name="segundos"
                style={{ minWidth: '100px' }}
                isDisabled={isDisabled}
                defaultValue={pc.segundos}
                updateValue={(value) => updateValue(pc.id, value)}
              />

              <InformationInput
                noHead
                name="titulo"
                style={{ width: '100%' }}
                isDisabled={isDisabled}
                defaultValue={pc.titulo}
                updateValue={(value) => updateValue(pc.id, value)}
              />

              <Icon
                as={BiTrash}
                minW="21px"
                h="40px"
                cursor="pointer"
                onClick={() => onRemovePuntoclave(pc.id)}
              />
            </Flex>
          ))}
      </Flex>

      <Flex
        align="center"
        fontSize="13px"
        fontWeight="medium"
        cursor={leccionId ? 'pointer' : 'not-allowed'}
        _hover={leccionId ? { fontWeight: 'semibold' } : undefined}
        onClick={leccionId ? onNewPuntoclave : undefined}
      >
        <Icon as={BiPlus} boxSize="21px" />
        Añadir punto clave
      </Flex>
    </Flex>
  );
};
