import * as React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";
App.use(express.static(__dirname));

App.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});
const msalInstance = new PublicClientApplication(msalConfig);
ReactDOM.render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <App />
    </MsalProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
registerServiceWorker();
