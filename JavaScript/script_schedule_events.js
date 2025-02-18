let allTasks = []; // すべてのタスクデータを保持

document.addEventListener("DOMContentLoaded", function () {
  var calendarEl = document.getElementById("calendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    locale: "ja",
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "dayGridMonth,timeGridWeek,timeGridDay",
    },
    events: function (fetchInfo, successCallback, failureCallback) {
      successCallback(generateCalendarEvents(allTasks));
    },
  });
  calendar.render();

  document.getElementById("showCompleted").addEventListener("change", () => {
    calendar.refetchEvents();
  });

  document.getElementById("taskNameFilter").addEventListener("input", () => {
    calendar.refetchEvents();
  });
});

// タスクデータをカレンダー形式に変換
const generateCalendarEvents = (tasks) => {
  const nameFilter = document.getElementById("taskNameFilter").value.toLowerCase();
  const showCompleted = document.getElementById("showCompleted").checked;
  const now = new Date();

  return tasks
    .filter((task) => {
      const start = new Date(task.start);
      const end = new Date(task.end);
      const matchesName = task.name.toLowerCase().includes(nameFilter);
      return (showCompleted || end >= now) && matchesName;
    })
    .map((task) => ({
      id: task.id,
      title: task.name,
      start: task.start,
      end: task.end,
      color: getTaskColor(task),
    }));
};

// 進捗率に応じた色を設定
const getTaskColor = (task) => {
  const progress = calculateProgress(task);
  if (progress <= 25) return "#ffadad";
  if (progress <= 50) return "#ffd6a5";
  if (progress <= 75) return "#fdffb6";
  return "#caffbf";
};

// 進捗率を計算
const calculateProgress = (task) => {
  const now = new Date();
  const start = new Date(task.start);
  const end = new Date(task.end);
  const totalDuration = end - start;
  const elapsedTime = now - start;
  if (elapsedTime < 0) return 0;
  if (elapsedTime > totalDuration) return 100;
  return Math.floor((elapsedTime / totalDuration) * 100);
};

// タスクデータの読み込み
const loadTasks = async () => {
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
    "../tasks/tasks_kuma2.json",
  ];

  try {
    const tasks = await Promise.all(
      taskFiles.map((file) => fetch(file).then((response) => response.json()))
    );
    allTasks = tasks.flat();
  } catch (error) {
    console.error("Error loading tasks:", error);
  }
};

loadTasks();
