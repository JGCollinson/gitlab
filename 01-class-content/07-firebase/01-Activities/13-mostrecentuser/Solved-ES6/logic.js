// Initialize Firebase
const config = {
  apiKey: "your_api_key",
  authDomain: "your_auth_domain",
  databaseURL: "your_database_url",
  projectId: "your_projectId",
  storageBucket: "your_storage_bucket",
  messagingSenderId: "your_messaging_sender_id"
};

firebase.initializeApp(config);

// Create a variable to reference the database
const database = firebase.database();

const getValues = () => {
  return {
    name: $("#name-input").val().trim(),
    email: $("#email-input").val().trim(),
    age: $("#age-input").val().trim(),
    comment: $("#comment-input").val().trim()
  }
};

// ES6 Object Destructuring with Default Values --
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring
const setDbValues = ({name = "", email = "", age = 0, comment = ""}) => {
  database.ref().set({
    name: name,
    email: email,
    age: age,
    comment: comment
  }).then(() => {
    $("#name-display").text(name);
    $("#email-display").text(email);
    $("#age-display").text(age);
    $("#comment-display").text(comment);
  }).catch((err) => {
    console.log(`Error setting db values -- ${err}`);
  });
};

// Capture Button Click
$("#add-user").on("click", function() {
  // Don't refresh the page!
  event.preventDefault();

  // YOUR TASK!!!
  const recentUser = getValues();
  // Code in the logic for storing and retrieving the most recent user.
  setDbValues(recentUser);
});

setDbValues(initialUser);