var st = "";
var cur = 0;
var hist = ["whoami", "git config --get user.email", "echo $HOME", "history", "ls", "cat bookmarks.htm", "cat credit.htm"];
var histcurs = -1;
var st_temp = "";

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
    newcur = cur + 1
    cur = parse_entry(newcur)
    st = ""
    window.scrollTo(0,document.body.scrollHeight);
  } else {
    st += String.fromCharCode(e.which);
    $('#entry_'+cur).html(st);
  }
});

function parse_entry(newcur) {
  if (st != "") hist.push(st)
  console.log(hist)
  histcurs = -1

  var response = "command not found: "+st+"\n\n"
  st_arr = st.split(" ")
  if (st_arr[0] == "git") response = "git: access denied for: "+st_arr.splice(1).join(" ")+'\n\n'

  switch(st) {
    case "":
      response = "";
      break;
    case "clear":
      response = "";
      $("#console").html('$ <span id="entry_0"></span><span class="blink_me">_</span>')
      cur = 0
      break;
    case "restart":
      window.location.reload()
      return 0
    case "exit":
      window.close();
      return 0
    case "whoami":
      response = "Samuel Colburn\n\n";
      break;
    case "history":
      response = "    1985  was born\n    1985  resided in Plainfield, NH\n    1992  started programming in BASIC\n    1995  built first website\n    2000  released first electronica album\n    2003  released second electronica album\n    2003  started computer science studies at Bucknell University\n    2007  released third electronica album\n    2008  moved to Keene, NH\n    2011  moved to Mansfield, MA\n    2013  voiced a part in an Audible.com audiobook\n\n"
      break;
    case "git config --get user.email":
      response = '<a href="mailto:samuel.colburn@gmail.com">samuel.colburn@gmail.com</a>\n\n';
      break;
  }

  if (st != "clear") {
    $('#entry_'+cur).after( '<span class="response" id="response_'+cur+'">'+response+'</span>' )
    $('#response_'+cur).after( '$ <span class="entry" id="entry_' + newcur + '">')
    return newcur
  }
  return 0
}
