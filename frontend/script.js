let totalMs = 0;
let timer = null;
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

  timer = setInterval(() => {

    totalMs -= 10;

    if(totalMs <= 0){

      totalMs = 0;

      clearInterval(timer);

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
}

function resetTimer(){

  clearInterval(timer);

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

function focusMode(){

  document.body.classList.toggle(
    "hide-ui"
  );

  // Fullscreen
  if(!document.fullscreenElement){

    document.documentElement
    .requestFullscreen();

  }else{

    document.exitFullscreen();
  }
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

updateDisplay();