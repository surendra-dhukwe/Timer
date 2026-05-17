let totalMs = 0;
let timer = null;
let wakeLock = null;
let originalTime = "00:00:00";

const h = document.getElementById("hours");
const m = document.getElementById("minutes");
const s = document.getElementById("seconds");
const ms = document.getElementById("milliseconds");

function updateDisplay(){

  let hours = Math.floor(totalMs / 3600000);

  let minutes = Math.floor(
    (totalMs % 3600000) / 60000
  );

  let seconds = Math.floor(
    (totalMs % 60000) / 1000
  );

  let milli = totalMs % 1000;

  h.innerText = String(hours).padStart(2,"0");

  m.innerText = String(minutes).padStart(2,"0");

  s.innerText = String(seconds).padStart(2,"0");

  ms.innerText = String(milli).padStart(3,"0");
}

function startTimer(){

  let hh = parseInt(
    document.getElementById("hInput").value
  ) || 0;

  let mm = parseInt(
    document.getElementById("mInput").value
  ) || 0;

  let ss = parseInt(
    document.getElementById("sInput").value
  ) || 0;

  // ORIGINAL TIME SAVE
  originalTime =
  `${String(hh).padStart(2,"0")}:
${String(mm).padStart(2,"0")}:
${String(ss).padStart(2,"0")}`;

  if(totalMs <= 0){

    totalMs =
    (hh * 3600 + mm * 60 + ss) * 1000;
  }

  if(totalMs <= 0){
    alert("Enter Time");
    return;
  }

  clearInterval(timer);
  enableWakeLock();

  timer = setInterval(() => {

    totalMs -= 10;

    if(totalMs <= 0){

      totalMs = 0;

      clearInterval(timer);
      disableWakeLock();

      updateDisplay();

      playRelaxSound();

      // TIME OVER BOX
      let box =
      document.getElementById("timeOverBox");

      document.getElementById(
        "completedTime"
      ).innerText = originalTime;

      box.style.display = "flex";

      // 5 sec baad hide
      setTimeout(() => {

        box.style.display = "none";

        document.body.classList.remove(
          "hide-ui"
        );

        if(document.fullscreenElement){
          document.exitFullscreen();
        }

      },5000);
    }

    updateDisplay();

  },10);
}

function stopTimer(){

  clearInterval(timer);

  disableWakeLock();
}
function resetTimer(){

  clearInterval(timer);

  disableWakeLock();

  totalMs = 0;

  updateDisplay();
}

function toggleTheme(){

  document.body.classList.toggle(
    "light"
  );
}

function toggleLayout(){

  document.body.classList.toggle(
    "vertical"
  );
}

async function focusMode(){

  // AUTO START
  if(!timer){
    startTimer();
  }

  document.body.classList.add(
    "hide-ui"
  );

  // FULLSCREEN
  if(!document.fullscreenElement){

    await document.documentElement
    .requestFullscreen();
  }

  // SCREEN LOCK PREVENT
  enableWakeLock();

  // STOP BUTTON SHOW
  document.getElementById(
    "floatingStop"
  ).style.display = "flex";
}
function playRelaxSound(){

  const audioCtx =
  new (
    window.AudioContext ||
    window.webkitAudioContext
  )();

  const oscillator =
  audioCtx.createOscillator();

  const gainNode =
  audioCtx.createGain();

  oscillator.type = "sine";

  oscillator.frequency.setValueAtTime(
    432,
    audioCtx.currentTime
  );

  oscillator.connect(gainNode);

  gainNode.connect(
    audioCtx.destination
  );

  gainNode.gain.setValueAtTime(
    0.001,
    audioCtx.currentTime
  );

  gainNode.gain.exponentialRampToValueAtTime(
    0.4,
    audioCtx.currentTime + 1
  );

  oscillator.start();

  // 5 sec sound
  setTimeout(() => {

    gainNode.gain
    .exponentialRampToValueAtTime(
      0.001,
      audioCtx.currentTime + 1
    );

    oscillator.stop(
      audioCtx.currentTime + 1
    );

  },5000);
}

let colorMode = "text";

const colorPicker =
document.getElementById("colorPicker");

const modeBtn =
document.getElementById("modeBtn");

// COLOR CHANGE
colorPicker.addEventListener("input", () => {

  let color = colorPicker.value;

  // TEXT COLOR
  if(colorMode === "text"){

    // TIMER
    document.querySelector(".timer").style.color =
    color;

    document.querySelector(".timer").style.textShadow =
    `0 0 10px ${color},
     0 0 20px ${color},
     0 0 40px ${color}`;

    // TITLE
    document.querySelector(".title").style.color =
    color;

    document.querySelector(".title").style.textShadow =
    `0 0 10px ${color},
     0 0 20px ${color},
     0 0 40px ${color}`;

    // TIME OVER
    document.querySelector(".time-over-box h1")
    .style.color = color;

    document.querySelector(".time-over-box h1")
    .style.textShadow =
    `0 0 10px ${color},
     0 0 20px ${color},
     0 0 40px ${color}`;

    document.getElementById("completedTime")
    .style.color = color;

    document.getElementById("completedTime")
    .style.textShadow =
    `0 0 10px ${color},
     0 0 20px ${color},
     0 0 40px ${color}`;

  }

  // BG COLOR
  else{

    document.body.style.background = color;

    document.querySelector(".time-over-box")
    .style.background = color;
  }

});

