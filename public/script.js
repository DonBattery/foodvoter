"use strict";

const apiURL = "http://localhost:8080";

function hideTable() {
  document.getElementById("mainPage").style.display = "none";
}

function hideToken() {
  document.getElementById("tokenPage").style.display = "none";
}

function hideStatus() {
  document.getElementById("statusPage").style.display = "none";
}

function hideResult() {
  document.getElementById("resultPage").style.display = "none";
}

function validateTable() {
  let allVoted = true;
  chefs.forEach((chef) => {
    let chefTable = document.getElementsByName(`${chef.id}table`);
    let voted = false;
    chefTable.forEach((radio) => {
      if (radio.checked) {
        voted = true;
      };
    });
    if (!voted) {
      allVoted = false;
    };
  });
  return allVoted;
}

function renderResult() {
  let resultPage = document.getElementById("resultPage");
  resultPage.style.display = 'block';
}

function getSelectedRadio(list) {
  let value = 0;
  list.forEach((e) => {
    if (e.checked) {
      value = e.value;
    }
  });
  return value;  
}

function getVotes() {
  return chefs.map((chef) => {
    return {
      name : chef.name,
      id :  chef.id,
      category : chef.category,
      foodname : chef.foodname,
      vote : getSelectedRadio(document.getElementsByName(`${chef.id}table`)),
    }
  });  
}

function renderToken() {
  let tokenPage = document.getElementById("tokenPage");
  let tokenField = document.getElementById("tokenField");
  let tokenButton = document.getElementById("tokenButton");
  tokenButton.addEventListener('click', (event) => {
    event.preventDefault();
    if ((tokenField.value.length > 3) && (tokenField.value.length < 10)) {
      $.ajax(apiURL + '/vote', {
        data : JSON.stringify(getVotes()),
        contentType : 'application/json',
        type : 'POST',
        beforeSend: (xhr) => {
          xhr.setRequestHeader('voteToken', tokenField.value);
        }
      });
    } else {
      alert("Érvénytelen Szavazó Kód")
    }
  });
  tokenField.value = "";
  tokenPage.style.display = 'block';  
}

function renderTable() {
  let mainTable = document.getElementById("mainTable");
  chefs.forEach((chef) => {
    let chefTable = document.createElement("div");
    chefTable.innerHTML = `
    <form class="chefForm">
    <label class="radioLabel" for="${chef.id}table">${chef.name} ${chef.category} ${chef.foodname}</label>
    <fieldset id="${chef.id}table">
      <input type="radio" name="${chef.id}table" value="1">1
      <input type="radio" name="${chef.id}table" value="2">2  
      <input type="radio" name="${chef.id}table" value="3">3 
      <input type="radio" name="${chef.id}table" value="4">4  
      <input type="radio" name="${chef.id}table" value="5">5 
    </fieldset>
  </form>
    ` 
    mainTable.appendChild(chefTable);
  });
  document.getElementById("voteButton").addEventListener("click", (event) => {
    event.preventDefault();
    if (validateTable()) {
      hideTable();
      renderToken();
    } else {
      alert("Valamelyik kajára nem szavaztál");
    }
  });
  mainTable.style.display = 'block';
};


window.addEventListener('load', () => {
  $.get( apiURL + '/state', (state) => {
    if (state == 'vote') {
      hideToken();
      hideResult();
      hideStatus();
      renderTable();
    } else {
      hideToken();
      hideStatus();
      hideTable();
      renderResult();
    };
  });
});
