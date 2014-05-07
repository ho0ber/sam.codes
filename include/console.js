var st = "";
var cur = 0;
var hist = [];
var histcurs = -1;
var st_temp = "";

$(function() {
  cur = initial_commands(cur)
});

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
  }
});

$(document).keypress(function(e) {
  if (e.which == 13) { // enter
    $('#entry_'+cur).html(st+String.fromCharCode(e.which));
    cur = parse_entry(st, cur)
    st = ""
    window.scrollTo(0,document.body.scrollHeight);
  } else {
    st += String.fromCharCode(e.which);
    $('#entry_'+cur).html(st);
  }
});

function initial_commands(cursor) {
  cursor = run_command("whoami", cursor)
  cursor = run_command("git config --get user.email", cursor)
  cursor = run_command("echo $HOME", cursor)
  cursor = run_command("jobs", cursor)
  cursor = run_command("history", cursor)
  cursor = run_command("ls", cursor)
  cursor = run_command("cat bookmarks.htm", cursor)
  cursor = run_command("cat credit.htm", cursor)
  return cursor
}

function run_command(input, cursor) {
  $('#entry_'+cursor).html(input+'\n');
  return parse_entry(input, cursor)
}

function parse_entry(input, cursor) {
  if (input != "") hist.push(input)
  histcurs = -1

  var response = "command not found: "+input+"\n\n"
  input_arr = input.split(" ")
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
    case "exit":
      window.close();
      return 0;
    case "ls":
      response = Object.keys(CONTENT).map(function(e) { if (e[0] != ".") return e }).join("  ")+"\n\n";
      break;
    case "ls -a":
      response = Object.keys(CONTENT).join("  ")+"\n\n";
      break;
    case "whoami":
      response = access_content(".hidden/whoami", "whoami")
      break;
    case "help":
      response = access_content(".hidden/help", "help")
      break;
    case "history":
      response = access_content(".hidden/history", "history")
      break;
    case "jobs":
      response = access_content(".hidden/jobs", "jobs")
      break;
    case "git config --get user.email":
      response = '<a href="mailto:samuel.colburn@gmail.com">samuel.colburn@gmail.com</a>\n\n';
      break;
    case "echo $HOME":
      response = '/USA/Massachusetts/Greater Boston Area/Mansfield\n\n';
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
    case "ls":
      response = ls_command(input_arr.splice(1));
      break;
  }

  newcur = cursor + 1
  $('#entry_'+cursor).after( '<span class="response" id="response_'+cursor+'">'+response+'</span>' )
  $('#response_'+cursor).after( '$ <span class="entry" id="entry_' + newcur + '">')
  return newcur
}

function cat_command(args) {
  if (args.length > 0) {
    return access_content(args[0], "cat")
  }
  return "cat: pipe is clogged\n"
}

function ls_command(args) {
  if (args.length == 0)
    return Object.keys(CONTENT).map(function(e) { if (e[0] != ".") return e }).join("  ")+"\n\n";
  else if (args.length > 0) {
    var flags = ""
    var path = ""
    for (var i=0; i<args.length; i++) {
      if (args[i][0] == "-") {
        flags = args[i]
      } else {
        path = args[i]
      }
    }
    return Object.keys(access_content_object(path, "ls")).map(function(e) { if (e[0] != ".") return e }).join("  ")+"\n\n";
  }
}

function access_content(path_string, command) {
  var path = path_string.split("/")
  var object = CONTENT
  for (var i=0; i<path.length; i++) {
    key = path[i]
    if (key in object)
      object = object[key]
    else
      return command+": "+path_string+": No such file or directory\n"
  }
  return object.content
}

function access_content_object(path_string, command) {
  var path = path_string.split("/")
  var object = CONTENT
  for (var i=0; i<path.length; i++) {
    key = path[i]
    if (key in object)
      object = object[key]
    else
      return command+": "+path_string+": No such file or directory\n"
  }
  return object
}
