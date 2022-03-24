import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { es } from 'date-fns/locale';
import { format, isToday, isSameDay, addMonths } from 'date-fns';
import {
  Box,
  Flex,
  Drawer,
  DrawerContent,
  DrawerBody,
  DrawerCloseButton,
} from '@chakra-ui/react';

import { Calendar } from './Calendar';
import { useLeccionesCalendario } from '@clevery-lms/data';
import { LayoutContext } from '../../../context';

type CalendarDrawerProps = {
  state: { isOpen: boolean; onClose: () => void };
};

export const CalendarDrawer = ({ state }: CalendarDrawerProps) => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date>(new Date());
  const { isMobile } = useContext(LayoutContext);

  const { eventos } = useLeccionesCalendario({
    query: [
      { limit: 777 },
      {
        fecha_inicio: format(addMonths(date, -1), 'yyyy-MM-dd', { locale: es }),
      },
      { fecha_fin: format(addMonths(date, 1), 'yyyy-MM-dd', { locale: es }) },
    ],
  });

  const [dateEvents, setDateEvents] = useState(
    eventos?.filter((ev: any) => isSameDay(date, new Date(ev.fechaPublicacion)))
  );

  const onDateChange = (newDate: Date) => {
    setDate(newDate);
    setDateEvents(
      eventos?.filter((ev: any) =>
        isSameDay(newDate, new Date(ev.fechaPublicacion))
      )
    );
  };

  return (
    <Drawer
      isOpen={state.isOpen}
      placement="right"
      onClose={state.onClose}
      size={isMobile ? 'full' : 'md'}
    >
      <DrawerContent
        w="200px"
        p={isMobile ? '34px 20px' : '34px'}
        bg="white"
        boxShadow="0px 4px 24px rgba(0, 0, 0, 0.25)"
        borderLeft="1px solid var(--chakra-colors-gray_3)"
        overflow="overlay"
      >
        {' '}
        <DrawerBody p="0px">
          {' '}
          {isMobile && <DrawerCloseButton mt="10px" />}
          <Flex
            direction="column"
            align="center"
            justify="center"
            gridRowGap="34px"
          >
            <Flex w="100%" direction="column" gridRowGap="30px">
              <Flex direction="column" gridRowGap="15px">
                <Flex fontSize="15px" lineHeight="75%">
                  {isToday(date) && (
                    <Box mr="3px" fontWeight="bold">
                      Hoy,
                    </Box>
                  )}

                  <Box textTransform="capitalize">
                    {format(date, 'EEEE', { locale: es })}
                  </Box>
                </Flex>

                <Flex fontSize="36px" lineHeight="75%">
                  <Box mr="3px" fontWeight="bold">
                    {format(date, 'dd', { locale: es })}
                  </Box>

                  <Box textTransform="capitalize" fontWeight="semibold">
                    {format(date, 'MMMM', { locale: es })}
                  </Box>
                </Flex>
              </Flex>

              <Calendar
                date={date}
                daysDisabled={[0, 6]}
                onDateChange={onDateChange}
                events={eventos?.map((e: any) => ({
                  id: e.id,
                  date: new Date(e.fechaPublicacion),
                  ...e,
                }))}
              />
            </Flex>

            <Box w="100%" h="1px" bg="gray_2" />

            <Flex w="100%" direction="column" gridRowGap="30px">
              <Box fontWeight="bold" fontSize="19px">
                Eventos del día
              </Box>

              {dateEvents?.length > 0 ? (
                <Flex direction="column" w="100%" gridRowGap="20px">
                  {dateEvents?.map((ev: any) => (
                    <Flex
                      h="60px"
                      w="100%"
                      p="15px"
                      align="center"
                      cursor="pointer"
                      rounded="5px"
                      bg="white"
                      transition="all 0.2s ease"
                      key={`calendar-event-${ev.id}`}
                      borderLeft="3px solid var(--chakra-colors-primary)"
                      _hover={{ background: 'rgba(38, 200, 171, 0.15)' }}
                      onClick={() =>
                        navigate(
                          `/cursos/${ev.modulo?.cursoId}/leccion/${ev.id}`
                        )
                      }
                    >
                      <Flex
                        w="100%"
                        direction="row"
                        gridColumnGap="40px"
                        justify="space-between"
                      >
                        {!isMobile ? (
                          <Flex fontWeight="medium" fontSize="17px">
                            {ev?.modulo?.curso?.titulo && (
                              <Box fontWeight="bold" mr="4px">
                                {ev.modulo?.curso?.titulo} -
                              </Box>
                            )}

                            {ev.titulo}
                          </Flex>
                        ) : (
                          <Flex
                            fontWeight="medium"
                            fontSize="12px"
                            direction="column"
                          >
                            {ev?.modulo?.curso?.titulo && (
                              <Box fontWeight="bold" mr="4px">
                                {ev.modulo?.curso?.titulo}
                              </Box>
                            )}
                            <Box>{ev.titulo}</Box>
                          </Flex>
                        )}

                        <Flex
                          fontWeight="medium"
                          fontSize="15px"
                          align="center"
                        >
                          {format(new Date(ev.fechaPublicacion), "HH:mm'h'")}
                        </Flex>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              ) : (
                <Box
                  color="gray_4"
                  fontWeight="semibold"
                  fontSize="14px"
                  lineHeight="100%"
                >
                  No hay eventos programados para esta fecha
                </Box>
              )}
            </Flex>
          </Flex>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};
