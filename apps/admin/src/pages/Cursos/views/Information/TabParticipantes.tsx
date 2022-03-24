import { Flex } from '@chakra-ui/react';
import { ICurso } from '@clevery-lms/data';

type TabParticipantesProps = {
  curso: ICurso;
  updateValue: (value: any) => void;
};

export const TabParticipantes = ({
  curso,
  updateValue,
}: TabParticipantesProps) => {
  return <Flex>Esta es la tab de Participantes</Flex>;
};
