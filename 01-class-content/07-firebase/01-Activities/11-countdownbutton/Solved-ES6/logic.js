/* global firebase */
// Initialize Firebase (YOUR OWN APP)
const config = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  databaseURL: "your_database_url",
  projectId: "your_project_id",
  storageBucket: "your_storage_bucket",
  messagingSenderId: "your_messaging_sender_id"
};

firebase.initializeApp(config);

const database = firebase.database();
const initialValue = 100;

// --------------------------------------------------------------

// At the initial load, get a snapshot of the current data.
// ES6 -- Arrow Functions -- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions
const getClickCount = (callback) => {
  database.ref().once("value")
    .then((snapshot) => {
      callback(snapshot.val().clickCount);
})
.catch((err) => {
  // ES6 - Template Literals -- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
  console.log(`Error getting click count -- ${err}`);
});
};

const setClickCount = (value) => {
  database.ref().set({
    clickCount: value
  }).then(() => {
    $("#click-value").text(value);
}).catch((err) => {
    console.log(`Error setting click count -- ${err}`);
});
};


// --------------------------------------------------------------

setClickCount(initialValue);

// Whenever a user clicks the click button
$("#click-button").on("click", function() {
  getClickCount((clickCount) => {
    // Reduce the clickCounter by 1
    clickCount--;

  // Alert User and reset the counter
  if (clickCount === 0) {
    alert("You made it to the end!");
    clickCount = 100;
  }
  // Save new value to Firebase
  setClickCount(clickCount);

  // Log the value of clickCounter
  console.log(clickCount);
});
});

// Whenever a user clicks the restart button
$("#restart-button").on("click", function() {
  setClickCount(initialValue);
});