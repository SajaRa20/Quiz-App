




const quiz= document.getElementById('quiz')
const answerEls = document.querySelectorAll('.answer')
const questionEl = document.getElementById('question')
const a_text = document.getElementById('a_text')
const b_text = document.getElementById('b_text')
const c_text = document.getElementById('c_text')
const d_text = document.getElementById('d_text')
const submitBtn = document.getElementById('next')
const counter = document.getElementById('counter');
const timerElement = document.getElementById('timer');
const error = document.getElementById('Error');
const Errorname = document.getElementById('Errorname');
const btnStart = document.getElementById('btnStart');
const home = document.getElementById('home');
const playerNameInput = document.getElementById('fname');
const local = document.getElementById('local');
const leaderboard = document.getElementById('leaderboard');

btnStart.addEventListener('click',(event) =>{
    event.preventDefault();
    let playerName  = playerNameInput.value;
    if(playerName.trim() === ""){
      Errorname.textContent='Name is required';
    }
   else{
    Errorname.textContent='';
    quiz.style.display ='block';
    home.style.display ='none';
 
    }
})



let currentQuiz = 0;
let score = 0;
let minutes = 0;
let seconds = 0;
var formattedTime = '';

const randomQuestions = [];
while (randomQuestions.length < 10) {
  const randomIndex = quizData[Math.floor(Math.random() * quizData.length)];
  
  if (!randomQuestions.includes(randomIndex)) {
    randomQuestions.push(randomIndex);
  }
}


loadQuiz();
function loadQuiz() {
  deselectAnswers();
  const currentQuizData = randomQuestions[currentQuiz];
  questionEl.innerText = currentQuizData.question;
  a_text.innerText = currentQuizData.a;
  b_text.innerText = currentQuizData.b;
  c_text.innerText = currentQuizData.c;
  d_text.innerText = currentQuizData.d;
  if (currentQuiz == 9) {
    submitBtn.textContent = 'Submit';
  }
}


function deselectAnswers() {
  answerEls.forEach(answerEl => (answerEl.checked = false));
  error.textContent = '';
}


function getSelected() {
  let answer;
  answerEls.forEach(answerEl => {
    if (answerEl.checked) {
      answer = answerEl.id;
    } else {
    }
  });

  return answer;
}

submitBtn.addEventListener('click', () => {
  const answer = getSelected();
  if (answer) {
    if (answer === randomQuestions[currentQuiz].correct) {
      score++;

    }
    currentQuiz++;
    counter.textContent = `${currentQuiz + 1}/10`;
    if (currentQuiz < randomQuestions.length) {
        loadQuiz();
    } else {
      addToLeaderboard(playerNameInput.value, score ,formattedTime);
        stopTimer();
        playGameOverSound(); 
      quiz.innerHTML = `<div style="height:155px;">
           <h3>Game Over!</h3>
           <h2>You answered<span class="score"> ${score}/${randomQuestions.length}</span> questions correctly</h2>
           <button onclick="location.reload()">Reload</button>
           </div>  
           `;
    }
  }
});








/////// leaderboard



function addToLeaderboard(username, score,formattedTime) {
  localStorage.setItem("data", JSON.stringify(quizData));
  localStorage.setItem("questions", JSON.stringify(randomQuestions));
  let leaderboard = JSON.parse(localStorage.getItem('leaderboard'));

  if (!leaderboard) {
    leaderboard = [];
  }
  const existingUser = leaderboard.find((entry) => entry.username === username);
  if (existingUser) {
    existingUser.score = score;
  } else {
    leaderboard.push({ username, score,formattedTime });
  }
  localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
}

local.addEventListener('click', ()=>{
  quiz.style.display ='none';
  home.style.display ='none';
  leaderboard.style.display ='block';
  displayLeaderboardInTable();
})



function displayLeaderboardInTable() {
  
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard'));
  const leaderboardBody = document.getElementById('leaderboard-body');

  // تحقق مما إذا كانت هناك سجلات في المصفوفة
  if (leaderboard && leaderboard.length > 0) {
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard.forEach((entry) => {
      const row = document.createElement('tr');
      const usernameCell = document.createElement('td');
      const scoreCell = document.createElement('td');
      const timer = document.createElement('td')
      
      usernameCell.textContent = entry.username;
      scoreCell.textContent = entry.score;
      timer.textContent = entry.formattedTime
      row.appendChild(usernameCell);
      row.appendChild(scoreCell);
      row.appendChild(timer);
      leaderboardBody.appendChild(row);
    });
  }
}






/////// Sound
 function playGameOverSound() {
    const gameOverSound = document.getElementById('gameOverSound');
    gameOverSound.play();
  }

////// Timer
    function startTimer() {
      seconds++;

      if (seconds >= 60) {
        seconds = 0;
        minutes++;
      }
       formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      timerElement.textContent = formattedTime;
    }

    const timer = setInterval(startTimer, 1000);

    function stopTimer() {
      clearInterval(timer);
    }

