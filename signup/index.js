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

// Ensure the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Set up our register function
    function register() {
        // Get all our input fields
        const email = document.getElementById('email_register').value;
        const password = document.getElementById('password_register').value;
        const fullName = document.getElementById('full_name').value;
        const reenterPassword = document.getElementById('password_confirm').value;

        // Validate input fields
        if (!validateEmail(email) || !validatePassword(password)) {
            alert('Email or Password is invalid!');
            return;
        }
        if (password !== reenterPassword) {
            alert('Passwords do not match!');
            return;
        }
        if (!validateField(fullName)) {
            alert('Full Name is invalid!');
            return;
        }

        // Move on with Auth
        auth.createUserWithEmailAndPassword(email, password)
            .then(function () {
                // Declare user variable
                const user = auth.currentUser;

                // Add this user to Firebase Database
                const databaseRef = database.ref();

                // Create User data
                const userData = {
                    email: email,
                    full_name: fullName,
                    last_login: Date.now()
                };

                // Push to Firebase Database
                databaseRef.child('users/' + user.uid).set(userData);

                // Done
                alert('User Created!');
                window.location.href = '../upload/index.html'
            })
            .catch(function (error) {
                // Firebase will use this to alert of its errors
                const errorMessage = error.message;

                alert(errorMessage);
            });
    }

    // Validate Functions
    function validateEmail(email) {
        const expression = /^[^@]+@\w+(\.\w+)+\w$/;
        return expression.test(email);
    }

    function validatePassword(password) {
        // Firebase only accepts lengths greater than 6
        return password.length >= 6;
    }

    function validateField(field) {
        return field && field.length > 0;
    }

    // Attach register function to the global scope so it can be called from HTML
    window.register = register;
});
