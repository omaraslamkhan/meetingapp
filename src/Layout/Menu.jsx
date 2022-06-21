import * as React from "react";
import { useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import {
  Group as UserIcon,
  Event as CalendarIcon,
  ListAlt as AssessmentIcon,
} from "@material-ui/icons";
import classnames from "classnames";
import { usePermissions, DashboardMenuItem, MenuItemLink } from "react-admin";

const Menu = ({ dense = false }) => {
  const classes = useStyles();
  const open = useSelector((state) => state.admin.ui.sidebarOpen);
  const { loading, permissions } = usePermissions();
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    setIsAdmin(permissions === "admin");
  }, [permissions, loading]);

  return (
    <div
      className={classnames(classes.root, {
        [classes.open]: open,
        [classes.closed]: !open,
      })}
    >
      {" "}
      <DashboardMenuItem />
      <MenuItemLink
        to={{
          pathname: "/meetings",
          state: { _scrollToTop: true },
        }}
        primaryText="MoM"
        leftIcon={<CalendarIcon />}
        dense={dense}
      />
      <MenuItemLink
        to={{
          pathname: "/points",
          state: { _scrollToTop: true },
        }}
        primaryText="Tasks"
        leftIcon={<AssessmentIcon />}
        dense={dense}
      />
      {!loading && isAdmin && (
        <MenuItemLink
          to={{
            pathname: "/users",
            state: { _scrollToTop: true },
          }}
          primaryText="Users"
          leftIcon={<UserIcon />}
          dense={dense}
        />
      )}
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  open: {
    width: 200,
  },
  closed: {
    width: 55,
  },
}));

export default Menu;
