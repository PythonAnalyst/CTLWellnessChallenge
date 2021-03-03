// DOM elements
const guideList = document.querySelector('.guides');
const loggedOutLinks = document.querySelectorAll('.logged-out');
const loggedInLinks = document.querySelectorAll('.logged-in');
const accountDetails = document.querySelector('.account-details');
const ruleDetails = document.querySelector('.rule-details');
const personalPoints = document.querySelector('.personal-points');
const teamPoints = document.querySelector('.team-points');
const opposingTeamPoints1 = document.querySelector('.opp-team-points1');
const opposingTeamPoints2 = document.querySelector('.opp-team-points2');
const ctlPoints = document.querySelector('.ctl-points');
// const teamSelected = document.querySelector('#teamSelector');
const moveMinutesForm = document.querySelector('#add-move-minutes-form');

var teamList = ['Fighting Mongooses', 'Run Like the Winded', 'Sweet Sassy Molassy'];

// Team Point Card (create before setupUI so I can pass this function to it)
const setupTeamPoints = (user, userTeam) => {
  if (user) {

    db.collection('teams').doc(userTeam).get().then(doc => {
      teamEntries = doc.data().totalEntries;
      teamCardio = doc.data().userTeamCardio;
      teamActive = doc.data().userTeamActive;
      const html = `
      <div>Total Entries: <span  class="points-color">${teamEntries}</span></div>
      <div>Cardio / Strength: <span  class="points-color">${teamCardio}</span></div>
      <div>Active Living: <span  class="points-color">${teamActive}</span></div>
  `;
  teamPoints.innerHTML = html;
  })
 } else {
   console.log('not logged in');
 }
};

// Opposing Team Card 1
const setupOpposingTeamPoints1 = (userTeam) => {
  if (userTeam) {
    let opposingTeamList = teamList.filter( function(value) {
      return value !== userTeam
    });
    let opposingTeam1 = opposingTeamList[0];

    db.collection('teams').doc(opposingTeam1).get().then(doc => {
      let oppTeamEntries = doc.data().totalEntries;
      let oppTeamCardio = doc.data().userTeamCardio;
      let oppTeamActive = doc.data().userTeamActive;
      const html = `
      <span class="card-title opposingTeamColor">${opposingTeam1}</span>
      <div>Total Entries: <span  class="opp-points-color">${oppTeamEntries}</span></div>
      <div>Cardio / Strength: <span  class="opp-points-color">${oppTeamCardio}</span></div>
      <div>Active Living: <span  class="opp-points-color">${oppTeamActive}</span></div>
  `;
  opposingTeamPoints1.innerHTML = html;
  })
 } else {
   console.log('not logged in');
 }
};


// Opposing Team Card 2
const setupOpposingTeamPoints2  = (userTeam) => {
  if (userTeam) {

    let opposingTeamList = teamList.filter( function(value) {
      return value !== userTeam
    });
    let opposingTeam2 = opposingTeamList[1];


    db.collection('teams').doc(opposingTeam2).get().then(doc => {
      let oppTeamEntries = doc.data().totalEntries;
      let oppTeamCardio = doc.data().userTeamCardio;
      let oppTeamActive = doc.data().userTeamActive;
      const html = `
      <span class="card-title opposingTeamColor">${opposingTeam2}</span>
      <div>Total Entries: <span  class="opp-points-color">${oppTeamEntries}</span></div>
      <div>Cardio / Strength: <span  class="opp-points-color">${oppTeamCardio}</span></div>
      <div>Active Living: <span  class="opp-points-color">${oppTeamActive}</span></div>
  `;
  opposingTeamPoints2.innerHTML = html;
  })
 } else {
   console.log('not logged in');
 }
};

var userTeam;
// setupUI 
const setupUI = (user) => {
    if (user) {
      // account info
        db.collection('users').doc(user.uid).get().then(doc => {
          userTeam = doc.data().userTeam;
            const html = `
            <div class="container">
              <div>Name: ${doc.data().userName}</div>
              <div>Team: ${userTeam}</div>
              <div>Are you ready to crush it?</div>
            </div>
        `;
        accountDetails.innerHTML = html;
        setupTeamPoints(user, userTeam);
        setupOpposingTeamPoints1(userTeam);
        setupOpposingTeamPoints2(userTeam);
      })

      // toggle user UI elements
      loggedInLinks.forEach(item => item.style.display = 'block');
      loggedOutLinks.forEach(item => item.style.display = 'none');

      
    } else {
      // hide account info
      accountDetails.innerHTML = '';
      // toggle user elements
      loggedInLinks.forEach(item => item.style.display = 'none');
      loggedOutLinks.forEach(item => item.style.display = 'block');
    }
  };

