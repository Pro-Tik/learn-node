const firstNameInput = document.querySelector("#first-name");
const lastNameInput = document.querySelector("#last-name");
const mobileNumberInput = document.querySelector("#Mobile");
const agreement = document.querySelector("#agreement");
const pass = document.querySelector("#password");
const submit = document.querySelector("#submit");
const msg = document.querySelector("#msg");

// Listen for the submit event on the button
submit.addEventListener('click', async (event) => { // 👈 1. Make the handler function async
    event.preventDefault(); // Stop the form/button from reloading the page
    msg.innerHTML = ''; // Clear previous messages

    // Capture values directly (assuming the IDs are correct)
    const firstName = firstNameInput.value;
    const lastName = lastNameInput.value;
    // 👈 2. CORRECTED: Use mobileNumberInput.value, not lastNameInput.value
    const mobileNumber = mobileNumberInput.value; 
    const password = pass.value;
    const isAgreed = agreement.checked;

    if (isAgreed) {
        // 3. CORRECTED: Define the object with the variables DIRECTLY, no extra quotes or backticks
        const sendData = {
            "firstName": firstName,       // Variable firstName is used as the value
            "lastName": lastName,         // Variable lastName is used as the value
            "mobileNumber": mobileNumber, // Variable mobileNumber is used as the value
            "pass": password,             // Variable password is used as the value
            "TosAg": "true"
        };
        
        // 4. Call the async function and await its result
        try {
            await sendUser(sendData);
            msg.innerHTML = 'Thank You! Data Sent Successfully.';
        } catch (error) {
            msg.innerHTML = 'Error sending data.';
            console.error(error);
        }

    } else {
        // A more professional error message is generally recommended
        msg.innerHTML = 'Error: You must agree to the Terms of Service.';
    }
});

// Define the async function outside or inside the handler.
// It's cleaner to define it outside and pass the data to it.
async function sendUser(data) {
    // Note: No try/catch here, letting the calling code handle errors
    // so it can update the UI (the 'msg' element)
    const response = await fetch('http://localhost:5000/user', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data) // Use the passed-in data
    });
    
    if (!response.ok) {
        // Throw an error if the response status is 4xx or 5xx
        const errorBody = await response.json();
        throw new Error(`HTTP error! Status: ${response.status}. Message: ${errorBody.message || 'Unknown Error'}`);
    }

    const result = await response.json();
    console.log("Success! Server Response:", result);
    return result;
}

// 5. REMOVED: The original sendUser() call here was misplaced and would execute immediately on page load.