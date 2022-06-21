import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { register } from "./SignupStyles";
import InputAdornment from "@material-ui/core/InputAdornment";
import { userLogin } from "react-admin";
import { connect } from "react-redux";

import CssBaseline from "@material-ui/core/CssBaseline";
import Paper from "@material-ui/core/Paper";
import {
  FormControl,
  Input,
  InputLabel,
  Button,
  Select,
  MenuItem,
} from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import VisibilityTwoToneIcon from "@material-ui/icons/VisibilityTwoTone";
import VisibilityOffTwoToneIcon from "@material-ui/icons/VisibilityOffTwoTone";
import CloseIcon from "@material-ui/icons/Close";

class Registration extends Component {
  state = {
    email: "",
    password: "",
    passwordConfrim: "",
    designation: "",
    firstName: "",
    lastName: "",
    hidePassword: true,
    error: null,
    errorOpen: false,
    designationsList: [],
  };

  errorClose = (e) => {
    this.setState({
      errorOpen: false,
    });
  };

  handleChange = (name) => (e) => {
    this.setState({
      [name]: e.target.value,
    });
  };

  passwordMatch = () => this.state.password === this.state.passwordConfrim;

  showPassword = () => {
    this.setState((prevState) => ({ hidePassword: !prevState.hidePassword }));
  };

  isValid = () => {
    return (
      !!this.state.email &&
      !!this.state.firstName &&
      !!this.state.lastName &&
      !!this.state.designation &&
      !!this.state.password &&
      this.state.password === this.state.passwordConfrim
    );
  };

  submitRegistration = (e) => {
    e.preventDefault();
    if (!this.passwordMatch()) {
      this.setState({
        errorOpen: true,
        error: "Passwords don't match",
      });
    }
    const newUserCredentials = {
      email: this.state.email,
      password: this.state.password,
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      designation: this.state.designation,
      mode: "signup",
    };

    this.props.userLogin(newUserCredentials);
  };

  async componentDidMount() {
    try {
      const request = new Request(`${process.env.REACT_APP_URI}/designations`, {
        method: "GET",
        headers: new Headers({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        }),
      });
      const resp = await fetch(request);
      if (resp.status < 200 || resp.status >= 300) {
        throw new Error(response.statusText);
      }
      const list = await resp.json();
      this.setState({
        designationsList: list,
      });
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.main}>
        <CssBaseline />
        <Paper className={classes.paper}>
          <form
            className={classes.form}
            onSubmit={() => this.submitRegistration}
          >
            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="email" className={classes.labels}>
                Email
              </InputLabel>
              <Input
                name="email"
                type="email"
                autoComplete="off"
                className={classes.inputs}
                disableUnderline={true}
                onChange={this.handleChange("email")}
              />
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="firstName" className={classes.labels}>
                First Name
              </InputLabel>
              <Input
                name="firstName"
                type="text"
                autoComplete="off"
                className={classes.inputs}
                disableUnderline={true}
                onChange={this.handleChange("firstName")}
              />
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="lastName" className={classes.labels}>
                Last Name
              </InputLabel>
              <Input
                name="lastName"
                type="text"
                autoComplete="off"
                className={classes.inputs}
                disableUnderline={true}
                onChange={this.handleChange("lastName")}
              />
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="designations" className={classes.labels}>
                Designations
              </InputLabel>
              <Select
                className={classes.inputs}
                value={this.state.designation}
                onChange={this.handleChange("designation")}
              >
                {this.state.designationsList.map((des) => (
                  <MenuItem value={des.id}>{des.designation}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="password" className={classes.labels}>
                Password
              </InputLabel>
              <Input
                name="password"
                autoComplete="password"
                className={classes.inputs}
                disableUnderline={true}
                onChange={this.handleChange("password")}
                type={this.state.hidePassword ? "password" : "input"}
                endAdornment={
                  this.state.hidePassword ? (
                    <InputAdornment position="end">
                      <VisibilityOffTwoToneIcon
                        fontSize="default"
                        className={classes.passwordEye}
                        onClick={this.showPassword}
                      />
                    </InputAdornment>
                  ) : (
                    <InputAdornment position="end">
                      <VisibilityTwoToneIcon
                        fontSize="default"
                        className={classes.passwordEye}
                        onClick={this.showPassword}
                      />
                    </InputAdornment>
                  )
                }
              />
            </FormControl>

            <FormControl required fullWidth margin="normal">
              <InputLabel htmlFor="passwordConfrim" className={classes.labels}>
                Confrim Password
              </InputLabel>
              <Input
                name="passwordConfrim"
                autoComplete="passwordConfrim"
                className={classes.inputs}
                disableUnderline={true}
                onClick={this.state.showPassword}
                onChange={this.handleChange("passwordConfrim")}
                type={this.state.hidePassword ? "password" : "input"}
                endAdornment={
                  this.state.hidePassword ? (
                    <InputAdornment position="end">
                      <VisibilityOffTwoToneIcon
                        fontSize="default"
                        className={classes.passwordEye}
                        onClick={this.showPassword}
                      />
                    </InputAdornment>
                  ) : (
                    <InputAdornment position="end">
                      <VisibilityTwoToneIcon
                        fontSize="default"
                        className={classes.passwordEye}
                        onClick={this.showPassword}
                      />
                    </InputAdornment>
                  )
                }
              />
            </FormControl>
            <Button
              disabled={!this.isValid()}
              disableRipple
              fullWidth
              variant="outlined"
              className={classes.button}
              type="submit"
              onClick={this.submitRegistration}
            >
              Join
            </Button>
          </form>

          {this.state.error ? (
            <Snackbar
              variant="error"
              key={this.state.error}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center",
              }}
              open={this.state.errorOpen}
              onClose={this.errorClose}
              autoHideDuration={3000}
            >
              <SnackbarContent
                className={classes.error}
                message={
                  <div>
                    <span style={{ marginRight: "8px" }}>
                      <ErrorIcon fontSize="large" color="error" />
                    </span>
                    <span> {this.state.error} </span>
                  </div>
                }
                action={[
                  <IconButton
                    key="close"
                    aria-label="close"
                    onClick={this.errorClose}
                  >
                    <CloseIcon color="error" />
                  </IconButton>,
                ]}
              />
            </Snackbar>
          ) : null}
        </Paper>
      </div>
    );
  }
}
export default connect(undefined, { userLogin })(
  withStyles(register)(Registration)
);
