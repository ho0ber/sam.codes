// Oh goodness, please don't actually look at this code.
//
// It is completely miserable, as it was sprinted together in a very short
// amount of time.


// Eww! Globals!
var st = "";
var cur = 0;
var hist = [];
var histcurs = -1;
var st_temp = "";
var cd = [];
var cursor_offset = 0;

// Init the console
$(function() {
  cur = initial_commands(cur)

  var hash_commands = window.location.hash.slice(1).split(";").filter(function(n){ return n != "" })
  hash_commands.map(function(command) {
    cur = run_command(command, cur);
  });
  if (hash_commands.length > 0) {
    update_input(cur, st, cursor_offset);
    window.scrollTo(0,document.body.scrollHeight);
  }
});

// Handle "special" keys:
//  backspace
//  up
//  down
//  left
//  right
//  enter
//  tab
$(document).keydown(function(e) {
  if (e.which == 8) { // backspace
    st = remove_letter(st, cursor_offset);
    update_input(cur, st, cursor_offset);
    return false;
  } else if (e.which == 38) { // up
    if (histcurs == -1) {
      st_temp = st;
      histcurs = hist.length-1
      cursor_offset = 0
      st = hist[histcurs]
    }
    else if (histcurs > 0) {
      histcurs--
      cursor_offset = 0
      st = hist[histcurs]
    }

    update_input(cur, st, cursor_offset);
    return false;
  } else if (e.which == 40) { // down
    if (histcurs >= hist.length -1) {
      histcurs = -1
      st = st_temp
      cursor_offset = 0
    }
    else if (histcurs >= 0) {
      histcurs++
      st = hist[histcurs]
      cursor_offset = 0
    }
    update_input(cur, st, cursor_offset);
    return false;
  } else if (e.which == 37) { // left
    if (cursor_offset <= st.length) {
      cursor_offset++
    }
    update_input(cur, st, cursor_offset);
    return false;
  } else if (e.which == 39) { // right
    if (cursor_offset > 0) {
      cursor_offset--
    }
    update_input(cur, st, cursor_offset);
    return false;
  } else if (e.which == 13) { // enter
    $('#entry_'+cur).html(st+String.fromCharCode(e.which));
    cur = parse_entry(st, cur);
    st = "";
    cursor_offset = 0;
    update_input(cur, st, cursor_offset);
    window.scrollTo(0,document.body.scrollHeight);
    return false;
  } else if (e.which == 9) { // tab
    return false;
  }
});

// Handle normal, printable keys
$(document).keypress(function(e) {
  st = insert_letter(e, st, cursor_offset);
  update_input(cur, st, cursor_offset);
});

// Run a handful of initial commands
function initial_commands(cursor) {
  cursor = run_command("whoami", cursor)
  cursor = run_command("git config --get user.email", cursor)
  cursor = run_command("echo $HOME", cursor)
  cursor = run_command("echo $PATH", cursor)
  cursor = run_command("jobs", cursor)
  cursor = run_command("history", cursor)
  cursor = run_command("ls", cursor)
  cursor = run_command("cat bookmarks.htm", cursor)
  cursor = run_command("cat credit.htm", cursor)
  cursor = run_command("gui --help", cursor)
  update_input(cursor, st, cursor_offset);
  return cursor
}

// Calculate the input field's HTML including the cursor
function calc_cursor(text, cursor) {
  if (cursor == 0)
    return text + '<span class="blink_me">_</span>';

  cursor_loc = text.length - cursor;
  cursor_char = text.charAt(cursor_loc);
  cursor_html = '<span class="blink_me"><u>' + cursor_char + '</u></span>'
  return text.slice(0,cursor_loc) + cursor_html + text.slice(cursor_loc + 1)
}

// Insert a letter in the input field at the cursor
function insert_letter(event, text, cursor) {
  new_char = String.fromCharCode(event.which);
  cursor_loc = text.length - cursor;
  return text.slice(0,cursor_loc) + new_char + text.slice(cursor_loc);
}

