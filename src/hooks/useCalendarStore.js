import { useSelector, useDispatch } from 'react-redux'
import { onAddNewEvent, onDeleteEvent, onSetActiveEvent, onUpdateEvent } from '../store'

export const useCalendarStore = () => {
    const dispatch = useDispatch()
    const {events, activeEvent} = useSelector(state => state.calendar)
    
    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async(calendarEvent) => {
        if(calendarEvent._id){
            //Update
            dispatch(onUpdateEvent({...calendarEvent}))
        }else{
            //Insert
            dispatch(onAddNewEvent({...calendarEvent, _id: new Date().getTime()}))
        }
    }

    const startDeletingEvent = () => {
        dispatch(onDeleteEvent())
    }

    return {
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent
    }
}
