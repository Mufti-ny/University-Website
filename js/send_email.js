document.addEventListener('DOMContentLoaded', () => {
    const emailInput = document.querySelector('input[type="email"]');
    const errorSpace = document.getElementById('error');
    const sendEmailBtn = document.querySelector('a');
    const successful = document.getElementById('success')



    console.log(sendEmailBtn.innerText)

    sendEmailBtn.addEventListener('click', (e) => {
        e.preventDefault();
        
    const email = emailInput.value;

    console.log(email)




    if (!email) {
        errorSpace.innerText = "Please Enter all the Fields";
   } 
   if (email){
    errorSpace.innerText = "";
    successful.innerText = "";
    fetch('http://localhost:3000/send-email', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    }).then(response => {
        if (!response.ok) {
            return response.json().then(errorData => { // Capture the error message from backend
                throw new Error(errorData.error || 'invalid user');
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            console.log(data.message);
            successful.innerText = data.message;
            

            // window.location.href = "../index.html"; // Uncomment to redirect after successful login
        } else {
            errorSpace.innerText = "invalid user";
        }
    })
    .catch(error => {
        console.error('Login error:', error);
        
        errorSpace.innerText = error.message;


        

    });
    
}

    })
});