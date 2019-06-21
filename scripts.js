$(document).ready( () => {
    let game = new Game();
})

class Game {
    constructor(){
        this.players = [];
        this.scoreboard = new Scoreboard();
        this.turn;
        this.board = [
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0]
        ];

        this.initGUI();
    }

    // builds initial GUI
    initGUI(){
        // where the board will be
        $("body").append($("<div></div>").attr("id", "board"));
        $("#board").css({
            "background-color": "#f00",
            "float": "left",
            "width": "75%",
            "height": "95vh"
        });
        // where the game info will be
        $("body").append($("<div></div>").attr("id", "info"));
        $("#info").css({
            "background-color": "#0f0",
            "float": "left",
            "width": "25%",
            "height": "95vh"
        });
        // builds the board
        for(var i = 0; i < this.board.length - 1; i++){
console.log("length: " + this.board.length);
            for(var k = 0; k < this.board[i].length - 1; k++){
console.log("length[k]: " + this.board[k].length);
// console.log(""+i+k);
                $("#board").append($("<div> </div>").attr({
                    "id": ""+i+k,
                    "row": i,
                    "column": k
                }));
                $("#"+i+k).css({
                    "width": "16%",
                    "height": "15vh",
                    "background-color": "#00f",
                    "float": "left",
                    "border": "1px solid black"
                });
            }
        }
        // builds game info
        $('#info').append($("<div></div>").attr("id", "player_one"));
        $("#player_one").css({
            "width": "50%",
            "float": "left",
            "height": "auto",
            "background-color": "white"
        });
        $("#info").append($("<p>Name:</p>"));
        $("#info").append($("<textarea></textarea>").attr("id","player_one_name"));
        $("#info").append($("<button>Set name</button>").attr({
            "type":"button"
        }).css({
            "width": "50%",

        }));
    }
}

class Player {
    constructor(name){
        this.name = name;
    }
}

class Scoreboard {
    constructor(){
        
    }
}

class Token {
    constructor(){
        
    }

}