let allTasks = []; // すべてのタスクデータを保持

// 進捗を計算する関数
const calculateProgress = (task) => {
  const now = new Date();
  const start = new Date(task.start);
  const end = new Date(task.end);
  const totalDuration = end - start;
  const elapsedTime = now - start;

  if (elapsedTime < 0) return 0; // タスクがまだ開始されていない場合
  if (elapsedTime > totalDuration) return 100; // タスクが完了した場合
  return (elapsedTime / totalDuration) * 100;
};

// ガントチャートを更新する関数
const updateGantt = (showCompleted, nameFilter = '') => {
  const now = new Date();
  const filteredTasks = allTasks.filter(task => {
    const end = new Date(task.end);
    const matchesName = task.name.toLowerCase().includes(nameFilter.toLowerCase());
    return (showCompleted || end >= now) && matchesName;
  });

  const gantt = new Gantt("#gantt", filteredTasks, {
    view_mode: "Day",
    date_format: "YYYY-MM-DD",
    editable: false
  });
};

// タスクデータをロードする関数
const loadTasks = async () => {
  const taskFiles = [
    'https://wiballiance.github.io/tasks/tasks_old.json',
    'https://wiballiance.github.io/tasks/tasks_turi.json',
    'https://wiballiance.github.io/tasks/tasks_setugenboueki.json',
    'https://wiballiance.github.io/tasks/tasks_hyougennsihaisya.json',
    'https://wiballiance.github.io/tasks/tasks_gunbi.json',
    'https://wiballiance.github.io/tasks/tasks_doumeisoudouin.json',
    'https://wiballiance.github.io/tasks/tasks_heiki.json',
    'https://wiballiance.github.io/tasks/tasks_doumeisouha.json',
    'https://wiballiance.github.io/tasks/tasks_kyoukoku.json',
    'https://wiballiance.github.io/tasks/tasks_toride.json',
    'https://wiballiance.github.io/tasks/tasks_sikannkeikaku.json',
    'https://wiballiance.github.io/tasks/tasks_jina.json',
    'https://wiballiance.github.io/tasks/tasks_kuma1.json'
  ];

  try {
    const tasks = await Promise.all(taskFiles.map(file =>
      fetch(file).then(response => response.json())
    ));
    allTasks = tasks.flat();
    updateGantt(false);
  } catch (error) {
    console.error('Error loading tasks:', error);
  }
};

// 初期データのロード
loadTasks();

// イベントリスナーの登録
document.getElementById("showCompleted").addEventListener("change", (event) => {
  const nameFilter = document.getElementById("taskNameFilter").value;
  updateGantt(event.target.checked, nameFilter);
});

document.getElementById("taskNameFilter").addEventListener("input", (event) => {
  const nameFilter = event.target.value;
  const showCompleted = document.getElementById("showCompleted").checked;
  updateGantt(showCompleted, nameFilter);
});

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
    return (start < targetDate && end > targetDate);
  });

  if (targetTasks.length === 0) {
    alert(`${formattedDate}にはイベントがありません`);
    return;
  }

  const sortedTasks = targetTasks.sort((a, b) => new Date(a.start) - new Date(b.start));

  const tasksToCopy = targetTasks.map(task => {
    const taskStartDate = new Date(task.start);
    const taskStartFormattedTime = `${String(taskStartDate.getHours()).padStart(2, '0')}:${String(taskStartDate.getMinutes()).padStart(2, '0')}`;
    const diffTime = targetDate - taskStartDate;
    const diffDays = Math.floor((diffTime / (1000 * 60 * 60 * 24)) + 1);
    return `${taskStartFormattedTime}~ ${task.name} (${diffDays}日目)`;
  }).join('\n');

  const textArea = document.createElement("textarea");
  textArea.value = `${formattedDate}のイベント:\n${tasksToCopy}`;
  document.body.appendChild(textArea);
  textArea.select();
  const successful = document.execCommand('copy');
  document.body.removeChild(textArea);

  alert(successful ? `${formattedDate}のイベントをコピーしました！` : "コピーに失敗しました。手動でコピーしてください。");
});
