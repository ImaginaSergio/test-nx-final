import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import { Form as FormikForm, Formik } from 'formik';
import { Button, useToast, Flex } from '@chakra-ui/react';

import { onFailure, onSuccess } from '@clevery-lms/utils';
import {
  addCertificacion,
  addHabilidad,
  getHabilidades,
} from '@clevery-lms/data';
import {
  FormAsyncCreatableSelect,
  FormInput,
  FormSelect,
  FormTextarea,
} from '../../../shared/components';
import { FormTextEditor } from '@clevery-lms/ui';

const CertificacionesForm = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const formSteps = [{ step: 1, body: <Step1 /> }];

  const initialValues: any = {
    step: 1,
    nombre: '',
    descripcion: '',
    publicado: true,
    habilidadId: null,
    nivel: null,
  };

  const validationSchema = Yup.object().shape({
    step: Yup.number().oneOf([1, 2, 3]).required(),
    nombre: Yup.string()
      .required('¡El título es obligatorio!')
      .typeError('El título es obligatorio.'),
    descripcion: Yup.string().required(),
    publicado: Yup.boolean().notRequired(),
    habilidadId: Yup.number().required(),
    nivel: Yup.number().required(),
  });

  const submitForm = async (values: any) => {
    let certificacion = {
      nombre: values.nombre,
      nivel: values.nivel,
      publicado: values.publicado,
      descripcion: values.descripcion,
      habilidadId: values.habilidadId,
    };

    await addCertificacion({ certificacion, client: 'admin' })
      .then(async (response: any) => {
        onSuccess(toast, `Certificación creada correctamente.`);
        navigate(`/certificaciones/${response.value?.data?.id || ''}`);
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
                  Crear nueva certificación
                </Button>
              </Flex>
            </FormikForm>
          );
        }}
      </Formik>
    </Flex>
  );
};

export default CertificacionesForm;

const Step1 = () => {
  const toast = useToast();

  const loadHabilidades = async (value: string) => {
    let _habilidades = await getHabilidades({
      query: [{ nombre: value }],
      client: 'admin',
    });

    return _habilidades?.data?.map((hab: any) => ({
      value: hab.id,
      label: hab.nombre,
    }));
  };

  const onCreateHabilidad = (e: any) => {
    return addHabilidad({ habilidad: { nombre: e?.nombre, publicado: true } })
      .then((response: any) => ({
        value: response.value?.data?.id,
        label: response.value?.data?.nombre,
      }))
      .catch((error: any) => {
        console.error('❌ Algo ha fallado al crear...', { error });
        onFailure(toast, error.title, error.message);

        return undefined;
      });
  };

  return (
    <Flex bg="#ffffff" boxSize="100%" p="30px">
      <Flex direction="column" w="20%" mr="30px" gridRowGap="20px">
        <FormInput name="nombre" label="Nombre de la certificación *" />

        <FormAsyncCreatableSelect
          isClearable
          name="habilidadId"
          label="Habilidad relacionada *"
          loadOptions={loadHabilidades}
          onCreateOption={(nombre: any) =>
            onCreateHabilidad({ nombre: nombre })
          }
        />

        <FormSelect
          name="nivel"
          label="Nivel de la certificación *"
          options={[
            { label: 'Nivel Inicial (1)', value: 1 },
            { label: 'Nivel Intermedio (2)', value: 2 },
            { label: 'Nivel Avanzado (3)', value: 3 },
          ]}
        />

        <FormSelect
          name="publicado"
          label="Certificación publicada"
          options={[
            { label: 'Publicado', value: true },
            { label: 'Oculto', value: false },
          ]}
        />
      </Flex>

      <Flex direction="column" h="100%" w="80%" gridRowGap="20px">
        <FormTextEditor
          name="descripcion"
          label="Descripción de la certificación *"
        />
      </Flex>
    </Flex>
  );
};
