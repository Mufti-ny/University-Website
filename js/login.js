// import { response } from "express";

document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.querySelector('input[type="text"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const signInBtn = document.querySelector('a');

    // console.log("value: ", usernameInput.value)
    console.log(signInBtn.innerText)

    signInBtn.addEventListener('click', (e) => {
        e.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        console.log(username,password)

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        }).then(response => {
            if (!response.ok) {
                return response.json().then(errorData => { // Capture the error message from backend
                    throw new Error(errorData.error || 'Login failed');
                });
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log("Login successful:", data.message);
                window.location.href = "../index.html"; // Uncomment to redirect after successful login
            } else {
                alert('Login failed');
            }
        })
        .catch(error => {
            console.error('Login error:', error);
            alert(error.message); // Show the exact error message
        });
        


    })
})


// data [username, password] => post request
// get request 