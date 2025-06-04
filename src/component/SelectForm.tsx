import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

export interface Data {
  label: string;
  value: string;
}

type Props = {
  label?: string;
  value?: Data | null;
  dataList: Data[];
  onChange?: (value: Data | null) => void;
  loading?: boolean;
};

export default function SelectForm({
  label,
  value,
  dataList: recognitionModelList,
  onChange,
  loading = false,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Data[]>([]);

  React.useEffect(() => {
    if (open) {
      setOptions(recognitionModelList);
    } else {
      setOptions([]);
    }
  }, [open, recognitionModelList]);

  return (
    <Autocomplete
      sx={{ width: '100%' }}
      size="small"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      options={options}
      value={value ?? null}
      onChange={(_, value) => onChange?.(value)}
      loading={loading}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
}
