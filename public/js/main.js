// Active link highlighting
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    const links = document.querySelectorAll('.nav-menu a');
    
    links.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Check database connection status
    fetch('/api/welcome')
        .then(response => response.json())
        .then(data => {
            console.log('✅ API Status:', data);
            if (data.database) {
                console.log('📊 Database:', data.database);
            }
        })
        .catch(err => console.error('❌ API Error:', err));
});
