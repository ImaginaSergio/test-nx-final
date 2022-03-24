import { createContext } from 'react';
import { IConfig } from '@clevery-lms/data';

interface ContextProps {
  config?: IConfig;
  setConfig: (config: IConfig) => void;
}

export const ConfigContext = createContext<ContextProps>({
  config: undefined,
  setConfig: (config: IConfig) => {},
});
