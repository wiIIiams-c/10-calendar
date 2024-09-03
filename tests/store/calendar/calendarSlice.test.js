import { calendarSlice, onAddNewEvent, onDeleteEvent, onLoadEvents, onLogoutCalendar, onSetActiveEvent, onUpdateEvent } from "../../../src/store/calendar/calendarSlice";
import { calendarWithActiveEventState, calendarWithEventsState, events, initialState } from "../../fixtures/calendarStates";

describe('Pruebas en CalendarSlice', () => {
    test('debe regresar el estado por defecto', () => {
        const state = calendarSlice.getInitialState();

        expect(state).toEqual(initialState);
    });

    test('onSetActiveEvent debe activar el evento', () => {
        const state = calendarSlice.reducer(calendarWithEventsState, onSetActiveEvent(events[0]));

        expect(state.activeEvent).toEqual(events[0]);
    });

    test('onAddNewEvent debe agregar el evento', () => {
        const newEvent = {
            id: 3,
            title: "Event 3",
            notes: "Note 3",
            start: "2023-04-12T10:00:00",
            end: "2023-04-12T12:00:00"
        };

        const state = calendarSlice.reducer(calendarWithEventsState, onAddNewEvent(newEvent));

        expect(state.events).toEqual([...events, newEvent]);
    });

    test('onUpdateEvent debe actualizar el evento', () => {
        const updatedEvent = {
            id: 1,
            title: "Event 1 Updated",
            notes: "Note 1 Updated",
            start: "2023-04-10T10:00:00",
            end: "2023-04-10T12:00:00"
        };

        const state = calendarSlice.reducer(calendarWithEventsState, onUpdateEvent(updatedEvent));

        expect(state.events).toContainEqual(updatedEvent);
    });

    test('onDeleteEvent debe eliminar el evento activo', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventState, onDeleteEvent());

        expect(state.activeEvent).toBe(null);
        expect(state.events).not.toContainEqual(events[0]);
    });

    test('onLoadEvents debe cargar los eventos', () => {
        const state = calendarSlice.reducer(initialState, onLoadEvents(events));

        expect(state.isLoadingEvents).toBeFalsy();
        expect(state.events).toEqual(events);

        const newState = calendarSlice.reducer(state, onLoadEvents(events));

        expect(newState.events.length).toBe(events.length);
    });

    test('onLogoutCalendar debe limpiar el estado', () => {
        const state = calendarSlice.reducer(calendarWithActiveEventState, onLogoutCalendar());

        expect(state).toEqual(initialState);
    });
});