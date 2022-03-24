import { useContext, useState } from 'react';

import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { BiPlus } from 'react-icons/bi';
import { Box, Button, Flex, Icon, useDisclosure } from '@chakra-ui/react';

import { isRoleAllowed } from '@clevery-lms/utils';
import { LoginContext } from '../../../../../shared/context';
import { ICurso, IGrupo, UserRolEnum } from '@clevery-lms/data';
import {
  InformationTable,
  textRowTemplate,
} from '../../../../../shared/components';
import CertificacionesGruposModal from '../../../components/CertificacionesGruposModal';

type TabCertificacionesProps = {
  grupo: IGrupo;
  updateValue: (value: any) => void;
  refreshState: () => void;
};

export const TabCertificaciones = ({
  grupo,
  updateValue,
  refreshState,
}: TabCertificacionesProps) => {
  const [certificacionSelected, setCertificacionSelected] = useState<ICurso>();

  const { user } = useContext(LoginContext);
  const { isOpen, onOpen, onClose } = useDisclosure();

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
          Listado de certificaciones
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Listado de los certificaciones asociados al grupo, accesibles para
          todos los alumnos dentro de este.
        </Box>
      </Flex>

      <Flex direction="column" w="100%">
        <Flex
          minH="fit-content"
          w="100%"
          gridGap="8px"
          justify="space-between"
          align="center"
        >
          <Box fontSize="15px" fontWeight="medium">
            Listado de certificaciones
          </Box>

          <Button
            leftIcon={<Icon as={BiPlus} boxSize="21px" />}
            onClick={onOpen}
            isDisabled={isRoleAllowed([UserRolEnum.SUPERVISOR], user?.rol)}
          >
            Añadir certificación
          </Button>
        </Flex>

        <InformationTable
          data={grupo?.certificaciones}
          style={{ width: '100%' }}
          onRowClick={(row) => {
            setCertificacionSelected(row?.data);
            onOpen();
          }}
          columns={[
            {
              field: 'certificacion',
              header: 'Certificación asociada',
              body: (rowData: any) =>
                textRowTemplate({
                  content: {
                    text: rowData?.nombre,
                    subtext: 'Nivel ' + rowData?.nivel,
                  },
                  prefix: { svg: rowData?.icono },
                }),
            },
            {
              field: 'fecha_inicio',
              header: 'Fecha de subida',
              body: (rowData: any) =>
                textRowTemplate({
                  content: {
                    text: format(
                      new Date(rowData?.meta?.pivot_fecha_inicio),
                      'dd LLL yyyy',
                      { locale: es }
                    ),
                  },
                }),
            },
            {
              field: 'fecha_fin',
              header: 'Fecha de subida',
              body: (rowData: any) =>
                textRowTemplate({
                  content: {
                    text: format(
                      new Date(rowData?.meta?.pivot_fecha_fin),
                      'dd LLL yyyy',
                      { locale: es }
                    ),
                  },
                }),
            },
          ]}
        />
      </Flex>

      <CertificacionesGruposModal
        grupo={grupo}
        defaultValue={certificacionSelected}
        state={{
          isOpen,
          onOpen,
          onClose: () => {
            onClose();
            refreshState();
            setCertificacionSelected(undefined);
          },
        }}
      />
    </Flex>
  );
};
