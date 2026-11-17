/* =========================================================
   웹기초 퀴즈 챌린지 — 학생용 (js/script.js)

   ※ 1, 2번 구역(요소 선택, 데이터)은 이미 만들어져 있습니다.
   ※ 아래 ★ STEP 번호 순서대로, 주석 아래에 코드를 직접 입력하세요.
   ※ 한 STEP 이 끝날 때마다 브라우저를 새로고침하여 확인합니다.
   ※ HTML 과 CSS 는 수정하지 않습니다.

   만들 함수
     STEP 1  renderQuestion()   문제와 선택지 그리기
     STEP 2  (renderQuestion 안에서) 진행 표시, 점수 표시
     STEP 3  selectChoice(index)  답 고르기와 채점
     STEP 4  goNext()             다음 문제
     STEP 5  showResult(), resetGame()   결과 창, 다시 하기
     STEP 6  saveBest(), loadBest(), renderBest()   최고 점수 저장
   ========================================================= */

/* ---------------------------------------------------------
   1. 요소 선택 (제공)
   --------------------------------------------------------- */
const bestScoreText = document.querySelector('.best-score');
const progressText = document.querySelector('.progress-text');
const progressFill = document.querySelector('.progress-fill');
const questionText = document.querySelector('.question-text');
const choiceList = document.querySelector('.choice-list');
const feedback = document.querySelector('.feedback');
const scoreText = document.querySelector('.score-text');
const nextBtn = document.querySelector('.next-btn');

const modal = document.querySelector('.modal');
const resultGrade = document.querySelector('.result-grade');
const resultScore = document.querySelector('.result-score');
const resultDetail = document.querySelector('.result-detail');
const resultRecord = document.querySelector('.result-record');
const restartBtn = document.querySelector('.restart-btn');


/* ---------------------------------------------------------
   2. 데이터 (제공)
   --------------------------------------------------------- */
// 문제판: 객체 배열.  answer 는 choices 에서 정답이 몇 번째인지 (0부터 센다)
const quizzes = [
    {
        id: 1,
        question: 'HTML에서 가장 큰 제목을 만드는 태그는?',
        choices: ['<h6>', '<h1>', '<title>', '<head>'],
        answer: 1
    },
    {
        id: 2,
        question: 'HTML에서 문단(글 덩어리)을 나타내는 태그는?',
        choices: ['<p>', '<br>', '<span>', '<img>'],
        answer: 0
    },
    {
        id: 3,
        question: 'HTML에서 다른 페이지로 이동하는 링크를 만드는 태그는?',
        choices: ['<link>', '<a>', '<nav>', '<href>'],
        answer: 1
    },
    {
        id: 4,
        question: 'CSS에서 글자 색을 바꾸는 속성은?',
        choices: ['font-color', 'text-color', 'color', 'background'],
        answer: 2
    },
    {
        id: 5,
        question: 'class 이름이 box 인 요소를 선택하는 CSS 선택자는?',
        choices: ['#box', 'box', '*box', '.box'],
        answer: 3
    },
    {
        id: 6,
        question: 'JavaScript에서 값을 나중에 바꿀 수 있는 변수를 만드는 키워드는?',
        choices: ['const', 'fixed', 'static', 'let'],
        answer: 3
    },
    {
        id: 7,
        question: '배열의 맨 끝에 새 항목을 추가하는 메서드는?',
        choices: ['push', 'pop', 'find', 'filter'],
        answer: 0
    },
    {
        id: 8,
        question: '배열에서 조건에 맞는 첫 번째 항목을 찾아 주는 메서드는?',
        choices: ['filter', 'find', 'forEach', 'push'],
        answer: 1
    },
    {
        id: 9,
        question: 'CSS 선택자로 HTML 요소 하나를 찾는 JavaScript 코드는?',
        choices: ['document.querySelector()', 'document.write()', 'window.alert()', 'console.log()'],
        answer: 0
    },
    {
        id: 10,
        question: '객체나 배열을 localStorage 에 저장할 수 있도록 글자로 바꾸는 함수는?',
        choices: ['JSON.parse()', 'Number()', 'JSON.stringify()', 'String.join()'],
        answer: 2
    }
];

// 게임 중에 바뀌는 값
let current = 0;        // 지금 몇 번째 문제인가 (0 이면 첫 번째 문제)
let score = 0;          // 현재 점수 (한 문제를 맞히면 10점)
let answered = false;   // 지금 문제에서 이미 답을 골랐는가


