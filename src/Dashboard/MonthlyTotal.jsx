import { Avatar, Card, CardContent, Grid, Typography } from "@material-ui/core";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import { DateRange } from "@material-ui/icons";
import { red } from "@material-ui/core/colors";

const useStyles = makeStyles(() =>
  createStyles({
    icon: {
      backgroundColor: red[500],
      height: 60,
      width: 60,
    },
  })
);

const MonthlyTotal = (props) => {
  const classes = useStyles();
  return (
    <Card {...props}>
      <CardContent>
        <Grid container spacing={3} sx={{ justifyContent: "space-between" }}>
          <Grid item>
            <Typography color="textSecondary" gutterBottom variant="subtitle2">
              MoM This Month
            </Typography>
            <Typography color="textPrimary" variant="h3">
              {props.thisMonthTotal}
            </Typography>
          </Grid>
          <Grid item>
            <Avatar className={classes.icon}>
              <DateRange fontSize="large" />
            </Avatar>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MonthlyTotal;
