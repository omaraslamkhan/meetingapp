import * as React from "react";
import {
  List,

  FunctionField,
  DateInput,
  ReferenceInput,
  AutocompleteInput,
  TextInput,
  DateField,
  ReferenceField,
  usePermissions,
} from "react-admin";
import requestHeaders from "../_helpers/headers";
import { BASE_URL } from '../config/productionConfig'
// import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from "moment";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
// import {  DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Box, FormControl, InputLabel, MenuItem, Select } from "@material-ui/core";




// const listFilters = (permissions) => {
//   const isAdmin = permissions === "admin";

//   const result = [
//     <TextInput
//       source="text"
//       label="Search"
//       alwaysOn
//       style={{ width: "500px" }}
//     />,
//     <DateInput source="originalDate" label="Original Date" />,
//     <DateInput source="targetDate" label="Target Date" />,
//   ];

//   if (isAdmin) {
//     result.push(
//       <ReferenceInput
//         label="Responsible Person"
//         source="assignee"
//         reference="users"
//       >
//         <AutocompleteInput optionText="title" optionValue="id" fullWidth />
//       </ReferenceInput>
//     );
//   }

//   return result;
// };

const PointsList = (props) => {

  const [dataM, setDataM] = React.useState([]);
  const [tasks, setTasks] = React.useState([])
  const [valueTarget, setValueTarget] = React.useState(null);
  const [valueOrig, setValueOrig] = React.useState(null);
  const [resPerson, setResPerson] = React.useState(null);
  const [statusState, setStatus] = React.useState('');
  const [dataUser, setDataUser] = React.useState([]);

  // const [localUserID, setLocalUserId] = React.useState('')

  React.useEffect(async () => {
    const tasks = await axios.get(`${BASE_URL}/points?_end=200&_order=ASC&_sort=id&_start=0`);
    setTasks(tasks.data);
    // console.log(tasks.data);
    fetch(
      `http://localhost:3004/users`,

    )
      .then((res) => res.json())
      .then((apiRes) => {
        setDataUser(apiRes);
        // console.log('junaid api fetch', apiRes);


      })
      .catch((err) => console.log(err.message));

  }, []);

  const assemListUser = dataUser.map((assem) => {
    return {
      id: assem.id,
      name: assem.firstName,
      lastName: assem.lastName,
    };

  });

  // React.useEffect(() => {
  //   setDataM(tasks);
  //   // console.log(tasks);
  // }, [tasks])

  const assemListStatus = [
    "Not Started",
    "In Progress",
    "Need Management Approval",
    "On Hold",
    "Completed",
    "Aborted/Closed"
  ]

  const getStatus = (status) => {
    switch (status) {
      case 0: {
        return "Not Started"
      };

      case 1: {
        return "In Progress"
      };

      case 2: {
        return "Need Management Approval"
      };

      case 3: {
        return "On Hold"
      };

      case 4: {
        return "Completed"
      };

      case 5: {
        return "Aborted/Closed"
      };
    }
  }

  const getDate = (date) => {
    const customDate = moment(date).format("DD/MM/yyyy");
    // console.log(customDate);
    return customDate
  }

  const assemList = tasks.map((assem) => {
    //const assemList = state.assembly.map((assem) => {



    return {
      id: assem.id,
      meetingTitle: assem.meetingTitle,
      status: getStatus(assem.status),
      meeting: assem.meeting,
      text: assem.text,
      originalDate: getDate(assem.originalDate),
      targetDate: getDate(assem.targetDate),
      assignees: assem.assignees,
    };
  });
// setDataM(assemList)
  // console.log('check', assemList);




  React.useEffect(() => {
    // setDataM(assemList)

    if (!resPerson && !valueOrig && !valueTarget && !statusState) {
      setDataM(assemList);
      //GEt all data

      // return assem;

      console.log('from null', dataM);

      console.log('sb null hein');

    } else {
      if (valueOrig) {

        const res = assemList.filter((item, index) => {
          // let rowData = [];
          //  const ogDate = item.originalDate.split("T")[0]
          if (item.originalDate === valueOrig) {

            setDataM(res);
          }
          // rowData.push(assemList[index]);

        });
        console.log('original hai aur baki dono nh ', dataM);

      }
      else if (resPerson && valueOrig) {
        const res = assemList.filter((item, index) => {
          if (item.assignees.includes(resPerson.trim()) && item.originalDate === valueOrig) {
            setDataM(res)

          }


        });
        console.log('resperson aur original hai aur ik  nh ');


      }
      else if (statusState) {
        const res = assemList.filter((item, index) => {
          // let rowData = [];

          if (item.status == statusState) {
            setDataM(res);

          }

          // rowData.push(assemList[index]);

        });
        console.log('status hai aur baki nh ');
        // setDataM(res)


      }
      else if (resPerson) {
        const res = assemList.filter((item, index) => {

          if (item.assignees.includes(resPerson.trim())) {
            return true
          }
          console.log('res ha bs', ...dataM);
        });
        setDataM(res);

      }
      else if (valueOrig && valueTarget) {
        const res = assemList.filter((item, index) => {
          if (item.targetDate === valueTarget && item.originalDate === valueOrig) {
            setDataM(res);
          }
        });
        console.log('res nh hai baki dono h');

      }
    }

  }, [resPerson, valueOrig, valueTarget, statusState,])
  //  console.log(dataM);
  //  console.log(email);

  // const rowData = [];

  // dataM.filter((assem, index) => assem.assigneeEmail.split(',').find((val) => {
  //   if (val.trim() == email) {
  //     console.log(val);
  //     //  dataM[index].status==0?dataM[index].status=='Pending':dataM[index].status=='Approved'
  //     console.log(dataM[index].status)
  //     rowData.push(dataM[index])
  //   }

  // }))


  // console.log(rowData);

  const { loading, permissions } = usePermissions();

  const columns = [
    { field: "meetingTitle", headerName: "Meeting Title", width: 160 },
    { field: "text", headerName: "Task", width: 300 },
    { field: "originalDate", headerName: "Original Date", width: 150 },
    { field: "targetDate", headerName: "Target Date", width: 150 },
    { field: "assignees", headerName: "Responsible Persons", width: 200 },
    { field: "status", headerName: "Status", width: 150 },
  ];

  return (
    <div>
      <div
        style={{ background: "#EAEDED", width: "100%", padding: "30px 10px" }}
      >
        <div
          style={{
            padding: "50px 20px",
            textAlign: "center",
            width: "95%",
            margin: "auto",
            background: "#fff",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
          }}
        >
          <h2 style={{ marginTop: "-5px", textAlign: "center" }}>Tasks</h2>

          {loading ? null : (
            <div style={{ height: 400, width: "100%" }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', margin: '15px 0' }}>
                {/* <Autocomplete

                  id="combo-box-demo"
                  options={assemListUser}
                  getOptionLabel={(op) => `${op.name} ${op.lastName}`}
                  // isOptionEqualToValue ={(option, value) => {
                  //   console.log(option === value)

                  // }}
                  onInputChange={(e, f) => {

                    setResPerson(e.target.innerText)
                    console.log('responsible person', e.target.innerText);

                  }
                  }
                  // onClose={(e) => console.log('nClose p', e)}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Department" />}
                /> */}

                <Autocomplete

                  id="combo-box-demo"
                  options={assemListUser}
                  getOptionLabel={(op) => `${op.name} ${op.lastName}`}
                  // isOptionEqualToValue ={(option, value) => {
                  //   console.log(option === value)

                  // }}
                  onInputChange={(e, f) => {

                    setResPerson(e.target.innerText)
                    console.log('responsible person', e.target.innerText);
                  }
                  }
                  // onClose={(e) => console.log('nClose p', e)}
                  sx={{ width: 300 }}
                  renderInput={(params) => <TextField {...params} label="Responsible Person" />}
                />


                <LocalizationProvider dateAdapter={AdapterDateFns}>

                  <DatePicker
                    clearable
                    // clearText="Clear me"s
                    label="Original Date"

                    // inputFormat="yyyy/MM/dd" 
                    // handleOriginal
                    value={valueOrig}
                    onChange={(date) => {
                      if (date != null) {
                        const a = moment(date).format("DD/MM/yyyy");
                        setValueOrig(a)
                        console.log(a);

                      } else {
                        setValueOrig(date)
                        console.log('else', date);


                      }


                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />


                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDateFns}>

                  <DatePicker
                    clearable
                    // clearText="Clear"
                    label="Target Date"


                    // inputFormat="yyyy/MM/dd"
                    value={valueTarget}
                    onChange={(date) => {
                      if (date != null) {
                        var day = date.getDate();
                        var month = date.getMonth() + 1;
                        var year = date.getFullYear();

                        if (month < 10) month = "0" + month;
                        if (day < 10) day = "0" + day;

                        var dateFormate = year + "-" + month + "-" + day;
                        setValueTarget(dateFormate)
                        console.log('target date from state', dateFormate);


                      } else {
                        setValueTarget(date)
                        console.log('else', date);


                      }



                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />


                </LocalizationProvider>


                <Autocomplete

                  id="combo-box-demo2"
                  options={assemListStatus}
                  getOptionLabel={(op) => op}

                  onInputChange={(e, f) => {

                    setStatus(e.target.innerText)

                    console.log('Status from autcomplete', e.target.innerText);
                  }
                  }
                  // onClose={(e) => console.log('nClose p', e)}
                  sx={{ width: 200 }}
                  renderInput={(params) => <TextField {...params} label="Status" />}
                />


                {/* <Box sx={{ minWidth: 120 }}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Status</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={statusState}
                      label="status"
                      onChange={(status) => {

                        setStatus(status.target.value)
                        // console.log(status.target.value);
                        console.log(statusState);


                      }}
                    >
                      <MenuItem value={'In Progress'}>In Progress</MenuItem>

                      <MenuItem value={'Need Management Approval'}>Need Management Approval</MenuItem>
                      <MenuItem value={'On Hold'}>On Hold</MenuItem>
                      <MenuItem value={'Completed'}>Completed</MenuItem>
                      <MenuItem value={'Aborted/Closed'}>Aborted/Closed</MenuItem>
                    </Select>




                  </FormControl>
                </Box> */}


              </div>

              <DataGrid

                rows={dataM}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                onCellEditCommit={(params) => {
                  console.log("junaid dev", params);
                  setSelectionModel(params);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointsList;
