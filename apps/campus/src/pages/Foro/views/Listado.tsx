import { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Flex, toast } from '@chakra-ui/react';

import { onFailure } from '@clevery-lms/utils';
import { ICurso, IForoTema } from '@clevery-lms/data';
import { PageHeader } from '../components/PageHeader';
import { PageSidebar } from '../components/PageSidebar';
import { RoadmapContext } from '../../../shared/context';
import { GlobalCard, GlobalCardType } from '../../../shared/components';
import {
  filterCursosByRuta,
  filterCursosOutsideRuta,
  getCursos,
  useForoTemas,
} from '@clevery-lms/data';

type LocationProps = {
  state: { cursoId: number | string };
};

const ForoList = () => {
  const navigate = useNavigate();
  const location = useLocation() as unknown as LocationProps;
  const { ruta } = useContext(RoadmapContext);

  const [cursos, setCursos] = useState([]);
  const [cursoInHash, setCursoInHash] = useState<ICurso>();

  const [queryTemas, setQueryTemas] = useState<any[]>([
    { curso_id: 1 },
    { limit: 1000 },
  ]);
  const { data: temas, isLoading } = useForoTemas({ query: queryTemas });

  useEffect(() => {
    const lState: any = location.state;

    // Al entrar a la página de foros sin hash,
    // seleccionamos el primer curso de la hoja de ruta
    if (!lState?.cursoId)
      navigate(`/foro`, { state: { cursoId: ruta?.meta?.itinerario[0] } });
    else if (cursos) refreshCursoInHash(cursos);
  }, [location.state]);

  useEffect(() => {
    if (ruta) {
      (async () => {
        const _cursos = await getCursos({
          query: [{ limit: 1000 }],
          treatData: false,
        });

        if (_cursos?.data) {
          setCursos(_cursos.data);
          refreshCursoInHash(_cursos.data);
        } else {
          onFailure(
            toast,
            'Error inesperado',
            'Por favor, actualice la página y contacte con soporte si el error persiste.'
          );
        }
      })();
    }
  }, [ruta]);

  useEffect(() => {
    // Si hay marcado un curso en el hash, y por tanto en
    // el page-sidebar, cargamos los temas de dicho curso
    if (cursoInHash?.id)
      setQueryTemas([{ curso_id: cursoInHash.id }, { limit: 1000 }]);
  }, [cursoInHash]);

  /** Actualizamos el curso que obtenemos del ID del hashcode de la página, para
   * mostrar correctamente los temas correspondientes del foro. */
  const refreshCursoInHash = (cursos: ICurso[]) => {
    const lState: any = location.state;

    const curso = cursos?.find(
      (c: ICurso) => (lState?.cursoId || '') === +(c.id || 0)
    );
    setCursoInHash(curso);
  };

  const onQuery = (order: string, sort: string, search: string) => {
    if (cursoInHash?.id)
      setQueryTemas([
        { curso_id: cursoInHash.id },
        { limit: 1000 },
        { sort_by: sort },
        { order },
        { titulo: search },
      ]);
  };

  return (
    <Flex
      w="100%"
      p={{ base: '20px', sm: '34px' }}
      gap="40px"
      direction={{ base: 'column', md: 'row' }}
      h="100%"
    >
      <PageSidebar
        itemsRuta={filterCursosByRuta(
          ruta?.meta?.itinerario || [],
          cursos
        )?.map((c: ICurso) => ({
          icono: c.icono,
          titulo: c.titulo,
          slug: `curso-${c.id}`,
          onClick: () => navigate('/foro', { state: { cursoId: c.id } }),
          isActive: (location.state?.cursoId || '') === +(c.id || 0),
        }))}
        itemsOtros={filterCursosOutsideRuta(
          ruta?.meta?.itinerario || [],
          cursos
        )?.map((c: ICurso) => ({
          icono: c.icono,
          titulo: c.titulo,
          slug: `curso-${c.id}`,
          onClick: () => navigate('/foro', { state: { cursoId: c.id } }),
          isActive: (location.state?.cursoId || '') === +(c.id || 0),
        }))}
      />

      <Flex direction="column" gap="20px" w="100%">
        <PageHeader
          titulo={cursoInHash?.titulo}
          icono={cursoInHash?.icono}
          onQuery={onQuery}
        />

        <Flex w="100%" gap="20px 15px" wrap="wrap" pb="40px">
          {isLoading || !cursoInHash
            ? [1, 2, 3, 4, 5, 6, 7, 8, 9]?.map(
                (tema: number, index: number) => (
                  <GlobalCard
                    maxPerRow={5}
                    gapBetween="15px"
                    key={`tema-placeholder_item-${index}`}
                    type={GlobalCardType.TEMA}
                    props={{ tema, index, isLoading: true }}
                  />
                )
              )
            : temas?.map((tema: IForoTema, index: number) => (
                <GlobalCard
                  maxPerRow={5}
                  gapBetween="15px"
                  key={`tema-item-${index}`}
                  type={GlobalCardType.TEMA}
                  props={{ tema, index }}
                  onClick={() => navigate(`/foro/${tema.id}`)}
                />
              ))}
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ForoList;
