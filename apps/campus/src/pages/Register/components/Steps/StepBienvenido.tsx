import { Flex, Text } from '@chakra-ui/react';
import { Country, State } from 'country-state-city';

import { UserOrigenEnum } from '@clevery-lms/data';
import { LogoImagina } from '../UI/LogoImagina';
import { capitalizeFirst } from '@clevery-lms/utils';
import { Logo, Stepper, StepsFormSelect } from '..';
import { StepsFormRadio } from '../Form/StepsFormRadio';

import '../../Register.scss';

const StepBienvenido = ({
  pais,
  totalSteps,
  currentStep,
}: {
  pais: string;
  totalSteps: number;
  currentStep: number;
}) => {
  const parseJSON = (inputString: string) => {
    if (inputString) {
      try {
        return State.getStatesOfCountry(JSON.parse(inputString).value).map(
          (c: any) => ({ label: c.name, value: c.name })
        );
      } catch (e) {
        return State.getAllStates().map((c: any) => ({
          label: c.name,
          value: c.name,
        }));
      }
    }
  };

  const getCountryOptions = () => {
    const options = Country.getAllCountries().map((c: any) => ({
      label: c.flag + ' ' + c.name,
      value: `{ "label":"${c.name}", "value":"${c.isoCode}"}`,
    }));

    const spainIndex = options.findIndex((o) => o.label.includes('Spain'));

    if (spainIndex) {
      const auxSpain = options[spainIndex],
        auxFirst = options[0];

      options[0] = auxSpain;
      options[spainIndex] = auxFirst;
    }

    return options;
  };

  return (
    <Flex
      w="100%"
      h="100%"
      align="center"
      justify="start"
      direction="column"
      pt={{ base: '45px', sm: '75px' }}
      gap={{ base: '30px', sm: '60px' }}
    >
      {process.env.REACT_APP_ORIGEN_CAMPUS === 'OPENBOOTCAMP' ? (
        <Logo />
      ) : (
        <LogoImagina />
      )}

      <Stepper steps={totalSteps} currentStep={currentStep} />

      <Flex
        id="head_last_step"
        direction="column"
        align={{ base: 'start', sm: 'center' }}
        gap="10px"
      >
        <Text variant="h1_heading" id="head_last_step__title">
          ¡Ya estás casi!
        </Text>

        <Text
          variant="card_title"
          color="gray_4"
          id="head_last_step__description"
        >
          Con estos datos buscaremos ofertas de trabajo que encajen contigo.
        </Text>
      </Flex>

      <Flex
        direction="column"
        gap="30px"
        mb="30px"
        w="100%"
        id="body_last_step"
      >
        <StepsFormSelect
          label="¿En qué país vives?"
          name="pais"
          placeholder="Ej: Spain"
          options={getCountryOptions()}
        />

        <StepsFormSelect
          label="¿En qué localidad?"
          name="localidad"
          options={parseJSON(pais)}
          placeholder="Ej: Valencia"
        />

        <StepsFormSelect
          name="trabajoRemoto"
          label="¿Qué tipo de trabajo prefieres?"
          placeholder="Escoge uno de la lista"
          options={[
            { label: 'Remoto', value: true },
            { label: 'Presencial', value: false },
          ]}
        />

        <StepsFormSelect
          name="origen"
          label="¿Cómo nos has conocido?"
          placeholder="Escoge uno de la lista"
          options={Object.values(UserOrigenEnum).map((v) => ({
            label: capitalizeFirst(v),
            value: v,
          }))}
        />

        <StepsFormRadio
          name="posibilidadTraslado"
          label="¿Estarías dispuesto a trasladarte?"
          options={[
            { label: 'Sí', value: 'true' },
            { label: 'No', value: 'false' },
          ]}
        />
      </Flex>
    </Flex>
  );
};

export default StepBienvenido;
