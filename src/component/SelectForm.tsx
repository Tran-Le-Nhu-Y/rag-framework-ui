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
  multiple?: boolean;
};

export default function SelectForm({
  label,
  value = null,
  dataList,
  onChange,
  loading = false,
  multiple = false, // default 1
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
      sx={{ width: '100%' }}
      size="small"
      open={open}
      onOpen={() => setOpen(true)}
      onClose={() => setOpen(false)}
      isOptionEqualToValue={(option, value) => option.value === value.value}
      getOptionLabel={(option) => option.label}
      options={options}
      value={value ?? (multiple ? [] : null)}
      onChange={(_, newValue) => onChange?.(newValue)}
      loading={loading}
      renderInput={(params) => (
        // <TextField
        //   {...params}
        //   label={label}
        //   InputProps={{
        //     ...params.InputProps,
        //     endAdornment: (
        //       <>
        //         {loading ? (
        //           <CircularProgress color="inherit" size={20} />
        //         ) : null}
        //         {params.InputProps.endAdornment}
        //       </>
        //     ),
        //   }}
        // />
        <TextField {...params} label={label} />
      )}
    />
  );
}
