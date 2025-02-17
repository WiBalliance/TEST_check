let allTasks = {};

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
    { file: "../tasks/tasks_old.json", group: "Old Tasks" },
    { file: "../tasks/tasks_hyouketsunohihou.json", group: "Hyouketsu no Hihou" },
    { file: "../tasks/tasks_kisetu_events.json", group: "Seasonal Events" },
    { file: "../tasks/tasks_turi.json", group: "Fishing" },
    { file: "../tasks/tasks_setugenboueki.json", group: "Snowfield Trade" },
    { file: "../tasks/tasks_mia.json", group: "Mia's Tasks" },
    { file: "../tasks/tasks_hyougennsihaisya.json", group: "Expression Master" },
    { file: "../tasks/tasks_zengunsansen.json", group: "All Army Participation" },
    { file: "../tasks/tasks_taiyoujou.json", group: "Solar Castle" },
    { file: "../tasks/tasks_SvS.json", group: "SvS Events" },
    { file: "../tasks/tasks_setugen_doumeidaisakusen.json", group: "Snowfield Alliance Operation" },
    { file: "../tasks/tasks_joe.json", group: "Joe's Tasks" },
    { file: "../tasks/tasks_takenoko.json", group: "Takenoko Missions" },
    { file: "../tasks/tasks_yajyu.json", group: "Beast Challenges" },
    { file: "../tasks/tasks_rekkanokiba.json", group: "Fangs of Cold Winter" },
    { file: "../tasks/tasks_youheinomeiyo.json", group: "Mercenary Honor" },
    { file: "../tasks/tasks_gunbi.json", group: "Military Preparations" },
    { file: "../tasks/tasks_sikannkeikaku.json", group: "Officer Plans" },
    { file: "../tasks/tasks_doumeisoudouin.json", group: "Alliance Mobilization" },
    { file: "../tasks/tasks_doumeisouha.json", group: "Alliance Operations" },
    { file: "../tasks/tasks_toride.json", group: "Fortress Defense" },
    { file: "../tasks/tasks_heiki.json", group: "Weaponry" },
    { file: "../tasks/tasks_kyoukoku.json", group: "Stronghold" },
    { file: "../tasks/tasks_jina.json", group: "Jina's Tasks" },
    { file: "../tasks/tasks_herbester.json", group: "Harvester Missions" },
    { file: "../tasks/tasks_akatsukinotenbou.json", group: "Dawn's Outlook" },
    { file: "../tasks/tasks_kuma1.json", group: "Bear Missions 1" },
    { file: "../tasks/tasks_kuma2.json", group: "Bear Missions 2" }
  ];

  try {
    const now = new Date();
    const tasksData = await Promise.all(taskFiles.map(({ file, group }) =>
      fetch(file).then(response => response.json()).then(tasks => ({ group, tasks }))
    ));

    allTasks = tasksData.reduce((acc, { group, tasks }) => {
      acc[group] = tasks.filter(task => {
        const endDate = new Date(task.end || task.start);
        return endDate >= now || task.repeat;
      });
      return acc;
    }, {});

    updateCalendar(calendar);
    updateTaskList(listEl);
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
};

const updateCalendar = (calendar) => {
  calendar.removeAllEvents();
  Object.entries(allTasks).forEach(([group, tasks]) => {
    tasks.forEach(task => {
      calendar.addEvent({
        id: task.id,
        title: `${group}: ${task.name}`,
        start: task.start,
        end: task.end || task.start,
        allDay: true
      });
    });
  });
};

const updateTaskList = (listEl) => {
  listEl.innerHTML = '';
  Object.entries(allTasks).forEach(([group, tasks]) => {
    const groupHeader = document.createElement('h3');
    groupHeader.textContent = group;
    listEl.appendChild(groupHeader);

    const groupList = document.createElement('ul');
    tasks.forEach(task => {
      const listItem = document.createElement('li');
      listItem.textContent = `${task.name} (${task.start} - ${task.end || task.start})`;
      
      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy';
      copyButton.onclick = () => navigator.clipboard.writeText(task.name).then(() => alert('Copied!'));
      
      listItem.appendChild(copyButton);
      groupList.appendChild(listItem);
    });
    listEl.appendChild(groupList);
  });
};
