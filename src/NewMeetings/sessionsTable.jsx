import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Participants from "./participants";
import { Link, useHistory } from "react-router-dom";
import Notification from "../Generic/Notification";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import moment from "moment";

const sureStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const participantStyle = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

export default function DataGridDemo(props) {
  const [sessions, setSessions] = React.useState([]);
  const [sessionDate, setSessionDate] = React.useState(null);
  const [modal, setModal] = React.useState(false);
  const [selectedSession, setSelectedSession] = React.useState();
  const [update, setUpdate] = React.useState(false);
  const [minDate, setMinDate] = React.useState();
  const [newlyAddedSessionsIDs, setNewlyAddedSessionsIDs] = React.useState([]);
  const [dateChanged, setDateChanged] = React.useState(true);
  const [notificationState, setNotificationState] = React.useState(false);
  const [disableSave, setDisableSave] = React.useState(false);
  const [sure, setSure] = React.useState(false);
  const [selectedSessionID, setSelectedSessionID] = React.useState();
  const [disableAgendas, setDisableAgendas] = React.useState(false)
  const history = useHistory();

  React.useEffect(() => {
    if (localStorage.getItem("meetingID")) {
      setSessions(props.meetingSessions);
    } else {
      setSessions(props.createMeetingSessions);
    }
  }, [props]);

  React.useEffect(() => {
    if(!localStorage.getItem("meetingID")) {
      setDisableAgendas(true)
    }
  })

  React.useEffect(() => {
    var date = new Date();

    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();

    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;

    var today = year + "-" + month + "-" + day;
    //setSessionDate(today);
    setMinDate(today);
  }, []);

  const removeParticipant = (data) => {
    setTimeout(() => {
      const currentSessionID = localStorage.getItem("sessionID");
      const currentSession = sessions.filter((item) => {
        return item.id == currentSessionID;
      });

      const existingParticipants = currentSession[0].participants;
      const updatedParticipants = existingParticipants.filter((item) => {
        return item != data;
      });

      sessions.map((item) => {
        if (item.id == currentSessionID) {
          item.participants = updatedParticipants;
        }
      });

      setUpdate(!update);
      localStorage.removeItem("sessionID");
    }, 1000);
  };

  const participantName = (participant) => {
    let name = "";

    const filteredName = props.participants.filter((item) => {
      return item.id == participant;
    });

    name = filteredName[0].firstName + " " + filteredName[0].lastName;
    return name;
  };

  const getParticipants = (participants) => {
    return (
      <div
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          overflowY: "scroll",
        }}
      >
        {!participants.length ? (
          <span style={{ marginRight: 5 }}>Add a Participant</span>
        ) : (
          participants.map((item) => (
            <div
              style={{
                color: "#1565c0",
                border: "1px solid #1565c0",
                borderRadius: 20,
                display: "inline-block",
                marginRight: 10,
                padding: 5,
                marginTop: 5,
              }}
            >
              {participantName(item)}{" "}
              <CancelIcon
                onClick={() => removeParticipant(item)}
                style={{
                  cursor: "pointer",
                  marginBottom: "-6px",
                  color: "#1565c0",
                }}
              />
            </div>
          ))
        )}

        <AddCircleIcon
          style={{
            cursor: "pointer",
            marginTop: !participants.length ? -2 : 11,
            color: "#1E8449",
          }}
          onClick={addParticipants}
        />
      </div>
    );
  };

  const addParticipants = () => {
    localStorage.setItem("modalData", "participants");
  };

  const getRowID = (data) => {
    setSelectedSession(data);
    localStorage.setItem("sessionID", data.row.id);

    if (
      localStorage.getItem("modalData") === "agendas" ||
      localStorage.getItem("modalData") === "participants"
    ) {
      setModal(true);
    }
  };

  const changeDate = (value, rowData) => {
    const selectedDate = value;
    const customDate = moment(selectedDate).format("DD/MM/yyyy");

    const dateAlready = sessions.filter((item) => {
      return moment(item.startDate).format("DD/MM/yyyy") == customDate;
    });

    if (dateAlready.length) {
      setNotificationState(true);
      setTimeout(() => {
        setNotificationState(false);
      }, 5000);
    } else {
      const updatedSessions = sessions.map((item) => {
        if (item.id == rowData.id) {
          item = { ...item, startDate: value, endDate: value };
        }

        return item;
      });

      setSessions(updatedSessions);
    }
  };

  // const getCustomDate = (date) => {
  //   let d = date.split("T")[0];
  //   return d;
  // };

  const columns = [
    //   { field: 'id', headerName: 'ID', width: 90 },
    {
      field: "sessionDate",
      headerName: <b>Session Date</b>,
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        // <input
        //   style={{ padding: 10 }}
        //   type="date"
        //   //min={minDate}
        //   value={getCustomDate(data.row.startDate)}
        //   onChange={(event) => changeDate(event.target.value, data)}
        // />
        <DesktopDatePicker
          value={data.row.startDate}
          inputFormat="dd/MM/yyyy"
          onChange={(changedDate) => changeDate(changedDate, data)}
          renderInput={(props) => <TextField {...props} />}
        />
      ),
    },
    {
      field: "participants",
      headerName: <b>Participants</b>,
      width: 790,
      disableColumnMenu: true,
      sortable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (data) => getParticipants(data.row.participants),
    },
    {
      field: "action",
      headerName: <b>Actions</b>,
      width: 225,
      disableColumnMenu: true,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (data) => (
        <div>
          <Button
            size="small"
            variant="contained"
            onClick={() => confirmDelete(data.id)}
            style={{ background: "red" }}
          >
            Delete Session
          </Button>
        </div>
      ),
    },
  ];

  const closeModal = () => {
    setModal(false);

    setTimeout(() => {
      localStorage.removeItem("modalData");
    }, 2000);
  };

  const modalTrigger = (value) => {
    if (value === false) {
      closeModal();
    }
  };

  const addSession = () => {
    const newly = newlyAddedSessionsIDs;
    newly.push(sessions.length);

    const newSessions = [
      ...sessions,
      {
        id: sessions.length,
        startDate: sessionDate,
        endDate: sessionDate,
        participants: [],
        agendas: [],
      },
    ];

    setSessions(newSessions);
    setNewlyAddedSessionsIDs(newly);
    setDateChanged(true);
    setSessionDate(null);
    if (props?.getSessions) {
      props.getSessions(newSessions);
    }
  };

  const saveMeeting = () => {
    if (props?.getMeetingSessions) {
      props.getMeetingSessions(sessions, newlyAddedSessionsIDs);
    }

    if (props?.getMeetingInitialData) {
      setDisableSave(true);
      props.getMeetingInitialData(sessions);
    }
  };

  const goToAgendas = () => {
    history.push("/agendas");
  };

  const getText = (data) => {
    if (data != undefined) {
      return data.length ? "View Agendas" : "Add Agendas";
    } else {
      return "Loading...";
    }
  };

  const changePickDate = (data) => {
    const selectedDate = data;
    const customDate = moment(selectedDate).format("DD/MM/yyyy");

    const dateAlready = sessions.filter((item) => {
      return moment(item.startDate).format("DD/MM/yyyy") == customDate;
    });

    if (dateAlready.length) {
      setSessionDate(data);
      setDateChanged(true);
      setNotificationState(true);
      setTimeout(() => {
        setNotificationState(false);
      }, 5000);
    } else if(data != null) {
      setSessionDate(data);
      setDateChanged(false);
    }
  };

  const confirmDelete = (sessionID) => {
    setSure(true);
    setSelectedSessionID(sessionID);
  };

  const yesDelete = () => {
    const updatedList = sessions.filter((item) => {
      return item.id != selectedSessionID;
    });

    setSessions(updatedList);
    props.getDeletedSession(selectedSessionID)
    setSure(false);
  };

  const noDelete = () => {
    setSure(false);
  };

  return (
    <div>
      <div
        style={{
          width: "92%",
          textAlign: "left",
          margin: "30px auto",
          display: "flex",
        }}
      >
        <div style={{ width: "80%" }}>
          <h3>Session Date</h3>
          {/* <input
            style={{ padding: 10 }}
            type="date"
            value={sessionDate}
            //max={minDate}
            onChange={(data) => changePickDate(data)}
          /> */}
          <DesktopDatePicker
            value={sessionDate}
            inputFormat="dd/MM/yyyy"
            onChange={(data) => changePickDate(data)}
            renderInput={(props) => <TextField {...props} />}
          />

          <br />
          <Button
            onClick={addSession}
            style={{ marginTop: 20 }}
            variant="contained"
            disabled={dateChanged}
          >
            Add Session
          </Button>
          <Button
            disabled={props.checkFields || disableSave}
            onClick={saveMeeting}
            style={{ marginTop: 20, marginLeft: 10, background: "green" }}
            variant="contained"
          >
            Save
          </Button>

          {!localStorage.getItem("meetingID") && (
            <p style={{ fontSize: "12px" }}>
              *Would be able to add agendas, once the meeting is saved.
            </p>
          )}
        </div>
        <div style={{ width: "20%", position: "relative" }}>
          <Button
            onClick={goToAgendas}
            variant="contained"
            style={{ position: "absolute", bottom: 0 }}
            disabled={disableAgendas}
          >
            {/* <Link
              to="/agendas"
              style={{ textDecoration: "none", color: "#fff" }}
            >
              Add
            </Link> */}
            {getText(props.agendas)}
          </Button>
        </div>
      </div>
      <div
        style={{ height: 500, width: "95%", margin: "auto", marginBottom: 50 }}
      >
        <DataGrid
          rows={sessions ? sessions : []}
          columns={columns}
          pageSize={5}
          rowHeight={100}
          rowsPerPageOptions={[5]}
          onCellClick={getRowID}
          // checkboxSelection
          disableSelectionOnClick
        />

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={sure}
          //onClose={closeModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={sure}>
            <Box sx={sureStyle}>
              <p style={{ marginBottom: 30 }}>
                Are you sure you want to delete this session? This action can't
                be reverted.
              </p>
              <div style={{ textAlign: "center" }}>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  style={{ margin: "0px 10px" }}
                  onClick={yesDelete}
                >
                  Yes
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  color="primary"
                  style={{ margin: "0px 10px" }}
                  onClick={noDelete}
                >
                  No
                </Button>
              </div>
            </Box>
          </Fade>
        </Modal>

        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={modal}
          //onClose={closeModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={modal}>
            <Box sx={participantStyle}>
              <Participants
                currentSession={selectedSession}
                getModalState={modalTrigger}
              />
            </Box>
          </Fade>
        </Modal>
      </div>
      <Notification
        open={notificationState}
        text={"Session already added"}
        type={"error"}
      />
    </div>
  );
}
