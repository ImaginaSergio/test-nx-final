import { useContext, useRef, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { Box, Button, Flex, Input, Select } from '@chakra-ui/react';

import { PreguntaTipoEnum } from '@clevery-lms/data';
import { LoginContext } from '../../../shared/context';
import { addForoPregunta, useForoTema } from '@clevery-lms/data';
import { OpenEditor } from '@clevery-lms/ui';

const NuevaPregunta = () => {
  const navigate = useNavigate();

  const inputRef = useRef<any>();

  const { temaId } = useParams<any>();
  const { user } = useContext(LoginContext);
  const { data: tema } = useForoTema({ id: +(temaId || 0) });

  const [titulo, setTitulo] = useState<string>('');
  const [contenido, setContenido] = useState<string>('');
  const [tipo, setTipo] = useState<PreguntaTipoEnum>(PreguntaTipoEnum.AYUDA);

  useEffect(() => {
    if (inputRef.current) setTimeout(() => inputRef.current.focus(), 0);
  }, []);

  const subirPregunta = () => {
    if (!temaId || !user?.id) return;

    addForoPregunta({
      pregunta: {
        temaId: +temaId,
        tipo: tipo,
        titulo: titulo,
        contenido: contenido,
        userId: user?.id,
        fijado: false,
      },
    }).then((data) => {
      navigate(`/foro/${temaId}/${data.value.id}`);
    });
  };

  return (
    <Flex
      w="100%"
      p={{ base: '18px', md: '34px' }}
      gap="24px"
      direction="column"
      h="100%"
    >
      <Box w="100%" fontSize="24px" fontWeight="bold" lineHeight="29px">
        Escribe tu pregunta sobre {tema?.titulo}
      </Box>

      <Box h="1px" bg="gray_3" />

      <Flex
        direction="column"
        gap="24px"
        w="100%"
        p={{ base: '18px', md: '34px' }}
      >
        <Flex
          gap={{ base: '10px', sm: '40px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box minW="150px" textAlign={{ base: 'start', sm: 'end' }}>
            Tema
          </Box>

          <Select
            isDisabled
            value={tema?.id}
            bg="white"
            border="1px solid var(--chakra-colors-gray_3)"
          >
            <option value={tema?.id}>{tema?.titulo}</option>
          </Select>
        </Flex>

        <Flex
          gap={{ base: '10px', sm: '40px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box minW="150px" textAlign={{ base: 'start', sm: 'end' }}>
            Título pregunta
          </Box>

          <Input
            ref={inputRef}
            bg="white"
            value={titulo}
            border="1px solid var(--chakra-colors-gray_3)"
            onChange={(e: any) => setTitulo(e.target.value)}
          />
        </Flex>

        <Flex
          gap={{ base: '10px', sm: '40px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box minW="150px" textAlign={{ base: 'start', sm: 'end' }}>
            Categoría
          </Box>

          <Select
            value={tipo}
            bg="white"
            border="1px solid var(--chakra-colors-gray_3)"
            onChange={(e) => {
              let res: any = e.target.value;
              setTipo(res);
            }}
          >
            <option value={PreguntaTipoEnum.AYUDA}>Ayuda</option>
            <option value={PreguntaTipoEnum.ANUNCIO}>Anuncio</option>
            <option value={PreguntaTipoEnum.SUGERENCIA}>Sugerencia</option>
            <option value={PreguntaTipoEnum.PROYECTO}>Proyecto</option>
            <option value={PreguntaTipoEnum.NOTIFICACION_ERROR}>Error</option>
          </Select>
        </Flex>

        <Flex
          h="100%"
          gap={{ base: '10px', sm: '40px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box minW="150px" textAlign={{ base: 'start', sm: 'end' }}>
            Contenido
          </Box>
          <OpenEditor
            placeholder="Escribe una pregunta"
            value={contenido}
            onChange={(e: any) => setContenido(e)}
          />
        </Flex>

        <Flex
          h="100%"
          gap={{ base: '10px', sm: '40px' }}
          align={{ base: 'start', sm: 'center' }}
          direction={{ base: 'column', sm: 'row' }}
        >
          <Box minW="150px" textAlign={{ base: 'start', sm: 'end' }} />

          <Button
            bg="primary"
            color="#fff"
            p="10px 16px"
            rounded="10px"
            w="fit-content"
            onClick={subirPregunta}
            disabled={!titulo || !contenido}
          >
            Subir pregunta
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default NuevaPregunta;
