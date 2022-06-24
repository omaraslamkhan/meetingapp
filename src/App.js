import * as React from "react";
import { Group as UserIcon, Event as CalendarIcon } from "@material-ui/icons";
import { Admin, Resource, fetchUtils } from "react-admin";
import jsonServerProvider from "ra-data-json-server";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

import { ListMeeting, EditMeeting, CreateMeeting } from "./Meetings";
import Tasks from "./Points";
import Login from "./Auth/Login";
import LogoutButton from "./Auth/LogoutButton";
import { UserList } from "./users";
import authProvider from "./authProvider";
import CustomRoutes from "./CustomRoutes";
import Agendas from "./Agendas";
import momTheme from "./theme";
import Layout from "./Layout";
import Dashboard from "./Dashboard";
import { createBrowserHistory as createHistory } from "history";

const history = createHistory();

const httpClient = (url, options = {}) => {
  if (!options.headers) {
    options.headers = new Headers({ Accept: "application/json" });
  }
  const user = JSON.parse(localStorage.getItem("user"));
  const hasAdminRights = !!user?.hasAdminRights;

  if (!hasAdminRights) {
    options.headers.set("UserId", user.id);
  }
  return fetchUtils.fetchJson(url, options);
};

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Admin
        title="MoM Portal"
        dataProvider={jsonServerProvider(process.env.REACT_APP_URI, httpClient)}
        authProvider={authProvider}
        customRoutes={CustomRoutes}
        history={history}
        logoutButton={LogoutButton}
        dashboard={Dashboard}
        theme={momTheme}
        loginPage={Login}
        layout={Layout}
      >
        {(permissions) => [
          <Resource
            name="meetings"
            icon={CalendarIcon}
            list={ListMeeting}
            edit={EditMeeting}
            create={CreateMeeting}
            agendas={Agendas}
            options={{ label: "MoM" }}
            // show={PostShow}
          />,
          permissions === "admin" ? (
            <Resource name="users" icon={UserIcon} list={UserList} />
          ) : (
            <Resource name="users" />
          ),
          <Resource name="departments" />,
          <Resource name="agendas" />,
          <Resource name="points" icon={CalendarIcon} list={Tasks} />,
        ]}
      </Admin>
    </LocalizationProvider>
  );
};
export default App;
