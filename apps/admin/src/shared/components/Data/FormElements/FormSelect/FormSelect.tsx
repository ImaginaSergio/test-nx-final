import { useEffect, useState } from 'react';

import { Field } from 'formik';
import Select from 'react-select';
import { FormLabel, FormControl, FormErrorMessage } from '@chakra-ui/react';

export const FormSelect = ({
  name,
  label,
  options,
  placeholder,
  isMulti = false,
  defaultValue,
  isSearchable = true,
  isDisabled = false,
  isClearable = false,
  controlStyle = {},
  isOptionDisabled,
  style = {},
}: any) => {
  const [_value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const onChange = (e: any, form: any) => {
    if (isMulti) form.setFieldValue(name, [...e.map((item: any) => item.value)]);
    else form.setFieldValue(name, e !== null ? e.value : null);
  };

  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl style={controlStyle} isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="form-label" htmlFor={name}>
            {label}
          </FormLabel>

          <Select
            name={name}
            isMulti={isMulti}
            options={options}
            styles={selectStyles}
            isDisabled={isDisabled}
            isClearable={isClearable}
            placeholder={placeholder}
            isSearchable={isSearchable}
            closeMenuOnSelect={!isMulti}
            isOptionDisabled={isOptionDisabled}
            onChange={(option: any) => onChange(option, form)}
            value={options ? options.find((option: any) => option.value === field.value) || null : ''}
          />
          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const selectStyles = {
  singleValue: (styles: any) => ({ ...styles, color: '#131340', fontWeight: 'normal' }),
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  control: (styles: any, { isDisabled }: any) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'default',
    border: '1px solid #EBE8F0',
    borderRadius: '4px',
  }),
};
