import * as React from "react";
import {
  TabbedForm,
  FormTab,
  TextInput,
  DateInput,
  DateTimeInput,
  ReferenceInput,
  AutocompleteInput,
  ArrayInput,
  SimpleFormIterator,
  ReferenceArrayInput,
  AutocompleteArrayInput,
  required,
  minLength,
  SelectInput,
  useGetIdentity,
} from "react-admin";
import { TaskStatusList } from "../constants";

const MeetingForm = (props) => {
  const isEditMode = props.mode === "edit";
  const { identity, loading: identityLoading } = useGetIdentity();
  const [isNotOrganizer, setIsNotOrganizer] = React.useState(false);

  React.useEffect(() => {
    if (identityLoading) return;

    setIsNotOrganizer(
      identity.hasAdminRights || !isEditMode
        ? false
        : props.record?.organizer?.id !== identity.id
    );
  }, [identityLoading]);

  return (
    <TabbedForm {...props} submitOnEnter={props.submitOnEnter}>
      <FormTab label="Details">
        <TextInput
          source="subject"
          inputProps={{ spellCheck: true }}
          disabled={isEditMode}
          fullWidth
          validate={required()}
        />
        <ReferenceInput
          label="Organizer"
          source="organizer.id"
          validate={required()}
          reference="users"
        >
          <AutocompleteInput
            optionText="title"
            optionValue="id"
            disabled={isEditMode}
            fullWidth
          ></AutocompleteInput>
        </ReferenceInput>
        <ReferenceInput
          label="Department"
          source="department.id"
          validate={required()}
          reference="departments"
        >
          <AutocompleteInput
            optionText="name"
            optionValue="id"
            disabled={isEditMode}
            fullWidth
          ></AutocompleteInput>
        </ReferenceInput>
      </FormTab>
      <FormTab label="Sessions">
        <ArrayInput
          source="sessions"
          fullWidth
          validate={[
            required(),
            minLength(1, "Meeting should atleast have one session"),
          ]}
        >
          <SimpleFormIterator>
            <DateTimeInput
              source="startDate"
              label="Start Date"
              fullWidth
              disabled={isNotOrganizer}
            />
            <DateTimeInput
              source="endDate"
              label="Endt Date"
              fullWidth
              disabled={isNotOrganizer}
            />
            <ReferenceArrayInput
              label="Participants"
              source="participants"
              reference="users"
            >
              <AutocompleteArrayInput
                optionText="title"
                optionValue="id"
                disabled={isNotOrganizer}
                fullWidth
              ></AutocompleteArrayInput>
            </ReferenceArrayInput>
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
      <FormTab label="Agendas">
        <ArrayInput source="agendas" fullWidth>
          <SimpleFormIterator>
            <TextInput
              source="agenda"
              inputProps={{ spellCheck: true }}
              disabled={isNotOrganizer}
              required
              label="Agenda"
              fullWidth
            />
            <ArrayInput source="tasks" label="Tasks" fullWidth>
              <SimpleFormIterator>
                <ReferenceArrayInput
                  label="Responsible Persons"
                  source="assignees"
                  reference="users"
                  isRequired
                >
                  <AutocompleteArrayInput
                    optionText="title"
                    optionValue="id"
                    disabled={isNotOrganizer}
                    fullWidth
                  ></AutocompleteArrayInput>
                </ReferenceArrayInput>
                <ArrayInput source="points" label="Points" fullWidth>
                  <SimpleFormIterator>
                    <TextInput
                      source="text"
                      required
                      inputProps={{ spellCheck: true }}
                      disabled={isNotOrganizer}
                      label="Description"
                      multiline
                      fullWidth
                    />
                    <DateInput
                      source="originalDate"
                      label="Original Date"
                      disabled={isNotOrganizer}
                      fullWidth
                    />
                    <DateInput
                      source="targetDate"
                      label="Target Date"
                      disabled={isNotOrganizer}
                      fullWidth
                    />
                    <SelectInput
                      label="Status"
                      source="status"
                      choices={TaskStatusList}
                      disabled={isNotOrganizer}
                      fullWidth
                    />
                  </SimpleFormIterator>
                </ArrayInput>
              </SimpleFormIterator>
            </ArrayInput>
          </SimpleFormIterator>
        </ArrayInput>
      </FormTab>
    </TabbedForm>
  );
};

export default MeetingForm;
