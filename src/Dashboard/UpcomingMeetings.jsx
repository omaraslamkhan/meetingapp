import { Avatar, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { AssignmentInd } from "@material-ui/icons";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";

const useStyles = makeStyles(() =>
  createStyles({
    icon: {
      backgroundColor: blue[600],
      height: 60,
      width: 60,
    },
  })
);

const UpcomingMeetings = (props) => {
  const classes = useStyles();
  return (
    <Card sx={{ height: "100%" }} {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="subtitle2">
              Upcoming Meetings
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {props.upcomingMeetings}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.icon}>
              <AssignmentInd fontSize="large" />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default UpcomingMeetings;
