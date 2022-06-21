import * as React from "react";
import { Edit, TopToolbar } from "react-admin";
import MeetingForm from "./MeetingForm";
import Button from "@material-ui/core/Button";
import DownlaodIcon from "@material-ui/icons/GetApp";
import { meetingExporter } from "./MeetingExporter";

const MeetingTitle = ({ record }) => {
  return <span>{record ? `${record.id} - ${record.subject}` : ""}</span>;
};

const PostEditActions = ({ data }) => {
  return (
    <TopToolbar>
      <Button
        color="primary"
        startIcon={<DownlaodIcon />}
        onClick={() => meetingExporter([data.id])}
      >
        Export
      </Button>
    </TopToolbar>
  );
};

export default (props) => (
  <Edit title={<MeetingTitle />} actions={<PostEditActions />} {...props}>
    <MeetingForm submitOnEnter={false} mode="edit" />
  </Edit>
);
