let allTasks = []; // すべてのタスクデータを保持

// 繰り返しタスクを展開する関数
const generateRepeatingTasks = (tasks) => {
  const expandedTasks = [];

  tasks.forEach(task => {
    expandedTasks.push(task); // 元のタスクを追加

    if (task.repeat) {
      const interval = task.repeat.interval;
      const repeatEndDate = new Date(task.repeat.end_date);
      let currentStartDate = new Date(task.start);
      let currentEndDate = new Date(task.end);

      // 繰り返しタスクを生成
      while (true) {
        currentStartDate.setDate(currentStartDate.getDate() + interval);
        currentEndDate.setDate(currentEndDate.getDate() + interval);

        if (currentStartDate > repeatEndDate) break;

        // 繰り返しタスクを追加
        expandedTasks.push({
          ...task,
          id: `${task.id}_repeat_${currentStartDate.toISOString()}`,
          start: currentStartDate.toISOString(),
          end: currentEndDate.toISOString()
        });
      }
    }
  });

  return expandedTasks;
};

// カレンダーを更新する関数
const updateCalendar = (showCompleted, nameFilter = '') => {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) {
    console.error("カレンダーのコンテナが見つかりません。");
    return;
  }

  // タスクをフィルタリング
  const now = new Date();
  const filteredTasks = allTasks.filter(task => {
    const end = new Date(task.end);
    const matchesName = task.name.toLowerCase().includes(nameFilter.toLowerCase());

    return (showCompleted || end >= now) && matchesName;
  });

  // FullCalendar 用のイベントデータを作成
  const calendarEvents = filteredTasks.map(task => ({
    title: task.name,
    start: task.start,
    end: task.end,
    allDay: true
  }));

  // カレンダーを描画
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    events: calendarEvents
  });

  calendar.render();
};

// 複数のJSONファイルを読み込む関数
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
    "../tasks/tasks_kuma2.json"
  ];

  try {
    const tasks = await Promise.all(taskFiles.map(file =>
      fetch(file).then(response => response.json())
    ));
    allTasks = generateRepeatingTasks(tasks.flat()); // 繰り返しタスクを展開
    updateCalendar(false); // 初期表示
  } catch (error) {
    console.error('タスクの読み込みエラー:', error);
  }
};

loadTasks(); // ファイルの読み込みを開始
