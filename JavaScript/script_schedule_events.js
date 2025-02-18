import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";

const CalendarComponent = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const gunbiResponse = await fetch("tasks_gunbi.json");
      const kisetuResponse = await fetch("tasks_kisetu_events.json");
      const gunbiData = await gunbiResponse.json();
      const kisetuData = await kisetuResponse.json();
      
      const generateRecurringEvents = (task) => {
        let occurrences = [];
        let startDate = new Date(task.start);
        let endDate = new Date(task.end);
        const interval = task.repeat ? task.repeat.interval : null;
        const repeatEnd = task.repeat ? new Date(task.repeat.end_date) : null;
        
        while (interval && startDate <= repeatEnd) {
          occurrences.push({
            title: task.name,
            start: new Date(startDate).toISOString(),
            end: new Date(endDate).toISOString(),
            extendedProps: { taskId: task.id }
          });
          startDate.setDate(startDate.getDate() + interval);
          endDate.setDate(endDate.getDate() + interval);
        }
        return occurrences.length > 0 ? occurrences : [{
          title: task.name,
          start: task.start,
          end: task.end,
          extendedProps: { taskId: task.id }
        }];
      };
      
      const formattedEvents = [...gunbiData, ...kisetuData].flatMap(task => generateRecurringEvents(task));
      
      setEvents(formattedEvents);
    };
    
    fetchTasks();
  }, []);

  const handleDateClick = (info) => {
    const selectedDate = info.dateStr;
    const selectedTasks = events.filter(event =>
      new Date(event.start) <= new Date(selectedDate) &&
      new Date(event.end) >= new Date(selectedDate)
    );
    
    let copyText = "";
    selectedTasks.forEach(task => {
      const taskStartTime = new Date(task.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const taskEndTime = new Date(task.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      
      if (task.start.slice(0, 10) === selectedDate) {
        copyText += `【開始】 ${taskStartTime}~ ${task.title}\n`;
      } else if (task.end.slice(0, 10) === selectedDate) {
        copyText += `【終了】 ~${taskEndTime} ${task.title}\n`;
      } else {
        const daysElapsed = Math.ceil(
          (new Date(selectedDate) - new Date(task.start)) / (1000 * 60 * 60 * 24)
        );
        copyText += `【期間中】 ${task.title}(${daysElapsed}日目)\n`;
      }
    });
    navigator.clipboard.writeText(copyText);
    alert("コピーしました:\n" + copyText);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,listWeek"
      }}
      events={events}
      dateClick={handleDateClick}
    />
  );
};

export default CalendarComponent;
