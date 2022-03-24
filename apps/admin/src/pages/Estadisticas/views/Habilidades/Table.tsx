import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Flex } from '@chakra-ui/react';
import AsyncSelect from 'react-select/async';
import { BiBook, BiBrain, BiListUl } from 'react-icons/bi';

import { getHabilidades, getStatsByHabilidad } from '@clevery-lms/data';
import {
  HBarChart2,
  PageHeader,
  PageSidebar,
  RadarChart,
} from '../../../../shared/components';

export default function HabilidadesTable() {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState<string>();
  const [habilidad, setHabilidad] =
    useState<{ label: string; value: number }>();

  const [stats, setStats] = useState<any>([]);

  const loadHabilidades = async (search: string) => {
    let _habilidades = await getHabilidades({
      query: [{ nombre: search }, { es_superior: true }],
    });
    return _habilidades?.data?.map((hab: any) => ({
      value: hab.id,
      label: hab.nombre,
    }));
  };

  const updateHabilidad = async (newHabilidad: any) => {
    if (newHabilidad) {
      setHabilidad(newHabilidad);
      let stats: any = await getStatsByHabilidad({ query: newHabilidad.value });

      const totalUsers = stats.users?.total || 0;
      const labels = stats.cursos?.map((c: any) => c.titulo) || [];

      setStats({ labels, data: stats.cursos || [], totalUsers });
    } else setHabilidad(undefined);
  };

  const getPercent = (n: number = 0, total: number = 0) =>
    Math.floor((n * 100) / total);

  return (
    <Flex boxSize="100%">
      <PageSidebar
        title="Estadísticas"
        items={[
          {
            icon: BiListUl,
            title: 'Ranking',
            isActive: false,
            onClick: () => navigate('/estadisticas/ranking'),
          },
          {
            icon: BiBook,
            title: 'Cursos',
            isActive: false,
            onClick: () => navigate('/estadisticas/cursos'),
          },
          {
            icon: BiBrain,
            title: 'Habilidades',
            isActive: true,
            onClick: () => navigate('/estadisticas/habilidades'),
          },
        ]}
      />

      <Flex direction="column" boxSize="100%" overflow="overlay">
        <PageHeader head={{ title: 'Estadísticas por habilidades' }} />

        <Flex w="100%" p="30px" gap="30px" direction="column">
          <Flex w="100%" align="center">
            <Flex
              minH="fit-content"
              w="100%"
              direction="column"
              gridRowGap="8px"
            >
              <Box fontSize="18px" fontWeight="semibold">
                Progreso de Habilidades
              </Box>

              <Box fontSize="14px" fontWeight="medium" color="#84889A">
                Aquí se muestra la cantidad de alumnos que ha obtenido las
                habilidades.
              </Box>
            </Flex>

            <Flex minW="400px" align="center" gap="18px">
              <Box fontSize="16px" fontWeight="medium" lineHeight="19px">
                Habilidad
              </Box>

              <AsyncSelect
                defaultOptions
                closeMenuOnSelect
                value={habilidad}
                styles={AsyncSelectStyles}
                placeholder="Ej: Frontend"
                onChange={updateHabilidad}
                loadOptions={loadHabilidades}
                onInputChange={setInputValue}
              />
            </Flex>
          </Flex>

          <Flex
            position="relative"
            bg="gray_7"
            rounded="12px"
            border="1px solid"
            borderColor="gray_5"
            p="15px"
            align="center"
            minH="55px"
          >
            {!habilidad ? (
              <Box position="absolute" top="15px">
                Selecciona una habilidad
              </Box>
            ) : (
              <Flex
                gap="30px"
                w="100%"
                align="center"
                direction={{ base: 'column', lg: 'row' }}
              >
                <HBarChart2
                  showLegend={false}
                  datasets={stats?.data?.map((item: any) => ({
                    image: item.imagen?.url,
                    title: item.titulo,
                    data: [
                      getPercent(
                        +(item.meta?.totalUsers || 0),
                        +(stats.totalUsers || 0)
                      ),
                      100,
                    ],
                    total: +(stats.totalUsers || 0),
                    num: +(item.meta?.totalUsers || 0),
                  }))}
                />

                <Flex
                  w={{ base: undefined, lg: '100%' }}
                  maxW={{ base: undefined, lg: '500px' }}
                >
                  <RadarChart
                    labels={stats?.labels}
                    dataset={{
                      label: '# of Votes',
                      data: stats?.data?.map(
                        (item: any) => item.meta?.totalUsers
                      ),
                      backgroundColor: 'rgba(50, 213, 164, 0.3)',
                      borderColor: '#09C598',
                    }}
                  />
                </Flex>
              </Flex>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

const AsyncSelectStyles = {
  container: (styles: any) => ({
    ...styles,
    width: '100%',
    borderRadius: '7px',
  }),
  control: (styles: any) => ({
    ...styles,
    width: '100%',
    backgroundColor: 'white',
    border: '1px solid #E7E7E7',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: '#273360',
    fontSize: '16px',
    fontWeight: 500,
  }),
  placeholder: (styles: any) => ({
    ...styles,
    color: 'var(--chakra-colors-gray_4)',
    fontSize: '16px',
    fontWeight: 500,
  }),
  indicatorSeparator: (styles: any) => ({ ...styles, display: 'none' }),
  dropdownIndicator: (styles: any) => ({ ...styles, color: '#DBDBDB' }),
  option: (styles: any, { isFocused }: any) => ({
    ...styles,
    color: '#131340',
    fontSize: '14px',
    backgroundColor: isFocused ? '#E8EDFF' : 'white',
  }),
};
