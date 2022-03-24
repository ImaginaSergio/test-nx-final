import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { Box, Flex } from '@chakra-ui/react';
import { BiBook, BiBrain, BiListUl } from 'react-icons/bi';

import { getStatsByCurso } from '@clevery-lms/data';
import {
  HBarChart,
  PageHeader,
  PageSidebar,
} from '../../../../shared/components';

export default function CursosTable() {
  const navigate = useNavigate();

  const [cursosStats, setCursosStats] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      let stats = await getStatsByCurso({ query: [{ empresa_id: 1 }] });

      setCursosStats(
        stats?.data?.map((s: any) => {
          let totalUsers =
            (s.meta?.usersNoEmpezados?.length || 0) +
            (s.meta?.progresosUsers?.length || 0);
          let totalNoEmpezados = s.meta?.usersNoEmpezados?.length || 0;
          let totalCompletos = +(s.meta?.totalUsers || 0);
          let totalEnCurso = totalUsers - totalCompletos - totalNoEmpezados;

          const getPercent = (n: number = 0) =>
            Math.floor((n * 100) / totalUsers);

          return {
            id: s.id,
            title: s.titulo,
            image: s.imagen?.url,
            data: [
              getPercent(totalCompletos),
              getPercent(totalEnCurso),
              getPercent(totalNoEmpezados),
            ],
          };
        }) || []
      );
    })();
  }, []);

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
            isActive: true,
            onClick: () => navigate('/estadisticas/cursos'),
          },
          {
            icon: BiBrain,
            title: 'Habilidades',
            isActive: false,
            onClick: () => navigate('/estadisticas/habilidades'),
          },
        ]}
      />

      <Flex boxSize="100%" direction="column" gap="30px" p="30px">
        <PageHeader head={{ title: 'Estadísticas por cursos' }} />

        <Flex w="100%" direction="column" gap="30px">
          <Flex
            minH="fit-content"
            w="100%"
            direction="column"
            gap="8px"
            p="0px 30px"
          >
            <Box fontSize="18px" fontWeight="semibold">
              Progreso de Cursos
            </Box>

            <Box fontSize="14px" fontWeight="medium" color="#84889A">
              En este gráfico se muestra el progreso general del grupo respecto
              a los cursos.
            </Box>
          </Flex>

          <Flex direction="column" gap="30px" w="100%">
            {cursosStats?.length > 0 ? (
              <HBarChart
                showLegend
                datasets={cursosStats}
                onItemClick={(e) => navigate(`/estadisticas/cursos/${e.id}`)}
              />
            ) : (
              <Box>No hay cursos asociados al grupo</Box>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}
