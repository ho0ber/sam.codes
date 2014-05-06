var st = "";
var cur = 0;

$(document).keydown(function(e) {
  if (e.which == 8) { // backspace
    st = st.substr(0,(st.length -1))
    $('#entry_'+cur).html(st);
    return false;
  }
});

$(document).keypress(function(e) {
  if (e.which == 13) { // enterte
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
    case "whoami":
      response = "Samuel Colburn\n\n";
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
