import { useEffect, useState } from 'react';

import { Box, Flex, useToast } from '@chakra-ui/react';

import { onFailure } from '@clevery-lms/utils';
import { IProceso, IRuta, getRutaByID, updateRuta } from '@clevery-lms/data';
import {
  InformationInput,
  ItinerarioList,
} from '../../../../../shared/components';

type TabRutaProps = {
  proceso: IProceso;
  updateValue: (value: any) => void;
};

export const TabRuta = ({ proceso, updateValue }: TabRutaProps) => {
  const toast = useToast();
  const [ruta, setRuta] = useState<IRuta>();

  useEffect(() => {
    refreshState();
  }, [proceso?.rutaId]);

  const refreshState = async () => {
    if (!proceso?.rutaId) {
      setRuta(undefined);
    } else {
      let _ruta = await getRutaByID({ id: proceso.rutaId, client: 'admin' });
      setRuta(_ruta);
    }
  };

  const updateRutaValue = (value: any) => {
    if (!ruta?.id) return;

    return updateRuta({ id: ruta?.id, ruta: value, client: 'admin' })
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
    <Flex
      direction="column"
      p="30px"
      boxSize="100%"
      gridRowGap="30px"
      overflow="overlay"
    >
      <Flex minH="fit-content" w="100%" direction="column" gridRowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Hoja de ruta del proceso
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre el proceso, como el título del mismo, descripción,
          logotipo, etc...
        </Box>
      </Flex>

      <Flex direction="column" gridGap="30px" w="100%">
        <InformationInput
          name="nombre"
          label="Titulo de la hoja de ruta"
          defaultValue={ruta?.nombre}
          updateValue={updateRutaValue}
          style={{ width: '100%' }}
        />

        <ItinerarioList ruta={ruta} updateRuta={updateRutaValue} />
      </Flex>
    </Flex>
  );
};
