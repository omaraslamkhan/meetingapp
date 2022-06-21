import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
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
import {BASE_URL} from '../config/productionConfig'
import { DataGrid } from "@mui/x-data-grid";

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
  // const [localUserID, setLocalUserId] = React.useState('')

  React.useEffect(() => {
    const user = localStorage.getItem("user");
    const parseData = JSON.parse(user);
    // setLocalUserId(parseData.id)
    // console.log(parseData.firstName + parseData.lastName);
    // console.log(localUserID)

    fetch(
      `${BASE_URL}/points?_end=200&_order=ASC&_sort=id&_start=0`,
      {
        headers: requestHeaders,
      }
    )
      .then((res) => res.json())
      .then((apiRes) => {
        setDataM(apiRes);
        // console.log(apiRes);
      })
      .catch((err) => console.log(err.message));
  }, []);

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

  const assemList = dataM.map((assem) => {
    //const assemList = state.assembly.map((assem) => {
    return {
      id: assem.id,
      meetingTitle: assem.meetingTitle,
      status: assem.status === 0 ? "Pending" : "Approved",
      meeting: assem.meeting,
      text: assem.text,
      originalDate:  assem.originalDate ? assem.originalDate.split("T")[0] : null,
      targetDate: assem.targetDate ? assem.targetDate.split("T")[0] : null,
      assignees: assem.assignees,
    };
  });

  // console.log(rowData);

  const { loading, permissions } = usePermissions();

  const columns = [
    { field: "meetingTitle", headerName: "Meeting Title", width: 160 },
    { field: "text", headerName: "Task", width: 300 },
    { field: "originalDate", headerName: "Original Date", width: 150 },
    { field: "targetDate", headerName: "Target Date", width: 150 },
    { field: "assignees", headerName: "Responsible Persons", width: 200 },
    { field: "status", headerName: "Stauts", width: 150 },
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
              <DataGrid
                rows={assemList}
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
