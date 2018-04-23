var game = {}

function initialize_game(game) {
  var board = []
  for(var i=0; i<game["height"]-1; i++) {
    row = []
    for(var j=0; j<game["width"]-1; j++) {
      row.push(Math.ceil(Math.random()*game["colors"]))
    }
    board.push(row)
  }
  game["board"] = board
  game["count"] = 0
  return game
}

function take_turn(game, new_color) {
  var old_color = game["board"][0][0]
  if (new_color != old_color)
    return change_square(game, old_color, new_color, 0, 0)
  return game
}

function change_square(game, old_color, new_color, x, y) {
  if (x >= 0 && x < game["board"][0].length && y >= 0 && y < game["board"].length) {
    if (game["board"][y][x] == old_color) {
      game["board"][y][x] = new_color
      game = change_square(game, old_color, new_color, x+1, y)
      game = change_square(game, old_color, new_color, x-1, y)
      game = change_square(game, old_color, new_color, x, y+1)
      game = change_square(game, old_color, new_color, x, y-1)
    }
  }
  return game
}

function start_color_game(args) {
  game["width"] = 25
  game["height"] = 25
  game["colors"] = 5

  if (args[0] && args[0] > 0 && args[0] < 1000)
    game["width"] = args[0]

  if (args[1] && args[1] > 0 && args[1] < 1000)
    game["height"] = args[1]

  if (args[2] && args[2] > 0 && args[2] < 10)
    game["colors"] = args[2]

  game = initialize_game(game)
  print_board(game)

  $(document).bind('keypress', game_input)
}

function game_input(e) {
  input_char = String.fromCharCode(event.which);
  if (input_char > 0 && input_char <= game["colors"]) {
    game["count"]++
    game = take_turn(game, input_char)
    print_board(game)
    return false
  } else if (input_char == "r") {
    game = initialize_game(game)
    print_board(game)
  } else if (input_char == "q") {
    // Haven't quite figured this out yet. You get the lazy version!
    //$(document).unbind('keypress', game_input)
    // st = 0
    // clear_command()
    restart_command()
  }
  return false
}

function print_board(game) {
  var output = ""
  var last_color = true

  game["board"].map(function(row) {
    row.map(function(square) {
      output += '<span class="c'+square+'"> '+square+'</span>'
      if (last_color) {
        if (last_color == square || last_color === true)
          last_color = square
        else
          last_color = false
      }
    })
    output += "\n"
  })
  output += "\n  Moves: "+game["count"]+"  [1-"+game["colors"]+"] play  [R] reset  [Q] quit"
  if (last_color)
    output += "\n\n  YOU WIN!"
  $("#console").html('\n'+output+'\n')
}