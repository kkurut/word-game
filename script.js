const box = document.getElementById("box");

const words = {
    easy: ["cat","milk","frog","lion","door","fish","ring","cake","snow","tree"],
    medium: ["apple","silver","market","planet","camera","forest","castle","mother","flower","window"],
    hard: ["picture","airport","battery","company","problem","diamond","teacher","elephant","history","mountain"]
};

let difficulty = "";
let wordList = [];
let currentWord = "";
let display = [];
let lives = 3;
let results = [];
let roundStartTime;

// старт игры через confirm
function startGamePrompt() {
    if (!confirm("Хотите сыграть?")) {
        box.innerHTML = "<h2>Игра завершена</h2>";
        return;
    }
    chooseDifficulty();
}

// выбор сложности
function chooseDifficulty() {
    box.innerHTML = `
        <h2>Выберите сложность</h2>
        <button onclick="setDifficulty('easy')">Лёгкий (3-4 буквы)</button>
        <button onclick="setDifficulty('medium')">Средний (5-6 букв)</button>
        <button onclick="setDifficulty('hard')">Сложный (7-8 букв)</button>
    `;
}

function setDifficulty(diff) {
    difficulty = diff;
    wordList = [...words[diff]];
    results = [];
    nextRound();
}

// следующий раунд
function nextRound() {
    if (wordList.length === 0) return endGame();

    currentWord = wordList.shift().toLowerCase();
    display = Array(currentWord.length).fill("*");
    lives = 3;
    roundStartTime = new Date();
    drawRound();
}

// отрисовка раунда
function drawRound() {
    box.innerHTML = `
        <h2>Раунд</h2>
        <div class="word">${display.join("")}</div>
        <input id="inp" placeholder="Буква или слово">
        <button onclick="guess()">Отправить</button>
        <div class="stats">
            Длина слова: ${currentWord.length}<br>
            Жизни: ${lives}<br>
        </div>
    `;
}

// открыть одну случайную букву при ошибке
function openRandomLetter() {
    const hiddenIndexes = [];
    for (let i = 0; i < display.length; i++) {
        if (display[i] === "*") hiddenIndexes.push(i);
    }
    if (hiddenIndexes.length === 0) return;
    const i = hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];
    display[i] = currentWord[i];
}

// обработка угадывания
function guess() {
    const val = document.getElementById("inp").value.trim().toLowerCase();
    if (!val) return;

    if (!/^[a-zA-Z]+$/.test(val)) {
        alert("Только английские буквы!");
        return;
    }

    if (val.length > 1) { // слово
        if (val === currentWord) return win();
        else {
            lives--;
            openRandomLetter();
            if (lives <= 0) return lose();
            drawRound();
        }
        return;
    }

    // буква
    const letter = val;
    if (currentWord.includes(letter)) {
        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === letter) display[i] = letter;
        }
        if (display.join("") === currentWord) return win();
        drawRound();
    } else {
        lives--;
        openRandomLetter();
        if (lives <= 0) return lose();
        drawRound();
    }
}

// победа
function win() {
    const duration = (new Date() - roundStartTime)/1000;
    results.push({word: currentWord, win: true, time: duration});
    box.innerHTML = `
        <h2>Победа!</h2>
        <div class="word">${currentWord}</div>
        <button onclick="nextRoundPrompt()">Следующее слово</button>
    `;
}

// поражение
function lose() {
    const duration = (new Date() - roundStartTime)/1000;
    results.push({word: currentWord, win: false, time: duration});
    box.innerHTML = `
        <h2>Поражение</h2>
        <div class="word">${currentWord}</div>
        <button onclick="nextRoundPrompt()">Следующее слово</button>
    `;
}

// подтверждение следующего раунда
function nextRoundPrompt() {
    if (wordList.length === 0) return endGame();
    if (confirm("Сыграть следующий раунд?")) nextRound();
    else endGame();
}

// завершение игры + рейтинг
function endGame() {
    // сортировка по времени
    results.sort((a,b) => a.time - b.time);

    let table = `<table>
        <tr><th>Слово</th><th>Угадал</th><th>Время</th></tr>`;
    results.forEach(r => {
        const min = Math.floor(r.time/60).toString().padStart(2,'0');
        const sec = Math.floor(r.time%60).toString().padStart(2,'0');
        table += `<tr><td>${r.word}</td><td>${r.win ? 'да':'нет'}</td><td>${min}:${sec}</td></tr>`;
    });
    table += `</table>`;

    // итог побед/поражений
    const wins = results.filter(r=>r.win).length;
    const losses = results.filter(r=>!r.win).length;
    let message = wins > losses ? "Молодец!" : "В следующий раз получится лучше";

    box.innerHTML = `
        <h2>Игра окончена</h2>
        <div class="stats">
            Сложность: ${difficulty}<br>
            Побед: ${wins}<br>
            Поражений: ${losses}<br>
            ${message}
        </div>
        ${table}
        <button onclick="startGamePrompt()">В меню</button>
    `;
}

startGamePrompt();
