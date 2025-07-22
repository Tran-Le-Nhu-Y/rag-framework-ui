// component/AppSnackbar.tsx
import { Alert, Snackbar } from '@mui/material';
import React, { useState, type PropsWithChildren } from 'react';
import type { SnackbarSeverity } from '../util';
import { SnackbarContext } from '../hook/useSnackbar';

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

  return (
    <SnackbarContext
      value={{
        show: (props) => {
          setState({ open: true, ...props });
        },
        close: () => {
          setState({ open: false });
        },
      }}
    >
      <Snackbar
        open={state.open}
        autoHideDuration={Number(state.duration ?? 3000)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => {
            setState({ open: false });
          }}
          severity={state.severity}
          sx={{ width: '100%' }}
        >
          {state.message ?? ''}
        </Alert>
      </Snackbar>
      {children}
    </SnackbarContext>
  );
};

export default AppSnackbar;
