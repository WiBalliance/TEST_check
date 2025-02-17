let allTasks = [];

document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendar');
  const listEl = document.getElementById('taskList');
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek'
    },
    events: []
  });
  calendar.render();
  loadTasks(calendar, listEl);
});

const loadTasks = async (calendar, listEl) => {
  const taskFiles = [
    "../tasks/tasks_old.json",
    "../tasks/tasks_hyouketsunohihou.json",
    "../tasks/tasks_kisetu_events.json",
    "../tasks/tasks_turi.json",
    "../tasks/tasks_setugenboueki.json",
    "../tasks/tasks_mia.json",
    "../tasks/tasks_hyougennsihaisya.json",
    "../tasks/tasks_zengunsansen.json",
    "../tasks/tasks_taiyoujou.json",
    "../tasks/tasks_SvS.json",
    "../tasks/tasks_setugen_doumeidaisakusen.json",
    "../tasks/tasks_joe.json",
    "../tasks/tasks_takenoko.json",
    "../tasks/tasks_yajyu.json",
    "../tasks/tasks_rekkanokiba.json",
    "../tasks/tasks_youheinomeiyo.json",
    "../tasks/tasks_gunbi.json",
    "../tasks/tasks_sikannkeikaku.json",
    "../tasks/tasks_doumeisoudouin.json",
    "../tasks/tasks_doumeisouha.json",
    "../tasks/tasks_toride.json",
    "../tasks/tasks_heiki.json",
    "../tasks/tasks_kyoukoku.json",
    "../tasks/tasks_jina.json",
    "../tasks/tasks_herbester.json",
    "../tasks/tasks_akatsukinotenbou.json",
    "../tasks/tasks_kuma1.json",
    "../tasks/tasks_kuma2.json"
  ];

  try {
    const tasks = await Promise.all(taskFiles.map(file =>
      fetch(file).then(response => response.json())
    ));
    allTasks = tasks.flat();
    updateCalendar(calendar);
    updateTaskList(listEl);
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
};

const updateCalendar = (calendar) => {
  calendar.removeAllEvents();
  allTasks.forEach(task => {
    calendar.addEvent({
      id: task.id,
      title: task.name,
      start: task.start,
      end: task.end || task.start,
      allDay: true
    });
  });
};

const updateTaskList = (listEl) => {
  listEl.innerHTML = '';
  allTasks.forEach(task => {
    const listItem = document.createElement('li');
    listItem.textContent = `${task.name} (${task.start} - ${task.end || task.start})`;
    listEl.appendChild(listItem);
  });
};
