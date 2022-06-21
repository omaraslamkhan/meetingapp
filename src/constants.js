export const TaskStatusList = [
  {
    id: 0,
    name: 'Not Started'
  },
  {
    id: 1,
    name: 'In Progress'
  },
  {
    id: 2,
    name: 'Need Management Approval'
  },
  {
    id: 3,
    name: 'On Hold'
  },
  {
    id: 4,
    name: 'Completed'
  },
  {
    id: 5,
    name: 'Aborted/Closed'
  },
];

export const TaskStatusTexts = TaskStatusList.reduce((textObj, status) => {
  textObj[status.id] = status.name;
  return textObj;
}, {});
