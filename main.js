import { GameBoard } from './models.js';
import { lastGames } from './models.js';
let count = 0;
window.onload = () => {
    $("#start_btn").on("click", function(e) {
        e.preventDefault();
        let colorPB;
        const board = new GameBoard($("#cols").val(), $("#rows").val(), []);
        board.createBoard();
        if ($("#colorPA").val() == $("#colorPB").val()) {
            colorPB = "yellow";
        } else {
            colorPB = $("#colorPB").val();
        }
        GameBoard.setGame($("#colorPA").val(), colorPB, $("#cols").val(), $("#rows").val(), $("#player1").val(), $("#player2").val());
        $("#startForm").css("display", "none");
        $("#ingameOptions").css("display", "block");
        $("#undo").css("display", "block");
        $("#gameBoard").css("display", "block");
        $("#resBoard").html("");
        $("#resBoard").css("display", "none");
    });
    $("#restart").on("click", function(e) {
        $("#ingameOptions").css("display", "none");
        $("#startForm").css("display", "block");
        $("#gameBoard").html("");
    });

    $("#undo").on("click", function(e) {
        GameBoard.undo();

    });

    $("#gameBoard").on("click", "td", function(e) {
        GameBoard.clickOnCols(e.target);
    });

    $("#resBoard").on("click", ".save", function(e) {
        localStorage.setItem("lastGames", JSON.stringify(lastGames));
        alert("Results saved");
    });

    $("#resBoard").on("click", ".delete", function(e) {
        GameBoard.deleteLastGames();
        $("#resBoard").css("display", "none");
        localStorage.removeItem("lastGames");
        alert("Results deleted");
    });
};