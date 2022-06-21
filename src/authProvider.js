import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { config } from "./authConfig";

export default {
  login: async (creds) => {
    try {
      const url = `${process.env.REACT_APP_URI}/login`,
        payload = {
          email: creds.userPrincipalName,
          firstName: creds.givenName,
          lastName: creds.surname,
          designation: creds.jobTitle,
        };

      const request = new Request(url, {
        method: "POST",
        body: JSON.stringify(payload),
        headers: new Headers({
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers":
            "Origin, X-Requested-With, Content-Type, Accept",
        }),
      });
      const resp = await fetch(request);
      if (resp.status < 200 || resp.status >= 300) {
        throw "Error while signing in";
      }
      const auth = await resp.json();
      localStorage.setItem("user", JSON.stringify(auth));
      return auth;
    } catch (err) {
      console.error(err);
      return Promise.reject(err);
    }
  },
  // called when the user clicks on the logout button
  logout: () => {
    localStorage.removeItem("user");
    return Promise.resolve("/login");
  },
  // called when the API returns an error
  checkError: ({ status }) => {
    if (status === 401 || status === 403) {
      localStorage.removeItem("user");
      return Promise.reject();
    }
    return Promise.resolve();
  },
  // called when the user navigates to a new location, to check for authentication
  checkAuth: () => {
    return localStorage.getItem("user") ? Promise.resolve() : Promise.reject();
  },
  // called when the user navigates to a new location, to check for permissions / roles
  getPermissions: () => {
    if (document.location.hash.includes("signup")) {
      return Promise.resolve("guest");
    }

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) return Promise.reject();

    const hasAdminRights = !!user?.hasAdminRights;
    return Promise.resolve(hasAdminRights ? "admin" : "user");
  },
  getIdentity: () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      return Promise.resolve({
        ...user,
        fullName: user.firstName + " " + user.lastName,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },
};
