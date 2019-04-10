var admin = require("firebase-admin");
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 8000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://memorygame-db.firebaseio.com"
});

// generate a token in server and response to client web
app.post('/login', function(req, res){
    let obj = req.body;
    console.log("login: ");
    console.log("id: " + obj[0].email);
    const user = {id:obj[0].email};
    const token = jwt.sign({user}, 'my_secret_key', { expiresIn: '2hr' })
    res.json({
        token: token
    })
});

// // get current login user and display user info
// app.post('/login', function(req, res) {
//     let obj = req.body;
//     idToken = obj.clientToken;

//     admin.auth().verifyIdToken(idToken)
//     .then(function(decodedToken) {
        
//         //console.log("obj.clientToken: " + obj.clientToken);

//         var uid = decodedToken.uid;

//         // get user data by uid
//         admin.auth().getUser(uid)
//         .then(function(userRecord) {
//             // See the UserRecord reference doc for the contents of userRecord.
//             let userInfo = userRecord.toJSON();
//             //console.log("Successfully fetched user data:", userInfo.displayName);
//             console.log("Successfully fetched user data:", userRecord.toJSON());
//             // generate token
//             let user = userInfo.email;
//             const token = jwt.sign({user}, 'my_secret_key', { expiresIn: '5sec' })
//             let myObj = {token: token};
//             res.send(myObj);

//             // let user = userInfo.photoUrl;
//             // res.send(user);


//         })
//         .catch(function(error) {
//             console.log("Error fetching user data:", error);
//         });
//     })
//     .catch(function(error) {
//         // Handle error
//         console.log(error);
//         res.send(error);
//     });
// });

// verfy token and return data
app.post('/token', ensureToken, function(req, res) {
    console.log("token check run");
    jwt.verify(req.token, 'my_secret_key', function(err, data){
        if(err){
            res.sendStatus(403);
        } else {
            let obj = req.body;
            console.log(obj[0]);
            
            // response
            res.json({
                text: 'this is protected'
            });
        }
    });
});
function ensureToken(req, res, next){
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}

// get user info
// app.post('/userInfo', function(req, res) {
//     let obj = req.body;
//     idToken = obj.clientToken;

//     admin.auth().verifyIdToken(idToken)
//     .then(function(decodedToken) {
//         var uid = decodedToken.uid;
//         // get user data by uid
//         admin.auth().getUser(uid)
//         .then(function(userRecord) {
//             // See the UserRecord reference doc for the contents of userRecord.
//             let userInfo = userRecord.toJSON();
//             res.send(userInfo);
//         })
//         .catch(function(error) {
//             console.log("Error fetching user data:", error);
//         });
//     })
//     .catch(function(error) {
//         // Handle error
//         console.log(error);
//         res.send(error);
//     });
// });

// ckeck jwt token. If correct, return user name to client
app.post('/token/getUserName', ensureToken, function(req, res) {
    console.log("token check run");
    jwt.verify(req.token, 'my_secret_key', function(err, data){
        if(err){
            res.sendStatus(403);
        } else {
            let obj = req.body;
            // console.log(obj);

            idToken = obj.token;
            console.log(idToken);
            admin.auth().verifyIdToken(idToken)
            .then(function(decodedToken) {
                
                //console.log("obj.clientToken: " + obj.clientToken);

                var uid = decodedToken.uid;

                // get user data by uid
                admin.auth().getUser(uid)

                .then(function(userRecord) {
                    // See the UserRecord reference doc for the contents of userRecord.
                    let userInfo = userRecord.toJSON();
                    //console.log("Successfully fetched user data:", userInfo.displayName);
                    // console.log("Successfully fetched user data:", userRecord.toJSON());
                    let displayName = userInfo.displayName;
                    console.log("displayName: " + displayName);
                    // return displayname back to client
                    res.send(displayName);
                })
                .catch(function(error) {
                    console.log("Error fetching user data:", error);
                });

            })
            .catch(function(error) {
                // Handle error
                console.log(error);
                res.send(error);
            });     
        }
    });
});

function ensureToken(req, res, next){
    const bearerHeader = req.headers["authorization"];
    if(typeof bearerHeader !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    }else{
        res.sendStatus(403);
    }
}





// ckeck jwt token. If correct, return user name to client
app.post('/token/update', ensureToken, function(req, res) {
    console.log("token check run");
    jwt.verify(req.token, 'my_secret_key', function(err, data){
        if(err){
            res.sendStatus(403);
        } else {
            let obj = req.body;
            // console.log(obj);

            idToken = obj.token;
            // console.log(idToken);
            admin.auth().verifyIdToken(idToken)
            .then(function(decodedToken) {
                
                //console.log("obj.clientToken: " + obj.clientToken);

                var uid = decodedToken.uid;

                // get user data by uid
                admin.auth().getUser(uid)

                console.log("uid: " + uid);

                let score = obj.score;

                console.log("score: " + score);

                var db = admin.database();
                var ref = db.ref("/users");

                var usersRef = ref.child("/");

                // var userInfo = usersRef.child("user");
                
                var hopperRef = usersRef.child(uid);
                hopperRef.update({
                "score": score
                });

                res.end();
            })
            .catch(function(error) {
                // Handle error
                console.log(error);
                res.send(error);
            });     
        }
    });
});


