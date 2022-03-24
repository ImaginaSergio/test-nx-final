import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useToast } from '@chakra-ui/react';

import {
  ITab,
  ITabPanel,
  Information,
  InformationHead,
  InformationSelect,
  InformationLastupdate,
} from '../../../../shared/components';
import { onFailure } from '@clevery-lms/utils';
import { getHabilidadByID, updateHabilidad } from '@clevery-lms/data';

export default function HabilidadesInformation() {
  const { habilidadID } = useParams<any>();

  const [habilidad, setHabilidad] = useState<any>();

  const toast = useToast();

  useEffect(() => {
    refreshState();
  }, [habilidadID]);

  const refreshState = async () => {
    if (!habilidadID) return;

    let _habilidad = await getHabilidadByID({
      id: +habilidadID,
      client: 'admin',
    });

    setHabilidad(_habilidad);
  };

  const updateValue = (value: any) => {
    if (!habilidadID) return;

    return updateHabilidad({
      id: +habilidadID,
      habilidad: value,
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
            <InformationSelect
              name="publicado"
              label="Publicado"
              updateValue={updateValue}
              defaultValue={{
                label: habilidad?.publicado ? 'Publicado' : 'Sin publicar',
                value: habilidad?.publicado,
              }}
              options={[
                { label: 'Publicado', value: true },
                { label: 'Sin publicar', value: false },
              ]}
            />,
          ],
        },
      ],
    },
  ];

  const header = [
    <InformationHead
      title={habilidad?.nombre}
      subtitle=""
      nameTitle="nombre"
      updateValueTitle={updateValue}
    />,
    <InformationLastupdate
      created={habilidad?.createdAt}
      updated={habilidad?.updatedAt}
    />,
  ];

  return (
    <>
      <Information header={header} tabList={tabList} tabPanels={tabPanels} />
    </>
  );
}
