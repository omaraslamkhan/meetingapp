import * as React from "react";
import PropTypes from "prop-types";
import { withTypes } from "react-final-form";

import {
  Avatar,
  Button,
  Card,
  CardActions,
  CircularProgress,
  ButtonGroup,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Lock } from "@material-ui/icons";
import { Notification, useLogin, useNotify } from "react-admin";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { callMsGraph } from "../graph";
import { callMsDirectory } from "../directory";

const { Form } = withTypes();

const useStyles = makeStyles((theme) => ({
  main: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "flex-start",
    background: "url(https://i.imgur.com/rUBUUsJ.jpg)",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  card: {
    minWidth: 300,
    marginTop: "6em",
  },
  avatar: {
    margin: "1em",
    display: "flex",
    justifyContent: "center",
  },
  icon: {
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    padding: "0 1em 1em 1em",
  },
  actions: {
    padding: "0 1em 1em 1em",
  },
}));

const Login = () => {
  const [loading, setLoading] = React.useState(false);
  const classes = useStyles();
  const notify = useNotify();
  const login = useLogin();
  const { instance, accounts } = useMsal();

  React.useEffect(() => {
    if (!accounts?.length) return;

    setLoading(true);
    instance
      .acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      })
      .then((response) => {
        callMsGraph(response.accessToken).then(async (response) => {
          await login(response);
          setLoading(false);
        });
      });
  }, [accounts]);

  const handleSubmit = () => {
    setLoading(true);
    instance.loginRedirect(loginRequest).catch((error) => {
      setLoading(false);
      notify(
        typeof error === "string"
          ? error
          : typeof error === "undefined" || !error.message
          ? "Error while signing in"
          : error.message,
        "warning",
        {
          _:
            typeof error === "string"
              ? error
              : error && error.message
              ? error.message
              : undefined,
        }
      );
    });
  };

  return (
    <Form
      onSubmit={handleSubmit}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} noValidate>
          <div className={classes.main}>
            <Card className={classes.card}>
              <div className={classes.avatar}>
                <Avatar className={classes.icon}>
                  <Lock />
                </Avatar>
              </div>
              <CardActions className={classes.actions}>
                <ButtonGroup orientation="vertical" variant="text" fullWidth>
                  <Button
                    variant="contained"
                    type="submit"
                    color="primary"
                    disabled={loading}
                  >
                    {loading && <CircularProgress size={25} thickness={2} />}
                    SIGN IN
                  </Button>
                </ButtonGroup>
              </CardActions>
            </Card>
            <Notification />
          </div>
        </form>
      )}
    />
  );
};

Login.propTypes = {
  authProvider: PropTypes.func,
  previousRoute: PropTypes.string,
};

export default Login;
