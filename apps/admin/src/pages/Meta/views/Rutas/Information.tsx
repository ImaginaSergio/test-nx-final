import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useToast } from '@chakra-ui/react';

import { onFailure } from '@clevery-lms/utils';
import { getRutaByID, updateRuta } from '@clevery-lms/data';
import {
  ITab,
  ITabPanel,
  Information,
  ItinerarioList,
  InformationHead,
  InformationLastupdate,
} from '../../../../shared/components';

export default function RutasInformation() {
  const { rutaID } = useParams<any>();

  const [ruta, setRuta] = useState<any>();

  const toast = useToast();

  useEffect(() => {
    refreshState();
  }, [rutaID]);

  const refreshState = async () => {
    if (!rutaID) return;

    let _ruta = await getRutaByID({ id: +rutaID, client: 'admin' });
    setRuta(_ruta);
  };

  const updateValue = (value: any) => {
    if (!rutaID) return;

    return updateRuta({ id: +rutaID, ruta: value, client: 'admin' })
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

  const tabList: ITab[] = [{ title: 'Datos generales', isDisabled: false }];

  const tabPanels: ITabPanel[] = [
    /** Datos generales panel */
    {
      rows: [
        {
          blocks: [<ItinerarioList ruta={ruta} updateRuta={updateValue} />],
        },
      ],
    },
  ];

  const header = [
    <InformationHead
      picture={ruta?.icono}
      title={ruta?.nombre}
      subtitle=""
      nameTitle="nombre"
      updateValueTitle={updateValue}
    />,
    <InformationLastupdate
      created={ruta?.createdAt}
      updated={ruta?.updatedAt}
    />,
  ];

  return (
    <>
      <Information header={header} tabList={tabList} tabPanels={tabPanels} />
    </>
  );
}
