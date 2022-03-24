import { BiSearchAlt } from 'react-icons/bi';
import { Text, Button, Icon, useDisclosure } from '@chakra-ui/react';

import { SearchbarModal } from './SearchbarModal';

export const Searchbar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        w="161px"
        bg="gray_2"
        rounded="48px"
        border="gray_3"
        onClick={onOpen}
        leftIcon={<Icon as={BiSearchAlt} color="gray_4" />}
        style={{ justifyContent: 'flex-start', padding: '12px' }}
      >
        <Text variant="button_medium" fontSize="16px" color="gray_4">
          Buscar
        </Text>
      </Button>

      <SearchbarModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};
