import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import { Link, useHistory } from "react-router-dom";
import accountService from "../_services/accountService";
import axios from "axios";
import requestHeaders from "../_helpers/headers";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import FilterSection from "./filterSection";
import { BASE_URL } from "../config/productionConfig";
import { TextField } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import moment from "moment";
import { CSVLink } from "react-csv";

const filterStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 800,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: "none",
};

export default function DataGridDemo() {
  const [tasks, setTasks] = React.useState([]);
  const [allTasks, setAllTasks] = React.useState([]);
  const [allMeetings, setAllMeetings] = React.useState([]);
  const [filterModal, setFilterModal] = React.useState(false);
  const [usersList, setUsersList] = React.useState([]);
  const [departmentsList, setDepartmentsList] = React.useState([]);
  const [originalTasks, setOriginalTasks] = React.useState([]);
  const [currentFilters, setCurrentFilters] = React.useState({
    organizer: null,
    department: null,
    status: '',
    assignedDate: null,
    dueDate: null,
  });
  const history = useHistory();

  const headers = [
    { key: "meetingTitle", label: "Meeting Title" },
    { key: "text", label: "Task Description" },
    { key: "departmentName", label: "Department" },
    { key: "originalDate", label: "Assigned Date" },
    { key: "targetDate", label: "Due Date" },
    { key: "assignees", label: "Responsible Persons" },
    { key: "status", label: "Status" },
  ];

  React.useEffect(async () => {
    const users = await axios.get(`${BASE_URL}/users`, {
      headers: requestHeaders,
    });

    const departments = await axios.get(`${BASE_URL}/departments`, {
      headers: requestHeaders,
    });

    setUsersList(users.data);
    setDepartmentsList(departments.data);
  }, []);

  const fetchTasks = async () => {
    const fetchedTasks = await accountService.find(
      "",
      "points?_end=1000&_order=ASC&_sort=id&_start=0"
    );

    setAllTasks(fetchedTasks.data);
  };

  const fetchMeetings = async () => {
    const fetchedMeetings = await accountService.find(
      "",
      "meetings?_end=1000&_order=ASC&_sort=id&_start=0"
    );

    setAllMeetings(fetchedMeetings.data);
  };

  React.useEffect(() => {
    fetchTasks();
    fetchMeetings();
  }, []);

  const getDepartmentID = (meetingID) => {
    const departmentID = allMeetings.filter((item) => {
      return item.id == meetingID;
    });

    return departmentID[0]?.department?.id;
  };

  const getDepartmentName = (meetingID) => {
    const departmentName = allMeetings.filter((item) => {
      return item.id == meetingID;
    });

    return departmentName[0]?.department?.name;
  };

  const getIDs = (emails) => {
    let IDs = [];

    usersList.map((item) => {
      if (emails.includes(item.email)) {
        IDs.push(item.id);
      }
    });

    return IDs;
  };

  const getAssigneeIDs = (assignees) => {
    const removedSpaces = assignees.replace(/\s/g, "");
    const emailArray = removedSpaces.split(",");
    return getIDs(emailArray);
  };

  React.useEffect(() => {
    const customTasks = [];

    allTasks.map((item) => {
      let newObject = {
        ...item,
        assigneeIDs: getAssigneeIDs(item.assigneeEmail),
        departmentID: getDepartmentID(item.meeting),
        departmentName: getDepartmentName(item.meeting),
        originalDate:  moment(item.originalDate).format("DD/MM/yyyy"),
        targetDate:  moment(item.targetDate).format("DD/MM/yyyy"),
        status:  getStatus(item.status),
        statusID: item.status
      };
      customTasks.push(newObject);
    });

    setTasks(customTasks);
    setOriginalTasks(customTasks);
  }, [allTasks, allMeetings, usersList]);

  const getRowID = (data) => {
    console.log(data);
  };

  const getStatus = (status) => {
    switch (status) {
      case 0: {
        return "Not Started";
      }

      case 1: {
        return "In Progress";
      }

      case 2: {
        return "Need Management Approval";
      }

      case 3: {
        return "On Hold";
      }

      case 4: {
        return "Completed";
      }

      case 5: {
        return "Aborted/Closed";
      }
    }
  };

  const columns = [
    {
      field: "meetingTitle",
      headerName: <b>Meeting Title</b>,
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        <TextField
          variant="standard"
          multiline
          value={data.row.meetingTitle}
          InputProps={{
            disableUnderline: true,
            readOnly: true,
            style: {
              fontSize: 12,
            },
          }}
          style={{
            height: "90px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        />
      ),
    },
    {
      field: "text",
      headerName: <b>Task Description</b>,
      width: 450,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        <TextField
          variant="standard"
          multiline
          value={data.row.text}
          InputProps={{
            disableUnderline: true,
            readOnly: true,
            style: {
              fontSize: 12,
            },
          }}
          style={{
            height: "80px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            overflowY: "scroll",
          }}
        />
      ),
    },
    {
      field: "department",
      headerName: <b>Department</b>,
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        <TextField
          variant="standard"
          multiline
          value={data.row.departmentName}
          InputProps={{
            disableUnderline: true,
            readOnly: true,
            style: {
              fontSize: 12,
            },
          }}
          style={{
            height: "90px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        />
      ),
    },
    {
      field: "originalDate",
      headerName: <b>Assigned Date</b>,
      width: 150,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "targetDate",
      headerName: <b>Due Date</b>,
      width: 150,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "assignees",
      headerName: <b>Responsible Person(s)</b>,
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        <TextField
          variant="standard"
          multiline
          value={data.row.assignees.trim()}
          InputProps={{
            disableUnderline: true,
            readOnly: true,
            style: {
              fontSize: 12,
            },
          }}
          style={{
            height: "90px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        />
      ),
    },
    {
      field: "status",
      headerName: <b>Status</b>,
      width: 150,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        <TextField
          variant="standard"
          multiline
          value={data.row.status}
          InputProps={{
            disableUnderline: true,
            readOnly: true,
            style: {
              fontSize: 12,
            },
          }}
          style={{
            height: "90px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        />
      ),
    },
  ];

  const showFilters = () => {
    setFilterModal(true);
  };

  const hideFilters = (filterModalStatus) => {
    setFilterModal(filterModalStatus);
  };

  const filterRows = (data) => {
    setTasks(data);
  };

  const getCurrentFilters = (data) => {
    setCurrentFilters(data);
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
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={filterModal}
            //onClose={closeModal}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
              timeout: 500,
            }}
          >
            <Fade in={filterModal}>
              <Box sx={filterStyle}>
                <FilterSection
                  departments={departmentsList}
                  users={usersList}
                  filterModal={hideFilters}
                  getFilteredRows={filterRows}
                  allRows={originalTasks}
                  getFilters={getCurrentFilters}
                  filters={currentFilters}
                />
              </Box>
            </Fade>
          </Modal>

          <h2>Tasks</h2>

          <div
            style={{
              width: "95%",
              textAlign: "left",
              margin: "30px auto",
            }}
          >
            <CSVLink
              style={{
                fontWeight: "bold",
                marginTop: 10,
                padding: "10px 20px",
                borderRadius: 5,
                border: "1px solid green",
                background: "green",
                textDecoration: "none",
                color: "#fff",
              }}
              data={tasks}
              headers={headers}
              filename={"tasks.csv"}
            >
              EXPORT
            </CSVLink>
            <FilterAltIcon
              variant="contained"
              onClick={showFilters}
              color="primary"
              style={{
                cursor: "pointer",
                marginBottom: "-7px",
                marginLeft: 10,
              }}
            />
          </div>
          <div
            style={{
              height: 650,
              width: "95%",
              margin: "auto",
              marginBottom: 50,
            }}
          >
            <DataGrid
              rows={tasks}
              columns={columns}
              pageSize={10}
              rowHeight={100}
              rowsPerPageOptions={[5]}
              onCellClick={getRowID}
              // checkboxSelection
              disableSelectionOnClick
            />
          </div>
        </div>
      </div>
    </div>
  );
}
