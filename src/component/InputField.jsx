
import React from 'react';
import TextField from '@mui/material/TextField';


const InputField = ({ label, type = 'text', value, onChange, error = false, helperText = '', fullWidth = true, variant = 'outlined', ...otherProps
}) => {
  return (
    <TextField
      label={label}
      type={type}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      fullWidth={fullWidth}
      variant={variant}
      {...otherProps}
    />
  );
};

export default InputField;