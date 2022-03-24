import { useState, useEffect, useContext } from 'react';

import Select from 'react-select';
import { AiOutlineCloudSync } from 'react-icons/ai';
import { Flex, Icon, Spinner } from '@chakra-ui/react';

import { LoginContext } from '../../../../context';

export const InformationSelect = ({
  name,
  label,
  options,
  style,
  isMulti = false,
  defaultValue = null,
  closeMenuOnSelect = true,
  isSearchable = true,
  isClearable = false,
  isDisabled = false,
  updateValue,
}: any) => {
  const [value, setValue] = useState(defaultValue);

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');

  useEffect(() => {
    setValue({ ...defaultValue });
  }, [defaultValue]);

  const onChange = (e: any) => {
    setUpdate('loading');

    if (isMulti)
      updateValue({ [name]: [...e.map((item: any) => item.value)] }).then((res: any) => {
        setUpdate('idle');
      });
    else if (e !== null)
      updateValue({ [name]: e.value }).then((res: any) => {
        setUpdate('idle');
      });
    else
      updateValue({ [name]: null }).then((res: any) => {
        setUpdate('idle');
      });
  };

  return (
    <Flex direction="column" fontSize="14px" style={style}>
      <label className="information-block-label">
        {label}

        {update === 'editing' ? (
          <Icon as={AiOutlineCloudSync} ml="2" size="xs" />
        ) : update === 'loading' ? (
          <Spinner ml="2" size="xs" />
        ) : null}
      </label>

      <Select
        value={value}
        isMulti={isMulti}
        options={options}
        onChange={onChange}
        styles={selectStyles}
        isClearable={isClearable}
        isSearchable={isSearchable}
        closeMenuOnSelect={closeMenuOnSelect}
        isDisabled={isDisabled || update === 'loading'}
      />
    </Flex>
  );
};

const selectStyles = {
  container: (styles: any, { isDisabled }: any) => ({ ...styles, cursor: isDisabled ? 'not-allowed' : 'default' }),
  singleValue: (styles: any) => ({ ...styles, color: '#131340', fontWeight: 'normal' }),
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  control: (styles: any) => ({
    ...styles,

    border: '1px solid #E6E8EE',
    borderRadius: '7px',
  }),
};
