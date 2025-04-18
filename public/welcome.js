document.addEventListener('DOMContentLoaded', function() {
    const toggleBtn = document.querySelector(".toggle_btn");
    const toggleBtnIcon = document.querySelector(".toggle_btn i");
    const dropDownMenu = document.querySelector(".dropdown_menu");

    // Toggle mobile menu
    toggleBtn.onclick = function() {
        dropDownMenu.classList.toggle('open');
        const isOpen = dropDownMenu.classList.contains('open');
        toggleBtnIcon.classList = isOpen ? 'fas fa-times' : 'fas fa-bars';
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const section = document.querySelector(this.getAttribute('href'));
            
            if (section) {
                section.scrollIntoView({
                    behavior: 'smooth'
                });
                // Close dropdown menu if open
                dropDownMenu.classList.remove('open');
                toggleBtnIcon.classList = 'fas fa-bars';
            }
        });
    });

    // Contact form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            alert('Message sent successfully!');
            this.reset();
        });
    }
});