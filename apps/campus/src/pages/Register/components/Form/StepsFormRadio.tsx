import React, { useState } from 'react';

import { Field } from 'formik';
import { BiCheckCircle } from 'react-icons/bi';
import { FormLabel, FormControl, FormErrorMessage, RadioGroup, Radio, Text, Flex, Icon } from '@chakra-ui/react';

type FormRadioProps = {
  inputRef?: any;
  name: string;
  label?: string;
  controlStyle?: React.CSSProperties;
  onBlur?: Function;
  labelColor?: string;
  options: any;
};

export const StepsFormRadio = ({ name, label, controlStyle = {}, labelColor, options }: FormRadioProps) => {
  const [showCheck, setShowCheck] = useState(false);

  const onChange = (value: any, form: any) => {
    setShowCheck(true);
    form.setFieldValue(name, value);
  };

  return (
    <Field name={name}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl style={controlStyle} isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="form-label" htmlFor={name} color={labelColor || 'black'}>
            {label}
          </FormLabel>

          <Flex
            w="100%"
            align="center"
            position="relative"
            maxW={{ base: showCheck && !form.errors[name] ? '90%' : '100%', sm: '100%' }}
          >
            <RadioGroup value={field.value} name={name} id={name} onChange={(e) => onChange(e, form)}>
              {options.map((o: any, index: number) => (
                <Radio bg="white" value={o.value} key={`opcion-radiostep-${index}`} my="5px" mx="10px">
                  <Text>{o.label}</Text>
                </Radio>
              ))}
            </RadioGroup>

            {showCheck && !form.errors[name] && field.value && (
              <Icon as={BiCheckCircle} position="absolute" right="-32px" color="primary" boxSize="24px" />
            )}
          </Flex>

          <FormErrorMessage>{form.errors[name]}</FormErrorMessage>
        </FormControl>
      )}
    </Field>
  );
};