// TOGGLE BUTTON
function toggleColorMode(){

  if(colorMode === "text"){

    colorMode = "bg";

    modeBtn.innerText = "BG COLOR";

  }else{

    colorMode = "text";

    modeBtn.innerText = "TEXT COLOR";
  }
}

const colorName =
document.getElementById("colorName");

const colorSelect =
document.getElementById("colorSelect");
const imageUpload =
document.getElementById("imageUpload");



// APPLY COLOR
function applyColor(color){

  // TEXT
  if(colorMode === "text"){

    document.querySelector(".timer")
    .style.color = color;

    document.querySelector(".title")
    .style.color = color;

    document.getElementById("completedTime")
    .style.color = color;

    document.querySelector(".time-over-box h1")
    .style.color = color;

    // glow
    let glow =
    `0 0 10px ${color},
     0 0 20px ${color},
     0 0 40px ${color}`;

    document.querySelector(".timer")
    .style.textShadow = glow;

    document.querySelector(".title")
    .style.textShadow = glow;

    document.getElementById("completedTime")
    .style.textShadow = glow;

    document.querySelector(".time-over-box h1")
    .style.textShadow = glow;

  }

  // BG
  else{

    document.body.style.background =
    color;

    document.querySelector(".time-over-box")
    .style.background = color;
  }

  document.getElementById(
  "floatingStop"
).style.background = color;

// TEXT ALWAYS BLACK
document.getElementById(
  "floatingStop"
).style.color = "black";

  let stopBtn =
document.getElementById(
  "floatingStop"
);

// BUTTON IMAGE
stopBtn.style.backgroundImage =
imageUrl;

// IMAGE FIT
stopBtn.style.backgroundSize =
"cover";

stopBtn.style.backgroundPosition =
"center";

stopBtn.style.backgroundRepeat =
"no-repeat";

// TEXT BLACK
stopBtn.style.color =
"black";

stopBtn.style.textShadow =
"none";
}
// PICKER
colorPicker.addEventListener("input",()=>{

  applyColor(colorPicker.value);

});

// INPUT
colorName.addEventListener("keyup",()=>{

  applyColor(colorName.value);

});

// SELECT
colorSelect.addEventListener("change",()=>{

  applyColor(colorSelect.value);

});

// SCREEN WAKE LOCK
async function enableWakeLock(){

  try{

    wakeLock =
    await navigator.wakeLock.request("screen");

    console.log("Screen Wake Lock ON");

  }catch(err){

    console.log(
      "Wake Lock Error:",
      err
    );
  }
}

function disableWakeLock(){

  if(wakeLock){

    wakeLock.release();

    wakeLock = null;

    console.log("Screen Wake Lock OFF");
  }
}

// IMAGE UPLOAD

imageUpload.addEventListener(
  "change",
  (e)=>{

    let file =
    e.target.files[0];

    if(!file) return;

    let reader =
    new FileReader();

    reader.onload = function(ev){

      let imageUrl =
      `url(${ev.target.result})`;

      // TEXT IMAGE
      if(colorMode === "text"){

        let timer =
        document.querySelector(".timer");

        // let title =
        // document.querySelector(".title");

        let timeText =
        document.getElementById(
          "completedTime"
        );

        let overTitle =
        document.querySelector(
          ".time-over-box h1"
        );

        // ADD CLASS
        timer.classList.add(
          "image-text"
        );

        // title.classList.add(
        //   "image-text"
        // );

        timeText.classList.add(
          "image-text"
        );

        overTitle.classList.add(
          "image-text"
        );

        // APPLY IMAGE
        timer.style.backgroundImage =
        imageUrl;

        // title.style.backgroundImage =
        // imageUrl;

        timeText.style.backgroundImage =
        imageUrl;

        overTitle.style.backgroundImage =
        imageUrl;

        // REMOVE COLOR
        timer.style.color = "transparent";

        timer.style.textShadow = "none";

        timeText.style.color = "transparent";

        timeText.style.textShadow = "none";

        overTitle.style.color = "transparent";

        overTitle.style.textShadow = "none";

        let stopBtn =
document.getElementById(
  "floatingStop"
);

stopBtn.classList.add(
  "image-text"
);

stopBtn.style.backgroundImage =
imageUrl;

stopBtn.style.color =
"transparent";

stopBtn.style.textShadow =
"none";

      }

      // BACKGROUND IMAGE
      else{

        document.body.classList.add(
          "photo-bg"
        );

        document.body.style.backgroundImage =
        imageUrl;

        document.querySelector(
          ".time-over-box"
        ).style.backgroundImage =
        imageUrl;
      }
    };

    reader.readAsDataURL(file);

});

function exitFocusMode(){

  clearInterval(timer);

  timer = null;

  disableWakeLock();

  document.body.classList.remove(
    "hide-ui"
  );

  document.getElementById(
    "floatingStop"
  ).style.display = "none";

  if(document.fullscreenElement){

    document.exitFullscreen();
  }
}

updateDisplay();