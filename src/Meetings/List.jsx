import * as React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  FunctionField,
  DateInput,
  ReferenceInput,
  AutocompleteInput,
  TextInput,
  DeleteWithConfirmButton,
} from "react-admin";
import { Button } from "@material-ui/core";
import DownlaodIcon from "@material-ui/icons/GetApp";
import { meetingExporter } from "./MeetingExporter";

const listFilters = [
  <TextInput
    source="subject"
    label="Search"
    alwaysOn
    style={{ width: "500px" }}
  />,
  <ReferenceInput label="Organizer" source="organizer" reference="users">
    <AutocompleteInput optionText="title" optionValue="id" fullWidth />
  </ReferenceInput>,
  <ReferenceInput
    label="Department"
    source="department"
    reference="departments"
  >
    <AutocompleteInput optionText="name" optionValue="id" fullWidth />
  </ReferenceInput>,
  <DateInput source="startDate" label="From Date" />,
  <DateInput source="endDate" label="To Date" />,
];

const MeetingBulkActionButtons = (props) => (
  <>
    <Button
      color="primary"
      startIcon={<DownlaodIcon />}
      onClick={() => meetingExporter(props.selectedIds)}
    >
      Export
    </Button>
  </>
);

export default (props) => (
  <List
    {...props}
    bulkActionButtons={<MeetingBulkActionButtons />}
    exporter={false}
    filters={listFilters}
  >
    <Datagrid
      rowClick={(id) => {
        window.open(`${window.location.origin}/reporting/${id}`, "_blank");
      }}
    >
      <TextField source="subject" />
      <FunctionField
        render={(record) =>
          `${record.organizer.firstName} ${record.organizer.lastName}`
        }
        label="Organizer"
      />
      <NumberField
        source="totalSessions"
        label="Total Sessions"
        sortable={false}
      />
      <NumberField
        source="totalAgenda"
        label="Number of Agendas"
        sortable={false}
      />
      <EditButton />
      <DeleteWithConfirmButton confirmTitle="Delete %{id} - %{subject}" />
    </Datagrid>
  </List>
);
