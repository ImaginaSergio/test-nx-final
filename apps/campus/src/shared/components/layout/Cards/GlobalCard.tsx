import { Flex } from '@chakra-ui/react';

import { CardTema } from './CardTema';
import { CardExamen } from './CardExamen';
import { CardRoadmap } from './CardRoadmap';
import { CardProceso } from './CardProceso';
import { CardFavorito } from './CardFavorito';
import { CardNota } from './CardNota/CardNota';
import { CardCertificacion } from './CardCertificacion';
import { CardCurso, CardCursoActivo } from './CardCurso';
import { CardProyectoPublico, CardProyectoPropio, CardProyectoNuevo } from './CardProyecto';

export enum GlobalCardType {
  ROADMAP = 'roadmap',
  CERTIFICACION = 'certificacion',
  CURSO = 'curso',
  EXAMEN = 'examen',
  PROYECTO = 'proyecto',
  PROYECTO_PUBLICO = 'proyecto_publico',
  PROYECTO_PROPIO = 'proyecto_propio',
  PROYECTO_NUEVO = 'proyecto_nuevo',
  NOTA = 'nota',
  PROCESO = 'proceso',
  FAVORITO = 'favorito',
  CURSO_ACTIVO = 'curso_activo',
  TEMA = 'tema',
}

export type GlobalCardProps = {
  type: GlobalCardType;
  props: any;
  maxPerRow?: number;
  gapBetween?: string;
  onClick?: (e?: any) => any;
  style?: React.CSSProperties;
  width?: any;
};

export const GlobalCard = ({ type, onClick, maxPerRow = 1, gapBetween = '0px', style, width, props }: GlobalCardProps) => {
  const renderContent = (t: string) => {
    switch (type) {
      case GlobalCardType.ROADMAP:
        return <CardRoadmap {...props} />;
      case GlobalCardType.CURSO:
        return <CardCurso {...props} />;
      case GlobalCardType.CURSO_ACTIVO:
        return <CardCursoActivo {...props} />;
      case GlobalCardType.CERTIFICACION:
        return <CardCertificacion {...props} />;
      case GlobalCardType.PROCESO:
        return <CardProceso {...props} />;
      case GlobalCardType.PROYECTO_PUBLICO:
        return <CardProyectoPublico {...props} />;
      case GlobalCardType.PROYECTO_PROPIO:
        return <CardProyectoPropio {...props} />;
      case GlobalCardType.PROYECTO_NUEVO:
        return <CardProyectoNuevo {...props} />;
      case GlobalCardType.NOTA:
        return <CardNota {...props} />;
      case GlobalCardType.FAVORITO:
        return <CardFavorito {...props} />;
      case GlobalCardType.EXAMEN:
        return <CardExamen {...props} />;
      case GlobalCardType.TEMA:
        return <CardTema {...props} />;
    }
  };

  return (
    <Flex
      w={width || '100%'}
      bg="white"
      rounded="2xl"
      h="fit-content"
      justify="start"
      cursor="pointer"
      overflow="hidden"
      onClick={onClick}
      transition="all 0.2s ease"
      border="1px solid var(--chakra-colors-gray_3)"
      _hover={{ backgroundColor: 'var(--chakra-colors-gray_2)' }}
      maxW={
        width
          ? width
          : {
              base:
                maxPerRow - 4 <= 1
                  ? '100%'
                  : `calc((100% - (${gapBetween} * ${Math.max(1, maxPerRow - 5)})) / ${maxPerRow - 4})`,
              sm:
                maxPerRow - 3 <= 1
                  ? '100%'
                  : `calc((100% - (${gapBetween} * ${Math.max(1, maxPerRow - 4)})) / ${maxPerRow - 3})`,
              md:
                maxPerRow - 2 <= 1
                  ? '100%'
                  : `calc((100% - (${gapBetween} * ${Math.max(1, maxPerRow - 3)})) / ${maxPerRow - 2})`,
              lg:
                maxPerRow - 1 <= 1
                  ? '100%'
                  : `calc((100% - (${gapBetween} * ${Math.max(1, maxPerRow - 2)})) / ${maxPerRow - 1})`,
              '2xl': maxPerRow <= 1 ? '100%' : `calc((100% - (${gapBetween} * ${Math.max(1, maxPerRow - 1)})) / ${maxPerRow})`,
            }
      }
      style={style}
    >
      {renderContent(type)}
    </Flex>
  );
};
