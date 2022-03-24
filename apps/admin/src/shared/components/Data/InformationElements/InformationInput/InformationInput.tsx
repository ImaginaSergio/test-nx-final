import { useContext, useEffect, useState } from 'react';

import { format } from 'date-fns';
import { Flex, Input, Spinner, Icon, Box } from '@chakra-ui/react';

import { AiOutlineCloudSync } from 'react-icons/ai';

import { LoginContext } from '../../../../context';

export interface InformationInputProps {
  name: string;
  label?: string;
  type?: string;
  noHead?: boolean;
  isDisabled?: boolean;
  defaultValue?: any;
  placeholder?: string;
  validator?: string;
  style?: React.CSSProperties;

  updateValue: (e?: any) => any;
  onNullValue?: (e?: any) => any;
}

export const InformationInput = ({
  noHead,
  name,
  label,
  isDisabled,
  defaultValue,
  type = 'text',
  placeholder = '',
  validator,
  style,
  updateValue,
  onNullValue,
}: InformationInputProps) => {
  const [value, setValue] = useState<any>(defaultValue);
  const [isInvalid, setIsInvalid] = useState(false);

  const [update, setUpdate] = useState<'idle' | 'editing' | 'loading'>('idle');
  const [timeoutkey, setTimeoutkey] = useState<any>();

  useEffect(() => {
    if (timeoutkey) {
      clearTimeout(timeoutkey);
      setTimeoutkey(undefined);
    }

    setValue(defaultValue);
  }, [defaultValue]);

  function onChange(event: any) {
    let value = event.target.value;
    if (update === 'idle') setUpdate('editing');

    setIsInvalid(false);
    setValue(value);
  }

  function onBlur() {
    setUpdate('loading');

    function treatValue(_value: string) {
      if ((!_value || _value === '') && onNullValue) return onNullValue();
      else return _value;
    }

    if (validator && !value?.startsWith(validator)) {
      setIsInvalid(true);
      setUpdate('idle');

      return;
    }

    updateValue({ [name]: treatValue(value) })
      .then((res: any) => setUpdate('idle'))
      .catch((error: any) => console.error({ error }));
  }

  return (
    <Flex fontSize="14px" direction="column" style={style}>
      {!noHead && (
        <label className="information-block-label">
          {label}

          {update === 'editing' ? (
            <Icon as={AiOutlineCloudSync} ml="2" size="xs" />
          ) : update === 'loading' ? (
            <Spinner ml="2" size="xs" />
          ) : null}
        </label>
      )}

      <Input
        isInvalid={isInvalid}
        rounded="7px"
        color="#131340"
        value={value}
        border="1px solid #E6E8EE"
        type={type}
        onBlur={onBlur}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isDisabled || update === 'loading'}
      />

      {isInvalid && (
        <Box mt="4px" color="crimson">
          El texto debe empezar por: <i>{validator}</i>
        </Box>
      )}
    </Flex>
  );
};
