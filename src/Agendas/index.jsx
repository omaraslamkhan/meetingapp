import * as React from "react";
//import Header from "../Header";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import TasksTable from "./pointsTable";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import Tasks from "./tasks";
import { Link, useHistory } from "react-router-dom";
import CustomButton from "../Generic/Button";
import requestHeaders from "../_helpers/headers";
import Notification from "../Generic/Notification";
import {BASE_URL} from '../config/productionConfig'

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

const Agendas = (props) => {
  const [value, setValue] = React.useState(0);
  const [closeModal, setCloseModal] = React.useState(true);
  const [modalToggle, setModalToggle] = React.useState(false);
  const [agendas, setAgendas] = React.useState([]);
  const [newTask, setNewTask] = React.useState("");
  const [newAgenda, setNewAgenda] = React.useState("");
  const [selectedAgenda, setSelectedAgenda] = React.useState();
  const [loadingTasks, setLoadingTasks] = React.useState(false);
  const [loadingAgendas, setLoadingAgendas] = React.useState(false);
  const [organizerName, setOrganizerName] = React.useState("");
  const [meetingName, setMeetingName] = React.useState("");
  const [todayDate, setTodayDate] = React.useState("dd/MM/yyyy");
  const [users, setUsers] = React.useState([]);
  const [meetingDetails, setMeetingDetails] = React.useState({});
  const [newlyAddedAgendaIDs, setNewlyAddedAgendaIDs] = React.useState([]);
  const [newlyAddedTaskIDs, setNewlyAddedTaskIDs] = React.useState([]);
  const [newlyAddedPointIDs, setNewlyAddedPointIDs] = React.useState([]);
  const [notificationState, setNotificationState] = React.useState(false);
  const [notificationText, setNotificationText] = React.useState("");
  const [notificationType, setNotificationType] = React.useState("");
  const [disableSave, setDisableSave] = React.useState(false);
  const [sure, setSure] = React.useState(false);
  const [selectedAgendaID, setSelectedAgendaID] = React.useState();
  const history = useHistory();

  React.useEffect(async () => {
    const meetingID = localStorage.getItem("meetingID");

    const users = await axios.get(`${BASE_URL}/users`, {
      headers: requestHeaders,
    });
    const meetingDetails = await axios.get(
      `${BASE_URL}/meetings/${meetingID}`,
      {
        headers: requestHeaders,
      }
    );

    setUsers(users.data);
    setMeetingDetails(meetingDetails.data);
  }, []);

  React.useEffect(() => {
    if (Object.keys(meetingDetails).length && users.length) {
      let organizer =
        meetingDetails.organizer.firstName +
        " " +
        meetingDetails.organizer.lastName;
      setOrganizerName(organizer);
      setMeetingName(meetingDetails.subject);
      setAgendas(meetingDetails.agendas);
    }
  }, [users, meetingDetails]);

  // React.useEffect(() => {
  //   var date = new Date();

  //   var day = date.getDate();
  //   var month = date.getMonth() + 1;
  //   var year = date.getFullYear();

  //   if (month < 10) month = "0" + month;
  //   if (day < 10) day = "0" + day;

  //   var today = year + "-" + month + "-" + day;
  //   setTodayDate(today);
  // }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const closeAgendas = () => {
    setCloseModal(false);
  };

  const addAgenda = () => {
    localStorage.setItem("agendaModalData", "add");
    setModalToggle(true);
  };

  const editAgenda = () => {
    localStorage.setItem("agendaModalData", "edit");
    setModalToggle(true);
  };

  const addTask = (agendaID) => {
    setSelectedAgenda(agendaID);
    setLoadingTasks(true);
    const newly = newlyAddedTaskIDs;

    const updatedAgendas = agendas.filter((item) => {
      return item.id == agendaID;
    });

    let count = updatedAgendas[0].tasks.length;
    newly.push(count);

    let newObject = {
      id: count,
      assignees: [],
      points: [{
        id: 0,
        originalDate: todayDate,
        targetDate: todayDate,
        status: 0,
        text: '',
      }],
    };

    updatedAgendas[0].tasks = [...updatedAgendas[0].tasks, newObject];
    let index = agendas.findIndex((item) => item.id == updatedAgendas[0].id);

    const updatedList = agendas;
    updatedList.splice(index, 1, updatedAgendas[0]);

    setSelectedAgenda(-1);
    setAgendas(updatedList);
    setNewlyAddedTaskIDs(newly);
    setNewTask("");
    setTimeout(() => {
      setLoadingTasks(false);
    }, 3000);
  };

  const cancelAgenda = () => {
    localStorage.removeItem("agendaModalData");
    setModalToggle(false);
    setNewAgenda("");
    setNewTask("");
  };

  const saveAgenda = () => {
    const newly = newlyAddedAgendaIDs;
    newly.push(agendas.length);

    setLoadingAgendas(true);
    localStorage.removeItem("agendaModalData");

    let updatedList = [
      ...agendas,
      {
        id: agendas.length,
        agenda: newAgenda,
        tasks: [],
      },
    ];

    setNewAgenda("");
    setModalToggle(false);
    setAgendas(updatedList);
    setNewlyAddedAgendaIDs(newly);
    setTimeout(() => {
      setLoadingAgendas(false);
    }, 3000);
  };

  const getContent = () => {
    const content = localStorage.getItem("agendaModalData");

    switch (content) {
      case "add": {
        return (
          <div>
            <TextField
              id="outlined-basic"
              label="Agenda Title"
              variant="outlined"
              multiline
              rows={5}
              value={newAgenda}
              style={{ width: "100%" }}
              onChange={(e) => setNewAgenda(e.target.value)}
            />
            <br />
            <div style={{ display: "inline-block" }}>
              <Button
                onClick={saveAgenda}
                style={{
                  marginTop: 20,
                  marginRight: 10,
                  width: "20px",
                }}
                variant="contained"
              >
                Add
              </Button>
              <Button
                onClick={cancelAgenda}
                style={{
                  marginTop: 20,
                  width: "100px",
                  background: "#EAEDED",
                  color: "black",
                }}
                variant="contained"
              >
                Cancel
              </Button>
            </div>
          </div>
        );
      }

      // case "edit": {
      //   return (
      //     <div>
      //       <TextField
      //         id="outlined-basic"
      //         label="Agenda Name"
      //         variant="outlined"
      //         style={{ width: "100%" }}
      //       />
      //       <br />
      //       <div style={{ display: "inline-block" }}>
      //         <Button
      //           //onClick={saveAgendaName}
      //           style={{
      //             marginTop: 20,
      //             marginRight: 10,
      //             width: "20px",
      //           }}
      //           variant="contained"
      //         >
      //           Save
      //         </Button>
      //         <Button
      //           onClick={cancelAgenda}
      //           style={{
      //             marginTop: 20,
      //             width: "100px",
      //             background: "#EAEDED",
      //             color: "black",
      //           }}
      //           variant="contained"
      //         >
      //           Cancel
      //         </Button>
      //       </div>
      //     </div>
      //   );
      // }

      // case "addTask": {
      //   return (
      //     <div>
      //       <TextField
      //         id="outlined-basic"
      //         label="Task Name"
      //         variant="outlined"
      //         value={newTask}
      //         style={{ width: "100%" }}
      //         onChange={(e) => setNewTask(e.target.value)}
      //       />
      //       <br />
      //       <div style={{ display: "inline-block" }}>
      //         <Button
      //           onClick={saveTask}
      //           style={{
      //             marginTop: 20,
      //             marginRight: 10,
      //             width: "20px",
      //           }}
      //           variant="contained"
      //         >
      //           Add
      //         </Button>
      //         <Button
      //           onClick={cancelAgenda}
      //           style={{
      //             marginTop: 20,
      //             width: "100px",
      //             background: "#EAEDED",
      //             color: "black",
      //           }}
      //           variant="contained"
      //         >
      //           Cancel
      //         </Button>
      //       </div>
      //     </div>
      //   );
      // }
    }
  };

  const addAgendaToMeeting = async () => {
    setDisableSave(true);
    const customOriginalDate = agendas.map((item) => {
      item.tasks.map((element) => {
        element.points.map((entry) => {
          entry.originalDate = new Date(entry.originalDate).toISOString();
          return entry;
        });
        return element;
      });
      return item;
    });

    const customTargetDate = customOriginalDate.map((item) => {
      item.tasks.map((element) => {
        element.points.map((entry) => {
          entry.targetDate = new Date(entry.targetDate).toISOString();
          return entry;
        });
        return element;
      });
      return item;
    });

    const customAssigneeIDs = customTargetDate.map((item) => {
      item.tasks.map((element) => {
        let assigneeIDs = [];
        element.assignees.map((entry) => {
          if (typeof entry == "object") {
            assigneeIDs.push(entry.id);
          } else {
            assigneeIDs.push(entry);
          }
        });
        element.assignees = assigneeIDs;
        return element;
      });
      return item;
    });

    const customAgendas = customAssigneeIDs.map((agenda) => {
      if (newlyAddedAgendaIDs.includes(agenda.id)) {
        delete agenda["id"];
      }

      agenda.tasks.map((task) => {
        if (newlyAddedTaskIDs.includes(task.id)) {
          delete task["id"];
        }

        task.points.map((point) => {
          if (newlyAddedPointIDs.includes(point.id)) {
            delete point["id"];
          }

          return point;
        });

        return task;
      });

      return agenda;
    });

    const updatedMeeting = { ...meetingDetails, agendas: customAgendas };
    const res = await axios.put(
      `${BASE_URL}/meetings/${meetingDetails.id}`,
      updatedMeeting,
      {
        headers: requestHeaders,
      }
    );

    console.log(res);

    if (res?.status == 200) {
      setNotificationText("Agendas has been updated successfully!");
      setNotificationState(true);
      setNotificationType("success");
      setTimeout(() => {
        history.push("/meetings/update");
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
  };

  const pointData = (agendaID, taskID, point) => {
    const newly = newlyAddedPointIDs;

    const updatedList = agendas.map((item) => {
      if (item.id == agendaID) {
        item.tasks.map((task) => {
          if (task.id == taskID) {
            let newPoint = {
              id: task.points.length,
              originalDate: todayDate,
              targetDate: todayDate,
              status: 0,
              text: point,
            };

            newly.push(task.points.length);
            return (task.points = [...task.points, newPoint]);
          }

          return task;
        });
      }
      return item;
    });

    setAgendas(updatedList);
    setNewlyAddedPointIDs(newly);
  };

  const personsData = (agendaID, taskID, persons) => {
    const updatedList = agendas.map((item) => {
      if (item.id == agendaID) {
        item.tasks.map((task) => {
          if (task.id == taskID) {
            task.assignees = persons;
          }

          return task;
        });
      }
      return item;
    });

    setAgendas(updatedList);
  };

  const goToMeeting = () => {
    history.push("/meetings/update");
  };

  const updatedPointAssignedDate = (date, pointID, taskID, agendaID) => {
    const updatedList = agendas.map((item) => {
      if (item.id == agendaID) {
        item.tasks.map((task) => {
          if (task.id == taskID) {
            task.points.map((entry) => {
              if (entry.id == pointID) {
                entry.originalDate = date;
              }
              return entry;
            });
          }

          return task;
        });
      }
      return item;
    });

    setAgendas(updatedList);
  };

  const updatedPointTargetDate = (date, pointID, taskID, agendaID) => {
    const updatedList = agendas.map((item) => {
      if (item.id == agendaID) {
        item.tasks.map((task) => {
          if (task.id == taskID) {
            task.points.map((entry) => {
              if (entry.id == pointID) {
                entry.targetDate = date;
              }
              return entry;
            });
          }

          return task;
        });
      }
      return item;
    });

    setAgendas(updatedList);
  };

  const deletedPoint = (taskID, pointID, agendaID) => {
    let tasks = [];
    let points = [];

    agendas.map((agenda) => {
      if (agenda.id == agendaID) {
        tasks = agenda.tasks;
      }
    });

    tasks.map((task) => {
      if (task.id == taskID) {
        points = task.points;
      }
    });

    const newPoints = points.filter((point) => {
      return point.id != pointID;
    });

    const updatedList = agendas.map((agenda) => {
      if (agenda.id == agendaID) {
        agenda.tasks.map((task) => {
          if (task.id == taskID) {
            task.points = newPoints;
          }

          return task;
        });
      }

      return agenda;
    });

    setAgendas(updatedList);
  };

  const updatedPointText = (text, pointID, taskID, agendaID) => {
    const updatedList = agendas.map((item) => {
      if (item.id == agendaID) {
        item.tasks.map((task) => {
          if (task.id == taskID) {
            task.points.map((entry) => {
              if (entry.id == pointID) {
                entry.text = text;
              }
              return entry;
            });
          }

          return task;
        });
      }
      return item;
    });

    setAgendas(updatedList);
  };

  const updatedPointStatus = (status, pointID, taskID, agendaID) => {
    const updatedList = agendas.map((item) => {
      if (item.id == agendaID) {
        item.tasks.map((task) => {
          if (task.id == taskID) {
            task.points.map((entry) => {
              if (entry.id == pointID) {
                entry.status = status;
              }
              return entry;
            });
          }

          return task;
        });
      }
      return item;
    });

    setAgendas(updatedList);
  };

  const confirmDelete = (agendaID) => {
    setSure(true);
    setSelectedAgendaID(agendaID);
  };

  const yesDelete = () => {
    setLoadingAgendas(true);

    const updatedList = agendas.filter((item) => {
      return item.id != selectedAgendaID;
    });

    setAgendas(updatedList);
    setTimeout(() => {
      setLoadingAgendas(false);
    }, 3000);

    setSure(false);
  };

  const noDelete = () => {
    setSure(false);
  };

  const deleteTask = (agendaID, taskID) => {
    let tasks = [];
    let index = -1;

    agendas.map((agenda) => {
      if (agenda.id == agendaID) {
        tasks = agenda.tasks;
      }
    });

    tasks.map((task) => {
      if (task.id == taskID) {
        index = tasks.indexOf(task);
      }
    });

    tasks.splice(index, 1);
    const newAgendas = agendas.map((agenda) => {
      if (agenda.id == agendaID) {
        agenda.tasks = tasks;
      }

      return agenda;
    });

    setAgendas(newAgendas);
  };

  return (
    <div>
      <div
        style={{ background: "#EAEDED", width: "100%", padding: "30px 0px" }}
      >
        <div
          style={{
            padding: "10px 0px",
            width: "95%",
            margin: "auto",
            background: "#fff",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          <CustomButton btnText={"Back"} onClick={goToMeeting} />
          <h2 style={{ textAlign: "center", marginTop: "-5px" }}>Agendas</h2>
          <div style={{ lineHeight: 0, margin: 20 }}>
            <p>
              <font style={{ fontWeight: "bold" }}>Meeting Name: </font>
              {meetingName}
            </p>
            <p style={{ marginTop: 30 }}>
              <font style={{ fontWeight: "bold" }}>Organizer Name: </font>
              {organizerName}
            </p>
            {/* <p style={{ marginTop: 30 }}>
              <font style={{ fontWeight: "bold" }}>Session Date: </font>
              {sessionDate}
            </p> */}
          </div>
          <Button
            onClick={addAgenda}
            style={{ margin: 20, marginRight: 10, width: "150px" }}
            variant="contained"
          >
            + Add Agenda
          </Button>
          <Button
            onClick={addAgendaToMeeting}
            disabled={disableSave}
            style={{
              margin: 20,
              marginLeft: 0,
              width: "100px",
              background: "green",
            }}
            variant="contained"
          >
            Save
          </Button>

          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={modalToggle}
            //onClose={closeModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={modalToggle}>
              <Box sx={modalStyle}>{getContent()}</Box>
            </Fade>
          </Modal>
          <Box
            sx={{
              flexGrow: 1,
              bgcolor: "background.paper",
              display: "flex",
              height: "700px",
              marginTop: 5,
              paddingBottom: 10,
              overflowY: "scroll",
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: "divider", width: "200px" }}
            >
              {!loadingAgendas ? (
                agendas.map((item, index) => (
                  <Tab
                    style={{
                      alignItems: "self-start",
                      justifyContent: "flex-start",
                    }}
                    label={index + 1 + ". " + item.agenda}
                    {...a11yProps(index)}
                  />
                ))
              ) : (
                <div style={{ textAlign: "center", width: "150px" }}>
                  <CircularProgress />
                </div>
              )}
            </Tabs>
            {agendas.map((item, index) => (
              <TabPanel value={value} index={index} style={{ width: "100%" }}>
                <div style={{ display: "flex", width: "100%" }}>
                  <div style={{ width: "50%" }}>
                    <h3>{index + 1 + ". " + item.agenda}</h3>
                  </div>
                  <div
                    style={{ width: "50%", textAlign: "right", marginTop: 5 }}
                  >
                    <Button
                      onClick={() => addTask(item.id)}
                      style={{ margin: 10, marginRight: 0 }}
                      variant="contained"
                    >
                      + Add Task
                    </Button>
                    <Button
                      onClick={editAgenda}
                      disabled
                      style={{ margin: 10 }}
                      variant="contained"
                    >
                      Edit
                    </Button>
                    <Button
                      onClick={() => confirmDelete(item.id)}
                      style={{
                        margin: 10,
                        marginLeft: 0,
                        background: "red",
                      }}
                      variant="contained"
                    >
                      Delete Agenda
                    </Button>
                  </div>
                </div>

                {!loadingTasks ? (
                  <Tasks
                    getAssignees={personsData}
                    getDeletedTask={deleteTask}
                    agendaTasks={item.tasks}
                    agendaSerial={index + 1}
                    employees={users}
                    agendaID={item.id}
                    getData={pointData}
                    getUpdatedPointAssignedDate={updatedPointAssignedDate}
                    getUpdatedPointTargetDate={updatedPointTargetDate}
                    getUpdatedPointStatus={updatedPointStatus}
                    getUpdatedPointText={updatedPointText}
                    getDeletedPoint={deletedPoint}
                  />
                ) : (
                  <div style={{ textAlign: "center" }}>
                    <CircularProgress />
                  </div>
                )}
              </TabPanel>
            ))}
          </Box>
        </div>
      </div>
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
              Are you sure you want to delete this agenda? This action can't be
              reverted.
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
      <Notification
        open={notificationState}
        text={notificationText}
        type={notificationType}
      />
    </div>
  );
};

export default Agendas;
