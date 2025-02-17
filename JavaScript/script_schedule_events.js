let allTasks = [];

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

      // 繰り返しを生成
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






const loadTasks = async (calendar, listEl) => {

  const taskFiles = [
    // 終了イベント
    "../tasks/tasks_old.json",                       //終了したイベント
    // 秘宝イベント
    "../tasks/tasks_hyouketsunohihou.json",          //氷結の秘宝
    // 季節イベント
    "../tasks/tasks_kisetu_events.json",             //季節もののイベント
    // 
    "../tasks/tasks_turi.json",                      //釣り穴選手権
    // 超得イベント
    "../tasks/tasks_setugenboueki.json",             //雪原貿易
    "../tasks/tasks_mia.json",                       //ミアの占い屋
    // 通常イベント
    "../tasks/tasks_hyougennsihaisya.json",          //氷原支配者
    "../tasks/tasks_zengunsansen.json",              //全軍参戦
    "../tasks/tasks_taiyoujou.json",                 //王城決戦
    "../tasks/tasks_SvS.json",                       //SvS
    "../tasks/tasks_setugen_doumeidaisakusen.json",  //雪原貿易、同盟大作戦
    "../tasks/tasks_joe.json",                       //クレイジー・ジョイ
    "../tasks/tasks_takenoko.json",                  //燃霜鉱区
    "../tasks/tasks_yajyu.json",                     //野獣駆逐
    "../tasks/tasks_rekkanokiba.json",               //烈火の牙
    "../tasks/tasks_youheinomeiyo.json",             //傭兵の名誉
    "../tasks/tasks_gunbi.json",                     //軍備競技
    "../tasks/tasks_sikannkeikaku.json",             //士官計画
    "../tasks/tasks_doumeisoudouin.json",            //同盟総動員
    "../tasks/tasks_doumeisouha.json",               //同盟争覇戦
    "../tasks/tasks_toride.json",                    //要塞・砦争奪戦
    "../tasks/tasks_heiki.json",                     //兵器工場争奪戦
    "../tasks/tasks_kyoukoku.json",                  //峡谷合戦
    "../tasks/tasks_jina.json",                      //ジーナの復讐
    "../tasks/tasks_herbester.json",                 //ハーベスター
    "../tasks/tasks_akatsukinotenbou.json",          //暁の展望
    "../tasks/tasks_kuma1.json",                     //熊罠1
    "../tasks/tasks_kuma2.json"                      //熊罠2
  ];

  try {
    const tasks = await Promise.all(taskFiles.map(file =>
      fetch(file).then(response => response.json())
    ));
    allTasks = generateRepeatingTasks(tasks.flat()); // 繰り返しタスクを展開
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



loadTasks(); // ファイルの読み込みを開始

// チェックボックスのイベントリスナー
document.getElementById("showCompleted").addEventListener("change", (event) => {
  const nameFilter = document.getElementById("taskNameFilter").value;
  updateGantt(event.target.checked, nameFilter);
});

// タスク名でフィルタするイベントリスナー
document.getElementById("taskNameFilter").addEventListener("input", (event) => {
  const nameFilter = event.target.value;
  const showCompleted = document.getElementById("showCompleted").checked;
  updateGantt(showCompleted, nameFilter);
});

// コピー機能の実装
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

  // 開始時刻で昇順にソート
  const sortedTasks = targetTasks.sort((a, b) => new Date(a.start) - new Date(b.start));
  
  // 各コピー用テキストを作成
  const tasksToCopy_1 = sortedTasks.map(task => {
    const taskStartDate = new Date(task.start);
    const taskEndDate = new Date(task.end);
  
    const isStartDay = taskStartDate >= targetStartDate && taskStartDate <= targetEndDate;
    const isEndDay = !isStartDay && taskEndDate >= targetStartDate && taskEndDate <= targetEndDate;
    const isMiddleDay = taskStartDate < targetStartDate && taskEndDate > targetEndDate;
  
    if (isEndDay) {
      const taskEndFormattedTime = `${String(taskEndDate.getHours()).padStart(2, '0')}:${String(taskEndDate.getMinutes()).padStart(2, '0')}`;
      return `~${taskEndFormattedTime} ${task.name}`;
    }
    return null; // 空の行として扱う
  })
  .filter(line => line !== null) // null を取り除く
  .join('\n');
  
  // コピー用テキストを作成
  const tasksToCopy_2 = sortedTasks.map(task => {
    const taskStartDate = new Date(task.start);
    const taskEndDate = new Date(task.end);
  
    const isStartDay = taskStartDate >= targetStartDate && taskStartDate <= targetEndDate;
    const isEndDay = taskEndDate >= targetStartDate && taskEndDate <= targetEndDate;
    const isMiddleDay = taskStartDate < targetStartDate && taskEndDate > targetEndDate;
  
    if (isStartDay) {
      const taskStartFormattedTime = `${String(taskStartDate.getHours()).padStart(2, '0')}:${String(taskStartDate.getMinutes()).padStart(2, '0')}`;
      return `${taskStartFormattedTime}~ ${task.name}`;
    }
    return null; // 空の行として扱う
  })
  .filter(line => line !== null) // null を取り除く
  .join('\n');
  
  // コピー用テキストを作成
  const tasksToCopy_3 = sortedTasks.map(task => {
    const taskStartDate = new Date(task.start);
    const taskEndDate = new Date(task.end);
  
    const isStartDay = taskStartDate >= targetStartDate && taskStartDate <= targetEndDate;
    const isEndDay = taskEndDate >= targetStartDate && taskEndDate <= targetEndDate;
    const isMiddleDay = taskStartDate < targetStartDate && taskEndDate > targetEndDate;
  
    if (isMiddleDay) {
      const totalDays = Math.ceil((taskEndDate - taskStartDate) / (1000 * 60 * 60 * 24));
      const currentDay = Math.floor((targetStartDate - taskStartDate) / (1000 * 60 * 60 * 24)) + 2;
      return `${task.name}(${currentDay}日目)`;
    }
    return null; // 空の行として扱う
  })
  .filter(line => line !== null) // null を取り除く
  .join('\n');
  
  // それぞれの結果を連結
  // const finalTasksToCopy = `【終了】\n${tasksToCopy_1}\n\n【開始】\n${tasksToCopy_2}\n\n【期間中】\n${tasksToCopy_3}\n`;
  let finalTasksToCopy = "";
  // 防衛中セクションを追加
  if (tasksToCopy_1 !== "") {
    finalTasksToCopy += `【終了】\n${tasksToCopy_1}\n\n`;
  }
  if (tasksToCopy_2 !== "") {
    finalTasksToCopy += `【開始】\n${tasksToCopy_2}\n\n`;
  }
  if (tasksToCopy_3 !== "") {
    finalTasksToCopy += `【期間中】\n${tasksToCopy_3}\n\n`;
  }



  
  // 結果を表示またはコピー
  console.log(tasksToCopy_1);
  console.log(tasksToCopy_2);
  console.log(tasksToCopy_3);
  console.log(finalTasksToCopy);
  
  const textArea = document.createElement("textarea");
  textArea.value = `${formattedDate}のイベント:\n${finalTasksToCopy}`;
  document.body.appendChild(textArea);
  textArea.select();
  const successful = document.execCommand('copy');
  document.body.removeChild(textArea);

  alert(successful ? `${formattedDate}のイベントをコピーしました！` : "コピーに失敗しました。手動でコピーしてください。");
});
