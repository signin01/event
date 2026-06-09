// Get event name from URL parameter if coming from events page
document.addEventListener('DOMContentLoaded', function() {
    // Check if there's an event name in the URL
    const urlParams = new URLSearchParams(window.location.search);
    const eventName = urlParams.get('event');
    if (eventName) {
        const eventSelect = document.getElementById('eventName');
        if (eventSelect) {
            eventSelect.value = eventName;
            const hint = document.getElementById('selectedEventHint');
            if (hint) {
                hint.innerHTML = `📌 Selected Event: <strong>${eventName}</strong>`;
            }
        }
    }
});

// Handle form submission
const feedbackForm = document.getElementById('feedbackForm');
if (feedbackForm) {
    feedbackForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('fullName').value.trim();
        const email = document.getElementById('email').value.trim();
        const eventName = document.getElementById('eventName').value;
        const rating = parseInt(document.getElementById('rating').value);
        const feedback = document.getElementById('feedback').value.trim();
        
        // Validate
        if (!fullName || !email || !eventName || !rating || !feedback) {
            showMessage('Please fill in all fields', 'error');
            return;
        }
        
        // Validate rating is a number
        if (isNaN(rating) || rating < 1 || rating > 5) {
            showMessage('Please select a valid rating', 'error');
            return;
        }
        
        // Create feedback object
        const feedbackData = {
            fullName: fullName,
            email: email,
            eventName: eventName,
            rating: rating,
            feedback: feedback
        };
        
        // Show loading state
        const submitBtn = document.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        try {
            // Submit to backend API
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                showMessage('✅ ' + result.message, 'success');
                feedbackForm.reset();
                setTimeout(() => {
                    window.location.href = '/view-feedback.html';
                }, 2000);
            } else {
                let errorMsg = '❌ ' + (result.message || 'Could not save feedback');
                if (result.errors && result.errors.length > 0) {
                    errorMsg += '<br>' + result.errors.join('<br>');
                }
                showMessage(errorMsg, 'error');
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            showMessage('❌ Error saving feedback. Please check your connection and try again.', 'error');
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Helper function to show messages
function showMessage(msg, type) {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        const bgColor = type === 'success' ? '#d4edda' : '#f8d7da';
        const textColor = type === 'success' ? '#155724' : '#721c24';
        messageDiv.innerHTML = `<div style="padding: 10px; margin: 10px 0; border-radius: 5px; background: ${bgColor}; color: ${textColor};">${msg}</div>`;
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 5000);
    }
}