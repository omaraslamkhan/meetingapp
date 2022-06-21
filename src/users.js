import * as React from "react";
import { useMediaQuery } from "@material-ui/core";
import {
  List,
  Datagrid,
  EmailField,
  TextField,
  BooleanField,
  FunctionField,
} from "react-admin";

export const UserList = (props) => {
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  return (
    <List title="All users" {...props}>
      <Datagrid>
        <FunctionField
          label="Name"
          render={(record) => `${record.firstName} ${record.lastName}`}
        />
        <EmailField source="email" />
        <TextField source="designation.designation" label="Designation" />
        <TextField source="department.name" label="Department" />
        <BooleanField source="hasAdminRights" label="Has Admin Rights" />
      </Datagrid>
    </List>
  );
};
