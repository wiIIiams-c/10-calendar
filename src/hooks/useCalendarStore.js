import { useSelector, useDispatch } from 'react-redux'
import { onAddNewEvent, onDeleteEvent, onLoadEvents, onSetActiveEvent, onUpdateEvent } from '../store'
import { calendarApi } from '../api'
import { convertEventsToDateEvents } from '../helpers'
import Swal from 'sweetalert2'

export const useCalendarStore = () => {
    const dispatch = useDispatch()
    const {events, activeEvent} = useSelector(state => state.calendar)
    const {user} = useSelector(state => state.auth)
    
    const setActiveEvent = (calendarEvent) => {
        dispatch(onSetActiveEvent(calendarEvent))
    }

    const startSavingEvent = async(calendarEvent) => {
        try {
            if(calendarEvent.id){
                //Update
                const {data} = await calendarApi.put(`/events/${calendarEvent.id}`, calendarEvent)            
                dispatch(onUpdateEvent({...calendarEvent, user}))
    
                return
            }
            
            //Insert
            const {data} = await calendarApi.post('/events', calendarEvent)
            dispatch(onAddNewEvent({...calendarEvent, id: data.eventoGuardado.id, user}))
        } catch (error) {
            console.log(error);
            Swal.fire('Error al guardar', error.response.data?.mensaje, 'error')
        }
    }

    const startDeletingEvent = async() => {
        // Swal.fire({
        //     title: 'Eliminar evento',
        //     text: '¿Está seguro que desea eliminar el evento?',
        //     icon: 'question',
        //     showCancelButton: true,
        //     confirmButtonText: 'Si, eliminar'
        // }).then((result) => {
        //     if(result.isConfirmed){
        //         dispatch(onDeleteEvent())
        //     }
        // })
        try {
            await calendarApi.delete(`/events/${activeEvent.id}`)
            dispatch(onDeleteEvent())
        } catch (error) {
            console.log(error);
            Swal.fire('Error al eliminar', error.response.data?.mensaje, 'error')
        }
    }

    const startLoadingEvents = async() => {
        try {
            const {data} = await calendarApi.get('/events')
            const events = convertEventsToDateEvents(data.eventos)
            dispatch(onLoadEvents(events))
        } catch (error) {
            console.log(error);
            console.log('Error al cargar eventos');
            
        }
    }

    return {
        activeEvent,
        events,
        hasEventSelected: !!activeEvent,
        setActiveEvent,
        startSavingEvent,
        startDeletingEvent,
        startLoadingEvents
    }
}
