import { Flex } from '@chakra-ui/react';
import { BiBookContent, BiBarChartAlt2 } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

import { PageHeader, PageSidebar } from '../../../shared/components';

export default function CursosMetricas() {
  const navigate = useNavigate();

  return (
    <Flex width="100%" h="100%">
      <PageSidebar
        title={'Cursos'}
        items={[
          {
            icon: BiBookContent,
            title: 'Listado',
            onClick: () => navigate('/certificaciones'),
          },
          {
            icon: BiBarChartAlt2,
            title: 'Métricas',
            isActive: true,
            isDisabled: true,
            onClick: () => {},
          },
        ]}
      />

      <Flex direction="column" w="100%" overflow="overlay">
        <PageHeader head={{ title: 'Mis métricas' }} />

        <Flex h="100%">hola mundo!</Flex>
      </Flex>
    </Flex>
  );
}
