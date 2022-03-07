export { GameBoard };
export let victory = false;
export let lastGames;
if (localStorage.getItem("lastGames")) {
    lastGames = JSON.parse(localStorage.getItem("lastGames"));
} else {
    lastGames = [];
}
const fx = new Audio('media/connect4.mp4');

let gameState;
let playerTurn;
let color1;
let color2;
let boardX;
let boardY;
let colorP;
let player;
let player1;
let player2;
let lastTurnX;
let lastTurnY;
let lastTd;

class GameBoard {
    constructor(x, y, boardArray) {
        this.x = x;
        this.y = y;
        this.currentState = boardArray;
    }

    static setGame(colorA, colorB, x, y, p1, p2) {
        color1 = colorA;
        color2 = colorB;
        boardX = x;
        boardY = y;
        player1 = p1;
        player2 = p2;
        player = player2;
        colorP = color2;
        $("#turn").html(`It's ${p1}'s turn`);
        $("#playerTurnColor").css("background-color", colorA);
    }

    createBoard() {
        const table = $("<table></table>");
        let dataIndex = 0;
        $("#gameBoard").append(table);
        for (let i = 0; i < this.y; i++) {
            table.append("<tr></tr>");
            this.currentState.push([]);
            for (let j = 0; j < this.x; j++) {
                const td = document.createElement("td");
                $(td).attr("data-index", j);
                const tr = $("tr")[i];
                tr.append(td);
                this.currentState[i].push("");
                playerTurn = 1;
            }
        }
        gameState = this.currentState;
        // console.log(this.currentState);
    }

    static goUp(row, dataIndex) {
        let rows = $("tr");
        let previousTd = $(rows[row - 1]).children('td').eq(dataIndex);

        if (gameState[row - 1][dataIndex] == "") {
            gameState[row - 1][dataIndex] = playerTurn;
            previousTd.css("background-color", colorP);
            lastTurnY = row - 1;
            lastTurnX = dataIndex;
            lastTd = previousTd;
        } else if (gameState[row][dataIndex] == 1 || gameState[row][dataIndex] == 2) {
            this.goUp(row - 1, dataIndex);
        }
    }

    static goDown(row, dataIndex) {
        let rows = $("tr");
        let currentTd = $(rows[row]).children('td').eq(dataIndex);

        if (gameState[row + 1] <= boardY && gameState[row + 1][dataIndex] == "") {
            row += 1;
            this.goDown(row, dataIndex);
        } else if (gameState[row][dataIndex] == 1 || gameState[row][dataIndex] == 2) {
            this.goUp(row, dataIndex);
        } else {
            gameState[row][dataIndex] = playerTurn;
            currentTd.css("background-color", colorP);
            lastTurnY = row;
            lastTurnX = dataIndex;
            lastTd = currentTd;
        }
    }

    static clickOnCols(target) {
        fx.pause();
        fx.currentTime = 0;
        fx.play();
        $("#undo").prop("disabled", false);

        $("#turn").html(`It's ${player}'s turn`);
        $("#playerTurnColor").css("background-color", colorP);
        player = (playerTurn == 1) ? player1 : player2;

        let row = target.parentElement.rowIndex;
        let dataIndex = parseInt($(target).attr("data-index"));
        // console.log(player);

        colorP = (playerTurn == 1) ? color1 : color2;
        this.goDown(row, dataIndex);

        if (this.verifyWinning()) {
            alert(`${player} won the game !`);
        }
        playerTurn = (playerTurn == 1) ? 2 : 1;

        // console.log(gameState);
    }

    static winwin() {
        // count += 1;
        $("#gameBoard").fadeOut(3500);
        $("#undo").fadeOut(3500);
        $("#turn").html(`${player} won !`);
        $("#playerTurnColor").css("background-color", colorP);
        let today = new Date(Date.now());
        lastGames.push(today.toDateString() + ` - ${player} won`);
        if (lastGames.length >= 2) {
            const wonDiv = $("#resBoard");
            wonDiv.css("display", "block");
            wonDiv.html("");
            wonDiv.html("<h3>Last games results</h3>");

            for (let result of lastGames) {
                const res = $("<p></p>").text(result);
                wonDiv.append(res);
                $("body").append(wonDiv);
            }
            const saveBtn = $("<button>Save scores</button>");
            saveBtn.addClass("save");
            const deleteBtn = $("<button>Delete scores</button>");
            deleteBtn.addClass("delete");
            wonDiv.append(saveBtn, deleteBtn);
        }
    }

    static verifEquals(p1, p2, p3, p4) {
        if (p1 == p2 && p1 == p3 && p1 == p4 && p1 != "") {
            this.winwin();
            victory = true;
            return true;
        } else {
            return false;
        }
    }

    static verifyWinning() {

        let stateCopy = [];
        for (let row of gameState) {
            for (let td of row) {
                stateCopy.push(td);
            }
        }

        if (!stateCopy.includes("")) {
            let today = new Date(Date.now());
            lastGames.push(today.toDateString() + " - Draw");
            alert("That's a draw !");
            $("#gameBoard").fadeOut(5000);
            $("#undo").fadeOut(5000);
            $("#turn").html(`It's a draw !`);
            $("#playerTurnColor").css("background-color", "rgb(31, 31, 31)");
        }

        let tableRow = $("tr");
        let rowI = 0;
        for (let row = 0; row < boardY; row++) {
            for (let col = 0; col < boardX; col++) {
                if (this.verifEquals(gameState[row][col], gameState[row][col + 1], gameState[row][col + 2], gameState[row][col + 3])) {
                    return true;
                }
            }
        }

        for (let col = 0; col < boardX; col++) {
            for (let row = 0; row < boardY && gameState[row + 3]; row++) {
                if (this.verifEquals(gameState[row][col], gameState[row + 1][col], gameState[row + 2][col], gameState[row + 3][col])) {
                    return true;
                }
            }
        }

        for (let col = 0; col <= boardX - 4; col++) {
            for (let row = 0; row < boardY && gameState[row + 3]; row++) {
                if (this.verifEquals(gameState[row][col], gameState[row + 1][col + 1], gameState[row + 2][col + 2], gameState[row + 3][col + 3])) {
                    return true;
                }
            }
        }

        for (let col = boardX - 1; col >= 3; col--) {
            for (let row = 0; row < boardY && gameState[row + 3]; row++) {
                if (this.verifEquals(gameState[row][col], gameState[row + 1][col - 1], gameState[row + 2][col - 2], gameState[row + 3][col - 3])) {
                    return true;
                }
            }
        }

    }

    static undo() {

        $("#turn").html(`It's ${player}'s turn`);
        $("#playerTurnColor").css("background-color", colorP);
        gameState[lastTurnY][lastTurnX] = "";
        player = (playerTurn == 1) ? player1 : player2;
        lastTd.css("background-color", "rgb(31, 31, 31)");
        colorP = (playerTurn == 1) ? color1 : color2;
        playerTurn = (playerTurn == 1) ? 2 : 1;
        $("#undo").prop("disabled", true);
    }

    static deleteLastGames() {
        lastGames = [];
    }
}