// Personal Point Card
var userid;
const setupPersonalPoints = (user) => {
  if (user) {
    db.collection('users').doc(user.uid).get().then(doc => {
      userid = user.uid;
      personalEntries = doc.data().userEntries;
      personalCardio = doc.data().userCardio;
      personalActive = doc.data().userActiveLiving;
      const html = `
      <div>Total Entries: <span  class="points-color">${personalEntries}</span></div>
      <div>Cardio / Strength: <span  class="points-color">${personalCardio}</span></div>
      <div>Active Living: <span class="points-color">${personalActive}</span></div>
  `;
  personalPoints.innerHTML = html;
  })
 } else {
  console.log('no user');
 }
};

// CTL Point Card
// var totalCTLEntries;
// var totalCTLCardio;
// var totalCTLActive;
var teamPercentComplete = 0;
var CTLTeamGoal = 15000;
const setupCtlPoints = (user) => {
  if (user) {
    db.collection('CTL').doc('ctlData').get().then(doc => {
      totalCTLEntries = doc.data().ctlEntries;
      totalCTLCardio = doc.data().ctlCardio;
      totalCTLActive = doc.data().ctlActive;
      teamPercentComplete = ((totalCTLCardio + totalCTLActive) / CTLTeamGoal) *100; // *100 so it works with the d3 function
      const html = `
      <div>Total Entries:  <span  class="points-color">${totalCTLEntries}</span></div>
      <div>Cardio / Strength: <span  class="points-color">${totalCTLCardio}</span></div>
      <div>Active Living:  <span  class="points-color">${totalCTLActive}</span></div>
  `;
  ctlPoints.innerHTML = html;
  ctlProgressGoal(teamPercentComplete);

  })
 } else {
   console.log('not logged in');
 }
};





// setup materialize components
document.addEventListener('DOMContentLoaded', function() {

    var modals = document.querySelectorAll('.modal');
    M.Modal.init(modals);
  
    var items = document.querySelectorAll('.collapsible');
    M.Collapsible.init(items);

    var selectedTeam = document.querySelectorAll('select');
    var instances = M.FormSelect.init(selectedTeam);
  
  });

// get selected team 
var selectedTeam;
function getSelectedTeam() {
    var d = document.getElementById('teamSelecter');
    selectedTeam = d.options[d.selectedIndex].text;

}


// saving data
// check if document exists (i.e., if there is a sumbission for the doc on that date)
// https://stackoverflow.com/questions/46880323/how-to-check-if-a-cloud-firestore-document-exists-when-using-realtime-updates
moveMinutesForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // Updateing date data

  submittedCardio = parseInt(moveMinutesForm.cardioMinutes.value);
  submittedActive = parseInt(moveMinutesForm.activeMinutes.value);

  if (Number.isNaN(submittedCardio)) {
    submittedCardio = 0;
  }

  if (Number.isNaN(submittedActive)) {
    submittedActive = 0;
  }


  db.collection(userid).doc(selectedDate.toString()).set({
    date: selectedDate,
    dailyCardio: submittedCardio,
    dailyActive: submittedActive
  });

    personalEntries += 1;
    personalCardio += submittedCardio;
    personalActive += submittedActive;
    db.collection('users').doc(userid).update({
      userEntries: personalEntries,
      userCardio: personalCardio,
      userActiveLiving: personalActive
    });

    teamEntries += 1;
    teamCardio += submittedCardio;
    teamActive += submittedActive;
    db.collection('teams').doc(userTeam).update({
      totalEntries: teamEntries,
      userTeamCardio: teamCardio,
      userTeamActive: teamActive
    });

    totalCTLEntries += 1;
    totalCTLCardio += submittedCardio;
    totalCTLActive += submittedActive;
    db.collection('CTL').doc('ctlData').update({
      ctlEntries: totalCTLEntries, 
      ctlCardio: totalCTLCardio,
      ctlActive: totalCTLActive
    });
    // reset form valuse to empty
    moveMinutesForm.cardioMinutes.value = '';
    moveMinutesForm.activeMinutes.value = '';



})


