import * as React from "react";
import { useTheme } from "@mui/material/styles";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import axios from "axios";
import requestHeaders from "../_helpers/headers";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import CancelIcon from "@mui/icons-material/Cancel";
import {BASE_URL} from '../config/productionConfig'

export default function Participants(props) {
  const [availableParticipants, setAvailableParticipants] = React.useState([]);
  const [addedParticipants, setAddedParticipants] = React.useState([]);
  const [displayParticipants, setDisplayParticipants] = React.useState([]);
  const [closeModal, setCloseModal] = React.useState(true);
  const [names, setNames] = React.useState([]);
  const focusSave = React.useRef();

  React.useEffect(async () => {
    const users = await axios.get(`${BASE_URL}/users`, {
      headers: requestHeaders,
    });
    setNames(users.data);
  }, []);

  React.useEffect(() => {
    props.getModalState(closeModal);
  }, [closeModal]);

  React.useEffect(() => {
    const addedParticipants = props.currentSession.row.participants;
    const addedIDs = [];
    const employeeIDs = [];
    const finalList = [];
    const customizedList = [];
    const display = [];

    addedParticipants.map((item) => {
      addedIDs.push(item);
    });

    names.map((item) => {
      employeeIDs.push(item.id);
    });

    const list = employeeIDs.filter((item) => !addedIDs.includes(item));
    names.map((item) => {
      if (list.includes(item.id)) {
        finalList.push(item);
      }
    });

    names.map((item) => {
      if (addedParticipants.includes(item.id)) {
        display.push(item);
      }
    });

    finalList.map((item) => {
      let newObject = {
        id: item.id,
        label: item.title,
      };

      customizedList.push(newObject);
    });

    setAvailableParticipants(customizedList);
    setDisplayParticipants(display);
    setAddedParticipants(addedParticipants);
    //console.log(availableParticipants)
  }, [names]);

  const addParticipants = () => {
    props.currentSession.row.participants = addedParticipants;
    setCloseModal(false);
  };

  const cancelParticipants = () => {
    setCloseModal(false);
  };

  const getParticipant = (data) => {
    if (data != null) {
      const display = displayParticipants;

      const current = names.filter((item) => {
        return item.id == data.id;
      });

      display.push(current[0]);

      const updatedList = availableParticipants.filter((item) => {
        return item.id != data.id;
      });

      setAvailableParticipants(updatedList);
      setDisplayParticipants(display);
      addedParticipants.push(data.id);
    }

    focusSave.current.focus();
  };

  const removeParticipant = (data) => {
    const updatedList = addedParticipants.filter((item) => {
      return item != data.id;
    });

    const updatedDisplay = displayParticipants.filter((item) => {
      return item.id != data.id;
    });

    let removedObject = {
      id: data.id,
      label: data.title
    }

    setAddedParticipants(updatedList);
    setDisplayParticipants(updatedDisplay);
    availableParticipants.push(removedObject);
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 600 }}>
        <div style={{ padding: 7 }}>
          <h3>Participant(s)</h3>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexWrap: "wrap",
              //overflowY: "scroll",
            }}
          >
            {!displayParticipants.length ? (
              <span style={{ marginRight: 5 }}>Add a Participant(s)</span>
            ) : (
              displayParticipants.map((item) => (
                <div
                  style={{
                    color: "#7e57c2",
                    border: "1px solid #7e57c2",
                    borderRadius: 20,
                    display: "inline-block",
                    marginRight: 10,
                    padding: 5,
                    marginTop: 5,
                  }}
                >
                  {item.firstName + " " + item.lastName}
                  <CancelIcon
                    onClick={() => removeParticipant(item)}
                    style={{
                      cursor: "pointer",
                      marginBottom: "-6px",
                      color: "#7e57c2",
                    }}
                  />
                </div>
              ))
            )}
          </div>
        </div>

        <Autocomplete
          disablePortal
          id="combo-box-demo"
          value={null}
          style={{ margin: "10px 0px" }}
          onChange={(event, value) => getParticipant(value)}
          options={availableParticipants}
          sx={{ width: "95%" }}
          renderInput={(params) => (
            <TextField {...params} label="Select Participants" />
          )}
        />

        <div style={{ display: "inline-block" }}>
          <Button
            onClick={addParticipants}
            ref={focusSave}
            style={{ marginTop: 20, marginRight: 10, width: "20px" }}
            variant="contained"
          >
            Save
          </Button>
          <Button
            onClick={cancelParticipants}
            style={{
              marginTop: 20,
              width: "100px",
              background: "#EAEDED",
              color: "black",
            }}
            variant="contained"
          >
            Cancel
          </Button>
        </div>
      </FormControl>
    </div>
  );
}
