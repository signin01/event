async function loadFeedback() {
    const feedbackList = document.getElementById('feedbackList');
    const statsContainer = document.getElementById('statsContainer');
    
    try {
        // Load statistics
        const statsResponse = await fetch('/api/feedback/stats/summary');
        const statsResult = await statsResponse.json();
        
        if (statsResult.success) {
            statsContainer.innerHTML = `
                <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 20px;">
                    <div style="text-align: center;">
                        <h3>📊 Total Feedback</h3>
                        <p style="font-size: 2rem; color: #667eea;">${statsResult.data.totalFeedback}</p>
                    </div>
                    <div style="text-align: center;">
                        <h3>⭐ Average Rating</h3>
                        <p style="font-size: 2rem; color: #667eea;">${statsResult.data.averageRating.toFixed(1)}/5</p>
                    </div>
                </div>
            `;
        }
        
        // Load feedback
        const response = await fetch('/api/feedback');
        const result = await response.json();
        
        if (result.success && result.data.length > 0) {
            feedbackList.innerHTML = '';
            
            result.data.forEach(feedback => {
                const stars = '⭐'.repeat(feedback.rating);
                const date = new Date(feedback.createdAt);
                const formattedDate = date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                const feedbackItem = `
                    <div class="feedback-item">
                        <h3>🎉 ${escapeHtml(feedback.eventName)}</h3>
                        <p><strong>${escapeHtml(feedback.fullName)}</strong> - ${escapeHtml(feedback.email)}</p>
                        <div class="rating">${stars} (${feedback.rating}/5)</div>
                        <p>💬 ${escapeHtml(feedback.feedback)}</p>
                        <small>📅 Submitted: ${formattedDate}</small>
                    </div>
                `;
                feedbackList.innerHTML += feedbackItem;
            });
        } else {
            feedbackList.innerHTML = '<p style="text-align: center;">📝 No feedback submitted yet. Be the first to share your experience!</p>';
        }
    } catch (error) {
        console.error('Error:', error);
        feedbackList.innerHTML = '<p style="text-align: center; color: red;">❌ Error loading feedback. Please refresh the page and check your internet connection.</p>';
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

loadFeedback();
