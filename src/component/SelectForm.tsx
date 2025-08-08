import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
// import CircularProgress from '@mui/material/CircularProgress';

export interface Data {
  label: string;
  value: string;
}

type Props = {
  label?: string;
  value?: Data | Data[] | null;
  dataList: Data[];
  onChange?: (value: Data | Data[] | null) => void;
  loading?: boolean;
  required?: boolean;
  multiple?: boolean;
  error?: boolean;
  helperText?: string;
  isClearable?: boolean;
  isDisable?: boolean;
};

export default function SelectForm({
  label,
  value = null,
  dataList,
  onChange,
  required = false,
  loading = false,
  multiple = false, // default 1
  error = false,
  helperText = '',
  isClearable = true,
  isDisable = false,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<Data[]>([]);

  React.useEffect(() => {
    if (open) {
      setOptions(dataList);
    } else {
      setOptions([]);
    }
  }, [open, dataList]);

  return (
    <Autocomplete
      multiple={multiple}
      disabled={isDisable}
      sx={{ width: '100%' }}
      size="small"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => {
        if (!option || !value) return false;
        return option.value === value.value;
      }}
      disableClearable={!isClearable}
      getOptionLabel={(option) => option.label}
      options={options}
      value={value ?? (multiple ? [] : null)}
      onChange={(_, newValue) => onChange?.(newValue)}
      loading={loading}
      renderInput={(params) => (
        <TextField
          required={required}
          {...params}
          label={label}
          error={error}
          helperText={helperText}
        />
      )}
    />
  );
}
