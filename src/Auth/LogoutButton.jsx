import * as React from "react";
import { forwardRef } from "react";
import { useLogout } from "react-admin";
import MenuItem from "@material-ui/core/MenuItem";
import ExitIcon from "@material-ui/icons/PowerSettingsNew";
import { useMsal } from "@azure/msal-react";

const LogoutButton = forwardRef((props, ref) => {
  const logout = useLogout();
  const { instance } = useMsal();

  const handleClick = async () => {
    await logout();
    await instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };

  return (
    <MenuItem onClick={handleClick} ref={ref}>
      <ExitIcon /> Logout
    </MenuItem>
  );
});

export default LogoutButton;