// Remove a letter from the input field at the cursor
function remove_letter(text, cursor) {
  cursor_loc = text.length - cursor;
  if (cursor_loc == 0)
    return text;
  return text.slice(0,cursor_loc - 1) + text.slice(cursor_loc);
}

// Update the display of the input field
function update_input(current, text, cursor) {
  $('#entry_'+current).html(calc_cursor(text, cursor));
}

// Run a caommand as if it was typed in
function run_command(input, cursor) {
  $('#entry_'+cursor).html(input+'\n');
  return parse_entry(input, cursor);
}

// Parse input from the console
function parse_entry(input, cursor) {
  if (input != "") hist.push(input)
  histcurs = -1

  var response = "ERROR\n"
  input_arr = input.split(" ").filter(function(n){ return n != "" })
  if (input_arr[0] == "git") response = "git: access denied for: "+input_arr.splice(1).join(" ")+'\n\n'

  switch(input) {
    case "":
      response = "";
      break;
    case "git config --get user.email":
      response = '<a href="mailto:samuel.colburn@gmail.com">samuel.colburn@gmail.com</a>\n\n';
      break;
    case "sudo rm -rf /":
      die_horribly()
      break;
  }

  if (response === "ERROR\n")
    response = check_for_executable(input_arr, input)

  if (response == "##CLEAR##")
    return cur

  newcur = cursor + 1
  $('#entry_'+cursor).after( '<span class="response" id="response_'+cursor+'">'+response+'</span>' )
  $('#response_'+cursor).after( '$ <span class="entry" id="entry_' + newcur + '">')
  return newcur
}

// Checks for executables with the given path in the "path"
function check_for_executable(input_arr, input) {
  executable_path = input_arr[0].split('/')
  executable = executable_path.pop()
  executable_path = executable_path.join("/")
  if (executable in access_content(executable_path,""))
    return execute_command(input_arr)
  else if ((input_arr[0].indexOf("/") == -1) && (input_arr[0] in access_content("/.bin/",""))) {
    input_arr[0] = "/.bin/"+input_arr[0]
    return execute_command(input_arr)
  } else {
    if (input_arr[0].indexOf("/") == -1)
      return "command not found: "+input+"\n\n"
    else
      return input+": No such file or directory\n\n"
  }
}

// Access nested content in content.js
function access_content(path_string, command) {
  var path = path_string.split("/")
  if (path_string[0] != "/") {
    path = cd.concat(path)
  }

  path = path.filter(function(n){ return n != "." })

  for(var i=0; i<path.length-1; i++) {
    if (path[i] == "..") {
      path[i] = "";
      if (i > 0)
        path[i-i] = "";
    }
  }

  path = path.filter(function(n){ return n != "" })
  var object = CONTENT
  path.map(function(key) {
    if (key in object)
      object = object[key]
    else
      object = { error: command+": "+path_string+": No such file or directory\n" }
  });
  return object
}



// COMMAND FUNCTIONS

// Handle 'cat' command calls
function cat_command(args) {
  if (args.length > 0) {
    result = access_content(args[0], "cat")
    if (typeof(result) === "string")
      return result
    if ("executable" in result)
      return "cat: "+args[0]+": Cannot be displayed\n"
    if ("content" in result)
      return result.content
    return "cat: "+args[0]+": Is a directory\n"
  }
  return "cat: pipe is clogged\n"
}

// Handle 'execute' command and any executables
function execute_command(args) {
  if (args.length > 0) {
    result = access_content(args[0], "execute")
    if (typeof(result) === "string")
      return result
    if ("executable" in result) {
      if (result.executable === true)
        return result.content
      return eval(result.executable)
    }
    if ("content" in result)
      return "execute: "+args[0]+": Is not executable\n"
    return "execute: "+args[0]+": Is a directory\n"
  }
  return "execute: pipe is clogged\n"
}

// Handle 'echo' command
function echo_command(args) {
  keys = Object.keys(ENV_VARS)
  input = args.join(" ")
  keys.map(function(key) {
    input = replace_all(key, ENV_VARS[key], input);
  });
  input = input.replace('"','').replace("'","")
  return input+"\n\n"
}

