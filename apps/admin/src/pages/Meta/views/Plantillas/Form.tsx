import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Button, useToast, Flex } from '@chakra-ui/react';

import { addPlantilla } from '@clevery-lms/data';
import { onFailure, onSuccess } from '@clevery-lms/utils';
import {
  FormInput,
  FormSelect,
  FormTextarea,
} from '../../../../shared/components';
import { FormTextEditor } from '@clevery-lms/ui';

const PlantillasForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formSteps = [{ step: 1, body: <Step1 /> }];

  const initialValues: any = {
    step: 1,
    titulo: '',
    contenido: null,
    publicado: true,
  };

  const validationSchema = Yup.object().shape({
    step: Yup.number().oneOf([1, 2, 3]).required(),
    titulo: Yup.string()
      .required('¡El titulo es obligatorio!')
      .typeError('El titulo es obligatorio.'),
    publicado: Yup.boolean().notRequired(),
    contenido: Yup.string()
      .required('¡El contenido es obligatorio!')
      .typeError('El contenido es obligatorio.'),
  });

  const submitForm = async (values: any) => {
    let plantilla = {
      contenido: values.contenido,
      titulo: values.titulo,
      publicado: values.publicado,
    };

    await addPlantilla({ plantilla })
      .then((response: any) => {
        onSuccess(toast, `Plantilla creada correctamente.`);
        navigate(`/meta/plantillaes/${response.value?.data?.id || ''}`);
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
                  Crear nueva plantilla
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default PlantillasForm;

const Step1 = () => {
  return (
    <Flex bg="#ffffff" boxSize="100%" p="30px">
      <Flex direction="column" w="20%" mr="30px" gridRowGap="20px">
        <FormInput name="titulo" label="Título de la plantilla *" />

        <FormSelect
          name="publicado"
          label="Plantilla publicada"
          options={[
            { label: 'Publicado', value: true },
            { label: 'Oculto', value: false },
          ]}
        />
      </Flex>

      <Flex direction="column" h="100%" w="80%" gridRowGap="20px">
        <FormTextEditor name="contenido" label="Contenido de la plantilla *" />
      </Flex>
    </Flex>
  );
};
