import html2pdf from "html2pdf.js";
import { useEffect, useState } from "react";
import "./report.scss";
import moment from "moment";
import { Button, Box } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import { TaskStatusTexts } from "../constants";

export const meetingExporter = (selectedIds) => {
  selectedIds.forEach((id) =>
    window.open(`${window.location.origin}/reporting/${id}`, "_blank")
  );
};

export const MeetingToPDF = (props) => {
  const [meeting, setMeeting] = useState(null);
  const [participants, setParticipants] = useState(null);

  useEffect(() => {
    const meetingId = props.match.params.meetingId;
    fetch(`${process.env.REACT_APP_URI}/meetings/report/` + meetingId)
      .then((response) => response.json())
      .then((meetingResp) => {
        const participants = new Map(
          meetingResp.agendas.flatMap((agenda) => {
            return agenda.tasks.flatMap((task) =>
              task.assignees.map((assignee) => [assignee.id, assignee])
            );
          })
        );

        for (const session of meetingResp.sessions) {
          for (const participant of session.participants) {
            participants.set(participant.id, participant);
          }
        }

        const initialsSet = new Set();

        for (const [, participant] of participants) {
          let i =
            (participant.firstName[0]?.toUpperCase() ?? "") +
            (participant.lastName[0]?.toUpperCase() ?? "");

          if (initialsSet.has(i)) {
            let x = 1;
            while (initialsSet.has(i + x)) x++;
            i = i + x;
          }

          initialsSet.add(i);
          participant.initials = i;
        }

        setMeeting(meetingResp);
        setParticipants(participants);
      });
  }, []);

  function downloadPDF() {
    if (!meeting || !participants) return;

    const report = document.getElementById("report");
    html2pdf(report, { filename: meeting.subject });
  }

  function OriginalDateRow({ points, pointIndex }) {
    const originalDate = points[pointIndex].originalDate,
      list = points.slice(pointIndex + 1);
    let rowSpan = 1;

    if (pointIndex && points[pointIndex - 1].originalDate === originalDate)
      return null;

    for (const point of list) {
      if (point.originalDate !== originalDate) break;
      rowSpan++;
    }

    return (
      <td
        rowSpan={rowSpan}
        className="original-date-col"
        style={{ borderLeft: "none" }}
      >
        {originalDate ? moment(originalDate).format("DD-MMM-YY") : "TBC"}
      </td>
    );
  }

  if (!meeting || !participants) return <div>Generating Report</div>;

  return (
    <Box mt={2}>
      <Button
        id="download-btn"
        variant="contained"
        color="primary"
        style={{ marginLeft: "45%" }}
        onClick={downloadPDF}
      >
        Print Report
      </Button>
      <div id="report" class="report">
        <h1 className="heading">{meeting.subject}</h1>
        <table className="enclosing-table">
          <tbody className="enclosing-table-body">
            <table className="participants-table">
              <tr>
                <th colSpan={meeting.sessions.length + 3}>
                  Minutes of Meeting
                </th>
              </tr>
              <tr>
                <th className="number-col"></th>
                <th className="name-col">Participants</th>
                <th className="initals-col">Initials</th>
                {meeting.sessions.map((session) => (
                  <th className="session-col">
                    {moment(session.startDate).format("DD MMM, YYYY")}
                  </th>
                ))}
              </tr>
              {Array.from(participants.values()).map((participant, idx) => (
                <tr>
                  <td>{idx + 1}</td>
                  <td>{participant.firstName + " " + participant.lastName}</td>
                  <td>{participant.initial}</td>
                  {meeting.sessions.map((session) =>
                    session.participants.find(
                      (p) => p.id === participant.id
                    ) ? (
                      <td>
                        <CheckIcon />
                      </td>
                    ) : (
                      <td></td>
                    )
                  )}
                </tr>
              ))}
            </table>
            <table className="mom-table">
              <tr>
                <th className="number-col"></th>
                <th className="original-date-col">Original Date</th>
                <th className="task-number-col"></th>
                <th className="task-text-col">
                  Material Discussed &amp; Decision Taken{" "}
                </th>
                <th className="reponsible-person-col">Responsible Person</th>
                <th className="target-date-col">Target Date</th>
                <th className="task-status-col">Task Status</th>
              </tr>
              {meeting.agendas.flatMap((agenda, agendaIdx) => {
                let rows = [
                  <tr>
                    <td className="number-row">{agendaIdx + 1}</td>
                    <td></td>
                    <td></td>
                    <td>{agenda.agenda}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>,
                ];

                let taskRows = agenda.tasks.map((task, taskIdx) => (
                  <tr>
                    <td></td>
                    <td colSpan="6" className="points">
                      <table>
                        {task.points.map((point, pointIdx) => (
                          <tr>
                            {
                              <OriginalDateRow
                                points={task.points}
                                pointIndex={pointIdx}
                              />
                            }
                            {pointIdx === 0 && (
                              <td
                                rowSpan={task.points.length}
                                className="task-number-col"
                              >
                                {`${agendaIdx + 1}.${taskIdx + 1}`}
                              </td>
                            )}
                            <td className="task-text-col text">{`${
                              agendaIdx + 1
                            }.${taskIdx + 1}.${pointIdx + 1}. ${
                              point.text
                            }`}</td>
                            {pointIdx === 0 && (
                              <td
                                rowSpan={task.points.length}
                                className="reponsible-person-col"
                              >
                                {(() => {
                                  let initials = task.assignees.map(
                                    (assignee) =>
                                      participants.get(assignee.id).initial
                                  );
                                  return initials.reduce(
                                    (reponsiblePersonText, initial) =>
                                      `${
                                        reponsiblePersonText
                                          ? reponsiblePersonText + " & "
                                          : ""
                                      }${initial}`,
                                    ""
                                  );
                                })()}
                              </td>
                            )}
                            <td className="target-date-col">
                              {point.targetDate
                                ? moment(point.targetDate).format("DD-MMM-YY")
                                : "TBC"}
                            </td>
                            <td
                              className="task-status-col"
                              style={{ borderRight: "none" }}
                            >
                              {TaskStatusTexts[point.status]}
                            </td>
                          </tr>
                        ))}
                      </table>
                    </td>
                  </tr>
                ));
                rows = rows.concat(taskRows);
                return rows;
              })}
            </table>
          </tbody>
        </table>
      </div>
    </Box>
  );
};
