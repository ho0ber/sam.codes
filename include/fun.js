var q={};function aa(a){for(var b=[],c=0;c<a.q1-1;c++){row=[];for(var d=0;d<a.q2-1;d++)row.push(Math.ceil(Math.random()*a.q3));b.push(row)}a.q4=b;a.q5=0;return a}function bb(a,b){var c=a.q4[0][0];return b!=c?cc(a,c,b,0,0):a}function cc(a,b,c,d,e){0<=d&&d<a.q4[0].length&&0<=e&&e<a.q4.length&&a.q4[e][d]==b&&(a.q4[e][d]=c,a=cc(a,b,c,d+1,e),a=cc(a,b,c,d-1,e),a=cc(a,b,c,d,e+1),a=cc(a,b,c,d,e-1));return a}
function start_color_game(a){q.q2=25;q.q1=25;q.q3=5;a[0]&&0<a[0]&&1E3>a[0]&&(q.q2=a[0]);a[1]&&0<a[1]&&1E3>a[1]&&(q.q1=a[1]);a[2]&&0<a[2]&&10>a[2]&&(q.q3=a[2]);q=aa(q);ee(q);$(document).bind("keypress",dd)}function dd(a){input_char=String.fromCharCode(event.which);0<input_char&&input_char<=q.q3?(q.q5++,q=bb(q,input_char),ee(q)):"r"==input_char?(q=aa(q),ee(q)):"q"==input_char&&restart_command();return!1}
function ee(a){var b="",c=!0;a.q4.map(function(a){a.map(function(a){b+='<span class="c'+a+'"> '+a+"</span>";c&&(c=c==a||!0===c?a:!1)});b+="\n"});b+="\n  Moves: "+a.q5+"  [1-"+a.q3+"] play  [R] reset  [Q] quit";c&&(b+="\n\n  YOU WIN!");$("#console").html("\n"+b+"\n")};