console.log("Loaded app.js;");

let app = {
  gameResult: {
    DRAW: "d r a w",
    PLAYER_WIN: "+rep",
    COMPUTER_WIN: "-rep",
  },

  choices: {
    ROCK: "ROK",
    PAPER: "PAPOR",
    SCISSORS: "SKIZORS",
  },

  settings: {
    rollDelay: 700,
  },

  computerIsRolling: false,

  unblurClass: "unblur-game-button",
  blurClass: "blur-game-button",

  buttons: document.querySelectorAll(".game-button"),
  buttonClasses: ["rock-button", "paper-button", "scissors-button"],

  onButtonHover(button) {
    let thisButtonClass = null;

    // Stop existing animations.
    for (let gameButton of this.buttons) {
      gameButton.classList.remove(this.unblurClass);
    }

    // Find the class of this hovered button.
    for (let buttonClass of this.buttonClasses) {
      if (button.classList.contains(buttonClass)) {
        thisButtonClass = buttonClass;
        break;
      }
    }

    // Blur the buttons that aren't hovered.
    for (let gameButton of this.buttons) {
      if (gameButton.classList.contains(thisButtonClass)) {
        continue;
      }

      gameButton.classList.toggle(this.blurClass);
    }
  },

  onButtonMouseLeave(button) {
    for (let gameButton of this.buttons) {
      gameButton.classList.remove(this.blurClass);
      gameButton.classList.toggle(this.unblurClass);
    }
  },

  onButtonClick(button) {
    if (this.computerIsRolling) {
      return;
    }

    button.classList.add("selected-button");

    for (let gameButton of this.buttons) {
      if (gameButton !== button) {
        gameButton.classList.remove("selected-button");
      }
    }

    const gameData = this.playGame(button.textContent);

    let computerChoiceBox = document.querySelector(".ai-choice");
    let gameScoreValue = document.querySelector(".game-score-value");

    let gameScore = parseInt(gameScoreValue.textContent);

    if (gameData.result === this.gameResult.PLAYER_WIN) {
      gameScore++;
    } else if (gameData.result === this.gameResult.COMPUTER_WIN) {
      gameScore--;
    }

    gameData["gameScore"] = gameScore;

    this.rollComputerChoice(gameData);
  },

  rollComputerChoice(gameData) {
    let computerChoiceBox = document.querySelector(".ai-choice");
    let gameScoreValue = document.querySelector(".game-score-value");
    let gameResultText = document.querySelector(".game-result");
    let onScreenGameResult = gameResultText.cloneNode();

    let gameContainer = document
      .getElementsByClassName("game-container")
      .item(0);

    gameContainer.appendChild(onScreenGameResult);

    console.log(onScreenGameResult.parentNode);

    let choiceValues = Object.values(this.choices);

    const COMPUTER_ROLLS = 3;

    this.computerIsRolling = true;

    computerChoiceBox.classList.add("computer-roll-shake");

    for (let i = 0; i < COMPUTER_ROLLS; i++) {
      setTimeout(() => {
        let choice = Math.floor(Math.random() * 3);
        computerChoiceBox.textContent = choiceValues[i];

        computerChoiceBox.classList.toggle("computer-roll");
      }, this.settings.rollDelay * i);
    }

    setTimeout(() => {
      computerChoiceBox.classList.toggle("computer-roll");
      computerChoiceBox.textContent = "";
    }, this.settings.rollDelay * COMPUTER_ROLLS);

    setTimeout(() => {
      computerChoiceBox.textContent = gameData.computerChoice;
      gameScoreValue.textContent = String(gameData.gameScore);
      computerChoiceBox.classList.remove("computer-roll-shake");

      const xOffset = Math.floor((Math.random() - 0.5) * 400);

      onScreenGameResult.textContent = gameData.result;
      onScreenGameResult.style.left = `${xOffset}px`;
      console.log(onScreenGameResult.style.transform);
      onScreenGameResult.classList.add("game-result-fly");

      this.computerIsRolling = false;
    }, this.settings.rollDelay * (COMPUTER_ROLLS + 1));

    setTimeout(() => {
      onScreenGameResult.remove();
    }, this.settings.rollDelay * (COMPUTER_ROLLS + 1) + 6000);
  },

  playGame(playerChoice) {
    playerChoice = playerChoice.toUpperCase();

    let computerChoice = this.doComputerMove();

    let result = null;

    switch (playerChoice) {
      case this.choices.ROCK:
        if (computerChoice === this.choices.ROCK) {
          result = this.gameResult.DRAW;
        } else if (computerChoice === this.choices.PAPER) {
          result = this.gameResult.COMPUTER_WIN;
        } else {
          result = this.gameResult.PLAYER_WIN;
        }
        break;

      case this.choices.PAPER:
        if (computerChoice === this.choices.ROCK) {
          result = this.gameResult.PLAYER_WIN;
        } else if (computerChoice === this.choices.PAPER) {
          result = this.gameResult.DRAW;
        } else {
          result = this.gameResult.COMPUTER_WIN;
        }
        break;

      case this.choices.SCISSORS:
        if (computerChoice === this.choices.ROCK) {
          result = this.gameResult.COMPUTER_WIN;
        } else if (computerChoice === this.choices.PAPER) {
          result = this.gameResult.PLAYER_WIN;
        } else {
          result = this.gameResult.DRAW;
        }
        break;
    }

    return {
      result: result,
      computerChoice: computerChoice,
    };
  },

  doComputerMove() {
    const choices = ["ROK", "PAPOR", "SKIZORS"];

    this.choices;

    let choice = Math.floor(Math.random() * 3);

    return choices[choice];
  },

  init() {
    this.buttons.forEach((button) => {
      button.addEventListener("mouseover", () => {
        this.onButtonHover(button);
      });

      button.addEventListener("mouseleave", () => {
        this.onButtonMouseLeave(button);
      });

      button.addEventListener("click", () => {
        this.onButtonClick(button);
      });
    });
  },
};

app.init();
