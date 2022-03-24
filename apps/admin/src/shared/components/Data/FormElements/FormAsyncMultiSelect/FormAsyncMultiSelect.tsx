import { useState } from 'react';

import { Field } from 'formik';
import AsyncSelect from 'react-select/async';

import { BiX } from 'react-icons/bi';
import { FormLabel, FormControl, FormErrorMessage, Badge, Box, Center, Flex, Icon } from '@chakra-ui/react';

export type FormAsyncMultiSelectProps = {
  name: string;
  label?: string;
  loadOptions: any;
  placeholder?: string;
  defaultValue?: any[];
  isDisabled?: boolean;
};

export const FormAsyncMultiSelect = ({
  name,
  label,
  loadOptions,
  placeholder,
  defaultValue,
  isDisabled = false,
}: FormAsyncMultiSelectProps) => {
  const [inputValue, setInputValue] = useState<string>('');

  const onChange = (event: any, form: any) => {
    form.setFieldValue(name, [...event]);
  };

  const removeTag = (index: number, current: any, form: any) => {
    form.setFieldValue(
      name,
      [...current]?.filter((t, i) => i !== index)
    );
  };

  const _loadOptions = (inputValue: any) => {
    if (!inputValue) return [];

    return loadOptions(inputValue);
  };

  return (
    <Field name={name}>
      {({ form, field }: { field: any; form: any }) => (
        <FormControl isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="form-label" htmlFor={name}>
            {label}
          </FormLabel>

          <AsyncSelect
            isMulti
            isDisabled={isDisabled}
            placeholder={placeholder}
            loadOptions={_loadOptions}
            defaultValue={defaultValue}
            onInputChange={setInputValue}
            onChange={(e) => onChange(e, form)}
            styles={{ ...selectStyles, multiValue: (styles: any) => ({ ...styles, display: 'none' }) }}
            noOptionsMessage={() => (inputValue !== '' ? 'No se encuentran resultados' : 'Escribe para mostrar opciones...')}
          />

          <Flex wrap="wrap" pt="10px" gridGap="10px">
            {field?.value?.map((item: { label: string; value: any; meta: any }, index: number) => (
              <Badge
                display="flex"
                p="7px 12px"
                gridGap="8px"
                rounded="10px"
                key={`info-item-${index}`}
                bg="#e8e8e8"
                color="#a5a5a5"
              >
                <Box fontSize="14px" fontWeight="medium">
                  {item.label}
                </Box>

                <Icon as={BiX} boxSize="21px" cursor="pointer" onClick={(e) => removeTag(index, field.value, form)} />
              </Badge>
            ))}
          </Flex>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};

const selectStyles = {
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  singleValue: (styles: any) => ({ ...styles, color: '#131340', fontWeight: 'normal' }),
  noOptionsMessage: (styles: any) => ({ ...styles, fontSize: '14px', fontWeight: 'medium', textAlign: 'left' }),
  dropdownIndicator: (styles: any) => ({ ...styles, color: 'grey_6' }),
  control: (styles: any, { isDisabled }: any) => ({
    ...styles,
    cursor: isDisabled ? 'not-allowed' : 'default',
    border: '1px solid #EBE8F0',
    borderRadius: '4px',
    backgroundColor: 'var(--chakra-colors-grey_1)',
  }),
};
