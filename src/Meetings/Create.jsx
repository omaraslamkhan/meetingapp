import * as React from "react";
import { Create, useNotify, useRefresh, useRedirect } from "react-admin";
import MeetingForm from "./MeetingForm";

export default (props) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const redirect = useRedirect();

  const onSuccess = () => {
    notify(`Meeting Created`, "success");
    redirect("/meetings");
    refresh();
  };

  return (
    <Create {...props} onSuccess={onSuccess}>
      <MeetingForm submitOnEnter={false} />
    </Create>
  );
};
