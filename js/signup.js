// import { response } from "express";

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.querySelector('input[type="text"]');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const dropdownInput = document.getElementById('mydropdown');
    const signUpBtn = document.querySelector('a');
    const errorSpace = document.getElementById('error');


    // console.log("value: ", usernameInput.value)
    console.log(signUpBtn.innerText)

    signUpBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const username = usernameInput.value;
        const email = emailInput.value;
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        const dropdown = dropdownInput.value;

        if(password !== confirmPassword) {
            errorSpace.innerText = "Confirm password is not same as Password!!";
        } else if(!username || !email || !password || !confirmPassword || !dropdown) {
            errorSpace.innerText = "Fill out all the fields";
        }
        console.log(username, email, password, confirmPassword, dropdown)

        if(password === confirmPassword && email && password && confirmPassword && dropdown) {
            errorSpace.innerText = "";
        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password, confirmPassword, dropdown })
        }).then(response => {
            if (!response.ok) {
                return response.json().then(errorData => { // Capture the error message from backend
                    throw new Error(errorData.error || 'SignUp failed');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log("SignUp successful:", data.message);
                window.location.href = "../index.html"; // Uncomment to redirect after successful login
            } else {
                alert('SignUp failed');
            errorSpace.innerText ="Signup Failed";

            }
        })
        .catch(error => {
            console.error('SignUp error:', error.message);
            // alert(error.message); // Show the exact error message
            errorSpace.innerText = error.message;
        });
    }


    })
})


// data [username, password] => post request
// get request 