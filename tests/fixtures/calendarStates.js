export const events = [
    {
        id: 1,
        title: "Event 1",
        notes: "Note 1",
        start: "2023-04-10T10:00:00",
        end: "2023-04-10T12:00:00"
    },
    {
        id: 2,
        title: "Event 2",
        notes: "Note 2",
        start: "2023-04-11T14:00:00",
        end: "2023-04-11T16:00:00"
    }
]

export const initialState = {
    isLoadingEvents: true,
    events: [],
    activeEvent: null
}

export const calendarWithEventsState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: null
}

export const calendarWithActiveEventState = {
    isLoadingEvents: false,
    events: [...events],
    activeEvent: {...events[0]}
}