// Auto-fill selected event from events page
document.addEventListener('DOMContentLoaded', function() {
    const selectedEvent = localStorage.getItem('selectedEvent');
    if (selectedEvent) {
        const eventSelect = document.getElementById('eventName');
        if (eventSelect) {
            eventSelect.value = selectedEvent;
            const hint = document.getElementById('selectedEventHint');
            if (hint) {
                hint.innerHTML = `📌 You are providing feedback for: <strong>${selectedEvent}</strong>`;
            }
        }
        localStorage.removeItem('selectedEvent');
    }
});

// Handle form submission
document.getElementById('feedbackForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = document.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Submitting...';
    submitBtn.disabled = true;
    
    const formData = {
        fullName: document.getElementById('fullName').value.trim(),
        email: document.getElementById('email').value.trim(),
        eventName: document.getElementById('eventName').value,
        rating: parseInt(document.getElementById('rating').value),
        feedback: document.getElementById('feedback').value.trim()
    };
    
    const messageDiv = document.getElementById('message');
    
    try {
        const response = await fetch('/api/feedback', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        
        if (result.success) {
            messageDiv.innerHTML = '<div class="success-message" style="padding: 10px; margin: 10px 0; border-radius: 5px; background: #d4edda; color: #155724;">✅ ' + result.message + '</div>';
            document.getElementById('feedbackForm').reset();
            setTimeout(() => {
                window.location.href = '/view-feedback.html';
            }, 2000);
        } else {
            let errorMsg = '❌ ' + result.message;
            if (result.errors) {
                errorMsg += '<br>' + result.errors.join('<br>');
            }
            messageDiv.innerHTML = '<div class="error-message" style="padding: 10px; margin: 10px 0; border-radius: 5px; background: #f8d7da; color: #721c24;">' + errorMsg + '</div>';
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    } catch (error) {
        console.error('Error:', error);
        messageDiv.innerHTML = '<div class="error-message" style="padding: 10px; margin: 10px 0; border-radius: 5px; background: #f8d7da; color: #721c24;">❌ Error submitting feedback. Please check your connection and try again.</div>';
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
});