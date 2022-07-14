import * as React from "react";
import { Box, Container, Grid } from "@material-ui/core";
import { usePermissions } from "react-admin";
import MonthlyTotal from "./MonthlyTotal";
import MeetingChart from "./MeetingsChart";
import DepartmentChart from "./DepartmentChart";
import Backdrop from "@mui/material/Backdrop";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";
import { BASE_URL } from '../config/productionConfig'
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import requestHeaders from "../_helpers/headers";

const participantStyle = {
  position: "absolute",
  top: "45%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  outline: 'none'
};

const Dashboard = () => {
  const [stats, setStats] = React.useState({
    thisMonthTotal: 0,
    numberOfMeetingsPerMonth: [],
    deptWiseMeetings: {
      data: [],
      departments: [],
    },
  });
  const { loading, permissions } = usePermissions();
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [reportingToModal, setReportingToModal] = React.useState(false)
  const [users, setUsers] = React.useState([])
  const [usersList, setUsersList] = React.useState([])
  const [responsiblePerson, setResponsiblePerson] = React.useState(null)

  React.useEffect(async () => {
    const users = await axios.get(`${BASE_URL}/users`, {
      headers: requestHeaders,
    });

    setUsers(users.data);
  }, []);

  React.useEffect(() => {
    const finalList = []

    users.map((item) => {
      let newObject = {
        id: item.id,
        label: item.title,
      };

      finalList.push(newObject);
    });

    setUsersList(finalList)
  }, [users])

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);

    if (parsedUser.hasAdminRights == false && parsedUser.reportingTo == 0) {
      setReportingToModal(true)
    }
  }, [])

  React.useEffect(() => {
    (async () => {
      try {
        const request = new Request(`${process.env.REACT_APP_URI}/stats`, {
          method: "GET",
          headers: new Headers({
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers":
              "Origin, X-Requested-With, Content-Type, Accept",
          }),
        });
        const user = JSON.parse(localStorage.getItem("user"));
        request.headers.set("UserId", user.id);

        const resp = await fetch(request);
        if (resp.status < 200 || resp.status >= 300) {
          throw new Error(response.statusText);
        }
        const stats = await resp.json();
        setStats(stats);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  React.useEffect(() => {
    setIsAdmin(permissions === "admin");
  }, [permissions, loading]);

  const getReportingPerson = (data) => {
    if (data != null) {
      setResponsiblePerson(data)
    } else {
      setResponsiblePerson(null)
    }
  };

  const saveReportingPerson = async () => {
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);

    let currentUser = users.filter((item) => {
      return item.id == parsedUser.id
    })

    currentUser = { ...currentUser[0], reportingTo: responsiblePerson.id }
    //console.log(currentUser)

    const reportingPerson = await axios.put(`${BASE_URL}/users/${parsedUser.id}`, currentUser, {
      headers: requestHeaders,
    });

    console.log(reportingPerson)
    localStorage.setItem("user", JSON.stringify(currentUser))
    setReportingToModal(false)
  }

  if (loading) return null;

  return (
    <div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={reportingToModal}
        //onClose={closeModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={reportingToModal}>
          <Box sx={participantStyle}>
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              //value={null}
              style={{ margin: "10px 0px" }}
              onChange={(event, value) => getReportingPerson(value)}
              options={usersList}
              sx={{ width: "95%" }}
              renderInput={(params) => (
                <TextField {...params} label="Select Reporting Person" />
              )}
            />

            <div style={{ display: "inline-block" }}>
              <Button
                onClick={saveReportingPerson}
                style={{ marginTop: 20, marginRight: 10, width: "20px" }}
                variant="contained"
                disabled={responsiblePerson == null ? true : false}
              >
                Save
              </Button>
              {/* <Button
                //onClick={cancelParticipants}
                style={{
                  marginTop: 20,
                  width: "100px",
                  background: "#EAEDED",
                  color: "black",
                }}
                variant="contained"
              >
                Cancel
              </Button> */}
            </div>
          </Box>
        </Fade>
      </Modal>

      <Box
        sx={{
          backgroundColor: "#f4f6f8",
          minHeight: "100%",
          py: 3,
        }}
      >
        <Container maxWidth={false}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Grid container spacing={3}>
                <Grid item xs={3}>
                  <MonthlyTotal thisMonthTotal={stats.thisMonthTotal} />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={isAdmin ? 8 : 10}>
              <MeetingChart chartData={stats.numberOfMeetingsPerMonth} />
            </Grid>
            {isAdmin ? (
              <Grid item xs={4}>
                <DepartmentChart
                  sx={{ height: "100%" }}
                  chartData={stats.deptWiseMeetings.data}
                  departments={stats.deptWiseMeetings.departments}
                />
              </Grid>
            ) : null}
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Dashboard;
