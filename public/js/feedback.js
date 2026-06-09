// Get event name from URL parameter if coming from events page
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get('event');
    if (eventName) {
        document.getElementById('eventName').value = eventName;
        document.getElementById('selectedEventHint').innerHTML = `📌 Selected Event: <strong>${eventName}</strong>`;
    }
});

// Handle form submission
document.getElementById('feedbackForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const eventName = document.getElementById('eventName').value;
    const rating = parseInt(document.getElementById('rating').value);
    const feedback = document.getElementById('feedback').value;
    
    if (!fullName || !email || !eventName || !rating || !feedback) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    const feedbackData = {
        fullName: fullName,
        email: email,
        eventName: eventName,
        rating: rating,
        feedback: feedback
    };
    
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(feedbackData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showMessage('✅ Feedback saved successfully! Thank you!', 'success');
            document.getElementById('feedbackForm').reset();
            setTimeout(() => {
                window.location.href = '/view-feedback.html';
            }, 2000);
        } else {
            showMessage('❌ Error: ' + (result.message || 'Could not save feedback'), 'error');
        }
    } catch (error) {
        console.error('Error submitting feedback:', error);
        showMessage('❌ Error saving feedback. Please try again.', 'error');
    }
});

function showMessage(msg, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.innerHTML = `<div class="alert alert-${type}" style="padding: 10px; margin: 10px 0; border-radius: 5px; background: ${type === 'success' ? '#d4edda' : '#f8d7da'}; color: ${type === 'success' ? '#155724' : '#721c24'};">${msg}</div>`;
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}