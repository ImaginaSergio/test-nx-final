import { useState } from 'react';

import { isMobile } from 'react-device-detect';
import { Field } from 'formik';
import { BiCheckCircle, BiHide, BiShow } from 'react-icons/bi';
import {
  Flex,
  Icon,
  Text,
  Input,
  InputGroup,
  FormLabel,
  FormControl,
  FormErrorMessage,
  InputRightElement,
} from '@chakra-ui/react';

import '../../Register.scss';

export const StepsTextInput = ({
  type,
  name,
  label,
  placeholder,
  validate,
}: {
  type?: any;
  name: string;
  label: string;
  placeholder?: string;
  validate?: (value: any) => any;
}) => {
  const [show, setShow] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  return (
    <Field name={name} validate={validate}>
      {({ field, form }: { field: any; form: any }) => (
        <FormControl className="steps-form--form-control" isInvalid={form.errors[name] && form.touched[name]}>
          <FormLabel className="steps-form--form-control--label" htmlFor={name}>
            <Text variant="h5_heading">{label}</Text>
          </FormLabel>

          <Flex align="center" position="relative" w="100%">
            <InputGroup w="100%">
              <Input
                {...field}
                id={name}
                w="100%"
                rounded="13px"
                p="12px 15px"
                fontSize="14px"
                color="black"
                fontWeight="medium"
                border="1px solid var(--chakra-colors-gray_3)"
                borderColor="#E6E8EE"
                bg="white"
                placeholder={placeholder}
                value={field.value || ''}
                _placeholder={{ color: '#878EA0' }}
                type={type === 'password' ? (show ? 'text' : 'password') : type}
                onBlur={(e) => {
                  setShowCheck(true);
                  if (field.onBlur) field.onBlur(e);
                }}
                transition="all 0.3s linear"
                _focus={{
                  border: 'none',
                  boxShadow: '0 0 0 3px var(--chakra-colors-primary)',
                }}
              />
              {isMobile && showCheck && !form.errors[name] && field.value && (
                <InputRightElement>
                  <Icon as={BiCheckCircle} color="primary" boxSize="24px" mr={type === 'password' ? '50px' : ''} />{' '}
                </InputRightElement>
              )}
              {type === 'password' && (
                <InputRightElement>
                  <Icon as={show ? BiHide : BiShow} cursor="pointer" onClick={() => setShow(!show)}>
                    {show ? 'Hide' : 'Show'}
                  </Icon>
                </InputRightElement>
              )}
            </InputGroup>

            {!isMobile && showCheck && !form.errors[name] && field.value && (
              <Icon as={BiCheckCircle} position="absolute" right="-32px" color="primary" boxSize="24px" />
            )}
          </Flex>
          <Flex h="fit-content" minH="22px" mt={{ base: '5px', sm: '0' }}>
            <FormErrorMessage pt="5px" m="0">
              {form.errors[name]}
            </FormErrorMessage>
          </Flex>
        </FormControl>
      )}
    </Field>
  );
};
