import { Bar } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  colors,
  CardHeader,
  Divider,
} from "@material-ui/core";

const MeetingChart = ({ chartData }) => {
  const data = {
    datasets: [
      {
        backgroundColor: colors.indigo[500],
        barThickness: 20,
        borderRadius: 5,
        data: chartData,
        label: "Number of Meetings",
      },
    ],
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
  };

  const options = {
    animation: false,
    cornerRadius: 20,
    layout: { padding: 0 },
    legend: { display: false },
    maintainAspectRatio: false,
    responsive: true,
    scales: {
      xAxes: [
        {
          ticks: {
            fontColor: "#6b778c",
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        },
      ],
      yAxes: [
        {
          ticks: {
            fontColor: "#6b778c",
            beginAtZero: true,
            min: 0,
          },
          gridLines: {
            borderDash: [2],
            borderDashOffset: [2],
            color: "#efefef",
            drawBorder: false,
            zeroLineBorderDash: [2],
            zeroLineBorderDashOffset: [2],
            zeroLineColor: "#efefef",
          },
        },
      ],
    },
    tooltips: {
      backgroundColor: "#ffffff",
      bodyFontColor: "#6b778c",
      borderColor: "#efefef",
      borderWidth: 1,
      enabled: true,
      footerFontColor: "#6b778c",
      intersect: false,
      mode: "index",
      titleFontColor: "#172b4d",
    },
  };

  return (
    <Card>
      <CardHeader title="Number of meetings" />
      <Divider />
      <CardContent>
        <Box
          sx={{
            height: 400,
            position: "relative",
          }}
        >
          <Bar data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default MeetingChart;
