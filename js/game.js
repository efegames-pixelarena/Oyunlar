// ==========================
// BLACKJACK GAME ENGINE
// ==========================

let deck = [];
let playerHand = [];
let dealerHand = [];

let balance = 10000;
let currentBet = 0;
let gameActive = false;

// ---------- DESTES ----------
function createDeck() {
  const suits = ["♠", "♥", "♦", "♣"];
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  deck = [];

  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value });
    }
  }

  deck = deck.sort(() => Math.random() - 0.5);
}

// ---------- EL DEĞERİ ----------
function getHandValue(hand) {
  let value = 0;
  let aces = 0;

  for (let card of hand) {
    if (["J", "Q", "K"].includes(card.value)) value += 10;
    else if (card.value === "A") {
      value += 11;
      aces++;
    } else value += parseInt(card.value);
  }

  while (value > 21 && aces > 0) {
    value -= 10;
    aces--;
  }

  return value;
}

// ---------- BAHİS ----------
function updateBalanceUI() {
  document.getElementById("balance").textContent = balance;
  document.getElementById("bet").textContent = currentBet;
}

function placeBet(amount) {
  if (balance >= amount && !gameActive) {
    balance -= amount;
    currentBet += amount;
    updateBalanceUI();
  }
}

function settleBet(result) {
  if (result === "win") {
    balance += currentBet * 2;
  } else if (result === "push") {
    balance += currentBet;
  }
  currentBet = 0;
  updateBalanceUI();
}

// ---------- OYUN ----------
function startGame() {
  if (currentBet === 0) {
    alert("Önce bahis koyun!");
    return;
  }

  createDeck();
  playerHand = [deck.pop(), deck.pop()];
  dealerHand = [deck.pop(), deck.pop()];
  gameActive = true;

  renderUI();
}

function hit() {
  if (!gameActive) return;

  playerHand.push(deck.pop());
  renderUI();

  if (getHandValue(playerHand) > 21) {
    endGame("lose");
  }
}

function stand() {
  if (!gameActive) return;

  while (getHandValue(dealerHand) < 17) {
    dealerHand.push(deck.pop());
  }

  const playerValue = getHandValue(playerHand);
  const dealerValue = getHandValue(dealerHand);

  if (dealerValue > 21 || playerValue > dealerValue) {
    endGame("win");
  } else if (playerValue < dealerValue) {
    endGame("lose");
  } else {
    endGame("push");
  }
}

function endGame(result) {
  gameActive = false;
  settleBet(result);

  let message = "";
  if (result === "win") message = "Kazandınız!";
  if (result === "lose") message = "Kaybettiniz!";
  if (result === "push") message = "Berabere!";

  document.getElementById("message").textContent = message;
  renderUI(true);
}
