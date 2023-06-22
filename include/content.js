var CONTENT = {
  "bookmarks.htm": {
    content: `
<a href="https://blog.sam.codes">https://blog.sam.codes</a>
<a href="http://www.linkedin.com/in/samuelcolburn">http://www.linkedin.com/in/samuelcolburn</a>
<a href="https://github.com/ho0ber" class="highlight">https://github.com/ho0ber</a>
`
  },
  "credit.htm": {
    content: 'Inspired by and adapted from the website of <a href="http://jonasferry.com/">Jonas Ferry</a>\n\n'
  },
  "README": {
    content: `Welcome!

This is the Ho0berShell: a totally useless, inconsistent, and highly opinionated "shell".
Its opinions are mostly related to cats.

Type help to list commands.

`
  },
  "info": {
    "about": {
      content: `
<b>The Basics</b>
I am a professional software developer, freelance voice actor, technology enthusiast, amateur musician, 
geek, gamer, and ham. I work full-time remotely in tech and live in in Norton, MA with my spouse, Val.

<b>Technology</b>
I have been programming since I was under eight years old. My father, who has been working in the software
industry since I was born, taught me the basics early on an old Apple II, and also set me loose in TrueBASIC
on our Macintosh SE/30. I have been programming ever since, and in spite of the fact that I write code for
a living, I still find myself working on side-projects constantly.

<b>Voice</b>
In high school, I made use of my newfound deep voice to play a wide variety of roles in over a dozen
theatrical productions. In spite of deciding to go to college for computer science rather than theatre
or communications, I never lost the passion for performance. Recently, I have had more chances to take 
advantage of my talents, and I hope to continue voice acting on the side.

<b>Music</b>
Another major discovery of mine in high school was that of electronic music composition. The school had
a state of the art recording studio, complete with a number of midi keyboards and hardware sythesizers.
Since I started highschool, I've been slowly composing electronic music over the years, totaling roughly
three albums.

`
    },
  "technology": {
    content: "\n<b>Rant</b>\nI love technology. Among my many passions, it is likely foremost.\n\nI love technology for technology's sake; projects that exist only to see what can be done with technology. I often find myself learning a new language or infrastructure simply because I want to see what it might enable me to create. This passion has led me to develop personal projects in everything from Bash to Node.js, and to work professionally in everything from JavaScript to COBOL.\n\nI also love technology for the ways it can impact the lives of people; even the simplest pieces of technology can make a huge difference in the lives of its users. Under an hour of development to create a simple bar-code scanner emulator has enabled several of my coworkers to stop fighting over the one scanner they had access to, and has allowed them to work from home when they would have previously been unable. Five minutes of development to create a script that blocks the \"F11\" key unless you press and hold has potentially saved a different coworker's sanity.\n\nBeing a software developer, to me, is primarily about seeing \"the gap\". Not the clothing retailer, of course; \"the gap\" is that hole in a person's daily life that could be simplified and enriched by technology. The above examples are just that: I found a gap in my coworkers' workflow and I knew I could do something about it.\n\n\n<b>What I do</b>\nProfessionally, I write code in Ruby, Python, Scala, and JS in the web job-search industry. In my free time, I've been workingon a number of side and freelance projects using a bunch of really cool open source bleeding edge stuff.\n\nA large amount of my quick one-offs at my last job were done using <a href=\"http://www.autohotkey.com/\">AutoHotKey</a>. Thisdeceptively simple scripting language is extremely useful for the rapid development of automation and other simple scripts in Windows. My projects in AHK tend to be very small, and are often just one piece in a larger automation puzzle; think of it as windows batch fileson steroids.\n\nFor relatively obvious reasons, as pretty much any geek spends some time on the internet, a lot of my hobby or side work has been in webtechnologies. This started with PHP in a classic LAMP environment, but eventually expanded to doing some clever stuff with AJAX, some heavily client-side javascript oriented projects (including a completely terrible game), and eventually leading me to dabble in more powerful web application frameworks. Most recently, I've been developing in <a href=\"http://nodejs.org/\">Node.js</a> for a <a href=\"/SidDB\">freelance web application</a> I'm building.\n\nIn general, I enjoy working in whatever seems to be the best technology for a given project. If that means learning a new language orframework, then I'm twice as excited to get started. I'm constantly trying to expand my repertoire, and I enjoy learning new technologiesmore than almost any other pastime.\n\n"
  }
  },
  ".bin": {
    "history": {
      content: `
    1985  was born
    1985  resided in Plainfield, NH
    1992  started programming in BASIC
    1995  built first website
    2000  released first electronica album
    2003  released second electronica album
    2003  started computer science studies at Bucknell University
    2007  released third electronica album
    2008  moved to Keene, NH
    2012  moved to Mansfield, MA
    2013  voiced a part in an Audible.com audiobook
    2020  moved to Norton, MA
`,
      executable: true
    },
    "help": {
      content: `
Ho0berShell Commands: (Partial list)
 cat
 cd
 clear
 exit
 help
 ls
 pwd
 reset
 restart
`,
      executable: true
    },
    "whoami": {
      content: "Samuel Colburn\n\n",
      executable: true
    },
    "jobs": {
      content: `
[5]  2019  &#60;Running&#62;  Director of Engineering at EverQuote
[5]  2018  &#60;Stopped&#62;  Director of Engineering at HopJump
[4]  2017  &#60;Stopped&#62;  Director of Engineering at Cognius
[4]  2015  &#60;Stopped&#62;  Lead Software Engineer at Cognius
[4]  2015  &#60;Stopped&#62;  Senior Software Engineer at Cognius
[4]  2013  &#60;Stopped&#62;  Software Engineer at Cognius
[3]  2011  &#60;Stopped&#62;  Development Programmer at MEDITECH
[2]  2008  &#60;Stopped&#62;  Programmer/Analyst at C&S Wholesale Grocers
[1]  2006  &#60;Stopped&#62;  PHP Programmer at NinthVector
`,
      executable: true
    },
    "pwd": {
      executable: "pwd_command()"
    },
    "restart": {
      executable: "restart_command()"
    },
    "exit": {
      executable: "exit_command()"
    },
    "chat": {
      executable: "maya()"
    },
    "clear": {
      executable: "clear_command()"
    },
    "reset": {
      executable: "reset_command()"
    },
//     "gui": {
//       executable: "gui_command(args)"
//     },
    "cat": {
      executable: "cat_command(args.splice(1))"
    },
    "execute": {
      executable: "execute_command(args.splice(1))"
    },
    "ls": {
      executable: "ls_command(args.splice(1))"
    },
    "cd": {
      executable: "cd_command(args.splice(1))"
    },
    "echo": {
      executable: "echo_command(args.splice(1))"
    },
    "execute": {
      executable: "execute_command(args.splice(1))"
    },


  },
  ".hidden": {
    "riddle": {
      executable: "riddle_command()"
    },
    ".color": {
      executable: "start_color_game(args.splice(1))"
    }
  }
}

var ENV_VARS = {
  "$HOME": "/USA/Massachusetts/Greater Boston Area/Norton",
  "$PATH": "/Software Engineer:/Gamer:/Voice Actor:/Musician",
  "$VAL": "<3"
}
