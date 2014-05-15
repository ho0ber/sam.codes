function initialize_board(width, height, max_colors) {
  board = []
  for(var i=0; i<height-1; i++) {
    row = []
    for(var j=0; j<width-1; j++) {
      row.push(Math.ceil(Math.random()*max_colors))
    }
    board.push(row)
  }
  return board
}

function take_turn(board, new_color) {
  old_color = board[0][0]
  if (new_color != old_color)
    return change_square(board, old_color, new_color, 0, 0)
  return board
}

function change_square(board, old_color, new_color, x, y) {
  if (x >= 0 && x < board[0].length && y >= 0 && y < board.length) {
    if (board[y][x] == old_color) {
      board[y][x] = new_color
      board = change_square(board, old_color, new_color, x+1, y)
      board = change_square(board, old_color, new_color, x-1, y)
      board = change_square(board, old_color, new_color, x, y+1)
      board = change_square(board, old_color, new_color, x, y-1)
    }
  }
  return board
}

function start_color_game(args) {

  board = initialize_board(25, 25, 5)
  print_board(board)

  $(document).bind('keypress', game_input)
}

function game_input(e) {
  input_char = String.fromCharCode(event.which);
  if (input_char > 0 && input_char <= 5) {
    board = take_turn(board, input_char)
    print_board(board)
    return false
  } else if (input_char == "r") {
    board = initialize_board(25, 25, 5)
    print_board(board)
  } else if (input_char == "q") {
    // Haven't quite figured this out yet. You get the lazy version!
    //$(document).unbind('keypress', game_input)
    // st = 0
    // clear_command()
    window.location.reload()
  }
  return false
}

function print_board(board) {
  output = ""
  board.map(function(row) {
    row.map(function(square) {
      output += '<span class="c'+square+'""> '+square+'</span>'
    })
    output += "\n"
  })
  $("#console").html('\n'+output+'\n')
}