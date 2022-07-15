let game = {
  you: {
    scoreSpan: "#your-result",
    div: ".your-box",
    score: 0,
    winSpan: "#wins",
    wins: 0,
    loseSpan: "#losses",
    losses: 0,
    drawSpan: "#draws",
    draws: 0,
  },
  dealer: {
    scoreSpan: "#dealer-result",
    div: ".dealer-box",
    score: 0,
    wins: 0,
  },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K", "A"],
  cardsMap: {
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    J: 10,
    Q: 10,
    K: 10,
    A: [1, 11],
  },

  isStand: false,
  turnOver: false,
};

const YOU = game["you"];
const DEALER = game["dealer"];

document.querySelector("#hit").addEventListener("click", hitButton);

document.querySelector("#deal").addEventListener("click", dealButton);

document.querySelector("#stand").addEventListener("click", standButton);

const hitSound = new Audio("static/sounds/swish.m4a");
const winSound = new Audio("static/sounds/cash.mp3");
const loseSound = new Audio("static/sounds/aww.mp3");
function hitButton() {
  if (!game["isStand"]) {
    let card = randomCard();
    showCard(YOU, card);
    updateScore(YOU, card);
    document.querySelector("#head-page").textContent = "Lets play!";
    document.querySelector("#head-page").style.color = "black";
  }
}

function dealButton(activePlayer) {
  if (game["turnOver"]) {
    document.querySelector(".row1").style.setProperty("height", "300px");
    computeWinner();
    let yourImgs = document.querySelector(".your-box").querySelectorAll("img");
    let dealerImgs = document
      .querySelector(".dealer-box")
      .querySelectorAll("img");
    yourImgs.forEach((element) => {
      element.remove();
    });

    dealerImgs.forEach((element) => {
      element.remove();
    });

    YOU["score"] = 0;
    DEALER["score"] = 0;
    document.querySelector(YOU["scoreSpan"]).textContent = 0;
    document.querySelector(YOU["scoreSpan"]).style.color = "white";
    document.querySelector(DEALER["scoreSpan"]).textContent = 0;
    document.querySelector(DEALER["scoreSpan"]).style.color = "white";
    game["isStand"] = false;
    game["turnOver"] = true;
  }
}
function showCard(activePlayer, cardno) {
  let card = document.createElement("img");
  card.src = `static/images/${cardno}.png`;
  document.querySelector(activePlayer["div"]).appendChild(card);
  document.querySelector(".row1").style.setProperty("height", "auto");
  hitSound.play();
}

function randomCard() {
  let random = Math.floor(Math.random() * 13);
  return game["cards"][random];
}

function updateScore(activePlayer, card) {
  if (card === "A") {
    if (activePlayer["score"] + game["cardsMap"][card][1] <= 21) {
      activePlayer["score"] += game["cardsMap"][card][1];
    } else {
      activePlayer["score"] += game["cardsMap"][card][0];
    }
  } else {
    activePlayer["score"] += game["cardsMap"][card];
  }
  document.querySelector(activePlayer["scoreSpan"]).textContent =
    activePlayer["score"];
  if (activePlayer["score"] >= 21) {
    document.querySelector(activePlayer["scoreSpan"]).textContent = "BUSTED!";
    document.querySelector(activePlayer["scoreSpan"]).style.color = "red";
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function standButton() {
  game["isStand"] = true;
  let card = randomCard();
  showCard(DEALER, card);
  updateScore(DEALER, card);
  await delay(1000);
  while (DEALER["score"] < YOU["score"] && game["isStand"]) {
    let card = randomCard();
    showCard(DEALER, card);
    updateScore(DEALER, card);
    await delay(1000);
  }
  game["turnOver"] = true;
}

function computeWinner() {
  if (game["turnOver"]) {
    let winner;
    if (YOU["score"] < 21 && DEALER["score"] < 21) {
      if (YOU["score"] > DEALER["score"]) {
        console.log("You WIN!");
        winner = YOU;
        YOU["wins"]++;
        document.querySelector(YOU["winSpan"]).textContent = YOU["wins"];
      } else if (YOU["score"] === DEALER["score"]) {
        console.log("DRAW!");
        winner = undefined;
        YOU["draws"]++;
        document.querySelector(YOU["drawSpan"]).textContent = YOU["draws"];
      } else if (YOU["score"] < DEALER["score"]) {
        console.log("You LOST!");
        winner = DEALER;
        YOU["losses"]++;
        DEALER["wins"]++;
        document.querySelector(YOU["loseSpan"]).textContent = YOU["losses"];
      }
    } else if (YOU["score"] >= 21 && DEALER["score"] >= 21) {
      console.log("DRAW!");
      winner = undefined;
      YOU["draws"]++;
      document.querySelector(YOU["drawSpan"]).textContent = YOU["draws"];
    } else {
      if (YOU["score"] >= 21) {
        console.log("You LOST!");
        winner = DEALER;
        YOU["losses"]++;
        DEALER["wins"]++;
        document.querySelector(YOU["loseSpan"]).textContent = YOU["losses"];
      } else if (DEALER["score"] >= 21) {
        console.log("You WIN!");
        winner = YOU;
        YOU["wins"]++;
        document.querySelector(YOU["winSpan"]).textContent = YOU["wins"];
      }
    }
    let message, messageColor;
    if (winner === YOU) {
      message = "YOU WIN!";
      messageColor = "green";
      winSound.play();
    } else if (winner === DEALER) {
      message = "YOU LOST!";
      messageColor = "red";
      loseSound.play();
    }
    document.querySelector("#head-page").textContent = message;
    document.querySelector("#head-page").style.color = messageColor;
    console.log(winner);
  }
}
