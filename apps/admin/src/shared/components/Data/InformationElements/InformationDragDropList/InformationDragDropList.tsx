import { useState } from 'react';

import { Box, Center, Flex, Icon } from '@chakra-ui/react';
import {
  BiChevronDown,
  BiChevronUp,
  BiPencil,
  BiPlusCircle,
  BiTrash,
} from 'react-icons/bi';

export type Props = {
  label?: string;
  items: ListItemProps[];

  allowOpen?: boolean;
  allowDragDrop?: boolean;

  onCreate?: () => void;
  createTitle?: string;
};

export type ListItemProps = {
  title: string;
  foot?: string;

  showIndex?: boolean;

  allowDragDrop?: boolean;

  onEdit?: () => void;
  onClick?: () => void;
  onDelete?: () => void;
  onCreate?: () => void;
  createTitle?: string;

  subitems?: ListSubItemProps[];
};

export type ListSubItemProps = {
  title: string;
  icon?: any;

  isSelected?: boolean;

  foot?: string;
  onClick?: () => void;
  onDelete?: () => void;
};

export const InformationDragDropList = ({
  label,
  items,
  onCreate,
  allowOpen,
  createTitle = 'Añadir',
}: Props) => {
  return (
    <Flex direction="column" overflow="hidden">
      {label && <label className="information-block-label">{label}</label>}

      <Flex w="100%" direction="column" gridGap="10px" overflow="overlay">
        {items?.map((item: ListItemProps, index: number) => (
          <ListItem
            key={`list-item-${index}`}
            props={{ ...item }}
            index={index + 1}
            allowOpen={allowOpen}
          />
        ))}

        <Flex
          h="44px"
          w="100%"
          mt="10px"
          align="center"
          justify="center"
          gridGap="8px"
          p="10px 12px"
          rounded="12px"
          color="#84889A"
          cursor="pointer"
          onClick={onCreate}
          border="1px solid #E6E8EE"
          transition="all 0.3s ease-in-out"
          _hover={{
            bg: 'white',
            color: '#10172E',
            boxShadow: '0px 1px 7px rgba(7, 15, 48, 0.14)',
          }}
        >
          <Icon as={BiPlusCircle} boxSize="21px" />

          <Box fontSize="12px" fontWeight="semibold" textTransform="uppercase">
            {createTitle}
          </Box>
        </Flex>
      </Flex>
    </Flex>
  );
};

const ListItem = ({
  allowOpen = true,
  index,
  props,
}: {
  allowOpen?: boolean;
  index: number;
  props: ListItemProps;
}) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Flex bg="#FAFAFC" direction="column">
      <Flex
        h="44px"
        className="list-item"
        rounded="12px"
        align="center"
        justify="space-between"
        p="10px 12px"
        cursor="pointer"
        onClick={() => {
          if (allowOpen) setOpen(!open);
          if (props.onClick) props.onClick();
        }}
      >
        <Flex align="center" gridColumnGap="12px">
          {props.showIndex && (
            <Center
              bg="#E6E8EE"
              rounded="6px"
              w="24px"
              h="24px"
              fontWeight="semibold"
              fontSize="13px"
              lineHeight="15px"
            >
              {index}
            </Center>
          )}

          <Box
            fontSize="14px"
            fontWeight="medium"
            lineHeight="16px"
            textAlign="start"
          >
            {props.title}
          </Box>

          <Flex
            display="none"
            align="center"
            color="#878EA0"
            gridColumnGap="10px"
            sx={{ '.list-item:hover &': { display: 'flex' } }}
          >
            {props.onEdit && (
              <Icon
                as={BiPencil}
                w="21px"
                h="21px"
                onClick={(e) => {
                  e.stopPropagation();
                  if (props.onEdit) props.onEdit();
                }}
              />
            )}
          </Flex>
        </Flex>

        <Flex align="center" gridColumnGap="10px">
          <Flex
            display="none"
            align="center"
            color="#878EA0"
            gridColumnGap="10px"
            sx={{ '.list-item:hover &': { display: 'flex' } }}
          >
            {props.onDelete && (
              <Icon
                as={BiTrash}
                w="21px"
                h="21px"
                onClick={(e) => {
                  e.stopPropagation();
                  if (props.onDelete) props.onDelete();
                }}
              />
            )}
          </Flex>

          <Box fontSize="14px" fontWeight="medium" lineHeight="16px">
            {props.foot}
          </Box>

          {allowOpen && (
            <Icon
              as={open ? BiChevronUp : BiChevronDown}
              w="24px"
              h="24px"
              color="#878EA0"
            />
          )}
        </Flex>
      </Flex>

      {open && (
        <Flex direction="column" w="100%" p="10px 12px">
          <Box mb="12px" bg="#ffffff" h="1px" />

          <Flex w="100%" direction="column" gridRowGap="7px">
            {props.subitems?.map((subitem, _index) => (
              <ListSubItem
                key={`list-item-${index}-subitem-${_index}`}
                {...subitem}
              />
            ))}
          </Flex>

          <Flex
            h="35px"
            w="100%"
            align="center"
            justify="center"
            gridColumnGap="8px"
            p="10px 12px"
            rounded="12px"
            color="#84889A"
            cursor="pointer"
            onClick={props.onCreate}
            border="1px solid #E6E8EE"
            transition="all 0.3s ease-in-out"
            _hover={{
              bg: 'white',
              color: '#10172E',
              boxShadow: '0px 1px 7px rgba(7, 15, 48, 0.14)',
            }}
          >
            <Icon as={BiPlusCircle} boxSize="21px" />

            <Box
              fontSize="12px"
              fontWeight="semibold"
              textTransform="uppercase"
            >
              {props.createTitle}
            </Box>
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

const ListSubItem = (props: ListSubItemProps) => (
  <Flex
    h="35px"
    className="list-subitem"
    bg="#FAFAFC"
    rounded="12px"
    align="center"
    justify="space-between"
    p="10px 12px"
    cursor="pointer"
    onClick={props.onClick}
    color={props.isSelected ? '#26C8AB' : '#878EA0'}
    border={props.isSelected ? '2px solid #26C8AB' : '2px solid #FAFAFC'}
  >
    <Flex align="center" gridColumnGap="12px">
      {props.icon}

      <Box fontSize="14px" fontWeight="medium" lineHeight="16px">
        {props.title}
      </Box>
    </Flex>

    <Flex align="center" gridColumnGap="10px">
      <Flex
        display="none"
        align="center"
        color="#878EA0"
        gridColumnGap="10px"
        sx={{ '.list-subitem:hover &': { display: 'flex' } }}
      >
        <Icon
          as={BiTrash}
          w="21px"
          h="21px"
          onClick={(e) => {
            e.stopPropagation();
            if (props.onDelete) props.onDelete();
          }}
        />
      </Flex>

      <Box fontSize="14px" fontWeight="medium" lineHeight="16px">
        {props.foot}
      </Box>
    </Flex>
  </Flex>
);
