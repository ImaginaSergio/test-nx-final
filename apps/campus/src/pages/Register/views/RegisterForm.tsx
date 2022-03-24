import { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as Yup from 'yup';
import TagManager from 'react-gtm-module';
import { Flex, Button } from '@chakra-ui/react';
import { BiLeftArrowAlt } from 'react-icons/bi';
import { Form as FormikForm, Formik } from 'formik';

import { useQuery } from '@clevery-lms/utils';
import { LoginContext } from '../../../shared/context';
import {
  createUser,
  getItem,
  LOGIN_TOKEN,
  removeItem,
  setItem,
  updateProgresoGlobal,
  updateUser,
} from '@clevery-lms/data';

import StepRuta from '../components/Steps/StepRuta';
import StepNombre from '../components/Steps/StepNombre';
import StepBienvenido from '../components/Steps/StepBienvenido';
import StepCredenciales from '../components/Steps/StepCredenciales';
import StepConocimientos from '../components/Steps/StepConocimientos';

/** Objeto del usuario con la información almacenada por cada paso.  */
const USER_ONBOARDING = 'userOnboarding';
/** ID del usuario creado con la información del primer paso.  */
const USER_ONBOARDING_ID = 'userOnboardingId';
/** TOKEN del usuario creado con la información del primer paso.  */
const USER_ONBOARDING_TOKEN = 'userOnboardingToken';
/** Indica si el usuario está activo al crearse durante el primer paso.  */
const USER_ONBOARDING_ACTIVO = 'userOnboardingActivo';

export const RegisterForm = () => {
  const query = useQuery();
  const navigate = useNavigate();

  const { logout, login } = useContext(LoginContext);

  const steps = [1, 2, 3, 4, 5];

  const [localValues, setLocalValues] = useState<any>();
  const [activeStep, setActiveStep] = useState<number>(
    getItem(USER_ONBOARDING)?.step || 1
  );
  const isLastStep: boolean = activeStep === 5;

  useEffect(() => {
    let userOnboarding = getItem(USER_ONBOARDING);

    if (userOnboarding) setLocalValues(userOnboarding);

    // Enviamos a GTM que ha empezado el OnBoarding
    TagManager.dataLayer({ dataLayer: { onBoarding: 'started' } });

    // Cogemos la ruta por defecto de la query
    let ruta = query.get('ruta');

    if (['frontend', 'backend', 'fullstack'].includes(ruta || ''))
      setLocalValues((prev: any) =>
        prev
          ? { ...prev, preferencias: { ...prev?.preferencias, ruta: ruta } }
          : {}
      );
  }, []);

  const onKeyDown = (keyEvent: any) => {
    if ((keyEvent.charCode || keyEvent.keyCode) === 13)
      keyEvent.stopPropagation();
  };

  const submitForm = async (values: any) => {
    values.step = 5;

    let userId = getItem(USER_ONBOARDING_ID);
    let userToken = getItem(USER_ONBOARDING_TOKEN);
    let userActivo = getItem(USER_ONBOARDING_ACTIVO);

    if (userId)
      await updateUser({
        id: userId,
        user: {
          pais: values.pais,
          origen: values.origen,
          localidad: values.localidad,
          trabajoRemoto: values.trabajoRemoto,
          posibilidadTraslado: values.posibilidadTraslado,
          onboardingCompletado: true,
        },
      });

    // Si el usuario se crea activo, pasamos al login
    if (userActivo) {
      await login({ token: userToken }, userId, true)
        .then(() => {
          navigate('/register/empezar');

          cleanStorage(false);
        })
        .catch((error: any) => {
          console.log('Error en el login del register', { error, userId });
          navigate('/login');

          cleanStorage(true);
        });
    } else {
      // Si no, redirigimos a la página de usuario inactivo
      navigate('/register/inactivo');

      cleanStorage(true);
    }

    // Enviamos a GTM que ha terminado el OnBoarding
    TagManager.dataLayer({ dataLayer: { onBoarding: 'ended' } });
  };

  /** Limpiamos el localstorage de la información que ya no necesitamos */
  const cleanStorage = (doLogout: boolean) => {
    if (doLogout) logout();

    removeItem(USER_ONBOARDING);
    removeItem(USER_ONBOARDING_ID);
    removeItem(USER_ONBOARDING_ACTIVO);
    removeItem(USER_ONBOARDING_TOKEN);
  };

  const initialValues = {
    step: localValues?.step || 1,
    nombre: localValues?.nombre || null,
    apellidos: localValues?.apellidos || null,
    email: localValues?.email || null,
    origen: localValues?.origen || null,
    username: localValues?.username || null,
    password: localValues?.password || null,
    password_confirmation: localValues?.password_confirmation || null,
    politica_privacidad: localValues?.politica_privacidad || null,
    trabajoRemoto: localValues?.trabajoRemoto || null,
    posibilidadTraslado: localValues?.posibilidadTraslado || null,
    pais: localValues?.pais || null,
    localidad: localValues?.localidad || null,
    preferencias: {
      conocimientos: localValues?.preferencias?.conocimientos || null,
      ruta: localValues?.preferencias?.ruta || null,
    },
  };

  const containsWhiteSpaces = (text: string) => /^\s+|\s+$/.test(text);

  const validationSchema = Yup.object().shape({
    step: Yup.number()
      .oneOf([1, 2, 3, 4, 5]?.map((n) => +n))
      .required()
      .nullable(),
    nombre: Yup.string()
      .required('¡El nombre es obligatorio!')
      .typeError('El nombre es obligatorio.')
      .test(
        'Espacios en blanco',
        '¡El nombre no puede contener espacios en blanco al principio o al final!',
        (value) => !/^\s+|\s+$/.test(value || '')
      )
      .nullable(),
    apellidos: Yup.string()
      .required('¡Los apellidos son obligatorios!')
      .typeError('¡Los apellidos son obligatorios!')
      .test(
        'Espacios en blanco',
        '¡Los apellidos no pueden contener espacios en blanco al principio o al final!',
        (value) => !/^\s+|\s+$/.test(value || '')
      )
      .nullable(),
    email: Yup.string()
      .email('¡Escribe una dirección de email válida!')
      .required('¡El email es obligatorio!')
      .typeError('El email es obligatorio.')
      .test(
        'Espacios en blanco',
        '¡El email no puede contener espacios en blanco al principio o al final!',
        (value) => !/^\s+|\s+$/.test(value || '')
      )
      .nullable(),
    username: Yup.string()
      .required('¡El username es obligatorio!')
      .typeError('El username es obligatorio.')
      .matches(
        /^[a-z0-9_]+$/,
        'El nombre de usuario solo puede contener letras minúsculas, números y "_".'
      )
      .nullable(),
    politica_privacidad: Yup.boolean()
      .oneOf([true], 'Debes aceptar para continuar.')
      .required('Debes aceptar para continuar.')
      .typeError('Debes aceptar para continuar.'),
    preferencias: Yup.object().shape({
      conocimientos: Yup.string()
        .oneOf(['principiante', 'avanzado'])
        .required()
        .nullable(),
      ruta: Yup.string().notRequired().nullable(),
    }),
    password: Yup.string()
      .required('Introduce una contraseña.')
      .min(8, 'Contraseña muy corta. Debe tener como mínimo 8 carácteres.')
      .max(50, 'Contraseña muy larga. Debe tener como máximo 50 carácteres.')
      .matches(/(?=.*\d){1}/, 'La contraseña debe contener al menos un número.')
      .matches(
        /(?=.*[a-z]){1}/,
        'La contraseña debe contener al menos una letra en minúscula.'
      )
      .matches(
        /(?=.*[A-Z]){1}/,
        'La contraseña debe contener al menos una letra en mayúscula.'
      )
      .matches(
        /(?=.[!@#$%^&()-=+{};:,<.>]){1}/,
        'La contraseña debe contener al menos un carácter especial.'
      )
      .test(
        'Espacios en blanco',
        '¡La contraseña no puede contener espacios en blanco!',
        (value) => !/(\s)/g.test(value || '')
      )
      .typeError('Introduce tu contraseña.')
      .nullable(),
    password_confirmation: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir.')
      .required('Introduce una contraseña.')
      .nullable(),
    pais: Yup.string().notRequired().nullable(),
    localidad: Yup.string().notRequired().nullable(),
    origen: Yup.string().notRequired().nullable(),
  });

  return (
    <Formik
      enableReinitialize
      onSubmit={submitForm}
      initialValues={initialValues}
      validationSchema={validationSchema}
    >
      {({ values, handleSubmit, isSubmitting, errors }) => {
        const _renderStepContent = (step: number) => {
          switch (step) {
            case 1:
              return (
                <StepNombre
                  totalSteps={steps.length}
                  currentStep={activeStep}
                />
              );
            case 2:
              return (
                <StepCredenciales
                  totalSteps={steps.length}
                  currentStep={activeStep}
                />
              );
            case 3:
              return (
                <StepConocimientos
                  totalSteps={steps.length}
                  currentStep={activeStep}
                />
              );
            case 4:
              return (
                <StepRuta totalSteps={steps.length} currentStep={activeStep} />
              );
            case 5:
              return (
                <StepBienvenido
                  pais={values.pais || ''}
                  totalSteps={steps.length}
                  currentStep={activeStep}
                />
              );

            default:
              return <div>Lo sentimos, ha habido un error</div>;
          }
        };

        const onNextStep = (step: number) => {
          setItem('userOnboarding', values);

          // Enviamos a GTM el step activo
          TagManager.dataLayer({ dataLayer: { step: step } });

          let userId = getItem(USER_ONBOARDING_ID);
          let rndPassword = 'OpenBootcamp_' + Math.floor(Math.random() * 1001);

          switch (step) {
            case 1: {
              // Propiedades del usuario nuevo
              let userToCreate: any = {
                nombre: values.nombre,
                apellidos: values.apellidos,
                username:
                  values.email.substring(0, values.email.lastIndexOf('@')) +
                  Math.floor(Math.random() * 100001),
                email: values.email,
                password: rndPassword,
                password_confirmation: rndPassword,
              };

              let campanya: any = query.get('campanya'),
                grupoAnalitica: any = query.get('grupo'),
                palabraClave: any = query.get('palabraClave');

              // Datos analítica
              if (campanya && grupoAnalitica && palabraClave) {
                // Actualizamos el usuario a crear con la analítica
                userToCreate = {
                  ...userToCreate,
                  campanya,
                  grupoAnalitica,
                  palabraClave,
                };
              }

              // Creamos al usuario
              createUser({ user: userToCreate }).then((response) => {
                // Guardamos si el usuario está o no activo para el último paso.
                // TODO: A CAMBIAR DESDE BACKEND
                // setItem(USER_ONBOARDING_ACTIVO, response?.value?.user?.activo ? true : false);
                setItem(USER_ONBOARDING_ACTIVO, true);

                // Lo mismo para el ID y el token de acceso al campus.
                setItem(USER_ONBOARDING_ID, response.value.user.id);
                setItem(USER_ONBOARDING_TOKEN, response?.value?.token?.token);

                // Además guardamos el token para hacer el resto de peticiones de update
                setItem(LOGIN_TOKEN, response?.value?.token?.token);
              });

              // Pasamos al siguiente paso
              values.step = 2;
              setActiveStep(2);

              break;
            }

            case 2: {
              if (userId)
                updateUser({
                  id: userId,
                  user: {
                    username: values.username,
                    password: values.password,
                    password_confirmation: values.password_confirmation,
                  },
                });

              // Pasamos al siguiente paso
              values.step = 3;
              setActiveStep(3);

              break;
            }

            case 3: {
              if (userId)
                updateUser({
                  id: userId,
                  user: { preferencias: values.preferencias },
                }).then((response) => {
                  let ruta = values?.preferencias?.ruta;
                  let progresoGlobalId =
                    response.value?.data?.progresoGlobal?.id;

                  if (progresoGlobalId)
                    updateProgresoGlobal({
                      id: progresoGlobalId,
                      progresoGlobal: {
                        rutaId:
                          ruta === 'frontend'
                            ? 11
                            : ruta === 'backend'
                            ? 12
                            : ruta === 'fullstack'
                            ? 13
                            : 14,
                      },
                    });
                });

              // Enviamos a GTM el nivel de conocimientos
              TagManager.dataLayer({
                dataLayer: {
                  knowledge:
                    values.preferencias.conocimientos === 'avanzado'
                      ? 'pro'
                      : 'rookie',
                },
              });

              if (values.preferencias.conocimientos === 'principiante') {
                // Enviamos a GTM que la ruta es la de incubación
                TagManager.dataLayer({ dataLayer: { roadmap: 'incubation' } });

                // Saltamos al último paso
                values.step = 5;
                setActiveStep(5);
              } else {
                // Si no, pasamos al siguiente paso
                values.step = 4;
                setActiveStep(4);
              }

              break;
            }

            case 4: {
              if (userId)
                updateUser({
                  id: userId,
                  user: { preferencias: values.preferencias },
                });

              // Enviamos a GTM el roadmap
              TagManager.dataLayer({
                dataLayer: { roadmap: values.preferencias.ruta },
              });

              // Pasamos al siguiente paso
              values.step = 5;
              setActiveStep(5);

              break;
            }
          }

          // Hacemos scroll al inicio de la ventana.
          document
            .getElementById('top_point')
            ?.scrollIntoView({ behavior: 'smooth' });
        };

        const onPrevStep = (step: number) => {
          if (
            step === 5 &&
            values.preferencias.conocimientos === 'principiante'
          ) {
            values.step = 3;
            setActiveStep(3);
          } else {
            values.step = step - 1;
            setActiveStep(step - 1);
          }

          document
            .getElementById('top_point')
            ?.scrollIntoView({ behavior: 'smooth' });
        };

        const isDisabledStep = (step: number) => {
          switch (step) {
            case 1:
              return !(
                values.nombre &&
                !errors.nombre &&
                values.apellidos &&
                !errors.apellidos &&
                values.email &&
                !errors.email &&
                values.politica_privacidad &&
                !errors.politica_privacidad
              );
            case 2:
              return !(
                values.username &&
                !errors.username &&
                values.password &&
                !errors.password &&
                values.password_confirmation &&
                !errors.password_confirmation
              );
            case 3:
              return !values.preferencias.conocimientos;
            case 4:
              return !values.preferencias.ruta;
            case 5:
              return !(
                values.pais &&
                !errors.pais &&
                values.localidad &&
                !errors.localidad
              );
          }
        };

        return (
          <Flex direction="column" mb="20px" id="top_point">
            <FormikForm onSubmit={handleSubmit} onKeyDown={onKeyDown}>
              <Flex
                gap="27px"
                w="100%"
                direction="column"
                maxW="100vw"
                px={{ base: '30px', sm: '' }}
              >
                {_renderStepContent(activeStep)}

                {isLastStep && (
                  <Flex
                    w="100%"
                    mb="50px"
                    gap="12px"
                    direction={{ base: 'column', sm: 'row' }}
                    align={{ base: 'flex-end', sm: 'center' }}
                    justify={{ base: 'center', sm: 'flex-end' }}
                  >
                    <Button
                      id="register_previous_button"
                      variant="outline"
                      isLoading={isSubmitting}
                      disabled={activeStep === 1}
                      leftIcon={<BiLeftArrowAlt />}
                      onClick={() => onPrevStep(activeStep)}
                    >
                      Volver
                    </Button>

                    <Button
                      id="acces_to_campus_button"
                      type="submit"
                      isLoading={isSubmitting}
                      variant="primary"
                    >
                      ¡Empezar mi formación!
                    </Button>
                  </Flex>
                )}
              </Flex>
            </FormikForm>

            {!isLastStep && (
              <Flex
                w="100%"
                gap="12px"
                justify="flex-end"
                align="center"
                px="30px"
                maxW="100vw"
                pb="50px"
              >
                <Button
                  id="register_previous_button"
                  variant="outline"
                  isLoading={isSubmitting}
                  disabled={activeStep === 1}
                  leftIcon={<BiLeftArrowAlt />}
                  onClick={() => onPrevStep(activeStep)}
                >
                  Volver
                </Button>

                <Button
                  id="register_next_button"
                  variant="primary"
                  isLoading={isSubmitting}
                  disabled={isDisabledStep(activeStep)}
                  onClick={() => onNextStep(activeStep)}
                >
                  Siguiente paso
                </Button>
              </Flex>
            )}
          </Flex>
        );
      }}
    </Formik>
  );
};
