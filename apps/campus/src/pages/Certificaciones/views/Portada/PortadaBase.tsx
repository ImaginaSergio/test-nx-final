import { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { AiFillStar } from 'react-icons/ai';
import { useMediaQuery } from '@chakra-ui/react';
import { Flex, Box, Icon, Button, Skeleton } from '@chakra-ui/react';
import { BiCheckboxChecked, BiRightArrowAlt, BiStar } from 'react-icons/bi';

import { fmtMnts } from '@clevery-lms/utils';
import { Avatar } from '../../../../shared/components';
import {
  IExamen,
  ICertificacion,
  IFavorito,
  FavoritoTipoEnum,
} from '@clevery-lms/data';
import {
  FavoritosContext,
  LoginContext,
  LayoutContext,
} from '../../../../shared/context';

export const PortadaBase = ({
  examen,
  certificacion,
}: {
  examen?: IExamen;
  certificacion?: ICertificacion;
}) => {
  const navigate = useNavigate();

  const { user } = useContext(LoginContext);
  const { favoritos, addFavorito, removeFavorito } =
    useContext(FavoritosContext);
  const [certiFavorita, setCertiFavorita] = useState<IFavorito>();
  const [intentosRestantes, setIntentosRestantes] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { isMobile } = useContext(LayoutContext);
  const [smallDevice] = useMediaQuery('(max-height: 600px)');

  useEffect(() => {
    certificacion && setIsLoading(true);
  }, [certificacion]);

  useEffect(() => {
    setIntentosRestantes(
      (examen?.numIntentos || 0) -
        (user?.certificaciones?.find(
          (c: any) => c.id === examen?.certificacionId
        )?.meta?.pivot_intento || 0)
    );
  }, [certificacion, examen]);

  useEffect(() => {
    if (favoritos?.length > 0 && certificacion?.id)
      setCertiFavorita(
        favoritos?.find(
          (f) =>
            f.tipo === FavoritoTipoEnum.CERTIFICACION &&
            f.objetoId === certificacion?.id
        )
      );
  }, [favoritos, certificacion?.id]);

  return isLoading ? (
    <Flex
      w="100%"
      align="center"
      justify="center"
      direction="column"
      gap={isMobile ? '20px' : '60px'}
      p={{ base: '70px 10px 20px', sm: '0px' }}
    >
      <Flex
        direction="column"
        gap="45px"
        align="center"
        mt={smallDevice ? '100px' : '0px'}
      >
        <Avatar src={examen?.imagen?.url} size="125px" name="" rounded="20px" />

        <Flex direction="column" align="center" gap="18px">
          <Box
            fontSize="24px"
            lineHeight="29px"
            fontWeight="bold"
            textAlign={isMobile && 'center'}
          >
            Certificación - {certificacion?.nombre}
          </Box>

          <Box
            fontSize="15px"
            lineHeight="22px"
            textAlign={isMobile && 'center'}
            pl={{ base: '5px', sm: '0px' }}
            pr={{ base: '5px', sm: '0px' }}
          >
            {certificacion?.descripcion}
          </Box>
        </Flex>
      </Flex>

      <Flex
        align="center"
        gap={isMobile ? '15px' : '32px'}
        direction={isMobile && 'column'}
      >
        <Flex
          w="100%"
          p="18px"
          align="center"
          rounded="20px"
          gridColumnGap="20px"
          bg="white"
          border="1px solid var(--chakra-colors-gray_3)"
        >
          <Flex
            w="44px"
            h="44px"
            rounded="10px"
            p="10px"
            bg="primary_light"
            align="center"
            justify="center"
          >
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" gridRowGap="6px">
            <Box
              w="100%"
              lineHeight="100%"
              fontWeight="medium"
              fontSize="14px"
              color="gray_4"
              whiteSpace="nowrap"
            >
              Número de preguntas
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px">
              {examen?.numPreguntas || 0}
            </Box>
          </Flex>
        </Flex>

        <Flex
          w="100%"
          p="18px"
          align="center"
          rounded="20px"
          gridColumnGap="20px"
          bg="white"
          border="1px solid var(--chakra-colors-gray_3)"
        >
          <Flex
            w="44px"
            h="44px"
            rounded="10px"
            p="10px"
            bg="primary_light"
            align="center"
            justify="center"
          >
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" gridRowGap="6px">
            <Box
              w="100%"
              lineHeight="100%"
              fontWeight="medium"
              fontSize="14px"
              color="gray_4"
              whiteSpace="nowrap"
            >
              Tiempo total
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px">
              {fmtMnts(examen?.duracion || 0)}
            </Box>
          </Flex>
        </Flex>

        <Flex
          w="100%"
          p="18px"
          bg="white"
          align="center"
          rounded="20px"
          gridColumnGap="20px"
          border="1px solid var(--chakra-colors-gray_3)"
        >
          <Flex
            w="44px"
            h="44px"
            rounded="10px"
            p="10px"
            bg="primary_light"
            align="center"
            justify="center"
          >
            <Icon as={BiCheckboxChecked} boxSize="24px" color="primary_dark" />
          </Flex>

          <Flex direction="column" gridRowGap="6px">
            <Box
              w="100%"
              lineHeight="100%"
              fontWeight="medium"
              fontSize="14px"
              color="gray_4"
              whiteSpace="nowrap"
            >
              Intentos restantes
            </Box>

            <Box lineHeight="100%" fontWeight="bold" fontSize="19px">
              {Math.max(intentosRestantes, 0)} / {examen?.numIntentos}
            </Box>
          </Flex>
        </Flex>
      </Flex>

      <Flex
        align="center"
        direction={isMobile && 'column'}
        gap={isMobile ? '10px' : '15px'}
        p={isMobile && '5'}
      >
        <Button
          h="42px"
          w="100%"
          border="none"
          color={certiFavorita ? 'primary' : undefined}
          bg={certiFavorita ? 'primary_light' : 'gray_3'}
          rounded="10px"
          onClick={
            certiFavorita
              ? () => removeFavorito(certiFavorita)
              : () => {
                  if (certificacion?.id && user?.id)
                    addFavorito({
                      objetoId: certificacion?.id,
                      tipo: FavoritoTipoEnum.CERTIFICACION,
                      userId: user?.id,
                      objeto: certificacion,
                    });
                }
          }
          _hover={{ bg: 'gray_2' }}
          leftIcon={
            <Icon
              as={certiFavorita ? AiFillStar : BiStar}
              color={certiFavorita ? 'primary' : undefined}
              boxSize="21px"
            />
          }
        >
          <Box lineHeight="18px">
            {certiFavorita ? 'Favorito' : 'Añadir favorito'}
          </Box>
        </Button>

        <Button
          bg="black"
          color="white"
          w="100%"
          px="20px"
          rightIcon={<Icon as={BiRightArrowAlt} boxSize="24px" pr="5px" />}
          disabled={certificacion?.meta?.isCompleted || intentosRestantes <= 0}
          onClick={() =>
            navigate(
              `/certificaciones/${certificacion?.id}/examen/${examen?.id}`
            )
          }
          _hover={{ bg: 'gray_2', color: '#bdbdbd' }}
        >
          {certificacion?.meta?.isCompleted
            ? 'Certificación obtenida'
            : intentosRestantes <= 0
            ? 'Sin intentos restantes'
            : 'Empezar examen'}
        </Button>
      </Flex>
    </Flex>
  ) : (
    <Flex
      w="100%"
      align="center"
      justify="center"
      direction="column"
      gap={{ base: '30px', sm: '60px' }}
      p="20px"
    >
      <Skeleton boxSize="125px" rounded="xl" />
      <Flex direction="column" gap="15px" align="center">
        {' '}
        <Skeleton w="325px" h="29px" />
        <Skeleton w="150px" h="22px" />
      </Flex>
      <Flex gridColumnGap="20px" direction={{ base: 'column', sm: 'row' }}>
        <Skeleton
          w="186px"
          h="82px"
          rounded="xl"
          mb={{ base: '10px', sm: '0px' }}
        />
        <Skeleton
          w="186px"
          h="82px"
          rounded="xl"
          mb={{ base: '10px', sm: '0px' }}
        />
        <Skeleton
          w="186px"
          h="82px"
          rounded="xl"
          mb={{ base: '10px', sm: '0px' }}
        />
      </Flex>
      <Flex gridColumnGap="20px" direction={{ base: 'column', sm: 'row' }}>
        <Skeleton
          w="176px"
          h="42px"
          rounded="xl"
          mb={{ base: '10px', sm: '0px' }}
        />
        <Skeleton w="176px" h="42px" rounded="xl" />
      </Flex>
    </Flex>
  );
};
