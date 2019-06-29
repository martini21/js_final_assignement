var board = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
];

var socket;

var token_set = false;

$(document).ready( () => {
    socket = io();
    build_gui();

    socket.on('turn', function(column){
        console.log(column);
    });

    socket.on('refresh_board', function(position, color){
        console.log(position);
        console.log(color);
        $('#'+position).css({
            'background-color': color
        });
    });

    socket.on('msg', function(val){
        console.log(val);
    });

    // TODO: update token info (also in server)
    socket.on('win', function(players){
        $('#scoreboard').html('<h3>Scoreboard</h3>')
        $('#token_name').html('');
        $('#token_desc').html('');
        for(var i = 0; i < players.length; i++){
            $('#scoreboard').append('<p>'+ players[i].name +': '+ players[i].points + '</p>')
            // $('#token_name').append($('<p>' + players[i].token.name + '</p>'));
            // $('#token_desc').append($('<p>' + players[i].token.description + '</p>'));
        }
        $('#token_name').append($('<p>' + players[0].token.name + '</p>'));
            $('#token_desc').append($('<p>' + players[0].token.description + '</p>'));

        for(var i = 0; i < board.length; i++){
            for(var k = 0; k < board[i].length; k++){
                $('#'+i+k).css('background-color', 'white');
            }
        }

    });
});

function build_gui(){
    // where the board will be
    $("body").append($("<div></div>").attr("id", "board"));
    $("#board").css({
        "background-color": "blue",
        "float": "left",
        "width": "70%",
        "padding":"2.5%",
        "height": "auto"
    });
    // where the game info will be
    $("body").append($("<div></div>").attr("id", "info"));
    $("#info").css({
        "background-color": "DarkOliveGreen",
        "float": "left",
        "width": "20%",
        "height": "auto",
        "padding":"2.5%",
    });
    // builds the board
    for(var i = 0; i < board.length; i++){
        for(var k = 0; k < board[i].length; k++){
            $("#board").append($("<div></div>").attr({
                "id": ""+i+k,
                "row": i,
                "column": k
            }));
            $("#"+i+k).css({
                "width": "14%",
                "height": "15vh",
                "background-color": "white",
                "float": "left",
                "border": "1px solid black"
            });

            $('#'+i+k).click({column: k, id: ''+i+k},function(event){
                //check if token is not set
                if(token_set){
                    socket.emit('use_token', event.data.id);
                    token_set = false;
                }else{
                    socket.emit('turn',event.data.column);
                }
            });
        }
    }
    // builds player info
    $('#info').append($("<div></div>").attr("id", "player_name"));
    $("#player_name").css({
        "background-color": "white",
        "width": "95%",
        "padding":"2.5%",
        "float": "left",
        "height": "auto",
        "border": "1px solid black"
    });
    $("#player_name").append($("<p>Name:</p>"));
    $("#player_name").append($("<textarea></textarea>").attr("id","player_name_ta"));
    $("#player_name_ta").css("width", "95%");
    $("#player_name").append($("<button>Set name</button>").attr({
        "type":"button",
        "id": "player_set_name"
    }).css({
        "width": "97.5%"
    }));
    $('#player_set_name').click(function(){
        var name = $('#player_name_ta').val();
        socket.emit('player_name', name);
    });

    $('#info').append($('<div><h3>Scoreboard</h3></div>').attr('id', 'scoreboard'));
    $('#scoreboard').css({
        'margin-top': '2.5%',
        'padding': '2.5%',
        'width': '95%',
        'float': 'left',
        'height': 'auto',
        'border': '1px solid black',
        'background-color': 'white'
    });

    // build token
    $('#info').append($('<div><h3>Token</h3></div>').attr('id','token'));
    $('#token').css({
        'margin-top': '2.5%',
        'padding': '2.5%',
        'width': '95%',
        'float': 'left',
        'height': 'auto',
        'border': '1px solid black',
        'background-color': 'white'
    });
    $('#token').append($('<p><b>Name:</b></p>'));
    $('#token').append($('<div></div>').attr('id', 'token_name'));
    $('#token_name').css({
        'width': '95%'
    });
    $('#token').append($('<p><b>Description:</b></p>'));
    $('#token').append($('<div></div>').attr('id', 'token_desc'));
    $('#token_desc').css({
        'width': '95%'
    });
    $('#token').append($('<button>Use token</button>').attr({
        "type":"button",
        "id": "use_token"
    }).css({
        "width": "97.5%"
    }));
    $('#use_token').click(function(){
        token_set = true;
    });
}