// Handle 'cd' command calls
function cd_command(args) {
  if (args.length == 0) {
    cd = [];
    return ""
  }
  else {
    if (args[0] == "/" || args[0] == "~") {
      cd = [];
      return ""
    }
    if (args[0] == "..") {
      cd.pop();
      return ""
    }
    if (args[0] == ".") {
      return ""
    }
    result = access_content(args[0], "cd")
    if ("error" in result) return result.error
    if ("executable" in result) return "cd: "+args[0]+": Is not a directory\n"
    if ("content" in result) return "cd: "+args[0]+": Is not a directory\n"
    cd = args[0].split("/").filter(function(n){ return n != "" })
    return ""
  }
}

// Handle 'ls' command calls
function ls_command(args) {
  var flags = ""
  var path = ""
  args.map(function(arg) {
    if (arg[0] == "-") {
      flags = arg.split('')
    } else {
      path = arg
    }
  });

  result = access_content(path, "ls")
  if ("error" in result)
    return result.error

  keys = Object.keys(result).sort()

  if (flags.indexOf('a') < 0)
    keys = keys.filter(function(n) { return n[0] != "." })

  if (flags.indexOf('F') >= 0)
    keys = keys.map(function(key) {
      if (!("executable" in result[key]) && !("content" in result[key]))
        return key+"/";
      return key
    })

  if (flags.indexOf('l') >= 0)
    return keys.map(function(key) {
      key = key.replace("/","")
      if ("executable" in result[key]) return "-rwxr-xr-x  sam  "+key
      if ("content" in result[key]) return "-rw-r--r--  sam  "+key
      if (flags.indexOf('F') > 0)
        return "drw-r--r--  sam  "+key+'/'
      return "drw-r--r--  sam  "+key
    }).join('\n')+"\n\n";
  else
    return keys.join("  ")+"\n\n";
}

// Handles the 'sudo rm -rf /' command
function die_horribly() {
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !@#$%^&*()_+-=[]{}|;:,<.>/?";
  var blinders = ["10", "13", "08"]
  var text
  var addtext
  var addchar
  $("#console").html('<span class="blind_me"></span>')
   for( var j=0; j < 100; j++ ) {
    text = ""
    for( var i=0; i < Math.floor(Math.random() * 500)+100; i++ ) {
      addtext = ""
      addchar = possible.charAt(Math.floor(Math.random() * possible.length))
      if (addchar != '\n')
        addtext += '<span class="blind_me_'+blinders[Math.floor(Math.random() * blinders.length)]+'">'+possible.charAt(Math.floor(Math.random() * possible.length))+'</span>'
      else
        addtext += addchar
      text += addtext;
    }
    $(".blind_me").last().after('<span class="blind_me">'+text+'\n</span>')
  }
}

// Handles the 'riddle' executable
function riddle_command() {
  return "THIS IS A RIDDLE!!\n\n"
}

// Handles the 'pwd' command
function pwd_command() {
  return '/'+cd.join('/')+'\n';
}

// Handles the 'gui' command
function gui_command(args) {
  if (args.length == 1)
    window.location.href = 'http://samuelcolburn.com/gui';
  else if (args.length == 2 && args[1] == "--help")
    return 'gui: loads the <a href="http://samuelcolburn.com/gui">graphical version of this website</a>\n\n';
  else
    return 'gui: unknown arguments: '+args.join(" ")
}

// Handles the 'exit' command
function exit_command() {
  var win = window.open('', '_self');
  window.close();
  win.close();
   // Just in case the above fails to work...
  return run_command("clear", cursor);
}

// Handles the 'clear' command
function clear_command() {
  $("#console").html('$ <span id="entry_0"></span>')
  cur = 0;
  return "##CLEAR##";
}

// Handles the 'reset' command
function reset_command() {
  $("#console").html('$ <span id="entry_0"></span>')
  cur = initial_commands(0)
  return "##CLEAR##";
}

// Handles the 'restart' command
function restart_command() {
  window.location.hash = "";
  window.location.reload();
}

// HELPER FUNCTIONS

function replace_all(find, replace, str) {
  return str.replace(new RegExp(escape_reg_exp(find), 'g'), replace);
}

function escape_reg_exp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

