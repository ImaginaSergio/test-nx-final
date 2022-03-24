import React, { useState } from 'react';

import { Field } from 'formik';
import { FormLabel, FormControl, Icon, Input, InputGroup, InputRightElement, FormErrorMessage } from '@chakra-ui/react';
import { BiHide, BiShow } from 'react-icons/bi';

export const FormInput = ({
  name,
  label,
  placeholder,
  min,
  max,
  step,
  type = 'text',
  style = {},
  controlStyle = {},
  onBlur = () => {},
  isDisabled = false,
}: any) => {
  const [show, setShow] = useState(false);

  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl style={controlStyle} isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="form-label" htmlFor={name}>
            {label}
          </FormLabel>

          <InputGroup>
            <Input
              {...field}
              style={style}
              min={min}
              max={max}
              step={step}
              onBlur={onBlur}
              isDisabled={isDisabled}
              placeholder={placeholder}
              value={field.value || ''}
              type={type === 'password' ? (show ? 'text' : 'password') : type}
            />

            {type === 'password' && (
              <InputRightElement>
                <Icon
                  as={show ? BiHide : BiShow}
                  w="24px"
                  h="24px"
                  cursor="pointer"
                  title={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  onClick={() => setShow(!show)}
                />
              </InputRightElement>
            )}
          </InputGroup>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
