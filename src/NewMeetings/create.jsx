import React, { useEffect, useState } from "react";
//import Header from "../Header";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import SessionsTable from "./sessionsTable";
import axios from "axios";
import CustomButton from "../Generic/Button";
import { Link, useHistory } from "react-router-dom";
import requestHeaders from "../_helpers/headers";
import Notification from "../Generic/Notification";
import { BASE_URL } from "../config/productionConfig";

const CreateMeeting = () => {
  const [meetingName, setMeetingName] = useState("");
  const [department, setDepartment] = useState(null);
  const [organizer, setOrganizer] = useState(null);
  const [check, setCheck] = useState(true);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [notificationState, setNotificationState] = useState(false);
  const [notificationText, setNotificationText] = useState("");
  const [notificationType, setNotificationType] = useState("");
  const [sessions, setSessions] = useState([]);
  const [disableDepartment, setDisableDepartment] = useState(true);
  const [userObject, setUserObject] = useState();
  const [departmentObject, setDepartmentObject] = useState();
  const [originalDepartments, setOriginalDepartments] = useState([]);
  const history = useHistory();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  useEffect(async () => {
    let customDepartments = [];

    const departments = await axios.get(`${BASE_URL}/departments`, {
      headers: requestHeaders,
    });
    const users = await axios.get(`${BASE_URL}/users`, {
      headers: requestHeaders,
    });

    departments.data.map((item) => {
      let newObject = {
        id: item.id,
        label: item.name,
      };

      customDepartments.push(newObject);
    });

    setUsersList(users.data);
    setDepartmentsList(customDepartments);
    setOriginalDepartments(departments.data);
  }, []);

  useEffect(() => {
    if (departmentsList.length && usersList.length) {
      const selectedOrganizer = usersList.filter((item) => {
        return item.id == JSON.parse(localStorage.getItem("user")).id;
      });

      setUserObject(selectedOrganizer[0]);

      const organizer = {
        id: selectedOrganizer[0].id,
        label: selectedOrganizer[0].title,
      };

      setOrganizer(organizer);

      if (selectedOrganizer[0].department == null) {
        setDisableDepartment(false);
      } else {
        const selectedDepartment = departmentsList.filter((item) => {
          return item.id == selectedOrganizer[0].department.id;
        });

        const department = {
          id: selectedDepartment[0].id,
          label: selectedDepartment[0].label,
        };

        setDepartment(department);
      }
    }
  }, [usersList, departmentsList]);

  useEffect(() => {
    if (meetingName.length && department != null) {
      setCheck(false);
    } else {
      setCheck(true);
    }
  }, [meetingName, department]);

  const getDepartment = (data) => {
    if (data != null) {
      const selected = departmentsList.filter((item) => {
        return item.id == data.id;
      });
      setDepartment(selected[0]);

      const selectedDepartmentObject = originalDepartments.filter((item) => {
        return item.id == data.id;
      });
      setDepartmentObject(selectedDepartmentObject[0]);
    } else {
      setDepartment(null);
    }
  };

  const getMeetingSessions = async (data) => {
    let meetingObject = {
      subject: meetingName,
      organizer: {
        id: organizer.id,
      },
      department: {
        id: department.id,
      },
      sessions: data,
    };

    //console.log(meetingObject);
    const res = await axios.post(`${BASE_URL}/meetings`, meetingObject, {
      headers: requestHeaders,
    });

    if (!disableDepartment) {
      const updatedUser = { ...userObject, department: departmentObject };

      const updateUserDepartment = await axios.put(
        `${BASE_URL}/users/${organizer.id}`,
        updatedUser,
        {
          headers: requestHeaders,
        }
      );

      console.log(updateUserDepartment);
    }

    //console.log(res);

    if (res?.status == 200) {
      localStorage.setItem("meetingID", res.data.id);
      setNotificationText("Meeting has been created successfully!");
      setNotificationState(true);
      setNotificationType("success");
      setTimeout(() => {
        history.push("/meetings/update");
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
          <CustomButton btnText={"Cancel"} onClick={goToMeetings} />
          <h2 style={{ marginTop: "-5px", textAlign: "center" }}>
            Create a Meeting
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
              label="Meeting Title *"
              style={{ margin: "1px 0px", width: "95%" }}
              variant="outlined"
              value={meetingName}
              onChange={(event) => setMeetingName(event.target.value)}
            />

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              style={{ margin: "10px 0px" }}
              //onChange={(event, value) => getOrganizer(value)}
              value={organizer}
              options={usersList}
              disabled
              sx={{ width: "95%" }}
              renderInput={(params) => (
                <TextField {...params} label="Organizer" />
              )}
            />

            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={departmentsList}
              value={department}
              disabled={disableDepartment}
              style={{ margin: "5px 0px" }}
              onChange={(event, value) => getDepartment(value)}
              sx={{ width: "95%" }}
              renderInput={(params) => (
                <TextField {...params} label="Department" />
              )}
            />
          </div>

          <SessionsTable
            getMeetingInitialData={getMeetingSessions}
            checkFields={check}
            createMeetingSessions={sessions}
            getSessions={meetingSessions}
            agendas={[]}
            participants={usersList}
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

export default CreateMeeting;
