import * as React from "react";
import { Route } from "react-router-dom";
import Signup from "./Auth/Signup";
import { MeetingToPDF } from "./Meetings/MeetingExporter";
import Agendas from "./Agendas";

export default [
  <Route exact path="/signup" component={Signup} noLayout />,
  <Route exact path="/agendas" component={Agendas} />,
  <Route path="/reporting/:meetingId" component={MeetingToPDF} noLayout />,
];
