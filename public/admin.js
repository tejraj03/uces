document.addEventListener('DOMContentLoaded', function() {
     // Hide all sections first
     document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });

    // Show student management section by default
    document.getElementById('student-management').classList.add('active');
    loadEnrollments(); // Load the enrollment data immediately

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
    document.getElementById('logoutBtn').addEventListener('click', async function(e) {
        e.preventDefault();
        try {
            const response = await fetch('/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                // Clear any stored data
                sessionStorage.clear();
                localStorage.clear();
                
                // Prevent going back
                window.location.replace('/login.html');
                
                // Prevent browser back button
                window.history.pushState(null, '', '/login.html');
                window.addEventListener('popstate', function() {
                    window.history.pushState(null, '', '/login.html');
                });
            } else {
                throw new Error('Logout failed');
            }
        } catch (error) {
            console.error("Error during logout:", error);
            alert("Error logging out. Please try again.");
        }
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
// Add this to your existing DOMContentLoaded event listener
document.querySelector('.dashboard').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('student-management').classList.add('active');
    loadEnrollments();
});

function loadEnrollments() {
    // Load pending enrollments
    fetch('/api/pending-enrollments')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tbody = document.querySelector('#pending-enrollments-table tbody');
                tbody.innerHTML = '';
                data.enrollments.forEach(enrollment => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${enrollment.student_id}</td>
                            <td>${enrollment.student_name}</td>
                            <td>${enrollment.course_id}</td>
                            <td>${enrollment.course_name}</td>
                            <td>
                                <button onclick="approveEnrollment(${enrollment.enrollment_id})" 
                                        class="action-button approve-btn">Approve</button>
                                <button onclick="rejectEnrollment(${enrollment.enrollment_id})" 
                                        class="action-button reject-btn">Reject</button>
                            </td>
                        </tr>
                    `;
                });
            }
        });

    // Load current enrollments
// Replace the current enrollments fetch code with this updated version:
fetch('/api/current-enrollments')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const tbody = document.querySelector('#current-enrollments-table tbody');
            tbody.innerHTML = '';
            
            // Group enrollments by student
            const studentEnrollments = new Map();
            
            data.enrollments.forEach(enrollment => {
                const studentId = enrollment.student_id;
                
                if (!studentEnrollments.has(studentId)) {
                    studentEnrollments.set(studentId, {
                        student_id: enrollment.student_id,
                        student_name: enrollment.student_name,
                        courses: []
                    });
                }
                
                const courses = enrollment.courses.split(', ');
                const enrollmentIds = enrollment.enrollment_ids.split(',');
                const statuses = enrollment.statuses.split(',');
                const courseIds = enrollment.course_ids.split(',');
                
                for (let i = 0; i < courses.length; i++) {
                    studentEnrollments.get(studentId).courses.push({
                        course_id: courseIds[i],
                        course_name: courses[i],
                        status: statuses[i],
                        enrollment_id: enrollmentIds[i]
                    });
                }
            });
            
            // Generate HTML for each student
            studentEnrollments.forEach(student => {
                // Add student header row
                tbody.innerHTML += `
                    <tr class="student-header">
                        <td rowspan="${student.courses.length}">${student.student_id}</td>
                        <td rowspan="${student.courses.length}">${student.student_name}</td>
                        <td>${student.courses[0].course_id}</td>
                        <td>${student.courses[0].course_name.split(' (')[0]}</td>
                        <td><span class="status-${student.courses[0].status.toLowerCase()}">${student.courses[0].status}</span></td>
                        <td>${student.courses[0].status === 'dropped' 
                            ? `<button onclick="reEnrollStudent(${student.courses[0].enrollment_id})" class="action-button re-enroll-btn">Re-enroll</button>`
                            : `<button onclick="dropStudent(${student.courses[0].enrollment_id})" class="action-button delete-btn">Drop</button>`
                        }</td>
                    </tr>`;
                
                // Add remaining courses rows
                for (let i = 1; i < student.courses.length; i++) {
                    const course = student.courses[i];
                    tbody.innerHTML += `
                        <tr>
                            <td>${course.course_id}</td>
                            <td>${course.course_name.split(' (')[0]}</td>
                            <td><span class="status-${course.status.toLowerCase()}">${course.status}</span></td>
                            <td>${course.status === 'dropped'
                                ? `<button onclick="reEnrollStudent(${course.enrollment_id})" class="action-button re-enroll-btn">Re-enroll</button>`
                                : `<button onclick="dropStudent(${course.enrollment_id})" class="action-button delete-btn">Drop</button>`
                            }</td>
                        </tr>`;
                }
            });
        }
    });
// Add the re-enroll function
window.reEnrollStudent = function(enrollmentId) {
    if (confirm('Are you sure you want to re-enroll this student?')) {
        updateEnrollmentStatus(enrollmentId, 'approved');
    }
};}
// Add these functions after loadEnrollments()
window.approveEnrollment = function(enrollmentId) {
    updateEnrollmentStatus(enrollmentId, 'approved');
};

window.rejectEnrollment = function(enrollmentId) {
    updateEnrollmentStatus(enrollmentId, 'dropped');
};

function updateEnrollmentStatus(enrollmentId, status) {
    fetch(`/api/enrollments/${enrollmentId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert(`Enrollment ${status} successfully!`);
            loadEnrollments(); // Reload both tables
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to update enrollment status');
    });
}

