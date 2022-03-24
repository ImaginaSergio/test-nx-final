import React from 'react';

import { Field } from 'formik';
import { FormLabel, FormControl, FormErrorMessage, RadioGroup, Radio, Text, Flex, Icon, Box, Checkbox } from '@chakra-ui/react';

type FormCheckboxProps = {
  inputRef?: any;
  name: string;
  label?: string;
  onBlur?: Function;
  labelColor?: string;
  controlStyle?: React.CSSProperties;
};

export const StepsFormCheckbox = ({ name, label, controlStyle = {}, labelColor }: FormCheckboxProps) => {
  const onChange = (value: any, form: any) => {
    form.setFieldValue(name, value);
  };

  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl style={controlStyle} isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="form-label" htmlFor={name} color={labelColor || 'black'}>
            {label}
          </FormLabel>

          <Checkbox {...field} isChecked={field.value || false} onChange={(e) => onChange(e.target.checked, form)}>
            Acepto la{' '}
            <Box as="a" textDecoration="underline" href="https://open-bootcamp.com/politica-privacidad" target="_blank">
              política de privacidad
            </Box>
            .
          </Checkbox>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