/* ---------------------------------------------------------
   3. 화면 그리기 함수
   --------------------------------------------------------- */

// ★ STEP 1. renderQuestion() 함수 — 지금 문제 그리기
//   1) const quiz = quizzes[current];   지금 문제를 꺼낸다.
//   2) questionText.textContent 에 quiz.question 을 넣는다.
//   3) choiceList.innerHTML = '' 로 이전 선택지를 비운다.
//   4) quiz.choices.forEach((choice, index) => { ... }) 로 돌면서 버튼을 만든다.
//        - document.createElement('button')
//        - className 은 'choice-btn'
//        - 글자(textContent)는 (index + 1) + '. ' + choice   예) '1. <h6>'
//        - button.dataset.index = index
//        - choiceList.appendChild(button)
//
// ★ STEP 2. 같은 renderQuestion() 안에 이어서 쓴다.
//   - progressText.textContent 에 (current + 1) + ' / ' + quizzes.length
//   - progressFill.style.width 에 (current + 1) / quizzes.length * 100 + '%'
//   - scoreText.textContent 에 '현재 점수 ' + score + '점'
//     (점수 표시는 STEP 3 에서도 쓰므로 renderScore() 함수로 따로 만들면 편하다.)
function renderScore() {
        scoreText.textContent = '현재 점수 ' + score + '점';
    }
// ★ STEP 4. 새 문제를 보여 줄 때 되돌려야 하는 것도 renderQuestion() 안에 쓴다.
//   - answered = false
//   - feedback.textContent = ''
//   - nextBtn.disabled = true
function renderQuestion() {

    const quiz = quizzes[current];
    questionText.textContent = quiz.question;
    choiceList.innerHTML = '';

    quiz.choices.forEach((choice, index) => {
        const button = document.createElement('button');
        button.className = 'choice-btn';
        button.textContent = (index + 1) + '. ' + choice;
        button.dataset.index = index;
        choiceList.appendChild(button);

        button.addEventListener('click', () => selectChoice(index));
 
        progressText.textContent = (current + 1) + ' / ' + quizzes.length;
        progressFill.style.width = (current + 1) / quizzes.length * 100 + '%';
        
        renderScore();
        
        answered = false;
        feedback.textContent = '';
        nextBtn.disabled = true;


    });
    
}



/* ---------------------------------------------------------
   4. 게임 진행 함수
   --------------------------------------------------------- */

// ★ STEP 3. selectChoice(index) 함수 — 답 고르기와 채점
//   1) answered 가 true 이면 return (한 문제에는 한 번만 고를 수 있다.)
//   2) answered = true
//   3) 지금 문제 quiz 를 꺼내고, index === quiz.answer 이면 정답이다.
//   4) 정답이면 score += 10, feedback 에 '정답입니다!'
//      오답이면 feedback 에 '아쉬워요. 정답은 ○번입니다.'   (번호는 quiz.answer + 1)
//   5) choiceList.querySelectorAll('.choice-btn') 의 모든 버튼을 forEach 로 돌면서
//        - 정답 번호의 버튼에는 'correct' 클래스
//        - 내가 고른 오답 버튼에는 'wrong' 클래스
//        (힌트: classList.toggle('correct', 조건))
//   6) nextBtn.disabled = false  → [다음 문제] 버튼을 누를 수 있게 한다.
//   7) 점수 표시를 다시 그린다.
//   ※ 위 STEP 1 에서 버튼을 만들 때, click 이벤트를 연결하여 selectChoice(index) 를 부른다.
function selectChoice(index) {

    if(answered) return;
    answered = true;

    const quiz = quizzes[current];
    if(index === quiz.answer) {
        score += 10;
        feedback.textContent = '정답입니다!';

    }
    else {
       feedback.textContent = '아쉬워요. 정답은 ' + (quiz.answer + 1) + '번입니다.';
    }

    choiceList.querySelectorAll('.choice-btn').forEach(button => { 
        const buttonIndex = Number(button.dataset.index);

        button.classList.toggle('correct', buttonIndex === quiz.answer);
       
        button.classList.toggle('wrong', 
            buttonIndex === index && buttonIndex !== quiz.answer
        );
       
      button.disabled = true;
    
    });

    nextBtn.disabled = false;
    renderScore();

}


