document.getElementById("copyButton").addEventListener("click", () => {
  const selectedDate = document.getElementById("datePicker").value;
  if (!selectedDate) {
    alert("日付を選択してください");
    return;
  }

  const targetDate = new Date(selectedDate);
  const formattedDate = `${targetDate.getFullYear()}-${String(targetDate.getMonth() + 1).padStart(2, '0')}-${String(targetDate.getDate()).padStart(2, '0')}`;

  const targetStartDate = new Date(targetDate.setHours(0, 0, 0, 0)); // ターゲット日の開始時間（00:00）
  const targetEndDate = new Date(targetDate.setHours(23, 59, 59, 999)); // ターゲット日の終了時間（23:59）

  const targetTasks = allTasks.filter(task => {
    const start = new Date(task.start);
    const end = new Date(task.end);

    // ターゲット日付と重なる場合
    return (start <= targetEndDate && end >= targetStartDate);
  });

  if (targetTasks.length === 0) {
    alert(`${formattedDate}にはイベントがありません`);
    return;
  }

  // イベントを分類
  const endDayTasks = targetTasks.filter(task => {
    const taskEndDate = new Date(task.end);
    return taskEndDate >= targetStartDate && taskEndDate <= targetEndDate;
  }).sort((a, b) => new Date(a.start) - new Date(b.start));

  const startDayTasks = targetTasks.filter(task => {
    const taskStartDate = new Date(task.start);
    return taskStartDate >= targetStartDate && taskStartDate <= targetEndDate;
  }).sort((a, b) => new Date(a.start) - new Date(b.start));

  const middleDayTasks = targetTasks.filter(task => {
    const taskStartDate = new Date(task.start);
    const taskEndDate = new Date(task.end);
    return taskStartDate < targetStartDate && taskEndDate > targetEndDate;
  }).sort((a, b) => new Date(a.start) - new Date(b.start));

  // コピー用テキストを作成
  const tasksToCopy = [
    ...endDayTasks.map(task => {
      const taskEndDate = new Date(task.end);
      const taskEndFormattedTime = `${String(taskEndDate.getHours()).padStart(2, '0')}:${String(taskEndDate.getMinutes()).padStart(2, '0')}`;
      return `~${taskEndFormattedTime} ${task.name}`;
    }),
    ...startDayTasks.map(task => {
      const taskStartDate = new Date(task.start);
      const taskStartFormattedTime = `${String(taskStartDate.getHours()).padStart(2, '0')}:${String(taskStartDate.getMinutes()).padStart(2, '0')}`;
      return `${taskStartFormattedTime}~ ${task.name}`;
    }),
    ...middleDayTasks.map(task => {
      const taskStartDate = new Date(task.start);
      const taskEndDate = new Date(task.end);
      const totalDays = Math.ceil((taskEndDate - taskStartDate) / (1000 * 60 * 60 * 24));
      const currentDay = Math.floor((targetStartDate - taskStartDate) / (1000 * 60 * 60 * 24)) + 2;
      return `${task.name}(${currentDay}日目)`;
    })
  ].join('\n');

  const textArea = document.createElement("textarea");
  textArea.value = `${formattedDate}のイベント:\n${tasksToCopy}`;
  document.body.appendChild(textArea);
  textArea.select();
  const successful = document.execCommand('copy');
  document.body.removeChild(textArea);

  alert(successful ? `${formattedDate}のイベントをコピーしました！` : "コピーに失敗しました。手動でコピーしてください。");
});
