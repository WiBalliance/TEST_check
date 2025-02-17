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
