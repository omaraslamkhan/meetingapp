import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function CustomizedSnackbars(props) {
  return (
    <Snackbar anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} open={props.open} autoHideDuration={5000}>
      <Alert severity={props.type} sx={{ width: "100%" }}>
        {props.text}
      </Alert>
    </Snackbar>
  );
}
