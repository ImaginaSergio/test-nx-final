import { useState } from 'react';

import { Field } from 'formik';
import AsyncSelect from 'react-select/async';

import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';

export const FormAsyncSelect = ({
  name,
  label,
  loadOptions,
  placeholder,
  isMulti = false,
  defaultValue,
  closeMenuOnSelect = true,
  isSearchable = true,
  isClearable = false,
  controlStyle = {},
  isDisabled = false,
  onChangeCallback = (e: any) => {},
}: any) => {
  const [inputValue, setInputValue] = useState('');

  const onChange = (e: any, form: any) => {
    if (isMulti) form.setFieldValue(name, [...e.map((item: any) => item.value)]);
    else form.setFieldValue(name, e !== null ? e.value : null);

    if (onChangeCallback) onChangeCallback(e);
  };

  const _loadOptions = (inputValue: any) => {
    if (!inputValue) return [];

    return loadOptions(inputValue);
  };

  return (
    <Field name={name}>
      {({ form }: { field: any; form: any }) => (
        <FormControl style={controlStyle} isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="form-label" htmlFor={name}>
            {label}
          </FormLabel>

          <AsyncSelect
            isMulti={isMulti}
            styles={selectStyles}
            isDisabled={isDisabled}
            isClearable={isClearable}
            placeholder={placeholder}
            loadOptions={_loadOptions}
            isSearchable={isSearchable}
            defaultValue={defaultValue}
            onInputChange={setInputValue}
            onChange={(e) => onChange(e, form)}
            closeMenuOnSelect={closeMenuOnSelect}
            noOptionsMessage={() => (inputValue !== '' ? 'No se encuentran resultados' : 'Escribe para mostrar opciones...')}
          />
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const selectStyles = {
  noOptionsMessage: (styles: any) => ({ ...styles, fontSize: '16px', textAlign: 'left' }),
  singleValue: (styles: any) => ({ ...styles, color: '#131340', fontWeight: 'normal' }),
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  control: (styles: any, { isDisabled }: any) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'default',
    border: '1px solid #EBE8F0',
    borderRadius: '4px',
  }),
};