// ckeck jwt token. If correct, return user name to client
app.post('/coreApp/update', ensureToken, function(req, res) {
    console.log("token check run");
    jwt.verify(req.token, 'my_secret_key', function(err, data){
        if(err){
            res.sendStatus(403);
        } else {
            let obj = req.body;
            // console.log(obj);

            idToken = obj.token;
            // console.log(idToken);
            admin.auth().verifyIdToken(idToken)
            .then(function(decodedToken) {
                
                //console.log("obj.clientToken: " + obj.clientToken);

                var uid = decodedToken.uid;

                console.log(obj.name);
                console.log(obj.email);
                console.log(obj.course);
                console.log(obj.school);
                console.log(obj.website);
                console.log(obj.city);
                console.log(obj.state);

                // get user data by uid
                admin.auth().getUser(uid)

                console.log("uid: " + uid);

                var db = admin.database();
                var ref = db.ref("/users");

                var usersRef = ref.child("/");

                // var userInfo = usersRef.child("user");

                var hopperRef = usersRef.child(uid);
                hopperRef.update({
                    course: obj.course,
                    email : obj.email,
                    username : obj.name,
                    school : obj.school,
                    website : obj.website,
                    city: obj.city,
                    state: obj.state
                });

            })
            .catch(function(error) {
                // Handle error
                console.log(error);
                res.send(error);
            });     
        }
    });
});

app.post('/about', (req, res) => {
    let editor1 = req.body.editor1;
    let prodId = req.body.prodId;
    console.log("editor1: " + editor1);
    console.log("prodId: " + prodId);

    var str = editor1;
    var newStr = str.replace('<p>', '');
    var a = newStr.replace('</p>', '');
    editor1 = a;
    console.log("editor1: " + a);

    // console.log(prodId)

    let uid = prodId;

    // get user data by uid
    admin.auth().getUser(uid)

    console.log("uid: " + uid);

    var db = admin.database();
    var ref = db.ref("/users");

    var usersRef = ref.child("/");

    // var userInfo = usersRef.child("user");

    var hopperRef = usersRef.child(uid);
    hopperRef.update({
        about: editor1
    });

    res.redirect('https://www.yushuolu.com/project/coreApp/profile.html');
})


app.post('/read', (req, res) =>{
    let idToken = req.body.token;
    let arr = [];

    var db = admin.database();
    var ref = db.ref("users");
    
    let userRank = 0;
    let allNum = 0;
    let uid;

    admin.auth().verifyIdToken(idToken)
    .then(function(decodedToken) {
        uid = decodedToken.uid;
        console.log(uid);
    // ...
    })
    .then(function(){
        ref.orderByChild("score").on("child_added", function(snapshot) {
            console.log(snapshot.key + " was " + snapshot.val().score + " meters tall");
            obj={key:snapshot.key, userScore: snapshot.val().score}
            arr.push(obj);
            allNum++;

            if(snapshot.key == uid){
                userRank = allNum;
            }
        });
    })
    .then(function(){
        console.log(arr);
        console.log("userRank: " + userRank);
        let JOSNObj = {rank: userRank, all: allNum};
        res.send(JOSNObj);
    })
    .catch(function(error) {
        // Handle error
        res.send(error)
    });
})

app.post('/read2', (req, res) =>{

    let idToken = req.body.token;
    let arr = [];

    var db = admin.database();
    var ref = db.ref("users");
    
    let userRank = 0;
    let allNum = 0;

    

    // let idToken = "A0wHaN0sTvX7JANGe9t9us54RwB2"

    // admin.auth().verifyIdToken(idToken)
    // .then(function(decodedToken) {
    //     var uid = req.body.uuid;
    //     // ...
    //     // console.log("body: " + req.body.token);
    //     console.log("uid: " + uid)
    // })
    // .then(function(){
    //     res.send();
    // })
    // .catch(function(error) {
    //     // Handle error
    //     res.end("error: " + error);
    // });
    
    
    admin.auth().verifyIdToken(idToken)
    .then(function(decodedToken) {
        uid = req.body.uuid;
        console.log(uid);
    // ...
    })
    .then(function(){
        ref.orderByChild("score").on("child_added", function(snapshot) {
            console.log(snapshot.key + " was " + snapshot.val().score + " meters tall");
            obj={key:snapshot.key, userScore: snapshot.val().score}
            arr.push(obj);
            allNum++;

            if(snapshot.key == uid){
                userRank = allNum;
            }
        });
    })
    .then(function(){
        console.log(arr);
        console.log("userRank: " + userRank);
        let JOSNObj = {rank: userRank, all: allNum};
        res.send(JOSNObj);
    })
    .catch(function(error) {
        // Handle error
        res.send(error)
    });
})

console.log("Listen port 8000")
app.listen(port);