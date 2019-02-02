/**
     * Handles the sign in button press.
     */
function handleLogIn() {
    if (firebase.auth().currentUser) {
        // [START signout]
        firebase.auth().signOut();
        console.log("We have signed out :(");
        // [END signout]
    } else {
        var email = document.getElementById('email').value;
        var password = document.getElementById('password').value;
        if (email.length < 4) {
            alert('Please enter an email address.');
            return;
        }
        if (password.length < 4) {
            alert('Please enter a password.');
            return;
        }
        // Sign in with email and pass.
        // [START authwithemail]
        firebase.auth().signInWithEmailAndPassword(email, password).catch(function (error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            // [START_EXCLUDE]
            if (errorCode === 'auth/wrong-password') {
                alert('Wrong password.');
            } else {
                alert(errorMessage);
            }
            console.log(error);
            // [END_EXCLUDE]
        });
        // [END authwithemail]
    }
    //successful log in
}

/**
 * Handles the sign up button press.     
 **/
function handleSignUp() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var myName = document.getElementById('name').value;

    if (myName == "") {
        alert('Please enter a name.');
        return;
    }
    if (email.length < 4) {
        alert('Please enter an email address.');
        return;
    }
    if (password.length < 4) {
        alert('Please enter a password.');
        return;
    }


    firebase.auth().createUserWithEmailAndPassword(email, password).then(function () {
        user = firebase.auth().currentUser;
        //user.sendEmailVerification();
    }).then(function () {
        user.updateProfile({
            displayName: myName
        })
    }).catch(function (error) {
        //Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode == 'auth/weak-password') {
            alert('The password is too weak.');
        } else {
            alert(errorMessage);
        }
        console.log(error);
        // [END_EXCLUDE]
    });
}


/*
Observe status change
UPDATE USER: https://firebase.google.com/docs/reference/js/firebase.User#updateProfile
*/
firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        var uid = user.uid;
        var providerData = user.providerData;
        window.location.replace("index.html");
        // ...
    } else {
        // User is signed out.
    }
});


