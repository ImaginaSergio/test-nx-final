import { useContext } from 'react';

import { Flex, Box, useToast } from '@chakra-ui/react';

import { onFailure } from '@clevery-lms/utils';
import { PerfilSelect } from '../../components';
import { updateProgresoGlobal, getUserByID } from '@clevery-lms/data';
import {
  LoginContext,
  ProgresoGlobalContext,
  RoadmapContext,
} from '../../../../shared/context';

export const TabRuta = () => {
  const toast = useToast();

  const { user, setUser } = useContext(LoginContext);
  const { ruta, setRuta } = useContext(RoadmapContext);
  const { progresoGlobal } = useContext(ProgresoGlobalContext);

  const handleOnRoadmapChange = (event: any) => {
    if (!progresoGlobal?.id) {
      onFailure(
        toast,
        'Error inesperado',
        'Por favor, actualize la página y contacte con soporte si el error persiste.'
      );
      return Promise.reject();
    }

    return updateProgresoGlobal({
      id: progresoGlobal?.id,
      progresoGlobal: { rutaId: event },
    })
      .then(async (res) => {
        const dataUser = await getUserByID({ id: user?.id || 0 });

        if (!dataUser.isAxiosError) {
          setUser({ ...dataUser });
          setRuta(
            dataUser?.progresoGlobal?.ruta
              ? { ...dataUser.progresoGlobal?.ruta }
              : null
          );
        } else console.error({ error: dataUser });
      })
      .catch((err) => console.error({ err }));
  };

  return (
    <Flex direction="column">
      <Box fontSize="18px" fontWeight="bold" mb="27.5px">
        Hoja de ruta
      </Box>

      <PerfilSelect
        name="ruta_id"
        label="Hoja de ruta activa"
        onChange={handleOnRoadmapChange}
        placeholder="Escoge tu nueva hoja de ruta"
        isDisabled={process.env.REACT_APP_EDIT_ROADMAP === 'FALSE'}
        defaultValue={
          [11, 12, 13, 14].includes(+(ruta?.id || 0))
            ? { label: ruta?.nombre, value: ruta?.id }
            : undefined
        }
        options={[
          { label: 'FrontEnd', value: 11 },
          { label: 'BackEnd', value: 12 },
          { label: 'FullStack', value: 13 },
          { label: 'De 0 a Dev', value: 14 },
        ]}
      />
    </Flex>
  );
};
