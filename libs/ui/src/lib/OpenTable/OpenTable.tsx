import { useEffect, useState } from 'react';

import { Box, Button, Flex, Icon, Input, Spinner, Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react';
import { BiChevronDown, BiChevronLeft, BiChevronRight, BiChevronUp, BiSort, BiSortDown, BiSortUp } from 'react-icons/bi';

import { FilterAsyncSelect } from './FilterAsyncSelect/FilterAsyncSelect';

import './OpenTable.module.scss';

export interface OpenColumn {
  key: string;
  field: string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  options?: { label: String; value: any }[];
  render?: (data: any) => JSX.Element | undefined;
  loadOptions?: (search: string) => Promise<{ label: String; value: string }[] | undefined>;
}

interface OpenTableProps {
  columns: OpenColumn[];
  data?: any[];
  total?: number;
  maxPages: number;
  currentPage: number;
  isLoading?: boolean;
  isExpandable?: boolean;
  rowExpansionTemplate?: any;
  onRowClick?: (row: any) => void;
  onPageChange: (page: number) => void;
  onQueryChange: (string: string) => void;
}

export const OpenTable = ({
  columns,
  data,
  isLoading = true,
  onRowClick,
  maxPages,
  currentPage,
  onPageChange,
  total,
  onQueryChange,
  isExpandable = false,
  rowExpansionTemplate,
}: OpenTableProps) => {
  const [typing, setTyping] = useState<boolean>(false);
  const [typingTimeout, setTypingTimeout] = useState<any>();

  const [filters, setFilters] = useState<any>({});
  const [sortBy, setSortBy] = useState<string | undefined>('id');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [isExpanded, setIsExpanded] = useState<any>({});
  const [refresh, setRefresh] = useState<boolean>(false);

  useEffect(() => {
    setIsExpanded({});
  }, [data]);

  const handleExpand = async (id: number) => {
    let _isExpanded = isExpanded;

    _isExpanded[id] = !isExpanded[id];
    await setIsExpanded(_isExpanded);

    setRefresh(!refresh);
  };

  useEffect(() => {
    if (typing === false) {
      let _filters = Object.keys(filters).map((filter: string) => `${filter}=${filters[filter]}`);
      onQueryChange(`${_filters.join('&')}&sort_by=${sortBy}&order=${sortOrder}`);
    }
  }, [typing]);

  const onHeaderClick = (column: OpenColumn) => {
    let _filters = Object.keys(filters).map((filter: string) => `${filter}=${filters[filter]}`);
    let _sortOrder = sortOrder;

    if (sortBy === column.field) _sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';

    onQueryChange(`${_filters.join('&')}&sort_by=${column.field}&order=${_sortOrder}`);
    setSortOrder(_sortOrder);
    setSortBy(column.field);
  };

  const pageBack = async () => {
    onPageChange(currentPage - 1);
  };

  const pageForward = async () => {
    onPageChange(currentPage + 1);
  };

  const changeFilter = (key: string, value: any) => {
    setTyping(true);

    if (typingTimeout) clearTimeout(typingTimeout);
    setTypingTimeout(setTimeout(() => setTyping(false), 500));

    let _filters = filters;

    if (value === '') delete _filters[key];
    else _filters[key] = value;

    setFilters(_filters);
  };

  const loadDefaultOptions = async (...args: any[]) => {
    const options = args[0];
    const search = args[1];

    return options.filter((option: any) => option.label.toLowerCase().trim().includes(search.toLowerCase().trim()));
  };

  return (
    <Flex position="relative" w="100%" bg="white" direction="column" h="100%" overflow="scroll" justify="space-between">
      <Table w="100%">
        <Thead p="0px">
          <Tr position="sticky" top="0" bg="white" zIndex="20">
            {isExpandable && <Th maxW="50px" bg="gray_7"></Th>}

            {columns.map((c, index) => (
              <Th
                key={index}
                py="15px"
                my="15px"
                gap="15px"
                bg="gray_7"
                color={sortBy === c.field ? 'primary' : 'gray_4'}
                cursor={c.sortable ? 'pointer' : 'default'}
              >
                <Flex
                  mb="10px"
                  h="100%"
                  align="center"
                  gridGap="12px"
                  onClick={c.sortable ? () => onHeaderClick(c) : () => undefined}
                  _hover={c.sortable && c.field !== sortBy ? { color: 'black' } : {}}
                >
                  <Box>{c.header}</Box>

                  {c.sortable && (
                    <Icon fontSize="16px" as={sortBy === c.field ? (sortOrder === 'asc' ? BiSortUp : BiSortDown) : BiSort} />
                  )}
                </Flex>

                {c.filterable &&
                  (c.options || c.loadOptions ? (
                    <FilterAsyncSelect
                      defaultOptions
                      placeholder={`Filtrar por ${c.header}`}
                      onChange={(e: any) => changeFilter(c.field, e ? e.value : '')}
                      loadOptions={c.options ? loadDefaultOptions.bind(null, c.options) : c.loadOptions}
                    />
                  ) : (
                    <Input
                      m="0px"
                      h="40px"
                      bg="white"
                      color="black"
                      placeholder={`Filtrar por ${c.header}`}
                      onChange={(e) => changeFilter(c.field, e.target.value)}
                    />
                  ))}
              </Th>
            ))}
          </Tr>
        </Thead>

        {isLoading && (
          <Flex
            position="absolute"
            top="30%"
            align="center"
            justify="center"
            direction="column"
            w="100%"
            h="fit-content"
            gap="8px"
          >
            <Box fontWeight="semibold" fontSize="14px">
              Cargando datos, por favor espere un momento...
            </Box>

            <Spinner />
          </Flex>
        )}

        {!isLoading && (
          <Tbody
            overflow="auto"
            maxH={isExpandable ? 'fit-content' : 'calc(100% - 60px)'}
            h={isExpandable ? 'fit-content' : 'calc(100% - 60px)'}
          >
            {!data && (
              <Tr>
                <Td>No hay datos para mostrar</Td>
              </Tr>
            )}

            {data?.map((item, index) => (
              <>
                <Tr
                  key={index}
                  cursor="pointer"
                  _hover={{ backgroundColor: '#E5E5E5' }}
                  bg={index % 2 == 0 ? 'white' : 'gray_7'}
                >
                  {isExpandable && (
                    <Td maxW="50px" textAlign="center" px="0px">
                      {(refresh || !refresh) && (
                        <Icon as={isExpanded[index] ? BiChevronUp : BiChevronDown} onClick={() => handleExpand(index)} />
                      )}
                    </Td>
                  )}
                  {columns?.map((column, i) => (
                    <Td key={i} onClick={onRowClick ? () => onRowClick(item) : () => undefined}>
                      {column.render ? column.render(item) : item[column.field] || '-'}
                    </Td>
                  ))}
                </Tr>

                {(refresh || !refresh) && isExpanded[index] && (
                  <Td bg="gray_2" w="100%" alignContent="center" colSpan={columns.length + 1}>
                    {rowExpansionTemplate(data[index])}
                  </Td>
                )}
              </>
            ))}
          </Tbody>
        )}
      </Table>

      <Flex position="sticky" bottom="0" bg="white" w="100%" h="60px" align="center" justify="center">
        {!!total && (
          <Box position="absolute" left="24px" color="grey_4">
            {total} elementos en total
          </Box>
        )}

        <Flex gridGap="6px" align="center">
          <Button bg="transparent" disabled={currentPage === 1} onClick={pageBack}>
            <Icon fontSize="20px" as={BiChevronLeft} />
          </Button>

          <Box>{currentPage}</Box>
          <Box>de {maxPages}</Box>

          <Button bg="transparent" disabled={currentPage === maxPages} onClick={pageForward}>
            <Icon fontSize="20px" as={BiChevronRight} />
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};
