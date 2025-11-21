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
let wins = 0;
let losses = 0;

function startScreen() {
    box.innerHTML = `
        <h2>Угадай слово</h2>
        <button onclick="chooseDifficulty()">Играть</button>
    `;
}

function chooseDifficulty() {
    box.innerHTML = `
        <h2>Сложность</h2>
        <button onclick="startGame('easy')">Лёгкий</button>
        <button onclick="startGame('medium')">Средний</button>
        <button onclick="startGame('hard')">Сложный</button>
    `;
}

function startGame(diff) {
    difficulty = diff;
    wordList = [...words[diff]];
    wins = 0;
    losses = 0;
    nextRound();
}

function nextRound() {
    if (wordList.length === 0) return endGame();

    currentWord = wordList.shift().toLowerCase();
    display = Array(currentWord.length).fill("*");
    lives = 3;

    drawRound();
}

function drawRound() {
    box.innerHTML = `
        <h2>Раунд</h2>

        <div class="word">${display.join("")}</div>

        <input id="inp" placeholder="Буква или слово">

        <button onclick="guess()">Отправить</button>

        <div class="stats">
            Длина слова: ${currentWord.length}<br>
            Жизни: ${lives}<br>
            Победы: ${wins}, Поражения: ${losses}
        </div>
    `;
}

function openRandomLetter() {
    const hiddenIndexes = [];

    for (let i = 0; i < display.length; i++) {
        if (display[i] === "*") hiddenIndexes.push(i);
    }

    if (hiddenIndexes.length === 0) return;

    const i = hiddenIndexes[Math.floor(Math.random() * hiddenIndexes.length)];
    display[i] = currentWord[i];
}

function guess() {
    const val = document.getElementById("inp").value.trim().toLowerCase();
    if (!val) return;

    if (!/^[a-zA-Z]+$/.test(val)) {
        alert("Только английские буквы!");
        return;
    }

    // Если вводят слово
    if (val.length > 1) {
        if (val === currentWord) {
            win();
        } else {
            lives--;
            openRandomLetter(); // показать букву при ошибке
            if (lives <= 0) return lose();
            drawRound();
        }
        return;
    }

    // Ввод одной буквы
    const letter = val;
    if (currentWord.includes(letter)) {

        for (let i = 0; i < currentWord.length; i++) {
            if (currentWord[i] === letter) display[i] = letter;
        }

        if (display.join("") === currentWord) return win();

        drawRound();

    } else {
        lives--;
        openRandomLetter(); // показать букву при ошибке
        if (lives <= 0) return lose();
        drawRound();
    }
}

function win() {
    wins++;
    box.innerHTML = `
        <h2>Победа!</h2>
        <div class="word">${currentWord}</div>
        <button onclick="nextRound()">Следующее слово</button>
    `;
}

function lose() {
    losses++;
    box.innerHTML = `
        <h2>Поражение</h2>
        <div class="word">${currentWord}</div>
        <button onclick="nextRound()">Дальше</button>
    `;
}

function endGame() {
    box.innerHTML = `
        <h2>Игра окончена</h2>
        <div class="stats">
            Сложность: ${difficulty}<br>
            Побед: ${wins}<br>
            Поражений: ${losses}
        </div>
        <button onclick="startScreen()">В меню</button>
    `;
}

startScreen();
