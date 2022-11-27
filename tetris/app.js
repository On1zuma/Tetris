//load after html images.. load
document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  let squares = Array.from(document.querySelectorAll(".grid div"));
  const ScoreDisplay = document.querySelector("#score");
  const StartBtn = document.querySelector("#start-button");

  const LeftBtn = document.querySelector("#left");
  const DownBtn = document.querySelector("#down");
  const RightBtn = document.querySelector("#right");
  const RotationBtn = document.querySelector("#rotation");

  const width = 10;
  let nextRandom = 0;
  let timerId;

  var initialisation = 0;
  let score = 0;
  var end = 0;
  var tetrominoSpeed = 1000;

  const colors = ["blue", "green", "orange", "red", "purple"];
  //NEXT tetromino
  const displaySquares = document.querySelectorAll(".mini-grid div");

  //show up the next tetromino
  const displayWidth = 4;
  const displayIndex = 0;

  //the tetrominos without rotations
  const upNextTetrominos = [
    [1, displayWidth, displayWidth + 1, displayWidth + 2], // t tetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, 2], //l tetromino
    [0, 1, displayWidth, displayWidth + 1], // o tetromino
    [
      displayWidth + 1,
      displayWidth + 2,
      displayWidth * 2,
      displayWidth * 2 + 1,
    ], //z tetromino
    [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1], //i tetromino
  ];

  //CURRENT tetromino
  //tretisss
  const lTetromino = [
    [1, width + 1, width * 2 + 1, 2],
    [width, width + 1, width + 2, width * 2 + 2],
    [1, width + 1, width * 2 + 1, width * 2],
    [width, width * 2, width * 2 + 1, width * 2 + 2],
  ];

  const zTetromino = [
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
    [0, width, width + 1, width * 2 + 1],
    [width + 1, width + 2, width * 2, width * 2 + 1],
  ];
  const iTetromino = [
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
    [1, width + 1, width * 2 + 1, width * 3 + 1],
    [width, width + 1, width + 2, width + 3],
  ];
  const tTetromino = [
    [1, width + 1, width + 2, width * 2 + 1],
    [width, width + 1, width + 2, width * 2 + 1],
    [1, width, width + 1, width * 2 + 1],
    [1, width, width + 1, width + 2],
  ];
  const oTetromino = [
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
    [0, 1, width, width + 1],
  ];

  const theTetrominos = [
    tTetromino,
    lTetromino,
    oTetromino,
    zTetromino,
    iTetromino,
  ];

  //pos where tetromino spawn
  var currentPosition = 3;
  let currentRotation = 0;

  //figure
  var randomFig;
  //rota
  var randomRota;
  //current tetromino
  var current;

  //draw tetromino
  function draw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.add("tetromino");
      squares[currentPosition + index].style.backgroundColor =
        colors[randomFig];
    });
  }

  //select randomly a tetromino and here first rota and generate it
  function generateRandomTetromino() {
    currentPosition = 3;
    if (initialisation === 0) {
      nextRandom = Math.floor(Math.random() * theTetrominos.length); //randomFig
      initialisation = 1;
    }
    randomFig = nextRandom;
    console.log(randomFig);
    //next tetromino
    nextRandom = Math.floor(Math.random() * theTetrominos.length); //randomFig
    //rotation
    randomRota = Math.floor(Math.random() * oTetromino.length); //o tetromino or another is the same thing
    current = theTetrominos[randomFig][randomRota];
    draw();
    displayShape();
    addScore();
    gameOver();
  }

  generateRandomTetromino();

  //undraw tetromino
  function undraw() {
    current.forEach((index) => {
      squares[currentPosition + index].classList.remove("tetromino");
      squares[currentPosition + index].style.backgroundColor = "";
    });
  }

  //key listenner
  function control(e) {
    if (timerId && end === 0) {
      if (e.keyCode === 37 || e.keyCode === 81) {
        moveLeft();
      } else if (e.keyCode === 83 || e.keyCode === 40) {
        moveDown();
      } else if (e.keyCode === 68 || e.keyCode === 39) {
        moveRight();
      } else if (e.keyCode === 82) {
        makeRotation();
      }
    }
  }

  document.addEventListener("keyup", control);

  function moveDown() {
    undraw();
    currentPosition += width;
    draw();
    freeze();
  }

  //freeze function
  function freeze() {
    if (
      current.some(
        (index) =>
          squares[currentPosition + index + width].classList.contains(
            "taken"
          ) == true
      )
    ) {
      current.forEach((index) =>
        squares[currentPosition + index].classList.add("taken")
      );
      //start a new tetromino
      generateRandomTetromino();
      draw();
    }
  }

  //move left unless tetromino is at the edge or there is an othe item
  function moveLeft() {
    undraw();
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtLeftEdge) currentPosition -= 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition += 1;
    }
    draw();
  }

  //move right unless tetromino is at the edge or there is an othe item
  function moveRight() {
    undraw();
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );

    if (!isAtRightEdge) currentPosition += 1;
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      currentPosition -= 1;
    }

    draw();
  }

  function makeRotation() {
    undraw();
    randomRota++;
    if (randomRota >= 4) {
      randomRota = 0;
    }
    console.log(randomRota);
    //cheking edges
    const isAtRightEdge = current.some(
      (index) => (currentPosition + index) % width === width - 1
    );
    const isAtLeftEdge = current.some(
      (index) => (currentPosition + index) % width === 0
    );

    if (!isAtRightEdge) currentPosition += 1;
    if (!isAtLeftEdge) currentPosition -= 1;

    current = theTetrominos[randomFig][randomRota];
    draw();
  }

  //display the shape in the mini grid
  function displayShape() {
    displaySquares.forEach((square) => {
      square.classList.remove("tetromino");
      square.style.backgroundColor = "";
    });
    upNextTetrominos[nextRandom].forEach((index) => {
      displaySquares[displayIndex + index].classList.add("tetromino");
      displaySquares[displayIndex + index].style.backgroundColor =
        colors[nextRandom];
    });
  }

  //add buttons
  StartBtn.addEventListener("click", () => {
    if (timerId) {
      clearInterval(timerId);
      timerId = null;
    } else {
      // draw();
      timerId = setInterval(moveDown, tetrominoSpeed);
      // nextRandom = Math.floor(Math.random() * theTetrominos.length);
      // displayShape();
    }
  });

  LeftBtn.addEventListener("click", () => {
    if (end === 0) {
      moveLeft();
    }
  });

  RightBtn.addEventListener("click", () => {
    if (end === 0) {
      moveRight();
    }
  });

  DownBtn.addEventListener("click", () => {
    if (end === 0) {
      moveDown();
    }
  });

  RotationBtn.addEventListener("click", () => {
    if (end === 0) {
      makeRotation();
    }
  });

  //add score
  function addScore() {
    for (let i = 0; i < 199; i += width) {
      const row = [
        i,
        i + 1,
        i + 2,
        i + 3,
        i + 4,
        i + 5,
        i + 6,
        i + 7,
        i + 8,
        i + 9,
      ];
      if (row.every((index) => squares[index].classList.contains("taken"))) {
        score += 100;
        if (tetrominoSpeed > 500) {
          tetrominoSpeed -= 20;
        }
        if (tetrominoSpeed <= 500 && tetrominoSpeed > 250) {
          tetrominoSpeed -= 5;
        }
        if (tetrominoSpeed <= 250) {
          tetrominoSpeed -= 3;
        }

        console.log(tetrominoSpeed);
        ScoreDisplay.innerHTML = score;
        row.forEach((index) => {
          squares[index].classList.remove("taken");
          squares[index].classList.remove("tetromino");
          squares[index].style.backgroundColor = "";
        });
        const squaresRemoved = squares.splice(i, width);
        squares = squaresRemoved.concat(squares);
        squares.forEach((cell) => grid.appendChild(cell));
      }
    }
  }

  function gameOver() {
    if (
      current.some((index) =>
        squares[currentPosition + index].classList.contains("taken")
      )
    ) {
      end = 1;
      ScoreDisplay.innerHTML = " Game over";
      clearInterval(timerId);
    }
  }
});
