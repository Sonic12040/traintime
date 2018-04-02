// Initialize Firebase
var config = {
    apiKey: "AIzaSyBaaZo5qLSmMsYYmMsUCxBiXDjegae3moI",
    authDomain: "train-time-769af.firebaseapp.com",
    databaseURL: "https://train-time-769af.firebaseio.com",
    projectId: "train-time-769af",
    storageBucket: "",
    messagingSenderId: "392762276903"
  };
  firebase.initializeApp(config);

  let trainData = firebase.database();

  $('#add-train-btn').on('click', function() {
      //grab user input
    let trainName = $('#train-name-input').val().trim();
    let destination = $('#destination-input').val().trim();
    let firstTrain = $('#first-train-input').val().trim();
    let frequency = $('#frequency-input').val().trim();
    let newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    }
    trainData.ref().push(newTrain);
    return false;
      //add user input to train object
  });

  trainData.ref().on('child_added', function(childSnapshot, prevChildKey) {
      console.log(childSnapshot.val());
      let tName = childSnapshot.val().name;
      let tDestination = childSnapshot.val().destination;
      let tFrequency = childSnapshot.val().frequency;
      let tFirstTrain = childSnapshot.val().firstTrain;

      let trainArr = tFirstTrain.split(':');
      let trainTime = moment().hours(trainArr[0]).minutes(trainArr[1]);
      console.log(trainTime);
      let maxMoment = moment.max(moment(), trainTime);
      let tMinutes;
      let tArrival;
      if (maxMoment === trainTime) {
          tArrival = trainTime.format('hh:mm A');
          tMinutes = trainTime.diff(moment(), 'minutes');
      } else {
          let differenceTimes = moment().diff(trainTime, 'minutes');
          let tRemainder = differenceTimes % tFrequency;
          tMinutes = tFrequency - tRemainder;
          //calculate the arrival time
          tArrival = moment().add(tMinutes, 'm').format('mm:hh A');
      }

      $('#train-table > tbody').append('<tr><td>' + tName + '</td><td>' + tDestination + '</td><td>' + tFrequency + '</td><td>' + tArrival + '</td><td>' + tMinutes + '</td></tr>');
  })