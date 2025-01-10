let attemptCount = 0;
const maxAttempts = 5;
const correctPassword = "12345678";

document.getElementById('testForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');
    const submitBtn = document.getElementById('submitBtn');

    try {
        if (attemptCount >= maxAttempts) {
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Maximum attempts reached! You cannot submit anymore.';
            submitBtn.disabled = true;
            return;
        }

        if (password !== correctPassword) {
            attemptCount++;
            document.getElementById('attemptCount').textContent = attemptCount;
            messageDiv.className = 'message error';
            messageDiv.textContent = 'Incorrect password. Please try again.';
            if (attemptCount >= maxAttempts) {
                messageDiv.textContent = 'Maximum attempts reached! An alert has been sent to your email (check Spam),';
                await triggerEmailAlert(email);
                submitBtn.disabled = true;
            }
        } else {
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
