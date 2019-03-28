const express = require('express');
const app = express();
const firebase = require("firebase");
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 8000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// connect with firebase
var config = {
    apiKey: "AIzaSyCthKYeDvh2KMGCkuQplv5gUvcMvBq3Bxs",
    authDomain: "memorygame-db.firebaseapp.com",
    databaseURL: "https://memorygame-db.firebaseio.com",
    storageBucket: "memorygame-db.appspot.com",
  };
  firebase.initializeApp(config);

// register
app.post('/register', function(req, res) {
    let obj = req.body;
    console.log(obj[0]);

    var authEmail = obj[0].email;
    var authPassword = obj[0].password;
    
    if (authEmail.length < 4) {
        console.log('Please enter an email address.');
        res.send('Please enter an email address.');
        return;
    }

    if (authPassword.length < 4) {
        console.log('Please enter a password.');
        res.send('Please enter a password.');
        return;
    }

    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(authEmail, authPassword)
    .then(function(){
        console.log("displayName")
        var user = firebase.auth().currentUser;
        console.log("user.email: " + user.email);
        user.email = "aaa@gmail.com"
        user.updateProfile({
            displayName: "JaneUser",
            // photoURL: "https://example.com/jane-q-user/profile.jpg"
            email: "qweasd@gmail.com"
          }).then(function() {
            // Update successful.
          }).catch(function(error) {
            // An error happened.
          });

          res.send("register success");
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            console.log('The password is too weak.');
            // res.write('The password is too weak.');
        } else {
            console.log("errorMessage: " + errorMessage);
            res.send(errorMessage);
        }
        console.log("error" + error);
        // [END_EXCLUDE]
    });
});

// // register
// app.post('/register', function(req, res) {
//     let obj = req.body;
//     console.log(obj[0]);

//     var authEmail = obj[0].email;
//     var authPassword = obj[0].password;
    
//     if (authEmail.length < 4) {
//         console.log('Please enter an email address.');
//         res.send('Please enter an email address.');
//         return;
//     }

//     if (authPassword.length < 4) {
//         console.log('Please enter a password.');
//         res.send('Please enter a password.');
//         return;
//     }

//     // Sign in with email and pass.
//     // [START createwithemail]
//     firebase.auth().createUserWithEmailAndPassword(authEmail, authPassword).catch(function(error) {
//         // Handle Errors here.
//         var errorCode = error.code;
//         var errorMessage = error.message;
//         // [START_EXCLUDE]
//         if (errorCode == 'auth/weak-password') {
//             console.log('The password is too weak.');
//             // res.write('The password is too weak.');
//         } else {
//             console.log("errorMessage: " + errorMessage);
//             res.send(errorMessage);
//         }
//         console.log("error" + error);
//         // [END_EXCLUDE]
//     });
// });

// login
app.post('/login', function(req, res) {
    let obj = req.body;
    console.log(obj[0]);

    var authEmail = obj[0].email;
    var authPassword = obj[0].password;
    
    firebase.auth().signInWithEmailAndPassword(authEmail, authPassword)
    .then(function(){
        // if no errors, send message back to web page
        res.send("login success");
    })
    .catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          console.log('Wrong password.');
          res.send('Wrong password.');
        } else {
          console.log("errorMessage: " + errorMessage);
          res.send(errorMessage);
        }
        console.log("error: " + error);

        // [END_EXCLUDE]
    });
    // [END authwithemail]
});

// check user's status
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // ...
      console.log("signin");
      console.log("displayName: " + displayName);
      console.log("email: " + email);
      console.log("uid: " + uid);


    } else {
      // User is signed out.
      // ...
      console.log("signout");
    }
});

// insert into DB
app.post('/insert', function(req, res) {
    let temp = req.body;
    console.log(temp[0]);

    var mgScore = temp[0].score;
    var mgUserName = temp[0].userName;

    console.log(mgScore);
    console.log(mgUserName);
    var ref = firebase.database().ref('/leaderboard');
    var obj = {score: mgScore, userName: mgUserName};
    ref.push(obj);   // Creates a new ref with a new "push key"
});

app.post('/signOut', function(req, res){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
        console.log("Sign-out successful.")
        res.send("Sign-out successful.");
      }).catch(function(error) {
        // An error happened.
        console.log("signOut: " + error);
      });
});

console.log("Listen port 8000")
app.listen(port);