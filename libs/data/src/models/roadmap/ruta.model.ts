import { ApiItem } from '../common.model';

export interface IRuta extends ApiItem {
  nombre: string;
  itinerario: string;

  meta?: {
    itinerario: number[];
  };
}
