import * as React from "react";
import Button from "@mui/material/Button";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";

const FilterSection = (props) => {
  const [organizer, setOrganizer] = React.useState(null);
  const [department, setDepartment] = React.useState(null);
  const [status, setStatus] = React.useState("");
  const [assignedDate, setAssignedDate] = React.useState(null);
  const [dueDate, setDueDate] = React.useState(null);
  const [departmentsList, setDepartmentsList] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [usersList, setUsersList] = React.useState([]);

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

  React.useEffect(() => {
    //console.log(props.filters);
    setDepartment(props.filters.department);
    setOrganizer(props.filters.organizer);
    setStatus(props.filters.status);
    setAssignedDate(props.filters.assignedDate);
    setDueDate(props.filters.dueDate);
  }, []);

  React.useEffect(() => {
    let newFilters = props.filters;
    newFilters = { ...props.filters, department: department };
    props.getFilters(newFilters);
  }, [department]);

  React.useEffect(() => {
    let newFilters = props.filters;
    newFilters = { ...props.filters, organizer: organizer };
    props.getFilters(newFilters);
  }, [organizer]);

  React.useEffect(() => {
    let newFilters = props.filters;
    newFilters = { ...props.filters, status: status };
    props.getFilters(newFilters);
  }, [status]);

  React.useEffect(() => {
    let newFilters = props.filters;
    newFilters = { ...props.filters, dueDate: dueDate };
    props.getFilters(newFilters);
  }, [dueDate]);

  React.useEffect(() => {
    let newFilters = props.filters;
    newFilters = { ...props.filters, assignedDate: assignedDate };
    props.getFilters(newFilters);
  }, [assignedDate]);

  React.useEffect(() => {
    const usersList = [];
    const departmentsList = [];

    setRows(props.allRows);

    props.users.map((item) => {
      let newObject = {
        id: item.id,
        label: item.title,
      };

      usersList.push(newObject);
    });

    props.departments.map((item) => {
      let newObject = {
        id: item.id,
        label: item.name,
      };

      departmentsList.push(newObject);
    });

    setDepartmentsList(departmentsList);
    setUsersList(usersList);
  }, []);

  const closeFilter = () => {
    props.filterModal(false);
  };

  const clearFilter = () => {
    setDepartment(null);
    setOrganizer(null);
    setStatus("");
    setAssignedDate(null);
    setDueDate(null);

    let newFilters = props.filters;
    newFilters = {
      ...props.filters,
      department: null,
      status: "",
      organizer: null,
      assignedDate: null,
      dueDate: null,
    };
    props.getFilters(newFilters);
    props.getFilteredRows(rows);
    closeFilter();
  };

  const filterDueDate = (data) => {
    let filteredDueDate = [];

    if (dueDate != null) {
      filteredDueDate = data.filter((item) => {
        return item.targetDate == moment(dueDate).format("DD/MM/yyyy");
      });
    } else {
      filteredDueDate = data;
    }

    props.getFilteredRows(filteredDueDate);
  };

  const filterAssignedDate = (data) => {
    let filteredAssignedDate = [];

    console.log(assignedDate);

    if (assignedDate != null) {
      filteredAssignedDate = data.filter((item) => {
        return item.originalDate == moment(assignedDate).format("DD/MM/yyyy");
      });
    } else {
      filteredAssignedDate = data;
    }

    filterDueDate(filteredAssignedDate);
  };

  const filterStatus = (data) => {
    let filteredStatus = [];

    if (status != "") {
      filteredStatus = data.filter((item) => {
        return item.statusID == status;
      });
    } else {
      filteredStatus = data;
    }

    filterAssignedDate(filteredStatus);
  };

  const filterDepartment = (data) => {
    let filteredDepartment = [];

    if (department != null) {
      filteredDepartment = data.filter((item) => {
        return item.departmentID == department.id;
      });
    } else {
      filteredDepartment = data;
    }

    filterStatus(filteredDepartment);
  };

  const filterOrganizer = (data) => {
    let filteredOrganizer = [];

    if (organizer != null) {
      data.map((item) => {
        if (item.assigneeIDs.includes(organizer.id)) {
          filteredOrganizer.push(item);
        }
      });
    } else {
      filteredOrganizer = data;
    }

    filterDepartment(filteredOrganizer);
  };

  const applyFilter = () => {
    const updatedRows = rows;
    filterOrganizer(updatedRows);
    closeFilter();
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Filters</h2>

      <div style={{ width: "100%" }}>
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ width: "50%", textAlign: "left" }}>
            <DesktopDatePicker
              value={assignedDate}
              label="Assigned Date"
              inputFormat="dd/MM/yyyy"
              onChange={(date) => setAssignedDate(date)}
              renderInput={(props) => (
                <TextField style={{ marginTop: 15, width: "98%" }} {...props} />
              )}
            />
          </div>
          <div style={{ width: "50%", textAlign: "right" }}>
            <DesktopDatePicker
              value={dueDate}
              label="Due Date"
              inputFormat="dd/MM/yyyy"
              onChange={(date) => setDueDate(date)}
              renderInput={(props) => (
                <TextField style={{ marginTop: 15, width: "98%" }} {...props} />
              )}
            />
          </div>
        </div>

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={usersList}
          value={organizer}
          sx={{ width: "100%", marginTop: 2 }}
          onChange={(event, value) => setOrganizer(value)}
          renderInput={(params) => <TextField {...params} label="Responsible Person" />}
        />

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          value={department}
          options={departmentsList}
          sx={{ width: "100%", marginTop: 2 }}
          onChange={(event, value) => setDepartment(value)}
          renderInput={(params) => <TextField {...params} label="Department" />}
        />

        <FormControl fullWidth style={{ marginTop: 15 }}>
          <InputLabel id="demo-simple-select-label">Status</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={status}
            label="Status"
            onChange={(event) => setStatus(event.target.value)}
          >
            {statuses.map((item) => {
              return <MenuItem value={item.id}>{item.name}</MenuItem>;
            })}
          </Select>
        </FormControl>
      </div>

      <div style={{ width: "100%", textAlign: "right", marginTop: 20 }}>
        <Button variant="contained" onClick={applyFilter}>
          Apply
        </Button>

        <Button
          style={{ marginLeft: 20 }}
          variant="contained"
          onClick={clearFilter}
        >
          Clear Filters
        </Button>

        <Button
          style={{ marginLeft: 20 }}
          variant="contained"
          onClick={closeFilter}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default FilterSection;
