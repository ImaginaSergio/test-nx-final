import { createContext } from 'react';
import { IProgresoGlobal } from '@clevery-lms/data';

interface ContextProps {
  progresoGlobal?: IProgresoGlobal | null;
  setProgresoGlobal: (e: any) => void;
}

export const ProgresoGlobalContext = createContext<ContextProps>({
  progresoGlobal: undefined,
  setProgresoGlobal: () => {},
});
