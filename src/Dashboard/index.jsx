import * as React from "react";
import { Box, Container, Grid } from "@material-ui/core";
import { usePermissions } from "react-admin";
import MonthlyTotal from "./MonthlyTotal";
import MeetingChart from "./MeetingsChart";
import DepartmentChart from "./DepartmentChart";

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

  if (loading) return null;

  return (
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
  );
};

export default Dashboard;
