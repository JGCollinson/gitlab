const config = {
  apiKey: "AIzaSyAJUU9I-ZFgyNjy3GW5dB9mSSpNQRHn6V8",
  authDomain: "gtcbc-85290.firebaseapp.com",
  databaseURL: "https://gtcbc-85290.firebaseio.com",
  projectId: "gtcbc-85290",
  storageBucket: "gtcbc-85290.appspot.com",
  messagingSenderId: "547433724718"
};

firebase.initializeApp(config);

const database = firebase.database();

// Initial Values
let bidder = {
  BidderName: "No one :-(",
  BidderPrice: 0
};

// ES6 Object Destructuring w/ new names --
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Object_destructuring
let { BidderName: highBidder, BidderPrice: highPrice } = bidder;

// --------------------------------------------------------------

// Get user input values
const getValues = () => {
  database.ref().once("value")
    .then((snapshot) => {
      if (snapshot.child("highBidder").exists() && snapshot.child("highPrice").exists()) {
        highBidder = snapshot.val().highBidder;
        highPrice = parseInt(snapshot.val().highPrice)
      }
    })
    .catch((err) => {
      console.log(`Error getting db values -- ${err}`);
    })
};

// Set high bidder values in database, then display
const setValues = ({BidderName = highBidder, BidderPrice = highPrice}) => {
  database.ref().set({
    highBidder: BidderName,
    highPrice: BidderPrice
  }).then(() => {
    $("#highest-bidder").text(BidderName);
    $("#highest-price").text(BidderPrice);
  }).catch((err) => {
    console.log(`Error setting db values -- ${err}`);
  });
};

// Sets High Bidder Values on Page Load
setValues(bidder);

// Click event listener to change high bidder values, if necessary
$("#submit-bid").on("click", () => {

  event.preventDefault();
  bidder.BidderName = $("#bidder-name").val().trim();
  bidder.BidderPrice = $("#bidder-price").val().trim();
  getValues();
  console.log(bidder);
  console.log(highPrice);

  if (bidder.BidderPrice > highPrice) {
    alert("You are now the highest bidder!");
    setValues(bidder);
  } else {
    alert("Sorry, your bid was too low.  Don't be cheap.");
  }

});