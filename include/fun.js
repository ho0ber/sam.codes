var game = {}

function initialize_game(width, height, max_colors) {
  var board = []
  for(var i=0; i<height-1; i++) {
    row = []
    for(var j=0; j<width-1; j++) {
      row.push(Math.ceil(Math.random()*max_colors))
    }
    board.push(row)
  }
  game["board"] = board
  game["count"] = 0
  return game
}

function take_turn(game, new_color) {
  old_color = game["board"][0][0]
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
  game = initialize_game(25, 25, 5)
  print_board(game)

  $(document).bind('keypress', game_input)
}

function game_input(e) {
  input_char = String.fromCharCode(event.which);
  if (input_char > 0 && input_char <= 5) {
    game["count"]++
    game = take_turn(game, input_char)
    print_board(game)
    return false
  } else if (input_char == "r") {
    game = initialize_game(25, 25, 5)
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
      output += '<span class="c'+square+'""> '+square+'</span>'
      if (last_color) {
        if (last_color == square || last_color === true)
          last_color = square
        else
          last_color = false
      }
    })
    output += "\n"
  })
  output += "\n  Moves: "+game["count"]+"  [R] to reset, [Q] to quit"
  if (last_color)
    output += "\n\n  YOU WIN!"
  $("#console").html('\n'+output+'\n')
}