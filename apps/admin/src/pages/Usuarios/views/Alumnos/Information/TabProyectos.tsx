import { useState } from 'react';

import { Flex } from '@chakra-ui/react';

import { IUser, useProyectos } from '@clevery-lms/data';

type TabProyectosProps = {
  user: IUser;
  refreshState: () => void;
  updateValue: (value: any) => void;
};

export const TabProyectos = ({
  user,
  updateValue,
  refreshState,
}: TabProyectosProps) => {
  const [query, setQuery] = useState(`?user_id=${user?.id}&limit=20`);
  const { proyectos } = useProyectos({ query: query, client: 'admin' });

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      p="30px"
      boxSize="100%"
      gridGap="30px"
      overflow="overlay"
    >
      Hola {user?.fullName} ✌
    </Flex>
  );
};
