import { BiAward, BiListOl, BiTimeFive } from 'react-icons/bi';
import {
  Icon,
  Flex,
  Image,
  Box,
  Progress,
  Badge,
  Skeleton,
} from '@chakra-ui/react';

import { ICurso } from '@clevery-lms/data';
import { fmtMnts } from '@clevery-lms/utils';

export type CardRoadmapProps = {
  index: number;
  curso: ICurso;
  isLoading?: any;
  isBlocked?: boolean;
  isCompleted?: boolean;
  style?: React.CSSProperties;
  onClick: () => any;
};

export const CardRoadmap = ({
  index,
  curso,
  isBlocked,
  isCompleted,
  onClick,
  style,
  isLoading = false,
}: CardRoadmapProps) => {
  return !isLoading ? (
    <Flex
      onClick={!isBlocked ? onClick : undefined}
      style={style}
      w="100%"
      direction="column"
    >
      {!isCompleted && (
        <Progress
          w="100%"
          h="4px"
          value={100}
          sx={{
            '& > div': {
              background:
                curso?.meta?.progreso_count !== undefined &&
                curso?.meta?.progreso_count > 0
                  ? `linear-gradient(90deg, var(--chakra-colors-primary) 0%, var(--chakra-colors-primary_dark) ${
                      curso?.meta?.progreso_count + '%'
                    }, var(--chakra-colors-gray_3) ${
                      curso?.meta?.progreso_count + '%'
                    }, var(--chakra-colors-gray_3) 100%)`
                  : 'white',
            },
          }}
        />
      )}

      <Flex
        direction="column"
        gridRowGap="34px"
        p="24px"
        w="100%"
        justify="start"
      >
        <Flex direction="column" gridRowGap="20px" w="100%">
          <Flex w="100%" justify="space-between">
            <Flex
              justify="start"
              align="center"
              w="54px"
              h="54px"
              color="gray_4"
              fontWeight="bold"
              fontSize="42px"
            >
              {index}
            </Flex>

            {isCompleted && (
              <Flex
                justify="center"
                align="center"
                w="32px"
                h="32px"
                bg="primary"
                rounded="50%"
              >
                <Icon boxSize="20px" as={BiAward} color="#fff" />
              </Flex>
            )}
          </Flex>

          <Flex w="100%" direction="column" gridRowGap="6px">
            <Flex w="100%" align="center" gridColumnGap="10px">
              <Box
                as="h3"
                w="100%"
                color="dark"
                fontSize="21px"
                fontWeight="bold"
                overflow="hidden"
                whiteSpace="nowrap"
                textOverflow="ellipsis"
              >
                {curso.titulo}
              </Box>
            </Flex>

            <Flex
              color="gray_4"
              gap="13px"
              width="100%"
              align="center"
              fontSize="14px"
              overflow="hidden"
              whiteSpace="nowrap"
              fontWeight="medium"
              textOverflow="ellipsis"
              fontStyle={isBlocked ? 'italic' : undefined}
            >
              <Flex align="center">
                <Icon as={BiTimeFive} mr="2px" color="gray_6" />
                {`${curso.modulos?.length || 0} módulos`}
              </Flex>

              <Flex align="center">
                <Icon as={BiListOl} mr="2px" color="gray_6" />
                {isBlocked
                  ? 'Estamos preparando el contenido...'
                  : `${fmtMnts(curso.meta?.duracionTotal)}`}
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Box
          position="relative"
          w="100%"
          minH="100px"
          rounded="xl"
          overflow="hidden"
          border="none"
        >
          <Badge
            position="absolute"
            p="3px 8px 3px 8px"
            m="12px"
            rounded="lg"
            bg="black"
            color="white"
          >
            {curso?.nivel}
          </Badge>

          <Image
            src={curso?.imagen?.url}
            fit="cover"
            align="center"
            minW="100%"
            maxH="150px"
            outline="none"
          />
        </Box>
      </Flex>
    </Flex>
  ) : (
    <Flex direction="column" p="24px" w="100%">
      <Skeleton h="32px" w="32px" rounded="10px" mb="24px" />
      <Skeleton h="22px" w="100%" mb="8px" />

      <Flex w="100%" justify="space-between" mb="24px">
        <Skeleton h="22px" w="48%" />
        <Skeleton h="22px" w="48%" />
      </Flex>

      <Skeleton h="100px" w="100%" rounded="10px" />
    </Flex>
  );
};
