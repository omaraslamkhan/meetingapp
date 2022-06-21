import * as React from "react";
import Button from "@mui/material/Button";

const CustomButton = (props) => {
  return (
    <div style={{textAlign: 'left', padding: '20px'}}>
      <Button variant="contained" onClick={props.onClick}>
        {props.btnText}
      </Button>
    </div>
  );
};

export default CustomButton;
