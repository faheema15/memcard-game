const gameBoard = document.getElementById('game-board');
const moveCount = document.getElementById('move-count');
const timerDisplay = document.getElementById('timer');
const newGameButton = document.getElementById('new-game');
const congratsMessage = document.getElementById('congrats-message');
const difficultySelection = document.getElementById('difficulty-selection');
const gameArea = document.getElementById('game-area');
const easyModeButton = document.getElementById('easy-mode');
const hardModeButton = document.getElementById('hard-mode');
const scoreDisplay = document.getElementById('score');

let cardImages = [
    '1.png', '2.png', '3.png', '4.png', '5.png', '6.png',
    '7.png', '8.png', '9.png', '10.png', '11.png', '12.png'
];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let timer;
let timeElapsed = 0;
let gridSize = 6;
let score = 0;

// Shuffle cards and set up the board based on grid size
function initializeGame(gridSize) {
    moves = 0;
    timeElapsed = 0;
    flippedCards = [];
    matchedPairs = 0;
    scoreDisplay.textContent = score;
    moveCount.textContent = moves;
    timerDisplay.textContent = timeElapsed;
    congratsMessage.classList.add('hidden');

    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);

    let cardPairs = [];
    if (gridSize === 4) {
        cardPairs = [...cardImages.slice(0, 8), ...cardImages.slice(0, 8)]; // 8 unique images for 4x4 grid
        gameBoard.style.gridTemplateColumns = 'repeat(4, 100px)';
        gameBoard.style.gridTemplateRows = 'repeat(4, 100px)';
    } else if (gridSize === 6) {
        // For 6x6 grid, use 12 unique images, repeat 6 more images to make up 18 pairs (36 cards total)
        let additionalPairs = cardImages.slice(0, 6); // Pick 6 images to repeat
        cardPairs = [...cardImages, ...cardImages, ...additionalPairs, ...additionalPairs]; // Total 18 pairs
        gameBoard.style.gridTemplateColumns = 'repeat(6, 100px)';
        gameBoard.style.gridTemplateRows = 'repeat(6, 100px)';
    }

    cardPairs.sort(() => 0.5 - Math.random());
    gameBoard.innerHTML = '';
    cards = cardPairs.map((image, index) => createCard(image, index));
    cards.forEach(card => gameBoard.appendChild(card));
}


// Create individual cards
function createCard(image, index) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.image = image;

    const cardInner = document.createElement('div');
    cardInner.classList.add('card-inner');

    const cardFront = document.createElement('div');
    cardFront.classList.add('card-front');
    
    const cardBack = document.createElement('div');
    cardBack.classList.add('card-back');
    cardBack.style.backgroundImage = `url('./images/${image}')`;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);
    card.appendChild(cardInner);

    card.addEventListener('click', () => flipCard(card));
    
    return card;
}

// Handle card flip
function flipCard(card) {
    if (flippedCards.length === 2 || card.classList.contains('flipped')) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        moves++;
        moveCount.textContent = moves;
        checkForMatch();
    }
}

// Check if two cards match
function checkForMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.dataset.image === secondCard.dataset.image) {
        flippedCards = [];
        matchedPairs++;
        score++;
        scoreDisplay.textContent = score;
        if ((gridSize === 6 && matchedPairs === 12) || (gridSize === 4 && matchedPairs === 8)) {
            endGame();
        }
    } else {
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}

// Timer update
function updateTimer() {
    timeElapsed++;
    timerDisplay.textContent = timeElapsed;
}

// End game
function endGame() {
    clearInterval(timer);
    congratsMessage.classList.remove('hidden');
}

// Event listeners for difficulty selection
easyModeButton.addEventListener('click', () => {
    gridSize = 4;
    difficultySelection.classList.add('hidden');
    gameArea.classList.remove('hidden');
    initializeGame(gridSize);
});

hardModeButton.addEventListener('click', () => {
    gridSize = 6;
    difficultySelection.classList.add('hidden');
    gameArea.classList.remove('hidden');
    initializeGame(gridSize);
});

// New game button: Return to difficulty selection
newGameButton.addEventListener('click', () => {
    clearInterval(timer);
    gameArea.classList.add('hidden');
    difficultySelection.classList.remove('hidden');
});
