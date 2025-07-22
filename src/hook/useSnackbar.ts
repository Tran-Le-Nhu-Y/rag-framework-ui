import { createContext, useContext } from 'react';
import { type SnackbarSeverity } from '../util';

interface SnackbarShowProps {
  message?: string;
  severity?: SnackbarSeverity;
  duration?: number;
}

interface SnackbarProps {
  show: (props: SnackbarShowProps) => void;
  close: () => void;
}

const SnackbarContext = createContext<SnackbarProps>({
  show: () => {},
  close: () => {},
});

const useSnackbar = () => {
  return useContext(SnackbarContext);
};

export { useSnackbar, SnackbarContext };
export type { SnackbarProps, SnackbarShowProps };
