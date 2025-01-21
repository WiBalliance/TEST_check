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

// 進捗率に基づいてCSSクラスを割り当てる関数
const getProgressClass = (progress) => {
  if (progress <= 25) return "progress-low";
  if (progress <= 50) return "progress-medium";
  if (progress <= 75) return "progress-high";
  return "progress-complete";
};

// ガントチャートのタスクデータを更新する関数
const updateTaskProgress = (tasks) => {
  return tasks.map(task => {
    const progress = calculateProgress(task);
    return { ...task, progress, custom_class: getProgressClass(progress) };
  });
};

// ガントチャートを時間ごとに表示する関数
const updateGanttWithHourlyView = (tasks) => {
  const tasksWithProgress = updateTaskProgress(tasks);

  // ガントチャートを描画
  const gantt = new Gantt("#gantt", tasksWithProgress, {
    view_mode: "Hour", // 1時間単位表示
    date_format: "YYYY-MM-DD HH:mm", // 日付＋時刻表示
    column_width: 40, // カラム幅を調整
    bar_height: 20, // タスクバーの高さ
    padding: 18, // バーの間隔を調整
    editable: false // 編集不可
  });
};

// 複数のJSONファイルを読み込む関数
const loadTasks = async () => {
  const taskFiles = [
    "../tasks/tasks_station_old.json",   // 終了したタスク
    "../tasks/tasks_station.json"
  ];

  try {
    const tasks = await Promise.all(taskFiles.map(file =>
      fetch(file).then(response => response.json())
    ));
    allTasks = tasks.flat(); // タスクを1つの配列にまとめる
    updateGanttWithHourlyView(allTasks); // 時間単位で初期表示
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
};

// コピー機能の実装
document.getElementById("copyButton").addEventListener("click", () => {
  const selectedDate = document.getElementById("datePicker").value;
  if (!selectedDate) {
    alert("日付を選択してください");
    return;
  }

  const targetDate = new Date(selectedDate);
  const formattedDate = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

  const targetTasks = allTasks.filter(task => {
    const start = new Date(task.start);
    const end = new Date(task.end);
    const targetStart = new Date(targetDate.setHours(0, 0, 0, 0));
    const targetEnd = new Date(targetDate.setHours(23, 59, 59, 999));
    return (start < targetEnd && end > targetStart);
  });

  if (targetTasks.length === 0) {
    alert(`${formattedDate}にはイベントがありません`);
    return;
  }

  const tasksToCopy = targetTasks.map(task => {
    const start = new Date(task.start);
    const time = `${String(start.getHours()).padStart(2, '0')}:${String(start.getMinutes()).padStart(2, '0')}`;
    return `${time}~ ${task.name}`;
  }).join('\n');

  const textArea = document.createElement("textarea");
  textArea.value = `${formattedDate}のイベント:\n${tasksToCopy}`;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);

  alert(`${formattedDate}のイベントをコピーしました！`);
});

// チェックボックスのイベントリスナー
document.getElementById("showCompleted").addEventListener("change", (event) => {
  const filteredTasks = allTasks.filter(task => {
    const now = new Date();
    const end = new Date(task.end);
    return event.target.checked || end >= now;
  });
  updateGanttWithHourlyView(filteredTasks);
});

// タスク名でフィルタするイベントリスナー
document.getElementById("taskNameFilter").addEventListener("input", (event) => {
  const nameFilter = event.target.value.toLowerCase();
  const filteredTasks = allTasks.filter(task => 
    task.name.toLowerCase().includes(nameFilter)
  );
  updateGanttWithHourlyView(filteredTasks);
});

loadTasks(); // 初期化
