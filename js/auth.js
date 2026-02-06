let PASSWORD = "";

async function loadPassword(){
  const res = await fetch("config/password.json");
  const data = await res.json();
  PASSWORD = data.password;
}

async function askPassword(){
  if(!PASSWORD) await loadPassword();

  const input = prompt("パスワードをいれてね");
  if(input === PASSWORD){
    localStorage.setItem("auth","true");
    document.getElementById("parentPanel").style.display="block";
    loadEditDay();
  } else {
    alert("ちがいます");
  }
}

function checkAuth(){
  if(localStorage.getItem("auth")==="true"){
    document.getElementById("parentPanel").style.display="block";
    loadEditDay();
  }
}
