import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import ResponsiblePersons from "./responsiblePersons";
import Agendas from "./index";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { TextField } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import moment from "moment";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};

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

export default function DataGridDemo(props) {
  const [modal, setModal] = React.useState(false);
  const [selectedTask, setSelectedTask] = React.useState();
  const [rows, setRows] = React.useState([]);
  const [sure, setSure] = React.useState(false);
  const [selectedPointID, setSelectedPointID] = React.useState();
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setRows(props.points);
  }, [props]);

  const statuses = [
    {
      id: 0,
      name: "Not Started",
    },
    {
      id: 1,
      name: "In Progress",
    },
    {
      id: 2,
      name: "Need Management Approval",
    },
    {
      id: 3,
      name: "On Hold",
    },
    {
      id: 4,
      name: "Completed",
    },
    {
      id: 5,
      name: "Aborted/Closed",
    },
  ];

  const getCustomDate = (date) => {
    const customDate = moment(date).format("DD/MM/yyyy");
    return customDate;
  };

  const getRowID = (data) => {
    setSelectedTask(data);
    localStorage.setItem("taskID", data.row.id);

    if (
      localStorage.getItem("modalData") === "edit" ||
      localStorage.getItem("modalData") === "responsiblePersons"
    ) {
      setModal(true);
    }
  };

  const editTask = () => {
    localStorage.setItem("modalData", "edit");
    setModal(true);
  };

  const changeAssignedDate = (value, rowData) => {
    props.getAssignedDate(value, rowData.id, props.taskID);
  };

  const changeTargetDate = (value, rowData) => {
    props.getTargetDate(value, rowData.id, props.taskID);
  };

  const changeStatus = (value, rowData) => {
    props.getPointStatus(value, rowData.id, props.taskID);
  };

  const changePointText = (value, rowData) => {
    props.getPointText(value, rowData.id, props.taskID);
  };

  const getStatus = (data) => {
    return (
      <FormControl fullWidth>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={data.row.status}
          //label="Status"
          onChange={(e) => changeStatus(e.target.value, data)}
        >
          {statuses.map((item) => {
            return <MenuItem value={item.id}>{item.name}</MenuItem>;
          })}
        </Select>
      </FormControl>
    );
  };

  const getIndex = (rowID) => {
    let index = rows.findIndex((item) => {
      return item.id == rowID;
    });

    return index + 1;
  };

  const getInitials = (data) => {
    const currentAssignees = props.assignees;
    let assignees = "";

    props.people.map((item) => {
      if (currentAssignees.includes(item.id)) {
        return <div>{item.initial}</div>;
        // assignees = assignees.concat(item.initial + ", ")
      }
    });

    // assignees = assignees.replace(/,\s*$/, "");
  };

  const getPointNumber = (data) => {
    return (
      props.agendaSerial + "." + props.taskSerial + "." + getIndex(data.id)
    );
  };

  const columns = [
    //   { field: 'id', headerName: 'ID', width: 90 },
    {
      field: "name",
      headerName: <b>Point</b>,
      width: 500,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ width: "10%", paddingTop: 1 }}>
            {getPointNumber(data)}
          </div>
          <div style={{ width: "90%" }}>
            <TextField
              variant="standard"
              multiline
              value={data.row.text}
              placeholder={"Point description"}
              onChange={(e) => changePointText(e.target.value, data)}
              InputProps={{
                disableUnderline: true,
                style: {
                  fontSize: 12,
                },
              }}
              style={{
                height: "90px",
                width: "100%",
                overflowY: "scroll",
              }}
            />
          </div>
        </div>
      ),
    },
    // {
    //   field: "assignees",
    //   headerName: <b>Assignees</b>,
    //   width: 300,
    //   renderCell: (data) => (
    //     <div style={{display: 'flex', flexWrap: 'wrap', width: '100%'}}>{getInitials(data)}</div>
    //   )
    // },
    {
      field: "originalDate",
      headerName: <b>Assigned Date</b>,
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        // <input
        //   style={{ padding: 10 }}
        //   type="date"
        //   //min={minDate}
        //   value={getCustomDate(data.row.originalDate)}
        //   onChange={(event) => changeAssignedDate(event.target.value, data)}
        // />
        <DesktopDatePicker
          value={new Date(data.row.originalDate)}
          inputFormat="dd/MM/yyyy"
          onChange={(changedDate) => changeAssignedDate(changedDate, data)}
          renderInput={(props) => <TextField {...props} />}
        />
      ),
    },
    {
      field: "targetDate",
      headerName: <b>Due Date</b>,
      width: 200,
      disableColumnMenu: true,
      sortable: false,
      renderCell: (data) => (
        // <input
        //   style={{ padding: 10 }}
        //   type="date"
        //   //min={minDate}
        //   value={getCustomDate(data.row.targetDate)}
        //   onChange={(event) => changeTargetDate(event.target.value, data)}
        // />
        <DesktopDatePicker
          value={new Date(data.row.targetDate)}
          inputFormat="dd/MM/yyyy"
          onChange={(changedDate) => changeTargetDate(changedDate, data)}
          renderInput={(props) => <TextField {...props} />}
        />
      ),
    },
    {
      field: "status",
      headerName: <b>Status</b>,
      width: 300,
      disableColumnMenu: true,
      sortable: false,
      headerClassName: "super-app-theme--header",
      renderCell: (data) => getStatus(data),
    },
    {
      field: "action",
      headerName: <b>Actions</b>,
      width: 225,
      disableColumnMenu: true,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: (data) => (
        <div>
          <Button
            //onClick={editTask}
            size="small"
            variant="contained"
            style={{ marginRight: 10 }}
          >
            Edit
          </Button>
          <Button
            size="small"
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

  const closeModal = () => {
    setModal(false);

    setTimeout(() => {
      localStorage.removeItem("modalData");
    }, 2000);
  };

  const modalTrigger = (value) => {
    if (value === false) {
      closeModal();
    }
  };

  const confirmDelete = (pointID) => {
    setSure(true);
    setSelectedPointID(pointID);
  };

  const yesDelete = () => {
    setLoading(true);
    props.getDeletedPoint(props.taskID, selectedPointID);

    setTimeout(() => {
      setLoading(false);
    }, 3000);

    setSure(false);
  };

  const noDelete = () => {
    setSure(false);
  };

  return (
    <div style={{ marginTop: 30, height: 400, width: "100%" }}>
      {loading ? (
        <div style={{ textAlign: "center" }}>
          <CircularProgress />
        </div>
      ) : (
        <DataGrid
          rows={rows}
          onCellKeyDown={(params, events) => events.stopPropagation()}
          columns={columns}
          pageSize={5}
          rowHeight={100}
          rowsPerPageOptions={[5]}
          onCellClick={getRowID}
          // checkboxSelection
          disableSelectionOnClick
        />
      )}

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
              Are you sure you want to delete this point? This action can't be
              reverted.
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
    </div>
  );
}
