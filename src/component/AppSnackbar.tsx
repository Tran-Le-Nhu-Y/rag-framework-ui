// component/AppSnackbar.tsx
import { Alert, Snackbar } from '@mui/material';
import React, { useCallback, useState, type PropsWithChildren } from 'react';
import type { SnackbarSeverity } from '../util';
import { SnackbarContext, type SnackbarShowProps } from '../hook/useSnackbar';

interface AppSnackbarState {
  open: boolean;
  message?: string;
  severity?: SnackbarSeverity;
  duration?: number;
}

const AppSnackbar: React.FC<PropsWithChildren> = ({ children }) => {
  const [state, setState] = useState<AppSnackbarState>({
    open: false,
  });

  const show = useCallback(
    (props: SnackbarShowProps) => setState({ open: true, ...props }),
    []
  );
  const close = useCallback(() => setState({ open: false }), []);

  return (
    <SnackbarContext value={{ show, close }}>
      <Snackbar
        open={state.open}
        autoHideDuration={state.duration ?? 3000}
        onClose={close}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={close} severity={state.severity} sx={{ width: '100%' }}>
          {state.message ?? ''}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext>
  );
};

export default AppSnackbar;
