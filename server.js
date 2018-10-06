const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = process.env.PORT || 8080;
const masterToken = 'GameOver777'

var state;
var votetokens = [];
var votedUsers = [];
var votes = [];
var result = {};

init();

//--------------------------------------------------------------------------
app.use(express.json());
app.use(morgan("combined"));
app.use(express.static("public"));

app.post("/vote", (req, res) => {
  let myToken = req.headers['votetoken'];
  // console.log(req.headers);
  // console.log(req.body);
  // console.log('\n\nJóságos votetoken\n\n' + myToken);
  if ((votetokens.indexOf(myToken) > -1) || (myToken == masterToken)) {
    if (votedUsers.indexOf(myToken) > -1) {
      res.send("Ön már szavazott egyszer")
    } else {
      votedUsers.push(myToken);
      votes.push(req.body);
      res.send("Szavazatát rögzítettük");
    } 
  } else {
    res.send("Hibás Szavazó KÓD")
  }
  if ((myToken == masterToken) || (votetokens.length == votedUsers.length)) {
    calculateResult();
    state = 'result';
  }
});

app.get("/result", (req, res) => {
  if (state != 'vote') {
    res.send(JSON.stringify(result));
  } else {
    res.send("A szavazás még folyamatban van");
  }
});

app.get("/state", (req, res) => {
  res.send(state);
});

app.get("*", (req, res) => {
  res.status(404).send("404 - Wrong Way 🐸");
});

app.listen(PORT, () => {
  console.log(`Food Voter Server listening on ${PORT}\n`);
});
//---------------------------------------------------------------------

function init() {
  console.log('\nARGV \n \n', process.argv);
  state = 'vote'
  for (let i = 0; i < parseInt(process.argv[2]); i++) {
    votetokens[i] = getToken();
  }
  console.log(`
A Játék elkezdődött !

Szavazók száma : ${votetokens.length}
Votetokens :
  `);
  for (i = 0; i < votetokens.length; i++) {
    console.log(`${votetokens[i]}
------->`);
  };
};

function getToken() {
  let text = "";
  let possible = "abcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 4; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  return text;
};

function calculateResult() {
  console.log("\nResults\n Votes :\n\n", votes);
  votes.forEach((vote) => {
    vote.forEach((chef) => {
      if (chef.category in result) {
        if (chef.name in result[chef.category]) {
          result[chef.category][chef.name]['pont'] += chef.vote;
        } else {
          result[chef.category][chef.name] =  {};
          result[chef.category][chef.name]['pont'] = chef.vote;
        }
      } else {
        result[chef.category] = {};
        result[chef.category][chef.name] = {};
        result[chef.category][chef.name]['pont'] = chef.vote;
      };
    }); 
  });
};