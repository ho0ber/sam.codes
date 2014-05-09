// Eww! Globals!
var st = "";
var cur = 0;
var hist = [];
var histcurs = -1;
var st_temp = "";
var cd = [];

// Init the console
$(function() {
  cur = initial_commands(cur)
});

// Handle Backspace, Up, and Down keys
$(document).keydown(function(e) {
  if (e.which == 8) { // backspace
    st = st.substr(0,(st.length -1))
    $('#entry_'+cur).html(st);
    return false;
  } else if (e.which == 38) {
    if (histcurs == -1) {
      st_temp = st;
      histcurs = hist.length-1
    }
    else if (histcurs > 0)
      histcurs--

    st = hist[histcurs]
    $('#entry_'+cur).html(st);
    return false;
  } else if (e.which == 40) {
    if (histcurs >= hist.length -1) {
      histcurs = -1
      st = st_temp
    }
    else if (histcurs >= 0) {
      histcurs++
      st = hist[histcurs]
    }
    $('#entry_'+cur).html(st);
    return false;
  } else if (e.which == 13) { // enter
    $('#entry_'+cur).html(st+String.fromCharCode(e.which));
    cur = parse_entry(st, cur);
    st = "";
    window.scrollTo(0,document.body.scrollHeight);
    return false;
  } else if (e.which == 9) { // tab
    return false;
  }
});

// Handle normal, printable keys
$(document).keypress(function(e) {
  st += String.fromCharCode(e.which);
  $('#entry_'+cur).html(st);
});

// Run a handful of initial commands
function initial_commands(cursor) {
  cursor = run_command("whoami", cursor)
  cursor = run_command("git config --get user.email", cursor)
  cursor = run_command("echo $HOME", cursor)
  cursor = run_command("jobs", cursor)
  cursor = run_command("history", cursor)
  cursor = run_command("ls", cursor)
  cursor = run_command("cat bookmarks.htm", cursor)
  cursor = run_command("cat credit.htm", cursor)
  cursor = run_command("gui --help", cursor)
  return cursor
}

// Run a caommand as if it was typed in
function run_command(input, cursor) {
  $('#entry_'+cursor).html(input+'\n');
  return parse_entry(input, cursor)
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
    case "clear":
      response = "";
      $("#console").html('$ <span id="entry_0"></span><span class="blink_me">_</span>')
      cur = 0;
      return 0;
    case "restart":
      window.location.reload()
      return 0;
    case "gui":
      window.location.href = 'gui';
      return 0;
    case "gui --help":
      response = access_content(".bin/gui", "gui").content
      break;
    case "exit":
      var win = window.open('', '_self');
      window.close();
      win.close();
       // Just in case the above fails to work...
      return run_command("clear", cursor);
    case "ls":
      response = Object.keys(CONTENT).map(function(e) { if (e[0] != ".") return e }).join("  ")+"\n\n";
      break;
    case "ls -a":
      response = Object.keys(CONTENT).join("  ")+"\n\n";
      break;
    case "whoami":
      response = access_content(".bin/whoami", "whoami").content
      break;
    // case "help":
    //   response = access_content(".bin/help", "help").content
    //   break;
    case "history":
      response = access_content(".bin/history", "history").content
      break;
    case "jobs":
      response = access_content(".bin/jobs", "jobs").content
      break;
    case "git config --get user.email":
      response = '<a href="mailto:samuel.colburn@gmail.com">samuel.colburn@gmail.com</a>\n\n';
      break;
    case "pwd":
      response = '/'+cd.join('/')+'\n';
      break;
    case "sudo rm -rf /":
      die_horribly()
      break;
    case "reset":
      cursor = run_command("clear", cursor)
      cursor = initial_commands(cursor)
      return cursor;
  }

  switch (input_arr[0]) {
    case "cat":
      response = cat_command(input_arr.splice(1));
      break;
    case "execute":
      response = execute_command(input_arr.splice(1));
      break;
    case "ls":
      response = ls_command(input_arr.splice(1));
      break;
    case "cd":
      response = cd_command(input_arr.splice(1));
      break;
    case "echo":
      response = echo_command(input_arr.splice(1));
      break;
  }

  if (response === "ERROR\n")
    response = check_for_executable(input_arr, input)


  newcur = cursor + 1
  $('#entry_'+cursor).after( '<span class="response" id="response_'+cursor+'">'+response+'</span>' )
  $('#response_'+cursor).after( '$ <span class="entry" id="entry_' + newcur + '">')
  return newcur
}

function check_for_executable(input_arr, input) {
  executable_path = input_arr[0].split('/')
  executable = executable_path.pop()
  executable_path = executable_path.join("/")

  if (executable in access_content(executable_path,""))
    return execute_command([input_arr[0]])
  else if ((input_arr[0].indexOf("/") == -1) && (input_arr[0] in access_content("/.bin/","")))
    return execute_command(["/.bin/"+input_arr[0]])
  else {
    if (input_arr[0].indexOf("/") == -1)
      return "command not found: "+input+"\n\n"
    else
      return input+": No such file or directory\n\n"
  }
}

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

function execute_command(args) {
  if (args.length > 0) {
    result = access_content(args[0], "execute")
    if (typeof(result) === "string")
      return result
    if ("executable" in result) {
      if (result.executable === true)
        return result.content
      return eval(result.executable)()
    }
    if ("content" in result)
      return "execute: "+args[0]+": Is not executable\n"
    return "execute: "+args[0]+": Is a directory\n"
  }
  return "execute: pipe is clogged\n"
}

function echo_command(args) {
  keys = Object.keys(ENV_VARS)
  input = args.join(" ")
  keys.map(function(key) {
    input = replace_all(key, ENV_VARS[key], input);
  });
  input = input.replace('"','').replace("'","")
  return input+"\n\n"
}

function replace_all(find, replace, str) {
  return str.replace(new RegExp(escape_reg_exp(find), 'g'), replace);
}

function escape_reg_exp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
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
  // else
  //   keys = [".", ".."].concat(keys)

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

function riddle() {
  return "THIS IS A RIDDLE!!\n\n"
}
