import { createContext } from 'react';
import { IRuta } from '@clevery-lms/data';

interface ContextProps {
  ruta?: IRuta | null;
  setRuta: (e: any) => void;
}

export const RoadmapContext = createContext<ContextProps>({
  ruta: undefined,
  setRuta: (e: any) => {},
});
