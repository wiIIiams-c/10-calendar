import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { addHours, parse, startOfWeek, getDay, format } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import { NavBar } from "../"

const locales = {
    'en-US': enUS,
}

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const events = [{
    title: 'My B-Day',
    notes: 'Celebrenlo mierda',
    start: new Date(),
    end: addHours(new Date(), 2),
    bgColor: '#fafafa',
    user: {
        _id: '123',
        name: 'Waldo'
    }
}]

export const CalendarPage = () => {
    return (
        <>
            <NavBar />

            <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 80px)' }}
            />
        </>
    )
}
