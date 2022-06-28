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
import FilterAltIcon from "@mui/icons-material/FilterAlt";
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
  const [meetings, setMeetings] = React.useState([]);
  const [allMeetings, setAllMeetings] = React.useState([]);
  const [disableOperations, setDisableOperations] = React.useState(false);
  const [sure, setSure] = React.useState(false);
  const [filterModal, setFilterModal] = React.useState(false);
  const [selectedMeetingID, setSelectedMeetingID] = React.useState();
  const [usersList, setUsersList] = React.useState([]);
  const [departmentsList, setDepartmentsList] = React.useState([]);
  const [originalMeetings, setOriginalMeetings] = React.useState([]);
  const [currentFilters, setCurrentFilters] = React.useState({
    organizer: null,
    department: null,
  });
  const history = useHistory();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  const fetchMeetings = async () => {
    const fetchedMeetings = await accountService.find(
      "",
      "meetings?_end=100&_order=ASC&_sort=id&_start=0"
    );

    setAllMeetings(fetchedMeetings.data);
  };

  React.useEffect(() => {
    fetchMeetings();
  }, []);

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);

    setMeetings(allMeetings);
    setOriginalMeetings(allMeetings);

    if (
      parsedUser.id == 934 ||
      parsedUser.id == 984 ||
      parsedUser.id == 994 ||
      parsedUser.id == 1054
    ) {
      setDisableOperations(true);
    }
  }, [allMeetings]);

  React.useEffect(() => {
    if (localStorage.getItem("meetingID")) {
      localStorage.removeItem("meetingID");
    }

    //setMeetings(DemoData);
  }, []);

  const confirmDelete = (meetingID) => {
    setSure(true);
    setSelectedMeetingID(meetingID);
  };

  const getRowID = (data) => {
    console.log(data);
  };

  const getCustomDate = (date) => {
    return moment(date).format("DD/MM/yyyy");
  };

  const columns = [
    //   { field: 'id', headerName: 'ID', width: 90 },
    {
      field: "subject",
      headerName: <b>Meeting Name</b>,
      width: disableOperations ? 500 : 330,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        <a
          href={`${window.location.origin}/reporting/${data.id}`}
          target="_blank"
        >
          {data.row.subject}
        </a>
      ),
    },
    {
      field: "organizer",
      headerName: <b>Organizer</b>,
      width: disableOperations ? 350 : 300,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        <span>
          {data.row.organizer.firstName + " " + data.row.organizer.lastName}
        </span>
      ),
    },
    {
      field: "meetingDate",
      headerName: <b>Meeting Date</b>,
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        <span>
          {data.row.sessions.length
            ? getCustomDate(data.row.sessions[0].startDate)
            : "No Sessions"}
        </span>
      ),
    },
    {
      field: "department",
      headerName: <b>Department</b>,
      width: 300,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => <span>{data.row.department.name}</span>,
    },
    {
      field: "action",
      headerName: <b>Actions</b>,
      width: 210,
      hide: disableOperations ? true : false,
      disableColumnMenu: true,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (data) => (
        <div>
          <Button
            onClick={() => goToUpdate(data)}
            size="small"
            disabled={disableOperations}
            variant="contained"
            style={{ marginRight: 10 }}
          >
            {/* <Link
              to="/meetings/update"
              style={{ textDecoration: "none", color: "#fff" }}
            >
              Edit
            </Link> */}
            Edit
          </Button>
          <Button
            size="small"
            disabled={disableOperations}
            onClick={() => confirmDelete(data.row.id)}
            variant="contained"
            style={{ background: "red" }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const goToCreate = () => {
    history.push("/meetings/create");
  };

  const goToUpdate = (data) => {
    localStorage.setItem("meetingID", data.id);
    history.push("/meetings/update");
  };

  const yesDelete = async () => {
    const deleteMeeting = await axios.delete(
      `${BASE_URL}/meetings/${selectedMeetingID}`,
      {
        headers: requestHeaders,
      }
    );

    console.log(deleteMeeting);
    setMeetings([]);
    fetchMeetings();
    setSure(false);
  };

  const noDelete = () => {
    setSure(false);
  };

  const showFilters = () => {
    setFilterModal(true);
  };

  const hideFilters = (filterModalStatus) => {
    setFilterModal(filterModalStatus);
  };

  const filterRows = (data) => {
    setMeetings(data);
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
                  allRows={originalMeetings}
                  getFilters={getCurrentFilters}
                  filters={currentFilters}
                />
              </Box>
            </Fade>
          </Modal>

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
                  Are you sure you want to delete this meeting? This action
                  can't be reverted.
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
          <h2>Meetings</h2>

          <div
            style={{
              width: "95%",
              textAlign: "left",
              margin: "30px auto",
            }}
          >
            {!disableOperations && (
              <Button
                style={{ marginTop: 20 }}
                variant="contained"
                onClick={goToCreate}
              >
                {/* <Link
                to="/meetings/create"
                style={{ textDecoration: "none", color: "#fff" }}
              >
                + Add Meeting
              </Link> */}
                + Add Meeting
              </Button>
            )}

            {disableOperations && (
              <FilterAltIcon
                variant="contained"
                onClick={showFilters}
                color="primary"
                style={{
                  cursor: "pointer",
                  marginBottom: "-20px",
                  marginLeft: 10,
                }}
              />
            )}
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
              rows={meetings}
              columns={columns}
              pageSize={10}
              rowHeight={50}
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
