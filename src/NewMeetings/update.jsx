import React, { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SessionsTable from "./sessionsTable";
import Employees from "../employees";
import axios from "axios";
import accountService from "../_services/accountService";
import { Link, useHistory } from "react-router-dom";
import CustomButton from "../Generic/Button";
import requestHeaders from "../_helpers/headers";
import Notification from "../Generic/Notification";
import { BASE_URL } from "../config/productionConfig";

const UpdateMeeting = () => {
  const [meetingName, setMeetingName] = useState("");
  const [department, setDepartment] = useState(null);
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [check, setCheck] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [meetingDetails, setMeetingDetails] = useState({});
  const [users, setUsers] = useState([]);
  const [notificationState, setNotificationState] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const history = useHistory();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(async () => {
    const customizedUsers = [];
    const customizedDepartments = [];
    const meetingID = localStorage.getItem("meetingID");

    const departments = await axios.get(`${BASE_URL}/departments`, {
      headers: requestHeaders,
    });
    const users = await axios.get(`${BASE_URL}/users`, {
      headers: requestHeaders,
    });
    const meetingDetails = await axios.get(
      `${BASE_URL}/meetings/${meetingID}`,
      {
        headers: requestHeaders,
      }
    );

    users.data.map((item) => {
      let newObject = {
        id: item.id,
        label: item.title,
      };

      customizedUsers.push(newObject);
    });

    departments.data.map((item) => {
      let newObject = {
        id: item.id,
        label: item.name,
      };

      customizedDepartments.push(newObject);
    });

    setUsersList(customizedUsers);
    setDepartmentsList(customizedDepartments);
    setUsers(users.data);
    setMeetingDetails(meetingDetails.data);
  }, []);

  const fetchMeetings = async () => {
    const fetchedMeetings = await accountService.find(
      "",
      "meetings?_end=100&_order=ASC&_sort=id&_start=0"
    );

    setMeetings(fetchedMeetings.data);
  };

  React.useEffect(() => {
    fetchMeetings();
  }, []);

  useEffect(() => {
    const meetingID = localStorage.getItem("meetingID");

    if (meetings.length && usersList.length && departmentsList.length) {
      const currentMeeting = meetings.filter((item) => {
        return item.id == meetingID;
      });

      const organizer = usersList.filter((item) => {
        return item.id == currentMeeting[0].organizer.id;
      });

      const department = departmentsList.filter((item) => {
        return item.id == currentMeeting[0].department.id;
      });

      setSelectedOrganizer({
        id: organizer[0].id,
        label: organizer[0].label,
      });

      setDepartment({
        id: department[0].id,
        label: department[0].label,
      });

      setMeetingName(currentMeeting[0].subject);
    }
  }, [meetings, usersList, departmentsList]);

  useEffect(() => {
    if (meetingDetails.hasOwnProperty("sessions")) {
      setSessions(meetingDetails.sessions);
    }
  }, [meetingDetails]);

  useEffect(() => {
    if (meetingName.length) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  }, [meetingName]);

  const getOrganizer = (data) => {
    if (data != null) {
      const selected = Employees.filter((item) => {
        return item.id == data.id;
      });
      setSelectedOrganizer(selected[0]);
    } else {
      setSelectedOrganizer(null);
    }
  };

  const getDepartment = (data) => {
    if (data != null) {
      setDepartment(data);
    } else {
      setDepartment(null);
    }
  };

  const getMeetingSessions = async (data, newly) => {
    const customSessions = data.map((item) => {
      item.startDate = new Date(item.startDate).toISOString();
      item.endDate = new Date(item.endDate).toISOString();

      if (newly.includes(item.id)) {
        delete item["id"];
      }

      return item;
    });

    const updatedMeeting = { ...meetingDetails, sessions: customSessions };
    //console.log(updatedMeeting)

    const res = await axios.put(
      `${BASE_URL}/meetings/${meetingDetails.id}`,
      updatedMeeting,
      {
        headers: requestHeaders,
      }
    );
    console.log(res);

    if (res?.status == 200) {
      setNotificationText("Meeting has been updated successfully!");
      setNotificationState(true);
      setNotificationType("success");
      setTimeout(() => {
        setNotificationState(false);
      }, 5000);
    } else {
      setNotificationText("Error");
      setNotificationState(true);
      setNotificationType("success");

      setTimeout(() => {
        setNotificationText("");
        setNotificationState(false);
        setNotificationType("");
      }, 5000);
    }

    //history.push("/meetings");
  };

  const goToMeetings = () => {
    history.push("/meetings");
  };

  const meetingSessions = (data) => {
    setSessions(data);
  };

  const getDeleted = (sessionID) => {
    const updatedList = sessions.filter((item) => {
      return item.id != sessionID;
    });

    setSessions(updatedList);
  };

  return (
    <div>
      {/* <Header /> */}
      <div
        style={{ background: "#EAEDED", width: "100%", padding: "30px 0px" }}
      >
        <div
          style={{
            padding: "10px 0px",
            textAlign: "center",
            width: "95%",
            margin: "auto",
            background: "#fff",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          <CustomButton btnText={"Back"} onClick={goToMeetings} />
          <h2 style={{ marginTop: "-5px", textAlign: "center" }}>
            Update a Meeting
          </h2>
          <div
            style={{
              width: "100%",
              marginTop: 30,
              textAlign: "left",
              padding: "0px 20px",
            }}
          >
            <TextField
              id="outlined-basic"
              label="Subject *"
              variant="outlined"
              style={{ width: "95%", margin: "1px 0px" }}
              value={meetingName}
              onChange={(event) => setMeetingName(event.target.value)}
            />

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              disabled
              value={selectedOrganizer}
              onChange={(event, value) => getOrganizer(value)}
              options={usersList}
              sx={{ width: "95%" }}
              style={{ margin: "10px 0px" }}
              renderInput={(params) => (
                <TextField {...params} label="Organizer" />
              )}
            />

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={departmentsList}
              disabled
              value={department}
              onChange={(event, value) => getDepartment(value)}
              sx={{ width: "95%" }}
              style={{ margin: "5px 0px" }}
              renderInput={(params) => (
                <TextField {...params} label="Department" />
              )}
            />
          </div>

          <SessionsTable
            getMeetingSessions={getMeetingSessions}
            participants={users}
            checkFields={check}
            meetingSessions={sessions}
            getSessions={meetingSessions}
            agendas={meetingDetails.agendas}
            getDeletedSession={getDeleted}
          />
        </div>
      </div>
      <Notification
        open={notificationState}
        text={notificationText}
        type={notificationType}
      />
    </div>
  );
};

export default UpdateMeeting;
