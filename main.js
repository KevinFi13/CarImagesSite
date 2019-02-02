//declare variables
var selectedFile;

//Ready function to hide Submit button
$(function () {
	$("#uploadButton").hide();

	var rootRef = firebase.database().ref().child("Posts");

	rootRef.on("child_added", snap => {
		var caption = snap.child("caption").val();
		var email = snap.child("userEmail").val();
		var myUrl = snap.child("url").val();

		$(".timeline").prepend(`<div class="post"> <a target="_blank" href="${myUrl}"> <img src="${myUrl}" width="600"> </a> <h1>${caption}</h1></div>`);
	});
});

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
	document.body.scrollTop = 0; // For Safari
	document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};


//Create new Post
function addPost(filename) {
	//get timeline
	var timeline = document.getElementById("timeline");

	$(".timeline").prepend('<div class="post"> <a target="_blank" href="images/ferrari.jpeg"> <img src="images/ferrari.jpeg" width="600"> </a> </div>');
	topFunction(); //scroll to top after posting new image
};


//Input selection
$(function () { //DOM is ready
	$("#file").change(function (event) {
		selectedFile = event.target.files[0]; //for now only select one file event if several are uploaded by user
		$("#uploadButton").show();
	});
});


//FILE UPLOAD
//To upload a file to Cloud storage, you first create a reference to the full path of the file, including the file name
function uploadFile() {
	//get fileName and create reference to it
	var filename = selectedFile.name;
	//create a root reference
	var storageRef = firebase.storage().ref('/carImages/' + filename); //getting the main folder of the database
	var uploadTask = storageRef.put(selectedFile);

	// Register three observers:
	// 1. 'state_changed' observer, called any time the state changes
	// 2. Error observer, called on failure
	// 3. Completion observer, called on successful completion
	uploadTask.on('state_changed', function (snapshot) {
		// Observe state change events such as progress, pause, and resume
		// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		console.log('Upload is ' + progress + '% done');
		switch (snapshot.state) {
			case firebase.storage.TaskState.PAUSED: // or 'paused'
				console.log('Upload is paused');
				break;
			case firebase.storage.TaskState.RUNNING: // or 'running'
				console.log('Upload is running');
				break;
		}
	}, function (error) {
		// Handle unsuccessful uploads
	}, function () {
		// Handle successful uploads on complete
		// For instance, get the download URL: https://firebasestorage.googleapis.com/...
		var postKey = firebase.database().ref('Posts/').push().key;

		uploadTask.snapshot.ref.getDownloadURL().then(function (downloadURL) {
			var updates = {};
			var postData = {
				userName: firebase.auth().currentUser.displayName,
				userEmail: firebase.auth().currentUser.email,
				url: downloadURL,
				caption: $("#imageCaption").val()
			};
			updates['/Posts/' + postKey] = postData;
			firebase.database().ref().update(updates);
			console.log('File available at', downloadURL);
		});

		//CREATE POST DIV HERE: Include caption
		storageRef.getDownloadURL().then(function (url) {
			var timeline = document.getElementById("timeline");
			var img = document.createElement("IMG");
			img.src = url;

			//obtain the caption from post
			var myCaption = firebase.database().ref('/Posts/' + postKey + '/caption');
			myCaption.on('value', function (snapshot) {

				//$(".timeline").prepend(`<div class="post"> <a target="_blank" href="${img.src}"> <img src="${img.src}" width="600"> </a> <h1>${snapshot.val()}</h1></div>`);
				//scroll to top after posting new image
				topFunction();
				//hide upload button after upload
				$("#uploadButton").hide();
				//clear caption field after upload
				$("#imageCaption").val("");
			});
		});
	});
};


/** 
 * Handles the sign out process
 */
function signOut() {
	if (firebase.auth().currentUser) {
		//[Start sign out]
		firebase.auth().signOut();
		//[End sign out]
		document.location.replace("login.html");
	} else {
		window.alert("You are already signed out");
		document.location.replace("login.html");
	}
}