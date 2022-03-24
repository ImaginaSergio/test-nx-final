import { Box, Flex } from '@chakra-ui/react';
import {
  InformationAsyncSelect,
  InformationFilepond,
  InformationInput,
  InformationMde,
  InformationSelect,
  InformationTextEditor,
} from '../../../../shared/components';
import { CursoNivelEnum, ICurso, getUsers } from '@clevery-lms/data';

type TabInformacionProps = {
  curso: ICurso;
  updateValue: (value: any) => void;
};

export const TabInformacion = ({ curso, updateValue }: TabInformacionProps) => {
  const loadProfesores = async (value: string) => {
    if (value.includes('@')) {
      let _usuarios = await getUsers({
        query: [{ email: value }],
        client: 'admin',
      });

      return _usuarios?.data?.map((user: any) => ({
        value: user.id,
        label: user.email,
      }));
    } else {
      let _usuarios = await getUsers({
        query: [{ full_name: value }],
        client: 'admin',
      });

      return _usuarios?.data?.map((user: any) => ({
        value: user.id,
        label: (user?.nombre || ' ') + ' ' + (user?.apellidos || ' '),
      }));
    }
  };

  return (
    <Flex
      direction="column"
      p="30px"
      boxSize="100%"
      gridRowGap="30px"
      overflow="overlay"
    >
      <Flex minH="fit-content" w="100%" direction="column" gridRowGap="8px">
        <Box fontSize="18px" fontWeight="semibold">
          Información General
        </Box>

        <Box fontSize="14px" fontWeight="medium" color="#84889A">
          Información sobre el curso, como el título del mismo, descripción,
          logotipo, etc...
        </Box>
      </Flex>

      <Flex direction={{ base: 'column', lg: 'row' }} gridGap="30px" w="100%">
        <Flex direction="column" w="100%" gridGap="30px">
          <InformationInput
            name="titulo"
            label="Titulo"
            defaultValue={curso.titulo}
            updateValue={updateValue}
          />

          <InformationAsyncSelect
            name="profesorId"
            label="Profesor"
            updateValue={updateValue}
            loadOptions={loadProfesores}
            defaultValue={{
              label: curso.profesor?.username,
              value: curso.profesorId,
            }}
          />

          <Flex
            width="100%"
            direction={{ base: 'column', lg: 'row' }}
            gridGap="30px"
          >
            <InformationSelect
              name="publicado"
              label="Estado"
              updateValue={updateValue}
              style={{ width: '100%' }}
              defaultValue={{
                label: curso.publicado ? 'Publicado' : 'Oculto',
                value: curso.publicado,
              }}
              options={[
                { label: 'Publicado', value: true },
                { label: 'Oculto', value: false },
              ]}
            />

            <InformationSelect
              name="extra"
              label="Curso extra"
              updateValue={updateValue}
              style={{ width: '100%' }}
              defaultValue={{
                label: curso.extra ? 'Sí' : 'No',
                value: curso.extra,
              }}
              options={[
                { label: 'Sí', value: true },
                { label: 'No', value: false },
              ]}
            />
          </Flex>

          <InformationSelect
            name="nivel"
            label="Nivel"
            updateValue={updateValue}
            defaultValue={{ label: curso.nivel, value: curso.nivel }}
            options={[
              {
                label: CursoNivelEnum.AVANZADO,
                value: CursoNivelEnum.AVANZADO,
              },
              {
                label: CursoNivelEnum.INTERMEDIO,
                value: CursoNivelEnum.INTERMEDIO,
              },
              { label: CursoNivelEnum.INICIAL, value: CursoNivelEnum.INICIAL },
              { label: CursoNivelEnum.EXTRA, value: CursoNivelEnum.EXTRA },
            ]}
          />

          <InformationTextEditor
            name="descripcion"
            label="Descripción del curso"
            placeholder="Introduce el texto"
            defaultValue={curso.descripcion}
            updateValue={updateValue}
          />
        </Flex>

        <Flex direction="column" w="100%" gridGap="30px">
          <InformationFilepond
            name="imagen"
            label="Portada"
            putEP={'/godAPI/cursos/' + curso.id}
            isDisabled={!curso?.id}
          />

          <InformationMde
            name="iconoMonocroo"
            label="Icono monocromo"
            placeholder="Introduce el texto"
            defaultValue={curso.iconoMonocromo}
            updateValue={updateValue}
          />

          <InformationMde
            name="icono"
            label="Icono a color"
            placeholder="Introduce el texto"
            defaultValue={curso.icono}
            updateValue={updateValue}
          />
        </Flex>
      </Flex>
    </Flex>
  );
};
