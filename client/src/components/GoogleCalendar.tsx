import React, { useEffect, useState } from 'react';

const GoogleCalendar: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('/api/google/calendar/events');
      const data = await response.json();
      setEvents(data);
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = async () => {
    const event = {
      summary: 'New Event',
      description: 'A new event created from the app',
      start: {
        dateTime: '2024-12-25T09:00:00-07:00',
        timeZone: 'America/Los_Angeles',
      },
      end: {
        dateTime: '2024-12-25T17:00:00-07:00',
        timeZone: 'America/Los_Angeles',
      },
    };
    await fetch('/api/google/calendar/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });
    // Refrescar la lista de eventos
    const response = await fetch('/api/google/calendar/events');
    const data = await response.json();
    setEvents(data);
  };

  return (
    <div>
      <button onClick={handleCreateEvent}>Create Event</button>
      <ul>
        {events.map((event) => (
          <li key={event.id}>{event.summary}</li>
        ))}
      </ul>
    </div>
  );
};

export default GoogleCalendar;