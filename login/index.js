// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbYgKsLwT819yJAbSRj0WbsR0kB9yX14g",
    authDomain: "quickcollab-ca6b3.firebaseapp.com",
    databaseURL: "https://quickcollab-ca6b3-default-rtdb.firebaseio.com",
    projectId: "quickcollab-ca6b3",
    storageBucket: "quickcollab-ca6b3.appspot.com",
    messagingSenderId: "989667043453",
    appId: "1:989667043453:web:9a2c48e1a04ed4e64aa914",
    measurementId: "G-P4S14VX3SG"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize variables
const auth = firebase.auth();
const database = firebase.database();

// Set up our register function
function register() {
    // Get all our input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const full_name = document.getElementById('full_name').value;

    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
        alert('Email or Password is incorrect!');
        return;
    }
    if (!validate_field(full_name)) {
        alert('Full Name field is incorrect!');
        return;
    }

    // Proceed with Auth
    auth.createUserWithEmailAndPassword(email, password)
        .then(function () {
            // Declare user variable
            const user = auth.currentUser;

            // Add this user to Firebase Database
            const database_ref = database.ref();

            // Create User data
            const user_data = {
                email: email,
                full_name: full_name,
                last_login: Date.now()
            };

            // Push to Firebase Database
            database_ref.child('users/' + user.uid).set(user_data);

            // Done
            alert('User Created!');
        })
        .catch(function (error) {
            // Firebase will use this to alert of its errors
            const error_message = error.message;
            alert(error_message);
        });
}

// Set up our login function
function login() {
    // Get all our input fields
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validate input fields
    if (!validate_email(email) || !validate_password(password)) {
        alert('Email or Password is incorrect!');
        return;
    }

    auth.signInWithEmailAndPassword(email, password)
        .then(function () {
            // Declare user variable
            const user = auth.currentUser;

            // Add this user to Firebase Database
            const database_ref = database.ref();

            // Create User data
            const user_data = {
                last_login: Date.now()
            };

            // Update Firebase Database
            database_ref.child('users/' + user.uid).update(user_data);

            // Done
            alert('User Logged In!');
            window.location.href = '../upload/index.html';
        })
        .catch(function (error) {
            // Firebase will use this to alert of its errors
            const error_message = error.message;
            alert(error_message);
        });
}

// Validate Functions
function validate_email(email) {
    const expression = /^[^@]+@\w+(\.\w+)+\w$/;
    return expression.test(email);
}

function validate_password(password) {
    // Firebase only accepts lengths greater than 6
    return password.length >= 6;
}

function validate_field(field) {
    return field != null && field.length > 0;
}
