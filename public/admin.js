document.addEventListener('DOMContentLoaded', function() {
    const instructorSection = document.getElementById('instructor-management');
    const addInstructorForm = document.getElementById('add-instructor-form');
    const courseSelect = document.querySelector('select[name="courseId"]');

    // Show instructor management when clicking the menu item
    document.querySelector('.registered-student').addEventListener('click', function(e) {
        e.preventDefault();
        instructorSection.classList.add('active');
        loadInstructors();
        loadCourses();
    });

    // Load available courses for the dropdown
    function loadCourses() {
        fetch('/courses')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    courseSelect.innerHTML = '<option value="">Select Course</option>';
                    data.courses.forEach(course => {
                        courseSelect.innerHTML += `
                            <option value="${course.course_id}">${course.course_name}</option>
                        `;
                    });
                }
            })
            .catch(error => console.error('Error loading courses:', error));
    }

    function loadInstructors() {
        fetch('/api/instructors')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const tbody = document.querySelector('#instructors-table tbody');
                    tbody.innerHTML = '';
                    data.instructors.forEach(instructor => {
                        tbody.innerHTML += `
                            <tr data-id="${instructor.instructor_id}">
                                <td>${instructor.instructor_id}</td>
                                <td>${instructor.instructor_name}</td>
                                <td>${instructor.email}</td>
                                <td>${instructor.course_id}</td>
                                <td>
                                    <button onclick="editInstructor(${instructor.instructor_id})" 
                                            class="action-button edit-btn">Edit</button>
                                    <button onclick="deleteInstructor(${instructor.instructor_id})" 
                                            class="action-button delete-btn">Delete</button>
                                </td>
                            </tr>
                        `;
                    });
                }
            })
            .catch(error => console.error('Error loading instructors:', error));
    }
    // Add new instructor
    addInstructorForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            instructorName: this.instructorName.value,
            email: this.email.value,
            password: this.password.value,
            courseId: this.courseId.value
        };

        fetch('/api/instructors', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Instructor added successfully!');
                this.reset();
                loadInstructors();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });

    // Make these functions available globally
    window.editInstructor = function(id) {
        const row = document.querySelector(`tr[data-id="${id}"]`);
        const name = prompt('Enter new name:', row.cells[1].textContent);
        const email = prompt('Enter new email:', row.cells[2].textContent);
        const courseId = prompt('Enter new course ID:', row.cells[3].textContent);

        if (name && email && courseId) {
            fetch(`/api/instructors/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, courseId })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Instructor updated successfully!');
                    loadInstructors();
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
        }
    };

    window.deleteInstructor = function(id) {
        if (confirm('Are you sure you want to delete this instructor?')) {
            fetch(`/api/instructors/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Instructor deleted successfully!');
                    loadInstructors(); // Reload the instructor list
                } else {
                    alert('Error: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to delete instructor');
            });
        }
    };
});
document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    const body = document.body;
    const icon = darkModeToggle.querySelector("i"); // Select the icon inside the button

    // Function to update icon
    function updateIcon() {
        if (body.classList.contains("dark-mode")) {
            icon.classList.remove("bx-sun");
            icon.classList.add("bx-moon");
        } else {
            icon.classList.remove("bx-moon");
            icon.classList.add("bx-sun");
        }
    }

    // Dark Mode Toggle
    darkModeToggle.addEventListener("click", () => {
        body.classList.toggle("dark-mode");

        // Save preference in local storage
        localStorage.setItem("darkMode", body.classList.contains("dark-mode"));

        // Update icon
        updateIcon();
    });

    // Load Dark Mode Preference from Local Storage
    if (localStorage.getItem("darkMode") === "true") {
        body.classList.add("dark-mode");
    }

    // Ensure correct icon on load
    updateIcon();
});
// Show course management when clicking the courses menu item
// Update the click handlers to hide all sections first
document.querySelector('.userinfo').addEventListener('click', function(e) {
    e.preventDefault();
    // Hide all sections first
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    // Show only course management
    document.getElementById('course-management').classList.add('active');
    loadCoursesManagement();
});

document.querySelector('.registered-student').addEventListener('click', function(e) {
    e.preventDefault();
    // Hide all sections first
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    // Show only instructor management
    document.getElementById('instructor-management').classList.add('active');
    loadInstructors();
});

// Load courses and populate the courses table
function loadCoursesManagement() {
    fetch('/courses')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tbody = document.querySelector('#courses-table tbody');
                tbody.innerHTML = '';
                data.courses.forEach(course => {
                    tbody.innerHTML += `
                        <tr data-id="${course.course_id}">
                            <td>${course.course_id}</td>
                            <td>${course.course_name}</td>
                            <td>${course.credits}</td>
                            <td>
                                <button onclick="deleteCourse(${course.course_id})" class="action-button delete-btn">Delete</button>
                            </td>
                        </tr>
                    `;
                });
            }
        })
        .catch(error => console.error('Error loading courses:', error));
}

// Add new course event listener
const addCourseForm = document.getElementById('add-course-form');
if (addCourseForm) {
    addCourseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const formData = {
            course_id: this.courseId.value,
            course_name: this.courseName.value,
            credits: this.credits.value
        };

        fetch('/api/courses', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Course added successfully!');
                this.reset();
                loadCoursesManagement();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => console.error('Error:', error));
    });
}

// Make deleteCourse function available globally
window.deleteCourse = function(courseId) {
    if (confirm('Are you sure you want to delete this course?')) {
        fetch(`/api/courses/${courseId}`, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Course deleted successfully!');
                loadCoursesManagement();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete course');
        });
    }
};