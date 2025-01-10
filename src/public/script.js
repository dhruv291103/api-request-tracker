let attemptCount = 0;
const maxAttempts = 5;
const correctPassword = "12345678"; // Default password for all users

document.getElementById('testForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;  // User's input password
    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn'); // Reference to the submit button
    
    try {
        // If the number of attempts is already 5, disable the submit button and return
        if (attemptCount >= maxAttempts) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Maximum attempts reached! You cannot submit anymore.';
            submitBtn.disabled = true; // Disable the submit button
            return;
        }

        // Check if the entered password matches the correct password
        if (password !== correctPassword) {
            // Incorrect password, increment the wrong attempt counter
            attemptCount++;
            document.getElementById('attemptCount').textContent = attemptCount;

            messageDiv.className = 'message error';
            messageDiv.textContent = 'Incorrect password. Please try again.';

            // Check if the maximum attempt threshold is reached
            if (attemptCount >= maxAttempts) {
                messageDiv.textContent = 'Maximum attempts reached! An alert has been sent to your email (check Spam),';
                await triggerEmailAlert(email);
                submitBtn.disabled = true; // Disable the submit button
            }
        } else {
            // Reset the attempt count on correct password
            attemptCount = 0;
            document.getElementById('attemptCount').textContent = attemptCount;

            messageDiv.className = 'message success';
            messageDiv.textContent = 'Request successful!';
        }
    } catch (error) {
        messageDiv.className = 'message error';
        messageDiv.textContent = 'Error making request: ' + error.message;
    }
});

// Function to send email alert when maximum attempts are reached
async function triggerEmailAlert(email) {
    try {
        const response = await fetch('/api/sendAlert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        });
        
        if (!response.ok) {
            console.log('Failed to send alert email.');
        }
    } catch (error) {
        console.log('Error triggering email alert:', error);
    }
}
