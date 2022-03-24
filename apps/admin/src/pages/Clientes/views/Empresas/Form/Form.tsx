import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Button, useToast, Flex } from '@chakra-ui/react';

import Step1 from './Step1';
import { addEmpresa } from '@clevery-lms/data';
import { CampusConfig } from '@clevery-lms/data';
import { onFailure, onSuccess } from '@clevery-lms/utils';

const EmpresasForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formSteps = [{ step: 1, body: <Step1 /> }];

  const initialValues: any = {
    step: 1,
    nombre: '',
    cif: null,
    sector: null,
    email: null,
    telefono: null,
    personaContacto: null,
  };

  const validationSchema = Yup.object().shape({
    step: Yup.number().oneOf([1, 2, 3]).required(),
    nombre: Yup.string()
      .required('¡El nombre es obligatorio!')
      .typeError('El nombre es obligatorio.'),
    cif: Yup.string().notRequired().nullable(),
    sector: Yup.string().notRequired().nullable(),
    email: Yup.string()
      .required('¡El email es obligatorio!')
      .typeError('El email es obligatorio.'),
    telefono: Yup.string()
      .required('¡El teléfono es obligatorio!')
      .typeError('El teléfono es obligatorio.'),
    personaContacto: Yup.string()
      .required('El contacto es obligatorio!')
      .typeError('El contacto es obligatorio.'),
  });

  const submitForm = async (values: any) => {
    await addEmpresa({ empresa: { ...values, config: CampusConfig } })
      .then(async (response: any) => {
        onSuccess(toast, `Empresa creada correctamente.`);

        navigate(`/clientes/empresas/${response.value?.data?.id || ''}`);
      })
      .catch((error: any) => {
        console.error('❌ Algo ha fallado...', { error });
        onFailure(toast, error.title, error.message);
      });
  };

  function onKeyDown(keyEvent: any) {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13)
      keyEvent.stopPropagation();
  }

  return (
    <Flex boxSize="100%">
      <Formik
        onSubmit={submitForm}
        enableReinitialize
        initialValues={initialValues}
        validationSchema={validationSchema}
      >
        {(formik) => {
          const { values, handleSubmit, setFieldValue } = formik;

          return (
            <FormikForm
              onSubmit={handleSubmit}
              onKeyDown={onKeyDown}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              {formSteps[values.step - 1].body}

              <Flex
                bg="#f4f5f6"
                align="center"
                justify="space-between"
                p="15px 30px"
                h="90px"
              >
                <div />

                <Flex gridGap="16px" fontSize="16px" fontWeight="semibold">
                  {formSteps.map(({ step }) => (
                    <Flex
                      key={'form-step-' + step}
                      align="center"
                      cursor="pointer"
                      onClick={() => setFieldValue('step', step)}
                    >
                      {values.step === step ? (
                        <Flex
                          bg="#3182FC"
                          color="#E4EFFF"
                          rounded="50%"
                          boxSize="32px"
                          align="center"
                          justify="center"
                        >
                          {step}
                        </Flex>
                      ) : (
                        <Flex
                          color="#3182FC"
                          bg="#E4EFFF"
                          rounded="50%"
                          boxSize="32px"
                          align="center"
                          justify="center"
                        >
                          {step}
                        </Flex>
                      )}
                    </Flex>
                  ))}
                </Flex>

                <Button
                  disabled={values.step !== formSteps.length}
                  bgColor="#3182FC"
                  color="#ffffff"
                  py="6"
                  w="fit-content"
                  type="submit"
                >
                  Crear nueva empresa
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default EmpresasForm;
