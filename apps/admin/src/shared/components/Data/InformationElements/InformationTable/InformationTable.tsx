import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

import { Box, Button, Flex, Icon } from '@chakra-ui/react';
import { BiPlus } from 'react-icons/bi';

type Props = {
  label?: string;
  noDataMessage?: string;
  data: any[] | undefined;
  style?: React.CSSProperties;
  onRowClick?: (e: any) => void;

  selection?: any;
  onSelectionChange?: any;
  selectionMode?: 'single' | 'multiple' | 'checkbox' | 'radiobutton';

  addButton?: {
    title?: string;
    onClick?: (e?: any) => void | any;
  };

  columns: {
    body?: any;
    field?: string;
    header?: string;
    className?: string;
    style?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    selectionMode?: 'single' | 'multiple';
  }[];
};

const InformationTable = ({
  label,
  data,
  style,
  columns,
  selection,
  onRowClick,
  addButton,
  selectionMode,
  onSelectionChange,
  noDataMessage = '',
}: Props) => {
  const getColumns = () => columns.map((item) => <Column key={item.field || null} {...item} />);

  return (
    <>
      <Flex align="center" justify="space-between">
        {label && (
          <label className="information-block-label" style={{ marginBottom: '0px' }}>
            {label}
          </label>
        )}

        {addButton && (
          <Button
            h="auto"
            color="#ffffff"
            bg="#3182FC"
            rounded="8px"
            p="10px 15px"
            w="fit-content"
            onClick={addButton.onClick}
            rightIcon={<Icon as={BiPlus} boxSize="21px" opacity="0.6" />}
          >
            {addButton.title}
          </Button>
        )}
      </Flex>

      {!data || data.length === 0 ? (
        noDataMessage && (
          <Box w="100%" color="gray_4" fontSize="14px" fontWeight="medium">
            {noDataMessage}
          </Box>
        )
      ) : (
        <DataTable
          rows={1000}
          scrollable
          value={data}
          onRowClick={onRowClick}
          selection={selection}
          selectionMode={selectionMode}
          onSelectionChange={onSelectionChange}
          style={{ boxShadow: 'none', borderRadius: '0px', ...style }}
        >
          {getColumns()}
        </DataTable>
      )}
    </>
  );
};

export { InformationTable };
