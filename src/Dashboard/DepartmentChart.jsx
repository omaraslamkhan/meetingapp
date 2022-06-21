import { Doughnut } from "react-chartjs-2";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  colors,
} from "@material-ui/core";

const TrafficByDevice = ({ chartData, departments }) => {
  const getColor = (_, idx) => {
    let colorRange;
    switch (idx % 7) {
      case 0:
        colorRange = colors.indigo;
        break;
      case 1:
        colorRange = colors.red;
        break;
      case 2:
        colorRange = colors.green;
        break;
      case 3:
        colorRange = colors.blue;
        break;
      case 4:
        colorRange = colors.orange;
        break;
      case 5:
        colorRange = colors.yellow;
        break;
      case 6:
        colorRange = colors.blueGrey;
        break;
    }
    const multiple = idx < 7 ? 1 : Math.floor(idx / 7) + 1;

    return colorRange[multiple * 100];
  };
  const data = {
    datasets: [
      {
        data: chartData,
        backgroundColor: departments.map(getColor),
        borderWidth: 5,
        borderColor: colors.common.white,
        hoverBorderColor: colors.common.white,
      },
    ],
    labels: departments.map(({ name }) => name),
  };

  const options = {
    layout: { padding: 0 },
    responsive: true,
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
    legend: {
      display: true,
      position: "bottom",
    },
  };

  return (
    <Card>
      <CardHeader title="Meetings per department" />
      <Divider />
      <CardContent>
        <Box>
          <Doughnut data={data} options={options} />
        </Box>
      </CardContent>
    </Card>
  );
};

export default TrafficByDevice;
