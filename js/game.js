let balance = 10000;
let currentBet = 0;

function updateBalanceUI() {
  document.getElementById("balance").textContent = balance;
  document.getElementById("bet").textContent = currentBet;
}

function placeBet(amount) {
  if (balance >= amount) {
    balance -= amount;
    currentBet += amount;
    updateBalanceUI();
  }
}
// ===== BASİT BLACKJACK MOTORU =====

const suits = ["♠", "♥", "♦", "♣"];
const values = [
  { name: "A", value: 11 },
  { name: "2", value: 2 },
  { name: "3", value: 3 },
  { name: "4", value: 4 },
  { name: "5", value: 5 },
  { name: "6", value: 6 },
  { name: "7", value: 7 },
  { name: "8", value: 8 },
  { name: "9", value: 9 },
  { name: "10", value: 10 },
  { name: "J", value: 10 },
  { name: "Q", value: 10 },
  { name: "K", value: 10 }
];

let deck = [];
let playerHand = [];
let dealerHand = [];

const dealerHandDiv = document.getElementById("dealerHand");
const playerHandDiv = document.getElementById("playerHand");
const dealerScoreDiv = document.getElementById("dealerScore");
const playerScoreDiv = document.getElementById("playerScore");
const ticker = document.getElementById("ticker");

const dealBtn = document.getElementById("dealBtn");
const hitBtn = document.getElementById("hitBtn");
const standBtn = document.getElementById("standBtn");

function createDeck() {
  deck = [];
  for (let suit of suits) {
    for (let val of values) {
      deck.push({ suit, ...val });
    }
  }
}

function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function drawCard() {
  return deck.pop();
}

function calculateScore(hand) {
  let score = 0;
  let aces = 0;

  for (let card of hand) {
    score += card.value;
    if (card.name === "A") aces++;
  }

  while (score > 21 && aces > 0) {
    score -= 10;
    aces--;
  }

  return score;
}

function renderHand(hand, container) {
  container.innerHTML = "";
  hand.forEach(card => {
    const cardDiv = document.createElement("div");
    cardDiv.classList.add("card");
    if (card.suit === "♥" || card.suit === "♦") {
      cardDiv.classList.add("red");
    } else {
      cardDiv.classList.add("black");
    }
    cardDiv.textContent = card.name + card.suit;
    container.appendChild(cardDiv);
  });
}

function updateScores() {
  playerScoreDiv.textContent = calculateScore(playerHand);
  dealerScoreDiv.textContent = calculateScore(dealerHand);
}

function startGame() {
  createDeck();
  shuffleDeck();

  playerHand = [];
  dealerHand = [];

  playerHand.push(drawCard());
  playerHand.push(drawCard());
  dealerHand.push(drawCard());
  dealerHand.push(drawCard());

  renderHand(playerHand, playerHandDiv);
  renderHand(dealerHand, dealerHandDiv);

  updateScores();
  ticker.textContent = "Oyun başladı";
}

function hit() {
  playerHand.push(drawCard());
  renderHand(playerHand, playerHandDiv);
  updateScores();

  if (calculateScore(playerHand) > 21) {
    ticker.textContent = "Bust! Kaybettiniz.";
  }
}

function stand() {
  while (calculateScore(dealerHand) < 17) {
    dealerHand.push(drawCard());
  }

  renderHand(dealerHand, dealerHandDiv);
  updateScores();

  const playerScore = calculateScore(playerHand);
  const dealerScore = calculateScore(dealerHand);

  if (dealerScore > 21 || playerScore > dealerScore) {
    ticker.textContent = "Kazandınız!";
  } else if (playerScore < dealerScore) {
    ticker.textContent = "Dealer kazandı.";
  } else {
    ticker.textContent = "Berabere.";
  }
}

dealBtn.addEventListener("click", startGame);
hitBtn.addEventListener("click", hit);
standBtn.addEventListener("click", stand);
