import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useToast } from '@chakra-ui/react';

import {
  ITab,
  ITabPanel,
  Information,
  InformationMde,
  InformationHead,
  InformationLastupdate,
} from '../../../../shared/components';
import { onFailure } from '@clevery-lms/utils';
import { getPlantilla, updatePlantilla } from '@clevery-lms/data';

export default function PlantillasInformation() {
  const { plantillaID } = useParams<any>();

  const [plantilla, setPlantilla] = useState<any>();

  const toast = useToast();

  useEffect(() => {
    refreshState();
  }, [plantillaID]);

  const refreshState = async () => {
    if (!plantillaID) return;

    let _plantilla = await getPlantilla({ id: +plantillaID, client: 'admin' });

    setPlantilla(_plantilla);
  };

  const updateValue = (value: any) => {
    if (!plantillaID) return;

    return updatePlantilla({
      id: +plantillaID,
      plantilla: value,
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

  const tabList: ITab[] = [{ title: 'Datos generales', isDisabled: false }];

  const tabPanels: ITabPanel[] = [
    /** Datos generales panel */
    {
      rows: [
        {
          blocks: [
            <InformationMde
              name="contenido"
              label="Contenido"
              updateValue={updateValue}
              defaultValue={plantilla?.contenido}
            />,
          ],
        },
      ],
    },
  ];

  const header = [
    <InformationHead
      title={plantilla?.titulo}
      subtitle=""
      nameTitle="titulo"
      updateValueTitle={updateValue}
    />,
    <InformationLastupdate
      created={plantilla?.createdAt}
      updated={plantilla?.updatedAt}
    />,
  ];

  return (
    <>
      <Information header={header} tabList={tabList} tabPanels={tabPanels} />
    </>
  );
}
