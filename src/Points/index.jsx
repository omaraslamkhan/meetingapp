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
import CircularProgress from "@mui/material/CircularProgress";
import { TextField } from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import DownloadIcon from "@mui/icons-material/Download";
import moment from "moment";
import { CSVLink } from "react-csv";
var xlsx = require("xlsx");

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
  const [loading, setLoading] = React.useState(true);
  const [subOrdinateTasks, setSubOrdinateTasks] = React.useState([]);
  const [currentFilters, setCurrentFilters] = React.useState({
    organizer: null,
    department: null,
    status: "",
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
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);

    const fetchedTasks = await accountService.find(
      "",
      "points?_end=1000&_order=ASC&_sort=id&_start=0"
    );

    const finalTasks = fetchedTasks.data;

    if (parsedUser.hasAdminRights == false) {
      const reportingUsers = usersList.filter((user) => {
        return user.reportingTo == parsedUser.id;
      });

      reportingUsers.map(async (person) => {
        const tasks = await axios.get(
          `${BASE_URL}/points?_end=1000&_order=ASC&_sort=id&_start=0`,
          {
            headers: {
              userid: person.id,
            },
          }
        );

        setSubOrdinateTasks(tasks.data);
        subOrdinateTasks.map((item) => {
          finalTasks.push(item);
        });
      });

      setAllTasks(finalTasks);
    } else {
      setAllTasks(finalTasks);
    }

    setLoading(false);
  };

  React.useEffect(() => {
    let customTasks = tasks;

    subOrdinateTasks.map((item) => {
      let newObject = {
        ...item,
        assigneeIDs: getAssigneeIDs(item.assigneeEmail),
        departmentID: getDepartmentID(item.meeting),
        departmentName: getDepartmentName(item.meeting),
        originalDate: moment(item.originalDate).format("DD/MM/yyyy"),
        targetDate: moment(item.targetDate).format("DD/MM/yyyy"),
        status: getStatus(item.status),
        statusID: item.status,
      };
      customTasks = [...customTasks, newObject];
    });

    setTasks(customTasks);
    setOriginalTasks(customTasks);
  }, [subOrdinateTasks]);

  const fetchMeetings = async () => {
    const fetchedMeetings = await axios.get(`${BASE_URL}/meetings?_end=1000&_order=ASC&_sort=id&_start=0`, {
      headers: {
        userid: 934,
      }
    });

    setAllMeetings(fetchedMeetings.data);
  };

  React.useEffect(() => {
    fetchTasks();
    fetchMeetings();
  }, [usersList]);

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
        originalDate: moment(item.originalDate).format("DD/MM/yyyy"),
        targetDate: moment(item.targetDate).format("DD/MM/yyyy"),
        status: getStatus(item.status),
        statusID: item.status,
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
        <a
          href={`${window.location.origin}/reporting/${data.row.meeting}`}
          target="_blank"
          style={{
            textDecoration: 'none',
            textAlign: 'left',
            height: "90px",
            width: "100%",
            fontSize: 12,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >{data.row.meetingTitle}</a>
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

  const getDepartment = (department) => {
    switch (department) {
      case "field force": {
        return 10;
      }

      case "fieldforce": {
        return 10;
      }

      case "sales & marketing (human)": {
        return 11;
      }

      case "sales & marketing (export)": {
        return 14;
      }

      case "product development": {
        return 22;
      }

      case "pd": {
        return 29;
      }

      case "medico marketing": {
        return 36;
      }

      case "quality assurance": {
        return 23;
      }

      case "information solutions": {
        return 5;
      }

      case "information solution": {
        return 5;
      }

      case "administration department": {
        return 21;
      }

      case "adminstration department": {
        return 21;
      }

      case "warehouse (fgs)": {
        return 18;
      }

      case "general management": {
        return 12;
      }

      case "production": {
        return 5;
      }

      case "finance": {
        return 3;
      }

      case "medical and regulatory": {
        return 11;
      }

      case "information technology / m.i.s": {
        return 9;
      }

      case "human resources": {
        return 7;
      }

      case "human resource": {
        return 7;
      }

      case "maintenance & engg.": {
        return 25;
      }

      case "maintainance & engg.": {
        return 25;
      }

      case "quality control": {
        return 26;
      }

      case "marketing i-force": {
        return 17;
      }

      case "material management": {
        return 15;
      }

      case "sales and marketing": {
        return 2;
      }

      case "indenting field": {
        return 19;
      }

      case "medical and regulatory affairs": {
        return 16;
      }

      case "medical & regulatory affairs": {
        return 16;
      }

      case "factory purchase": {
        return 27;
      }

      case "factory administration": {
        return 4;
      }

      case "medical affairs": {
        return 24;
      }

      case "marketing": {
        return 20;
      }

      case "sales & marketing (vet)": {
        return 13;
      }

      case "storage raw/ packing material": {
        return 35;
      }

      case "distribution department": {
        return 8;
      }

      case "store (fact)": {
        return 17;
      }

      case "engineering department": {
        return 24;
      }

      case "management": {
        return 1;
      }

      case "internal audit": {
        return 6;
      }

      case "quality operation": {
        return 28;
      }

      case "sfe & sales support department": {
        return 33;
      }

      case "sfe & sales support": {
        return 43;
      }

      case "sfe + sales support function": {
        return 39;
      }

      case "engineering administration": {
        return 38;
      }

      case "hrsg": {
        return 36;
      }

      case "management services": {
        return 41;
      }

      case "human resource division": {
        return 40;
      }

      case "regulatory affairs": {
        return 39;
      }

      case "indenting": {
        return 32;
      }

      case "admin assitant": {
        return 41;
      }

      case "sterile area": {
        return 31;
      }

      case "sales & marketing international division": {
        return 42;
      }

      case "business development": {
        return 34;
      }

      case "engineering": {
        return 45;
      }

      case "corporate projects": {
        return 46;
      }

      case "corporate communications": {
        return 37;
      }

      case "test department": {
        return 47;
      }

      case "sales manager institution north": {
        return 33;
      }

      case "default": {
        return -1;
      }
    }
  };

  const getProperName = (name) => {
    let customName = "";

    if (name.includes("/")) {
      customName = name.substr(0, name.lastIndexOf("/")).trim();
    } else {
      customName = name;
    }
    return customName;
  };

  const getOriginalDepartment = (departmentID) => {
    let departmentName = "Not Assigned";

    if (departmentID != null) {
      let OriginalDepartment = departmentsList.filter((department) => {
        return department.id == departmentID;
      });

      departmentName = OriginalDepartment[0]?.name;
    }

    return departmentName;
  };

  const customUsers = (data) => {
    const customData = [];

    data.map((entry) => {
      let customObject = {
        email: entry.userPrincipalName,
        name: getProperName(entry.displayName),
        department:
          entry.department != undefined
            ? getDepartment(entry.department.toLowerCase())
            : null,
        initials: "",
      };

      customData.push(customObject);
    });

    //console.log(customData);

    const finalList = customData.map((user) => {
      return (user = {
        ...user,
        department: getOriginalDepartment(user.department),
      });
    });

    console.log(finalList);
  };

  const readUploadFile = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target.result;
        const workbook = xlsx.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = xlsx.utils.sheet_to_json(worksheet);
        customUsers(json);
      };
      reader.readAsArrayBuffer(e.target.files[0]);
    }
  };

  return (
    <div>
      <div
        style={{ background: "#EAEDED", width: "100%", padding: "30px 0px" }}
      >
        {/* <form>
          <label htmlFor="upload">Upload File</label>
          <input
            type="file"
            name="upload"
            id="upload"
            onChange={readUploadFile}
          />
        </form> */}
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
            {loading ? (
              <div style={{ textAlign: "center" }}>
                <CircularProgress />
              </div>
            ) : (
              <DataGrid
                rows={tasks}
                columns={columns}
                pageSize={5}
                rowHeight={100}
                rowsPerPageOptions={[5]}
                onCellClick={getRowID}
                // checkboxSelection
                disableSelectionOnClick
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
