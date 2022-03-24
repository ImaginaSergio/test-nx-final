import { useEffect, useState } from 'react';

import AsyncSelect from 'react-select/async';
import { BiX, BiCheck } from 'react-icons/bi';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { Flex, Badge, Icon, Spinner, Box, Center } from '@chakra-ui/react';

import { IHabilidad } from '@clevery-lms/data';

import './InformationHabilidades.scss';

type InformationHabilidadesProps = {
  label?: string;
  loadOptions: any;
  isDisabled?: boolean;
  defaultValue: any;
  updateValue: (e?: any) => any | void;
  style?: React.CSSProperties;
};

export const InformationHabilidades = ({
  label = 'Habilidades',
  defaultValue,
  style,
  loadOptions,
  isDisabled,
  updateValue,
}: InformationHabilidadesProps) => {
  const [_habilidades, setHabilidades] = useState(
    defaultValue.map((habilidad: any) => ({
      ...habilidad,
      value: habilidad.id,
      label: habilidad.nombre,
    }))
  );

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    setHabilidades(
      defaultValue.map((habilidad: any) => ({
        ...habilidad,
        value: habilidad.id,
        label: habilidad.nombre,
      }))
    );
  }, [defaultValue]);

  const onChange = (event: any) => {
    if (event.length < _habilidades?.length) return;

    setUpdate('loading');

    let habilidadesResponse: any = {};
    let newHabilidades = [...event]?.map((habilidad: IHabilidad, i: number) => {
      if (!habilidad.id) return undefined;

      habilidadesResponse[habilidad.id + ''] = {
        nivel: habilidad?.meta?.pivot_nivel || 1,
      };
      return habilidad;
    });

    setHabilidades(newHabilidades?.filter((i) => i));
    updateValue({ habilidades: habilidadesResponse }).then((res: any) =>
      setUpdate('idle')
    );
  };

  const removeTag = (index: number) => {
    setUpdate('loading');

    let habilidadesResponse: any = {};
    let newHabilidades = [..._habilidades]?.map(
      (habilidad: IHabilidad, i: number) => {
        if (!habilidad.id) return habilidad;
        if (i === index) return undefined;

        habilidadesResponse[habilidad.id + ''] = {
          nivel: habilidad.meta.pivot_nivel,
        };
        return habilidad;
      }
    );

    setHabilidades(newHabilidades.filter((t) => t));
    updateValue({ habilidades: habilidadesResponse }).then((res: any) =>
      setUpdate('idle')
    );
  };

  const updateLevel = (index: number) => {
    setUpdate('loading');

    let habilidadesResponse: any = {};
    let newHabilidades = [..._habilidades]?.map(
      (habilidad: IHabilidad, i: number) => {
        if (!habilidad.id) return undefined;

        if (i === index) {
          let newLevel =
            habilidad.meta.pivot_nivel === 3
              ? 1
              : habilidad.meta.pivot_nivel + 1;

          habilidadesResponse[habilidad.id + ''] = { nivel: newLevel };
          habilidad.meta.pivot_nivel = newLevel;

          return habilidad;
        } else {
          habilidadesResponse[habilidad.id + ''] = {
            nivel: habilidad.meta.pivot_nivel,
          };
          return habilidad;
        }
      }
    );

    setHabilidades(newHabilidades?.filter((t) => t));
    updateValue({ habilidades: habilidadesResponse }).then((res: any) =>
      setUpdate('idle')
    );
  };

  const _loadOptions = (inputValue: any) => {
    if (!inputValue) return [];

    return loadOptions(inputValue);
  };

  return (
    <Flex w="100%" direction="column" fontSize="14px" style={style}>
      <label className="information-block-label">
        {label}

        {update === 'editing' ? (
          <Icon as={AiOutlineCloudSync} ml="2" size="xs" />
        ) : update === 'loading' ? (
          <Spinner ml="2" size="xs" />
        ) : null}
      </label>

      <div>
        <AsyncSelect
          isMulti
          isSearchable
          value={_habilidades}
          menuPlacement="top"
          isClearable={false}
          onChange={onChange}
          loadOptions={_loadOptions}
          isDisabled={update === 'loading' || isDisabled}
          styles={{
            ...reactSelectStyles,
            multiValue: (styles: any) => ({ ...styles, display: 'none' }),
          }}
        />

        <Flex wrap="wrap" pt="10px" gridGap="10px">
          {_habilidades?.data?.map(
            (
              habilidad: { label: string; value: any; meta: any },
              index: number
            ) => (
              <Badge
                display="flex"
                p="7px 12px"
                gridGap="8px"
                rounded="10px"
                key={`info-habilidades-${index}`}
                bg={habilidad.meta.pivot_nivel ? '#D3FDF8' : '#e8e8e8'}
                color={habilidad.meta.pivot_nivel ? '#31B9A9' : '#a5a5a5'}
              >
                <Box fontSize="14px" fontWeight="medium">
                  {habilidad.label}
                </Box>

                <Flex w="fit-content" gridGap="4px" align="center">
                  <Icon
                    as={BiX}
                    boxSize="21px"
                    cursor="pointer"
                    onClick={(e) => removeTag(index)}
                  />

                  <Center
                    w="fit-content"
                    h="21px"
                    rounded="50%"
                    cursor="pointer"
                    onClick={(e) => updateLevel(index)}
                    title={
                      habilidad.meta.pivot_nivel === 1
                        ? 'Nivel Inicial'
                        : habilidad.meta.pivot_nivel === 2
                        ? 'Nivel Intermedio'
                        : habilidad.meta.pivot_nivel === 3
                        ? 'Nivel avanzado'
                        : 'Sin definir'
                    }
                  >
                    {habilidad.meta.pivot_nivel === 1
                      ? 'Ini.'
                      : habilidad.meta.pivot_nivel === 2
                      ? 'Inter.'
                      : habilidad.meta.pivot_nivel === 3
                      ? 'Av.'
                      : 'Sin definir'}
                  </Center>
                </Flex>
              </Badge>
            )
          )}
        </Flex>
      </div>
    </Flex>
  );
};

const reactSelectStyles = {
  control: (styles: any) => ({
    ...styles,
    backgroundColor: 'white',
    border: '1px solid #E7E7E7',
  }),
  singleValue: (styles: any) => ({ ...styles, color: '#273360' }),
  placeholder: (styles: any) => ({
    ...styles,
    color: '#DDDDDD',
    fontSize: '14px',
  }),
  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
  dropdownIndicator: (styles: any) => ({ ...styles, color: '#DBDBDB' }),
  option: (styles: any, { isFocused }: any) => {
    return {
      ...styles,
      backgroundColor: isFocused ? '#E8EDFF' : 'white',
      color: '#131340',
      fontSize: '14px',
    };
  },
};
