var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
// node.js && express
app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
});

app.get('/scripts.js', function(req,res){
    res.sendFile(__dirname + '/scripts.js');
});

http.listen(3000, function(){
    console.log('listening on localhost:3000');
});

// socket.io
var last_player = 0; //socket.id of last player
var players = [];
var players_colors = ['red', 'yellow'];
var board = [
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0]
];
var tokens = [
    {
        name: 'remover',
        description: 'When used, you can select a chip to be removed from the board.'
    },
    {
        name: 'skipper',
        description: 'Skips your oponents turn.'
    }
]

io.on('connection', function(socket){
    console.log('a user connected: ' + socket.id);
    var player = {
        id: socket.id,
        name: "player" + players.length,
        color: players_colors[players.length],
        points: 0,
        token: tokens[Math.floor(Math.random()*tokens.length)],
        used_token: false
    }
    players.push(player);
    console.log(players);
    //send scoreboard data
    io.emit('win', players);

    socket.on('player_name', function(name){
        var n_player = players.filter( (c_val, index) => {
            if(c_val.id = socket.id){
                players[index].name = name;
            }
        });
    });
    

    socket.on('turn', function(column){
        if(socket.id != last_player){
            
            //calculate in which row needs to be placed
            for(var i = board.length - 1; i >= 0;i--){
                if(board[i][column] == 0){
                    board[i][column] = player.color; // update board array
                    io.emit('refresh_board', ''+i+column, player.color);
                    console.log(board);
                    break; //once the first one is found that is it
                }
            }

            //horizontal check
            var current_value = null, previous_value = 0, counter = 0;
            for(var x = 0; x <= board.length - 1; x++){
                for(var y = 0; y <= board[x].length - 1; y++){
                    current_value = board[x][y];
                    if(current_value === previous_value && current_value !== 0){
                        counter += 1;
                    }else{
                        counter = 0;
                    }
                    if(counter === 3){
                        console.log(player.name + ' won!');
                        player.points += 1;
                        io.emit('win', players);
                        board = [
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0]
                        ];
                        break;
                    }
                    previous_value = current_value;
                }
                counter = 0;
                previous_value = 0;
            }

            //vertical check
            current_value = null, previous_value = 0, counter = 0;
            for(var x = 0; x <= board[0].length - 1; x++){ //board.length
                for(var y = 0; y <= board.length - 1; y++){ //board[x].length
                    current_value = board[y][x];
                    if(current_value === previous_value && current_value !== 0){
                        counter += 1;
                    }else{
                        counter = 0;
                    }
                    if(counter === 3){
                        console.log(player.name + ' won!');
                        player.points += 1;
                        io.emit('win', players);
                        board = [
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0]
                        ];
                        break;
                    }
                    previous_value = current_value;
                }
                counter = 0;
                previous_value = 0;
            }

            //diagonal check
            var x = null, y = null, xtemp = null, ytemp = null, current_value = null, previous_value = 0, counter = 0;
            for(x = 0; x <= board.length - 1; x++){
                xtemp = x;
                ytemp = 0;
                while(xtemp <= board.length - 1 && ytemp <= board[x].length - 1){
                    current_value = board[ytemp][xtemp];
                    if(current_value === previous_value && current_value != 0){
                        counter += 1;
                    }else{
                        counter = 0;
                    }
                    if(counter === 3){
                        console.log(player.name + ' won!');
                        player.points += 1;
                        io.emit('win', players);
                        board = [
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0]
                        ];
                        break;
                    }
                    previous_value = current_value;
                    xtemp++;
                    ytemp++;
                }
                counter = 0;
                previous_value = 0;
            }

            for(x = 0; x <= board[0].length - 1; x++){
                xtemp = x;
                ytemp = 0;

                while(0 <= xtemp && ytemp <= board.length - 1){
                    current_value = board[ytemp][xtemp];
                    if(current_value === previous_value && current_value !== 0){
                        counter += 1;
                    }else{
                        counter = 0;
                    }
                    if(counter === 3){
                        console.log(player.name + ' won!');
                        player.points += 1;
                        io.emit('win', players);
                        board = [
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0]
                        ];
                        break;
                    }
                    previous_value = current_value;
                    xtemp--;
                    ytemp++;
                }
                counter = 0;
                previous_value = 0;
            }

            for(y = 0; y <= board.length -1; y++){
                xtemp = 0;
                ytemp = y;
                while(xtemp <= board[0].length - 1 && ytemp <= board.length - 1){
                    current_value = board[ytemp][xtemp];
                    if(current_value === previous_value & current_value !== 0){
                        counter += 1;
                    }else{
                        counter = 0;
                    }
                    if(counter === 3){
                        console.log(player.name + ' won!');
                        player.points += 1;
                        io.emit('win', players);
                        board = [
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0]
                        ];
                        break;
                    }
                    previous_value = current_value;
                    xtemp++;
                    ytemp++;
                }
                counter = 0;
                previous_value = 0;
            }

            for(y = 0; y <= board.length - 1; y++){
                xtemp = board[0].length - 1;
                ytemp = y;
                while (0 <= xtemp && ytemp <= board.length - 1){
                    current_value = board[ytemp][xtemp];
                    if(current_value === previous_value && current_value !== 0){
                        counter += 1;
                    }else{
                        counter = 0;
                    }
                    if(counter === 3){
                        console.log(player.name + ' won!');
                        player.points += 1;
                        io.emit('win', players);
                        board = [
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0],
                            [0,0,0,0,0,0,0]
                        ];
                        break;
                    }
                    previous_value = current_value;
                    xtemp--;
                    ytemp++;
                }
                counter = 0;
                previous_value = 0;
            }
            //update player
            last_player = socket.id;
        }
    });

    socket.on('use_token', function(id){        
        var t_player = players.filter((c_val, index) => {
            if(c_val.id == socket.id){
                if(!c_val.used_token){
                    if(c_val.token.name == 'remover'){

                    }else if(c_val.token.name == 'skipper'){
                        
                    }
                }
            }
        }); 
    });

    socket.on('disconnect', function(){
        var s_out = players.filter( (c_val, index) => {
            if(c_val.id = socket.id){
                players.splice(index, 1);
                console.log(players);
            }
        });
    });
});