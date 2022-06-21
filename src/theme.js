import { defaultTheme } from "react-admin";
import merge from "lodash/merge";
import { indigo, red, pink } from "@material-ui/core/colors";

export default merge({}, defaultTheme, {
  palette: {
    primary: indigo,
    secondary: pink,
    error: red,
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Arial",
      "sans-serif",
    ].join(","),
    h5: {
      color: "#7e57c2",
    },
  },
  overrides: {
    // MuiButton: { // override the styles of all instances of this component
    //     root: { // Name of the rule
    //         background: '#7e57c2', // Some CSS
    //     },
    //     textPrimary: {
    //       color: 'white'
    //     }
    // },
    MuiAppBar: {
      colorSecondary: {
        color: "white",
        backgroundColor: "#7e57c2",
      },
    },
  },
});
