import * as React from "react";
import Button from "@mui/material/Button";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import TextField from "@mui/material/TextField";
import moment from "moment";
import Autocomplete from "@mui/material/Autocomplete";

const FilterSection = (props) => {
  const [organizer, setOrganizer] = React.useState(null);
  const [department, setDepartment] = React.useState(null);
  const [departmentsList, setDepartmentsList] = React.useState([]);
  const [rows, setRows] = React.useState([]);
  const [usersList, setUsersList] = React.useState([]);

  React.useEffect(() => {
    console.log(props);
    setDepartment(props.filters.department)
    setOrganizer(props.filters.organizer)
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

    props.getFilteredRows(rows);
    closeFilter();
  };

  const filterDepartment = (data) => {
    let filteredDepartment = [];

    if (department != null) {
      filteredDepartment = data.filter((item) => {
        return item.department.id == department.id;
      });
    } else {
      filteredDepartment = data;
    }

    props.getFilteredRows(filteredDepartment);
  };

  const filterOrganizer = (data) => {
    let filteredOrganizer = [];

    if (organizer != null) {
      filteredOrganizer = data.filter((item) => {
        return item.organizer.id == organizer.id;
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
        <Autocomplete
          disablePortal
          id="combo-box-demo"
          options={usersList}
          value={organizer}
          sx={{ width: "100%" }}
          onChange={(event, value) => setOrganizer(value)}
          renderInput={(params) => <TextField {...params} label="Organizer" />}
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
