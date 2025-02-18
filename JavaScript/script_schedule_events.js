let allTasks = []; // すべてのタスクデータを保持

// 進捗率を計算する関数
const calculateProgress = (task) => {
  const now = new Date();
  const start = new Date(task.start);
  const end = new Date(task.end);
  const totalDuration = end - start;
  const elapsedTime = now - start;

  if (elapsedTime < 0) return 0; // タスクがまだ開始されていない場合
  if (elapsedTime > totalDuration) return 100; // タスクが完了した場合
  return Math.floor((elapsedTime / totalDuration) * 100); // 小数点以下切り捨て
};

// 進捗率に応じて背景色を設定する関数
const getProgressColor = (progress) => {
  if (progress <= 25) return "#66ccff";
  if (progress <= 50) return "#66ccff";
  if (progress <= 75) return "#66ccff";
  if (progress = 0) return "#dedcdc";
  if (progress = 100) return "#676669";
  return "#676669";
};

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
const updateCalendar = (nameFilter = '', viewMode = 'dayGridMonth') => {
  const calendarEl = document.getElementById('calendar');
  if (!calendarEl) {
    console.error("カレンダーのコンテナが見つかりません。");
    return;
  }

  // タスクをフィルタリング
  const filteredTasks = allTasks.filter(task => 
    task.name.toLowerCase().includes(nameFilter.toLowerCase())
  );

  // FullCalendar 用のイベントデータを作成
  const calendarEvents = filteredTasks.map(task => {
    const progress = calculateProgress(task);
    const startDate = new Date(task.start);
    const endDate = new Date(task.end);

    // 時間情報があるか判定
    const hasTime = startDate.getHours() !== 0 || startDate.getMinutes() !== 0 || 
                    endDate.getHours() !== 0 || endDate.getMinutes() !== 0;

    return {
      // title: `${task.name} (${progress}%)`, // タスク名に進捗率を表示
      title: `${task.name}`, // タスク名に進捗率を表示
      start: task.start,
      end: task.end,
      allDay: !hasTime, // 時間が指定されている場合は allDay を false にする
      backgroundColor: getProgressColor(progress),
      borderColor: getProgressColor(progress)
    };
  });

  // 既存のカレンダーを破棄して再描画
  calendarEl.innerHTML = '';

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: viewMode, // 初期ビューを引数で変更
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,listWeek' // 月・週・リストの切り替え
    },
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
    updateCalendar(); // 初期表示
  } catch (error) {
    console.error('タスクの読み込みエラー:', error);
  }
};

loadTasks(); // ファイルの読み込みを開始

// タスク名でフィルタするイベントリスナー
document.getElementById("taskNameFilter").addEventListener("input", (event) => {
  const nameFilter = event.target.value;
  updateCalendar(nameFilter);
});
