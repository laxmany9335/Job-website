import { Box, Button } from "@mui/material";

const ButtonBox = ({ icon, text, ...props }) => {
  return (
    <Button
      variant="outlined"
      fullWidth
      {...props}
      sx={{
        textTransform: "none",
        color: "black",
        borderColor: "#D1D5DB",
        "&:hover": { backgroundColor: "#f5f5f5" },
        display: "flex",
        justifyContent: "center", 
        alignItems: "center",
        position: "relative", 
        padding: "10px", 
        ...props.sx, 
      }}
    >
 
      <Box
        sx={{
          position: "absolute",
          left: "20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        {icon}
      </Box>
      {text}
    </Button>
  );
};

export default ButtonBox;



// import React from 'react';
// import Button from '@mui/material/Button';

// const ButtonBox = ({
//   children,
//   type = 'button',
//   color = 'primary',
//   fullWidth = false,
//   variant = 'contained',
//   onClick,
//   ...otherProps
// }) => {
//   return (
//     <Button
//       type={type}
//       fullWidth={fullWidth}
//       color={color}
//       variant={variant}
//       onClick={onClick}
//       {...otherProps}
//     >
//       {children}
//     </Button>
//   );
// };

// export default ButtonBox;