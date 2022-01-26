
const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1;                                               // active player: 1 or 2
let board = [];                                                   // array of rows, each row is array of cells  (board[y][x])


function makeBoard() {                                            // Set global board varable to an array of 6 height and 7 width.
  for( let y = 0; y < HEIGHT; y++) {                              // y is the ROWS.
    board.push(Array.from({ length: WIDTH }));                    // push into board arraylikestructure with a length of width. 
  }
}

function makeHtmlBoard() {
  const board = document.getElementById('board');                

  //making the first tableRow, adding clickEvent to it. 
  const top = document.createElement('tr');                      
  top.setAttribute("id", "column-top");                          
  top.addEventListener("click", handleClick);                   // an eventListener is set on top which when clicked will execute the handleClick function.

  // setting each individual tableData of the column tops and appending it to the variable top. 
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement('td');              // headCell varibale will be assigned to the creation of a new tableData HTML element. 
    headCell.setAttribute('id', x);                             // headCell variable is getting an id attribute with the value of x. So for each cell it will change starting from 0 going to 6.
    top.append(headCell);                                       // we append headCell to top. Which meand after top there will be the headCell. 
  }
  board.append(top);

  //make main part of board
  for (let y = 0; y < HEIGHT; y++) {                  
    const row = document.createElement('tr');         // creating a variable which will create a new tableRow element. 
                                                      // here we are running a nested loop, on top we created the tableRow, than inside the loop
                                                      // for every itereation we running the secon loop which will add tableData elements. 6 of them on each iteration. 
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement('td');      
      cell.setAttribute('id', `${y}-${x}`);           // giving cell an id attribute wiht value of Y and X (which are considered it coordinates)
      row.append(cell);                               // appending cell to row. Row first than cell. 
    }
    board.append(row);                                // appending row to board. first board than row. 
  }
}




/** findSpotForCol: given column x, return top empty y (null if filled) */
function findSpotForCol(x) {
  for (let y = HEIGHT - 1; y >= 0; y--) {         // we are starting at the top -1 (minus one because arrays start at 0) and go down one always checking if the space it taken. 
  if (!board[y][x]) {                               // if it doesnt return board with coordinates we know it is STILL empty. 
    return y;                                       // return the HEIGHT which is empty, otherwise return null.
  }
}
  return null;
}

//update DOM to place piece into HTML table of board
function placeInTable(y, x) {
  
  const piece = document.createElement('div');
  piece.classList.add('piece');
  piece.classList.add(`p${currPlayer}`);
  piece.style.top = -50 * (y + 2);

  const spot = document.getElementById(`${y}-${x}`);
  spot.append(piece);
}

/** endGame: announce game end */
function endGame(msg) {
  alert(msg)
}

/** handleClick: handle click of column top to play piece */

function handleClick(evt) {
  const x = +evt.target.id;                        // get x from ID of clicked cell. X ARE THE COLUMNS
  const y = findSpotForCol(x);                     // get next spot in column (if none, ignore click)
  if (y === null) {
    return;
  }

// TODO: add line to update in-memory board
  board[y][x] = currPlayer;                       
  placeInTable(y, x);                                       // place piece in board and add to HTML table

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  if (board.every(row => row.every(cell => cell))) {        //check if all cells in board are filled.
    return endGame ('Tie');
  }
  // switch players
  currPlayer = currPlayer === 1 ? 2 : 1;
}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

function checkForWin() {
  function _win(cells) {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer
    return cells.every(
      ([y, x]) =>
        y >= 0 &&       // if y equals or is greater than 0
        y < HEIGHT &&   // if y is smaller than height variable
        x >= 0 &&       // if x(column) equals or is greater than 0
        x < WIDTH &&    // if x(column) is smaller that width variable
        board[y][x] === currPlayer    // if 
    );
  }
  // TODO: read and understand this code. Add comments to help you.
  for (let y = 0; y < HEIGHT; y++) {      // run loop for rows
    for (let x = 0; x < WIDTH; x++) {     // run nested loop for all columns inside the row that we are currently looping trough. 
      const horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];   // variable horiz will be assigned to an array. 
      const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      const diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();
makeHtmlBoard();