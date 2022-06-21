import * as React from "react";
import { Layout } from "react-admin";
import Menu from "./Menu";

export default (props) => {
  return <Layout {...props} menu={Menu} />;
};
