import { createContext, useContext } from 'react';
import { type SnackbarSeverity } from '../util';

interface SnackbarProps {
  show: (props: {
    message?: string;
    severity?: SnackbarSeverity;
    duration?: number;
  }) => void;
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
export type { SnackbarProps };