// ★ STEP 4. goNext() 함수 — 다음 문제
//   1) current 를 1 늘린다.
//   2) current 가 quizzes.length 와 같으면 → showResult() 를 부르고 return
//   3) 아니면 renderQuestion() 을 부른다.
function goNext() {
    if(!answered || current >= quizzes.length) {
        return;
    }
    nextBtn.disabled = true;
    current++;

    if(current >= quizzes.length) {
        showResult();
        return;
    }
    renderQuestion();
}


// ★ STEP 5. showResult() 함수 — 결과 창
//   1) 정답 개수 = score / 10
//   2) 점수에 따라 등급을 정한다. (if / else if / else)
//        90점 이상 '🏆 퀴즈 마스터' / 70점 이상 '👍 우수' / 50점 이상 '🙂 보통' / 그 미만 '📚 더 공부해요'
//   3) resultGrade, resultScore('80점'), resultDetail('10문제 중 8문제 정답') 에 글자를 넣는다.
//   4) modal.classList.add('show')   → 결과 창이 보인다.



// ★ STEP 6. showResult() 안에서 최고 점수 갱신
//   score 가 best 보다 크면 → best = score, saveBest(), renderBest(),
//   resultRecord.textContent = '🎉 최고 점수 갱신!'   (아니면 빈 글자)
function showResult() {
     const correctCount = score / 10;

    let grade;
    if(score >= 90) {
        grade = '🏆 퀴즈 마스터';
    }
    else if(score >= 70) {
        grade = '👍 우수';
    }
    else if(score >= 50) {
        grade = '😑 보통';
    }
    else {
        grade = '📚 더 공부해요';
    }   
    resultGrade.textContent = grade;
    resultScore.textContent = score + '점';
    resultDetail.textContent = quizzes.length + '문제 중 ' + correctCount + '문제 정답';

    if(score > best) {
        best = score; 
        saveBest();
        renderBest();
        resultRecord.textContent = '🎉 최고 점수 갱신!';
    }
    else {
        resultRecord.textContent = '';
    }

     modal.classList.add('show'); 

}


// ★ STEP 5. resetGame() 함수 — 다시 하기
//   current, score 를 0 으로 되돌리고, modal 의 show 클래스를 없애고, renderQuestion() 을 부른다.
function resetGame() {
   

    current = 0;
    score = 0;
    modal.classList.remove('show');
    renderQuestion();
    
}


/* ---------------------------------------------------------
   5. 최고 점수 저장하기 / 불러오기
   --------------------------------------------------------- */

// ★ STEP 6. 최고 점수 변수와 저장 이름표를 만든다.
//   let best = 0;
//   const STORAGE_KEY = 'quiz-best-v1';
let best = 0;           // 최고 점수
const STORAGE_KEY = 'quiz-best-v1';   // 저장할 때 쓰는 이름표

// ★ STEP 6. saveBest() 함수
//   localStorage.setItem(STORAGE_KEY, String(best));   (숫자 → 글자)
function saveBest() {
    localStorage.setItem(STORAGE_KEY, String(best));
}


// ★ STEP 6. loadBest() 함수
//   1) localStorage.getItem(STORAGE_KEY) 로 꺼낸다. 값이 없으면(null) return
//   2) Number(저장된 글자) 로 숫자로 바꾼다.
//   3) Number.isNaN(숫자) 가 아닐 때만 best 에 넣는다.
function loadBest() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved === null) {
        return;
    }
    const number = Number(saved);
    if(!Number.isNaN(number)) {
        best = number;
    }
}


// ★ STEP 6. renderBest() 함수
//   bestScoreText.textContent 에 '최고 점수: ' + best + '점'
function renderBest() {
    bestScoreText.textContent = '최고 점수: ' + best + '점';
}


/* ---------------------------------------------------------
   6. 이벤트
   --------------------------------------------------------- */

// ★ STEP 4. [다음 문제] 버튼을 누르면 goNext() 를 부른다.
//   nextBtn.addEventListener('click', ...)
nextBtn.addEventListener('click', goNext);




// ★ STEP 5. [다시 하기] 버튼을 누르면 resetGame() 을 부른다.
//   restartBtn.addEventListener('click', ...)
restartBtn.addEventListener('click', resetGame);


/* ---------------------------------------------------------
   7. 처음 화면 그리기
   --------------------------------------------------------- */

// ★ STEP 1. renderQuestion();   를 한 번 부른다.
// ★ STEP 6. 맨 위에 loadBest(); 를 부르고, renderBest(); 도 부른다.
//           (순서: loadBest → renderBest → renderQuestion)
loadBest();
renderBest();
renderScore();
renderQuestion();