// Add dropStudent function as well
window.dropStudent = function(enrollmentId) {
    if (confirm('Are you sure you want to drop this student from the course?')) {
        updateEnrollmentStatus(enrollmentId, 'dropped');
    }
};
// Add this with your other event listeners
document.querySelector('.timetable').addEventListener('click', function(e) {
    e.preventDefault();
    // Hide all sections first
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    // Show timetable management
    document.getElementById('timetable-management').classList.add('active');
    loadTimetableManagement();
});

// Add these functions for timetable management
function loadTimetableManagement() {
    // Load courses for the dropdown
    fetch('/courses')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const courseSelect = document.querySelector('#add-timetable-form select[name="courseId"]');
                courseSelect.innerHTML = '<option value="">Select Course</option>';
                data.courses.forEach(course => {
                    courseSelect.innerHTML += `
                        <option value="${course.course_id}">${course.course_name}</option>
                    `;
                });
            }
        });

    // Load existing timetable entries
    loadTimetableEntries();
}

function loadTimetableEntries() {
    fetch('/api/timetable')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tbody = document.querySelector('#timetable tbody');
                tbody.innerHTML = '';
                data.timetable.forEach(entry => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${entry.day_of_week}</td>
                            <td>${entry.course_name}</td>
                            <td>${formatTime(entry.start_time)} - ${formatTime(entry.end_time)}</td>
                            <td>${entry.room_number}</td>
                            <td>
                                <button onclick="deleteTimetableEntry(${entry.id})" 
                                        class="action-button delete-btn">Delete</button>
                            </td>
                        </tr>
                    `;
                });
            }
        })
        .catch(error => console.error('Error loading timetable:', error));
}

// Helper function to format time
function formatTime(timeString) {
    return new Date('1970-01-01T' + timeString).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit'
    });
}

// Add timetable entry form submission
document.getElementById('add-timetable-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const formData = {
        courseId: this.courseId.value,
        day: this.day.value,
        startTime: this.startTime.value,
        endTime: this.endTime.value,
        roomNumber: this.roomNumber.value
    };

    fetch('/api/timetable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Timetable entry added successfully!');
            this.reset();
            loadTimetableEntries();
        } else {
            alert('Error: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to add timetable entry');
    });
});

// Delete timetable entry
window.deleteTimetableEntry = function(id) {
    if (confirm('Are you sure you want to delete this timetable entry?')) {
        fetch(`/api/timetable/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert('Timetable entry deleted successfully!');
                loadTimetableEntries();
            } else {
                alert('Error: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to delete timetable entry');
        });
    }
};