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
import axios from "axios";
import { BASE_URL } from "../config/productionConfig";
import requestHeaders from "../_helpers/headers";

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
  const [notificationText, setNotificationText] = React.useState("");
  const [notificationType, setNotificationType] = React.useState("");
  const [disableSave, setDisableSave] = React.useState(false);
  const [sure, setSure] = React.useState(false);
  const [selectedSessionID, setSelectedSessionID] = React.useState();
  const [disableAgendas, setDisableAgendas] = React.useState(false);
  const [disableAttachments, setDisableAttachments] = React.useState(false);
  const [attachments, setAttachments] = React.useState([])
  const [formDatas, setFormDatas] = React.useState([])
  const [attachmentUploaded, setAttachmentUploaded] = React.useState(false)
  const [currentAttachment, setCurrentAttachment] = React.useState('')
  const history = useHistory();

  React.useEffect(() => {
    if (localStorage.getItem("meetingID")) {
      setSessions(props.meetingSessions);
    } else {
      setSessions(props.createMeetingSessions);
    }
  }, [props]);

  React.useEffect(() => {
    if (!localStorage.getItem("meetingID")) {
      setDisableAgendas(true);
    }
  });

  React.useEffect(() => {
    if (!localStorage.getItem("meetingID")) {
      setDisableAttachments(true);
    }
  });

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
          height: participants.length <= 5 ? "auto" : "90px",
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
      setNotificationText("Session already added");
      setNotificationType("error");
      setTimeout(() => {
        setNotificationState(false);
        setNotificationText("");
        setNotificationType("");
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
      setNotificationText("Session already added");
      setNotificationType("error");
      setTimeout(() => {
        setNotificationState(false);
        setNotificationText("");
        setNotificationType("");
      }, 5000);
    } else if (data != null) {
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
    props.getDeletedSession(selectedSessionID);
    setSure(false);
  };

  const noDelete = () => {
    setSure(false);
  };

  const getPublish = (details) => {
    if (Object.keys(details).length) {
      if (details.locked == 0) {
        return "Publish";
      } else {
        return "Published";
      }
    } else {
      return "Publish";
    }
  };

  const getPublishStatus = (details) => {
    if (Object.keys(details).length) {
      if (details.locked == 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  };

  const publishMeeting = async () => {
    const updatedMeeting = { ...props.details, locked: 1 };

    const res = await axios.put(
      `${BASE_URL}/meetings/${updatedMeeting.id}`,
      updatedMeeting,
      {
        headers: requestHeaders,
      }
    );

    console.log(res);

    if (res?.status == 200) {
      setNotificationText("Meeting has been published successfully!");
      setNotificationState(true);
      setNotificationType("success");
      const meetingDetails = await axios.get(
        `${BASE_URL}/meetings/${updatedMeeting.id}`,
        {
          headers: requestHeaders,
        }
      );
      props.getDetails(meetingDetails.data);
      setTimeout(() => {
        setNotificationState(false);
        setNotificationText("");
        setNotificationType("");
      }, 5000);
    } else {
      setNotificationText("Error");
      setNotificationState(true);
      setNotificationType("error");

      setTimeout(() => {
        setNotificationText("");
        setNotificationState(false);
        setNotificationType("");
      }, 5000);
    }
  };

  const saveAttachments = async () => {
    const uploads = await axios.post(`${BASE_URL}/upload`, formDatas, {
      userid: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")).id : '',
      meetingId: ''
    });

    console.log(uploads)
  }

  const getFile = (event) => {
    let files = attachments
    let datas = formDatas

    setCurrentAttachment(event.target.files[0])

    if (event.target.files[0].type.includes('pdf') ||
      event.target.files[0].type.includes('png') ||
      event.target.files[0].type.includes('jpg') ||
      event.target.files[0].type.includes('jpeg') ||
      event.target.files[0].type.includes('zip') ||
      event.target.files[0].type.includes('txt') ||
      event.target.files[0].type.includes('text') ||
      event.target.files[0].type.includes('doc') ||
      event.target.files[0].type.includes('docx') ||
      event.target.files[0].type.includes('xlsx') ||
      event.target.files[0].type.includes('csv') ||
      event.target.files[0].type.includes('ppt')) {

      if (event.target.files[0].size > 1024 * 1024 * 5) {
        console.log('large file')
        setNotificationState(true)
        setNotificationText('File too large')
        setNotificationType('error')
        setCurrentAttachment('')
      } else {

        const existing = attachments.filter((item) => {
          return event.target.files[0].name == item.name
        })

        if (existing.length != 0) {
          console.log('already there')
          setNotificationState(true)
          setNotificationText('File already uploaded')
          setNotificationType('error')
          setCurrentAttachment('')
        } else {
          const formData = new FormData();
          formData.append(
            "file",
            event.target.files[0],
          );

          files.push(event.target.files[0])
          datas.push(formData)
          setAttachmentUploaded(!attachmentUploaded)
          setAttachments(files)
          setFormDatas(datas)
          setCurrentAttachment('')
          console.log(files)
        }
      }
    } else {
      console.log('rejected')
      setNotificationState(true)
      setNotificationText('Invalid file format')
      setNotificationType('error')
    }
  }

  const getFileIcon = (file) => {
    let type = ''

    if (file.name.includes('txt')) {
      type = 'txt'
    } else if (file.name.includes('jpg')) {
      type = 'jpg'
    } else if (file.name.includes('jpeg')) {
      type = 'jpg'
    } else if (file.name.includes('xlsx')) {
      type = 'xls'
    } else if (file.name.includes('csv')) {
      type = 'csv'
    } else if (file.name.includes('png')) {
      type = 'png'
    } else if (file.name.includes('pdf')) {
      type = 'pdf'
    } else if (file.name.includes('docx')) {
      type = 'doc'
    } else if (file.name.includes('doc')) {
      type = 'doc'
    } else if (file.name.includes('zip')) {
      type = 'zip'
    } else if (file.name.includes('ppt')) {
      type = 'ppt'
    }

    return <img style={{ width: 30 }} src={require(`../FileIcons/${type}.png`).default} />
  }

  const removeAttachment = (file) => {
    let index = attachments.indexOf(file)
    let newAttachments = attachments

    newAttachments.splice(index, 1)
    setCurrentAttachment('')
    setAttachments(newAttachments)
    setAttachmentUploaded(!attachmentUploaded)
  }

  const getFileElement = (file) => {
    return <div style={{ width: '95%', display: 'flex', padding: 5 }}>
      <div style={{ width: "10%" }}>{getFileIcon(file)}</div>
      <div style={{ width: "80%", paddingTop: 5 }}>{file.name}</div>
      <div style={{ width: "10%", paddingTop: 2 }}><CancelIcon onClick={() => removeAttachment(file)} style={{ cursor: 'pointer' }} /></div>
    </div>
  }

  const getAttachmentState = () => {
    if (!disableAttachments && !attachments.length) {
      //false and false
      return true
    } else if (!disableAttachments && attachments.length) {
      //false and true
      return true
    } else if (disableAttachments && !attachments.length) {
      //true and false
      return true
    } else {
      return false
    }
  }

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
        <div style={{ width: "70%", display: 'flex' }}>
          <div style={{ width: "40%" }}>
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
                *Would be able to add agendas and attachments, once the meeting is saved.
              </p>
            )}
          </div>
          <div style={{ width: "60%", paddingLeft: 20, position: 'relative' }}>
            <h3>Attachments</h3>
            <label for="file-upload" class="custom-file-upload"
              style={{
                fontSize: '0.875rem',
                fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                cursor: !localStorage.getItem("meetingID") ? 'default' : 'pointer',
                border: !localStorage.getItem("meetingID") ? 'none' : '1px solid #1976d2',
                color: !localStorage.getItem("meetingID") ? 'rgba(0, 0, 0, 0.26)' : '#fff',
                background: !localStorage.getItem("meetingID") ? 'rgba(0, 0, 0, 0.12)' : '#1976d2',
                position: 'absolute', padding: !localStorage.getItem("meetingID") ? "10px 16px" : "8.8px 16px",
                borderRadius: 5
              }}>
              UPLOAD
            </label>
            <input disabled={!localStorage.getItem("meetingID") ? true : false} id="file-upload" value={currentAttachment} type="file" style={{ display: 'none' }} onChange={getFile} />
            <Button
              disabled={getAttachmentState}
              onClick={saveAttachments}
              style={{ marginLeft: 100, background: "green" }}
              variant="contained"
            >
              Save
            </Button>

            <div style={{ width: '100%', marginTop: 10, height: '200px' }}>
              {attachments.length ?
                <div style={{ width: '100%', height: '100%', overflowY: 'scroll', padding: 5 }}>
                  {attachments.map((item) => {
                    return getFileElement(item)
                  })}
                </div> :
                <p style={{ fontSize: "12px" }}>
                  No Attachments
                </p>
              }
            </div>
          </div>
        </div>
        <div style={{ width: "30%", position: "relative" }}>
          <Button
            onClick={goToAgendas}
            variant="contained"
            style={{ position: "absolute", bottom: 0, right: 125 }}
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
          <Button
            onClick={publishMeeting}
            variant="contained"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              background: "green",
              width: "115px",
            }}
            disabled={getPublishStatus(props.details)}
          >
            {/* <Link
              to="/agendas"
              style={{ textDecoration: "none", color: "#fff" }}
            >
              Add
            </Link> */}
            {getPublish(props.details)}
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
        text={notificationText}
        type={notificationType}
      />
    </div>
  );
}
