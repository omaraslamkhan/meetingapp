import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import PointsTable from "./pointsTable";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Backdrop from "@mui/material/Backdrop";
import ResponsiblePersons from "./responsiblePersons";
import Fade from "@mui/material/Fade";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

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

const pointModalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const assigneesModalStyle = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

const Tasks = (props) => {
  const [tasks, setTasks] = React.useState([]);
  const [modalToggle, setModalToggle] = React.useState(false);
  const [newPoint, setNewPoint] = React.useState("");
  const [taskID, setTaskID] = React.useState(-1);
  const [currentTask, setCurrentTask] = React.useState({});
  const [loading, setLoading] = React.useState(false);
  const [sure, setSure] = React.useState(false);
  const [selectedTaskID, setSelectedTaskID] = React.useState();
  const users = props.employees;
  const agendaID = props.agendaID;

  React.useEffect(() => {
    setTasks(props.agendaTasks);
  }, []);

  const updatedList = (data, agendaID) => {
    let changedTask = {};
    let updatedTasks = [];
    let taskIndex = -1;

    agendas.map((item) => {
      if (item.id === agendaID) {
        item.tasks.map((element, index) => {
          if (element.id == localStorage.getItem("taskID")) {
            changedTask = element;
            taskIndex = index;
          } else {
            updatedTasks.push(element);
          }
        });
      }
    });

    changedTask = { ...changedTask, assignees: data };
    updatedTasks.splice(taskIndex, 0, changedTask);

    const updatedList = agendas.map((item) => {
      if (item.id === agendaID) {
        return (item = { ...item, tasks: updatedTasks });
      }

      return item;
    });

    setAgendas(updatedList);
  };

  const addPoint = (taskID) => {
    setTaskID(taskID);
    localStorage.setItem("taskModalData", "add");
    setModalToggle(true);
  };

  const viewResponsiblePersons = (taskID) => {
    const task = props.agendaTasks.filter((item) => {
      return item.id == taskID;
    });

    setCurrentTask(task[0]);
    localStorage.setItem("taskModalData", "responsiblePersons");
    setModalToggle(true);
  };

  const savePoint = () => {
    setLoading(true);

    props.getData(agendaID, taskID, newPoint);
    localStorage.removeItem("taskModalData");
    setModalToggle(false);
    setNewPoint("");
    setTaskID(-1);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  };

  const cancelPoint = () => {
    localStorage.removeItem("taskModalData");
    setModalToggle(false);
    setNewPoint("");
  };

  const modalTrigger = (data) => {
    if (data == false) {
      cancelPoint();
    }
  };

  const getContent = (taskID) => {
    const content = localStorage.getItem("taskModalData");

    switch (content) {
      case "add": {
        return (
          <div>
            <TextField
              id="outlined-basic"
              label="Point"
              variant="outlined"
              multiline
              rows={5}
              value={newPoint}
              style={{ width: "100%" }}
              onChange={(e) => setNewPoint(e.target.value)}
            />
            <br />
            <div style={{ display: "inline-block" }}>
              <Button
                onClick={() => savePoint()}
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
                onClick={cancelPoint}
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

      case "responsiblePersons": {
        return (
          <ResponsiblePersons
            currentTask={currentTask}
            getModalState={modalTrigger}
            getUpdatedList={updatedResponsiblePersons}
            usersList={props.employees}
          />
        );
      }
    }
  };

  const updatedResponsiblePersons = (data, taskID) => {
    let assigneesIDs = [];

    data.map((item) => {
      assigneesIDs.push(item.id);
    });

    props.getAssignees(agendaID, taskID, assigneesIDs);
  };

  const getUpdatedAssignedDate = (date, pointID, taskID) => {
    props.getUpdatedPointAssignedDate(date, pointID, taskID, agendaID);
  };

  const getUpdatedTargetDate = (date, pointID, taskID) => {
    props.getUpdatedPointTargetDate(date, pointID, taskID, agendaID);
  };

  const getUpdatedStatus = (status, pointID, taskID) => {
    props.getUpdatedPointStatus(status, pointID, taskID, agendaID);
  };

  const getUpdatedText = (text, pointID, taskID) => {
    props.getUpdatedPointText(text, pointID, taskID, agendaID);
  }

  const getRemovedPoint = (pointID, taskID) => {
    props.getDeletedPoint(pointID, taskID, agendaID);
  }

  const getAssigneesInitials = (data) => {
    const currentAssignees = data;
    let assignees = "";

    if (data.length) {
      users.map((item) => {
        if (currentAssignees.includes(item.id)) {
          assignees = assignees.concat(item.initial + ", ");
        }
      });

      assignees = assignees.replace(/,\s*$/, "");
    } else {
      assignees = "None";
    }

    return assignees;
  };

  const confirmDelete = (taskID) => {
    setSure(true);
    setSelectedTaskID(taskID);
  };

  const yesDelete = () => {
    setLoading(true);
    props.getDeletedTask(agendaID, selectedTaskID)
    
    setTimeout(() => {
      setLoading(false);
    }, 3000);

    setSure(false);
  };

  const noDelete = () => {
    setSure(false);
  };

  return tasks.map((item, index) => {
    return (
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography style={{ fontWeight: "bold", color: "#7e57c2" }}>
            Task {props.agendaSerial + "." + (index + 1)}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ textAlign: "right" }}>
            <Button
              onClick={() => addPoint(item.id)}
              style={{
                marginRight: 10,
              }}
              variant="contained"
            >
              + Add Point
            </Button>
            <Button
              onClick={() => viewResponsiblePersons(item.id)}
              style={{
                marginRight: 10,
              }}
              variant="contained"
            >
              Add Assignees
            </Button>
            <Button
              onClick={() => confirmDelete(item.id)}
              variant="contained"
              style={{ background: "red" }}
            >
              Delete Task
            </Button>
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
                  Are you sure you want to delete this task? This action can't
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

          <div
            style={{
              wordBreak: "break-all",
              margin: "5px 2px",
              fontSize: 15,
              width: "50%",
            }}
          >
            <b>Assignees:</b> {getAssigneesInitials(item.assignees)}{" "}
          </div>

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
              <Box
                sx={
                  localStorage.getItem("taskModalData") == "responsiblePersons"
                    ? assigneesModalStyle
                    : pointModalStyle
                }
              >
                {getContent()}
              </Box>
            </Fade>
          </Modal>

          {loading ? (
            <div style={{ textAlign: "center" }}>
              <CircularProgress />
            </div>
          ) : (
            <PointsTable
              points={item.points}
              // assignees={item.assignees}
              taskSerial={index + 1}
              agendaSerial={props.agendaSerial}
              taskID={item.id}
              getAssignedDate={getUpdatedAssignedDate}
              getTargetDate={getUpdatedTargetDate}
              getPointStatus={getUpdatedStatus}
              getPointText={getUpdatedText}
              getDeletedPoint={getRemovedPoint}
              getUpdatedResponsiblePersons={updatedList}
              people={users}
            />
          )}
        </AccordionDetails>
      </Accordion>
    );
  });
};

export default Tasks;
