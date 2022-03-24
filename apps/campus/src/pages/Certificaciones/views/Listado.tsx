import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  BiChevronDown,
  BiFilterAlt,
  BiSortDown,
  BiSortUp,
} from 'react-icons/bi';
import {
  Box,
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from '@chakra-ui/react';

import { ICertificacion } from '@clevery-lms/data';
import { useCertificaciones } from '@clevery-lms/data';
import { LayoutContext, ProgresoGlobalContext } from '../../../shared/context';
import {
  CardCertificacionLoader,
  GlobalCard,
  GlobalCardType,
} from '../../../shared/components';

enum CertificacionFilter {
  TODAS = 'Todas',
  NIVEL_1 = 'Nivel 1',
  NIVEL_2 = 'Nivel 2',
  NIVEL_3 = 'Nivel 3',
  SUPERADAS = 'Superadas',
}

enum CertificacionSortBy {
  // RECOMENDADOS = 'Recomendadas',
  ALFABETICO = 'Alfabético',
  ACTUALIZACION = 'Actualizadas',
}

enum CertificacionOrder {
  DESC = 'desc',
  ASC = 'asc',
}

const CertificacionesList = () => {
  const navigate = useNavigate();
  const { progresoGlobal } = useContext(ProgresoGlobalContext);
  const { setShowSidebar, setShowHeader } = useContext(LayoutContext);

  const [query, setQuery] = useState<any[]>([]);
  const [order, setOrder] = useState<CertificacionOrder>(
    CertificacionOrder.ASC
  );
  const [filter, setFilter] = useState<CertificacionFilter>(
    CertificacionFilter.TODAS
  );
  const [sortBy, setSortBy] = useState<CertificacionSortBy>(
    CertificacionSortBy.ALFABETICO
  );

  const { certificaciones, isLoading } = useCertificaciones({
    query,
    certificacionesIniciadas:
      progresoGlobal?.meta?.certificacionesIniciadas || [],
    certificacionesCompletadas:
      progresoGlobal?.meta?.certificacionesCompletadas || [],
  });

  // TODO: Si la query esta a = [], vaciar desde front.
  const {
    certificaciones: certificaciones_Iniciadas,
    isLoading: isLoading_Iniciadas,
    isError: isError_Iniciadas,
  } = useCertificaciones({
    query: [{ lista: progresoGlobal?.certificacionesIniciadas }],
    certificacionesIniciadas:
      progresoGlobal?.meta?.certificacionesIniciadas || [],
    certificacionesCompletadas:
      progresoGlobal?.meta?.certificacionesCompletadas || [],
  });

  useEffect(() => {
    setShowHeader(true);
    setShowSidebar(true);
  }, []);

  useEffect(() => {
    refreshState();
  }, [filter, sortBy, order]);

  const refreshState = async () => {
    let _query = '&limit=100';

    if (filter === CertificacionFilter.NIVEL_1) _query = '&nivel=1&limit=100';
    else if (filter === CertificacionFilter.NIVEL_2)
      _query = '&nivel=2&limit=100';
    else if (filter === CertificacionFilter.NIVEL_3)
      _query = '&nivel=3&limit=100';
    else if (filter === CertificacionFilter.SUPERADAS) {
      if ((progresoGlobal?.meta?.certificacionesCompletadas?.length || 0) === 0)
        return;

      _query = `?lista=${progresoGlobal?.certificacionesCompletadas}&limit=100`;
    }

    if (sortBy === CertificacionSortBy.ACTUALIZACION)
      _query += `&sort_by=updatedAt`;
    else if (sortBy === CertificacionSortBy.ALFABETICO)
      _query += `&sort_by=nombre`;

    _query += `&order=${order}`;

    const auxQuery = _query.split('&').map((item) => {
      const split = item.split('=');
      return { [split[0]]: split[1] };
    });

    setQuery([{ ...auxQuery }]);
  };

  return (
    <Flex
      direction="column"
      w="100%"
      p={{ base: '20px', sm: '34px' }}
      gridRowGap="64px"
    >
      {(progresoGlobal?.meta?.certificacionesIniciadas?.length || 0) !== 0 &&
        !isError_Iniciadas && (
          <Flex direction="column" gap="20px" lineHeight="22px">
            <Box fontSize="18px" fontWeight="bold" lineHeight="100%">
              En progreso
            </Box>

            <Flex w="100%" wrap="wrap" gridColumnGap="28px" gridRowGap="20px">
              {isLoading_Iniciadas
                ? Array.from(Array(1).keys()).map((n) => (
                    <GlobalCard
                      type={GlobalCardType.CERTIFICACION}
                      props={{ isLoading: true }}
                      maxPerRow={4}
                      gapBetween="28px"
                      key={'certificacion-item-active-' + n}
                    />
                  ))
                : certificaciones_Iniciadas?.map(
                    (c: ICertificacion, index: number) => (
                      <GlobalCard
                        onClick={() => navigate('/certificaciones/' + c.id)}
                        type={GlobalCardType.CERTIFICACION}
                        props={{ certificacion: c }}
                        maxPerRow={4}
                        gapBetween="28px"
                        key={'certificacion-item-active-' + index}
                      />
                    )
                  )}
            </Flex>
          </Flex>
        )}

      <Flex direction="column" gap="20px">
        <Flex
          align={{ base: 'flex-start', sm: 'center' }}
          justify={{ base: 'center', sm: 'space-between' }}
          direction={{ base: 'column', sm: 'row' }}
          gap="10px"
        >
          <Box fontSize="19px" fontWeight="bold" lineHeight="100%">
            Certificaciones
          </Box>

          <Flex align="center" gap="10px">
            <Menu>
              <MenuButton
                as={Button}
                bg="gray_2"
                p="5px 10px"
                rounded="8px"
                _hover={{ filter: 'brightness(90%)' }}
                leftIcon={<Icon as={BiFilterAlt} boxSize="20px" />}
                rightIcon={<Icon as={BiChevronDown} boxSize="20px" />}
              >
                {filter}
              </MenuButton>

              <MenuList color="black" bg="white">
                {Object.values(CertificacionFilter).map((value, index) => (
                  <MenuItem
                    cursor="pointer"
                    fontSize="16px"
                    fontWeight="bold"
                    _hover={{ bg: 'gray_1' }}
                    _focus={{ bg: 'gray_1' }}
                    key={'cursos-filter-' + index}
                    onClick={() => setFilter(value)}
                  >
                    {value}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>

            <Menu>
              <MenuButton
                as={Button}
                bg="gray_2"
                p="5px 10px"
                rounded="8px"
                _hover={{ filter: 'brightness(90%)' }}
                rightIcon={<Icon as={BiChevronDown} boxSize="20px" />}
                leftIcon={
                  <Icon
                    as={
                      order === CertificacionOrder.DESC ? BiSortDown : BiSortUp
                    }
                    boxSize="20px"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOrder(
                        order === CertificacionOrder.DESC
                          ? CertificacionOrder.ASC
                          : CertificacionOrder.DESC
                      );
                    }}
                  />
                }
              >
                {sortBy}
              </MenuButton>

              <MenuList color="black" bg="white">
                {Object.values(CertificacionSortBy).map((value, index) => (
                  <MenuItem
                    cursor="pointer"
                    fontSize="16px"
                    fontWeight="bold"
                    _hover={{ bg: 'gray_1' }}
                    _focus={{ bg: 'gray_1' }}
                    key={'cursos-filter-' + index}
                    onClick={() => setSortBy(value)}
                  >
                    {value}
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
        </Flex>

        <Flex w="100%" wrap="wrap" gap="28px">
          {isLoading
            ? Array.from(Array(10).keys()).map((n) => (
                <GlobalCard
                  type={GlobalCardType.CERTIFICACION}
                  props={{ isLoading: true }}
                  maxPerRow={4}
                  gapBetween="28px"
                  key={'certificacion-item-active-' + n}
                />
              ))
            : filter === CertificacionFilter.SUPERADAS &&
              (progresoGlobal?.meta?.certificacionesCompletadas?.length ||
                0) === 0
            ? undefined // Si no hay certificaciones superadas, entonces no mostramos nada... TODO: Debería estar a nivel de back
            : (certificaciones || [])
                ?.filter((c: ICertificacion) => c?.meta?.examenesCount !== '0')
                ?.map((c: ICertificacion, index: number) => (
                  <GlobalCard
                    maxPerRow={4}
                    gapBetween="28px"
                    type={GlobalCardType.CERTIFICACION}
                    onClick={() => navigate('/certificaciones/' + c.id)}
                    props={{ certificacion: c }}
                    key={'certificacion-item-' + index}
                  />
                ))}
        </Flex>
      </Flex>

      <Flex direction="column" gap="20px" pb="40px">
        {(certificaciones || [])?.filter(
          (certificacion: ICertificacion) =>
            certificacion?.meta?.examenesCount === '0'
        )?.length > 0 ? (
          <>
            <Flex align="end" justify="space-between" gap="10px">
              <Box fontSize="19px" fontWeight="bold" lineHeight="100%">
                Disponibles próximamente
              </Box>
            </Flex>

            <Flex w="100%" wrap="wrap" gap="28px">
              {isLoading
                ? Array.from(Array(10).keys()).map((n) => (
                    <CardCertificacionLoader
                      key={'certificacion-item-placeholder-' + n}
                    />
                  ))
                : (certificaciones || [])
                    ?.filter(
                      (certificacion: ICertificacion) =>
                        certificacion?.meta?.examenesCount === '0'
                    )
                    ?.map((c: ICertificacion, index: number) => (
                      <GlobalCard
                        maxPerRow={4}
                        gapBetween="28px"
                        type={GlobalCardType.CERTIFICACION}
                        key={'certificacion-item-' + index}
                        props={{ certificacion: c, isPublished: false }}
                      />
                    ))}
            </Flex>
          </>
        ) : null}
      </Flex>
    </Flex>
  );
};

export default CertificacionesList;
