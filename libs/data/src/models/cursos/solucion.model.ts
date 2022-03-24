import { ILeccion } from '..';
import { ApiItem } from '../common.model';

export interface ISolucion extends ApiItem {
  leccionId: string;
  contenido: string;
  publicado: boolean;

  leccion?: ILeccion;
}
