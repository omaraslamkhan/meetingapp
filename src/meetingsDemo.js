const meetings = [
    {
        id: 0,
        meetingName: 'Got it',
        department: {
            id: 0,
            label: 'Information Technology',
        },
        organizer:  {
            id: 0,
            name: 'Amanullah Khan',
            initials: 'AK'
        },
        sessions: [
            {
                id: 0,
                sessionDate: '1996-07-22',
                participants: [
                    {
                        id: 0,
                        name: 'Amanullah Khan',
                        initials: 'AK'
                    },
                    {
                        id: 1,
                        name: 'Umer Aslam',
                        initials: 'UA'
                    },
                    {
                        id: 2,
                        name: 'Arif Matloob',
                        initials: 'AM'
                    },
                ],
                agendas: [
                    // {
                    //     id: 0,
                    //     agendaName: 'Okay',
                    //     tasks: [
                    //         {
                    //             id: 0,
                    //             taskName: 'Run',
                    //             responsiblePersons: 'Amanullah'
                    //         },
                    //         {
                    //             id: 1,
                    //             taskName: 'Sit',
                    //             responsiblePersons: 'Umer',
                    //         }
                    //     ]
                    // },
                    // {
                    //     id: 1,
                    //     agendaName: 'Fire',
                    //     tasks: [
                    //         {
                    //             id: 0,
                    //             taskName: 'Fly',
                    //             responsiblePersons: 'Arif'
                    //         },
                    //         {
                    //             id: 1,
                    //             taskName: 'Land',
                    //             responsiblePersons: 'Abid',
                    //         }
                    //     ]
                    // }
                ]
            },
            {
                id: 1,
                sessionDate: '1993-11-12',
                participants: [
                    {
                        id: 3,
                        name: 'Shuja Ur Rehman Khan',
                        initials: 'SRK'
                    },
                    {
                        id: 4,
                        name: 'Abdul Haseeb',
                        initials: 'AH'
                    },
                    {
                        id: 5,
                        name: 'Aqib Umer',
                        initials: 'AU'
                    }
                ],
                agendas: [
                    {
                        id: 0,
                        agendaName: 'Football',
                        tasks: [
                            {
                                id: 0,
                                taskName: 'Sprint',
                                taskStatus: 'In Progress',
                                dueDate: '2022-06-08',
                                assignedDate: '2022-06-15',
                                responsiblePersons: [{
                                    id: 3,
                                    name: 'Shuja Ur Rehman Khan',
                                    initials: 'SRK'
                                },
                                {
                                    id: 4,
                                    name: 'Abdul Haseeb',
                                    initials: 'AH'
                                },]
                            },
                            {
                                id: 1,
                                taskName: 'Defend',
                                dueDate: '2022-06-13',
                                assignedDate: '2022-06-21',
                                taskStatus: 'Completed',
                                responsiblePersons: [ {
                                    id: 1,
                                    name: 'Umer Aslam',
                                    initials: 'UA'
                                },
                                {
                                    id: 2,
                                    name: 'Arif Matloob',
                                    initials: 'AM'
                                },
                            ],
                            }
                        ]
                    },
                    {
                        id: 1,
                        agendaName: 'Cricket',
                        tasks: [
                            {
                                id: 0,
                                taskName: 'Catch',
                                dueDate: '2022-06-08',
                                assignedDate: '2022-06-15',
                                taskStatus: 'Need Management Approval',
                                responsiblePersons: [ {
                                    id: 1,
                                    name: 'Umer Aslam',
                                    initials: 'UA'
                                },
                                {
                                    id: 2,
                                    name: 'Arif Matloob',
                                    initials: 'AM'
                                },]
                            },
                            {
                                id: 1,
                                taskName: 'Hit',
                                dueDate: '2022-06-08',
                                assignedDate: '2022-06-15',
                                taskStatus: 'Aborted/Closed',
                                responsiblePersons: [{
                                    id: 3,
                                    name: 'Shuja Ur Rehman Khan',
                                    initials: 'SRK'
                                },
                                {
                                    id: 4,
                                    name: 'Abdul Haseeb',
                                    initials: 'AH'
                                },],
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

export default meetings