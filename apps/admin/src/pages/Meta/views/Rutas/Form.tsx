import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Button, useToast, Flex } from '@chakra-ui/react';

import { onFailure, onSuccess } from '@clevery-lms/utils';
import { getCursos, addRuta } from '@clevery-lms/data';
import { FormAsyncSelect, FormInput } from '../../../../shared/components';

const RutasForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formSteps = [{ step: 1, body: <Step1 /> }];

  const initialValues: any = {
    step: 1,
    nombre: '',
    itinerario: [],
  };

  const validationSchema = Yup.object().shape({
    step: Yup.number().oneOf([1, 2, 3]).required(),
    nombre: Yup.string()
      .required('¡El nombre es obligatorio!')
      .typeError('El nombre es obligatorio.'),
    itinerario: Yup.array()
      .of(Yup.string())
      .required('¡El itinerario es obligatorio!')
      .typeError('El itinerario es obligatorio.'),
  });

  const submitForm = async (values: any) => {
    let ruta = {
      nombre: values.nombre,
      itinerario: '[' + values.itinerario.toString() + ']',
    };

    await addRuta({ ruta })
      .then((response: any) => {
        onSuccess(toast, `Ruta creada correctamente.`);
        navigate(`/meta/rutas/${response.value?.data?.id || ''}`);
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
                  Crear nueva ruta
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default RutasForm;

const Step1 = () => {
  const loadCursosByTitulo = async (value: any) => {
    let _cursos = await getCursos({
      query: [{ titulo: value }],
      client: 'admin',
    });

    return _cursos?.data?.map((exp: any) => ({
      ...exp,
      value: exp.id,
      label: exp.titulo,
    }));
  };

  return (
    <Flex bg="#ffffff" boxSize="100%" p="30px">
      <Flex direction="column" w="20%" mr="30px" gridRowGap="20px">
        <FormInput name="nombre" label="Nombre de la ruta *" />

        <FormAsyncSelect
          isMulti
          name="itinerario"
          label="Itinerario de cursos"
          loadOptions={loadCursosByTitulo}
        />
      </Flex>
    </Flex>
  );
};
