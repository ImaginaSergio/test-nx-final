import React, { useContext, useEffect, useState } from 'react';

import AsyncSelect from 'react-select/async';
import { BiPlusCircle } from 'react-icons/bi';
import { Icon, Box, Flex } from '@chakra-ui/react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { ICurso, IRuta } from '@clevery-lms/data';
import ItinerarioListItem from './InformationItinerarioListItem';
import { filterCursosByRuta, getCursos, useCursos } from '@clevery-lms/data';
import { LoginContext } from 'apps/admin/src/shared/context';

export const ItinerarioList = ({
  ruta,
  updateRuta,
}: {
  ruta?: IRuta;
  updateRuta: Function;
}) => {
  const [query, setQuery] = useState<any[]>([]);
  const [open, setOpen] = useState<boolean>(false);

  const { user } = useContext(LoginContext);
  const { cursos } = useCursos({ query: query, userId: user?.id });

  useEffect(() => {
    if (ruta?.itinerario)
      setQuery([{ ruta: ruta?.itinerario }, { limit: 1000 }]);
  }, [ruta?.itinerario]);

  async function loadOptions(value: string) {
    let _cursos = await getCursos({
      query: [{ titulo: value }],
      userId: user?.id,
    });
    return _cursos?.map((c: any) => ({ value: c.id, label: c.titulo }));
  }

  function onChange(event: any) {
    if (!ruta?.meta?.itinerario) return;

    let { itinerario } = ruta.meta;
    itinerario.push(event.value);

    updateRuta({ itinerario: `[${itinerario.toString()}]` });

    setOpen(false);
  }

  function onDelete(id?: number) {
    if (!id || !ruta?.meta?.itinerario) return;

    let { itinerario } = ruta.meta;
    itinerario = itinerario.filter((i) => i !== id);

    updateRuta({ itinerario: `[${itinerario.toString()}]` });
  }

  function handleOnDragEnd(result: any) {
    if (!result.destination || !ruta?.meta?.itinerario) return;

    let startIndex = result.source.index;
    let endIndex = result.destination.index;

    let { itinerario } = ruta.meta;

    let auxItem = itinerario[startIndex];
    itinerario[startIndex] = itinerario[endIndex];
    itinerario[endIndex] = auxItem;

    updateRuta({ itinerario: `[${itinerario.toString()}]` });
  }

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="ruta">
        {(provided) => (
          <Flex
            direction="column"
            gridGap="10px"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {cursos &&
              filterCursosByRuta(ruta?.meta?.itinerario, cursos)?.map(
                (c: ICurso, index: number) => (
                  <Draggable
                    key={c.id}
                    draggableId={'ruta-' + c.id}
                    index={index}
                  >
                    {(provided) => (
                      <Box
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ItinerarioListItem
                          curso={c}
                          onDelete={() => onDelete(c.id)}
                        />
                      </Box>
                    )}
                  </Draggable>
                )
              )}

            {open ? (
              <AsyncSelect
                onChange={onChange}
                loadOptions={loadOptions}
                styles={selectStyles}
              />
            ) : (
              <Flex
                align="center"
                justify="center"
                p="10px 12px"
                rounded="12px"
                gridGap="8px"
                color="#878EA0"
                border="1px solid #E6E8EE"
                onClick={() => setOpen(true)}
              >
                <Icon as={BiPlusCircle} boxSize="21px" />

                <Box fontWeight="semibold" fontSize="12px" lineHeight="14px">
                  Añadir curso
                </Box>
              </Flex>
            )}

            {provided.placeholder}
          </Flex>
        )}
      </Droppable>
    </DragDropContext>
  );
};

const selectStyles = {
  noOptionsMessage: (styles: any) => ({
    ...styles,
    fontSize: '16px',
    textAlign: 'left',
  }),
  singleValue: (styles: any) => ({
    ...styles,
    color: '#131340',
    fontWeight: 'normal',
  }),
  indicatorSeparator: (styles: any) => ({ display: 'none' }),
  control: (styles: any) => ({
    ...styles,
    border: '1px solid #E6E8EE',
    borderRadius: '7px',
  }),
};
