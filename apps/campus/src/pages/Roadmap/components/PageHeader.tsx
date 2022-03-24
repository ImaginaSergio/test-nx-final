import { Icon, Flex, Box, CircularProgress } from '@chakra-ui/react';

import { Avatar } from '../../../shared/components/core';

type PageHeaderProps = {
  kpis: {
    color: string;
    bgColor?: string;
    icon: any;
    title: string;
    value: string;
    isProgress?: boolean;
    progress?: any;
  }[];
};

export const PageHeader = ({ kpis = [] }: PageHeaderProps) => {
  return (
    <Flex direction={{ base: 'column', md: 'row' }} w="100%" gap="12px" align={{ base: 'flex-start', md: 'center' }}>
      {kpis?.map((kpi, index) => (
        <Flex
          key={`pageheader-kpi-${index}`}
          w="100%"
          p="18px"
          align="center"
          rounded="20px"
          gridColumnGap="20px"
          bg="white"
          border="1px solid var(--chakra-colors-gray_3)"
          position="relative"
        >
          <Flex
            w="44px"
            h="44px"
            rounded={kpi.isProgress ? '50px' : '10px'}
            p="10px"
            bg={kpi.bgColor}
            align="center"
            justify="center"
          >
            <Icon as={kpi.icon} boxSize="24px" color={kpi.color} />
            {kpi.isProgress && (
              <CircularProgress
                position="absolute"
                color="primary"
                trackColor="var(--primary)"
                value={kpi.progress || 0}
              />
            )}
          </Flex>

          <Flex direction="column" gridRowGap="6px">
            <Box w="100%" lineHeight="100%" fontWeight="semibold" fontSize="14px" color="gray_5">
              {kpi.title}
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px">
              {kpi.value}
            </Box>
          </Flex>
        </Flex>
      ))}
    </Flex>
  );
};
