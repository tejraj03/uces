document.addEventListener("DOMContentLoaded", function() {
    // Get all the main menu items
    const dashboardLink = document.querySelector(".dashboard");
    const userInfoLink = document.getElementById("showUserInfo");
    const registeredStudentLink = document.querySelector(".registered-student");
    const settingsLink = document.getElementById("showSettings");
    
    // Get all content sections
    const userInfoSection = document.getElementById("user-info");
    const settingsSection = document.getElementById("settings");
    const dashboardSection = document.createElement("div");
    dashboardSection.id = "dashboard-section";
    
    // Create initial dashboard with placeholder welcome message
    dashboardSection.innerHTML = `
        <div class="welcome-message">
            <h2>Welcome, Loading...</h2>
            <p>Access your information and manage your students from this dashboard.</p>
        </div>
    `;
    document.querySelector(".main-content").appendChild(dashboardSection);
    
    // Create placeholder for registered students section
    const registeredStudentsSection = document.createElement("div");
    registeredStudentsSection.id = "registered-students";
    registeredStudentsSection.classList.add("hidden");
    registeredStudentsSection.innerHTML = `
 <h2>Students Enrolled in Your Course</h2>
        <div class="table-section">
            <table id="students-table">
                <thead>
                    <tr>
                        <th>Student ID</th>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Application Status</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Students will be loaded dynamically -->
                </tbody>
            </table>
    `;
    document.querySelector(".main-content").appendChild(registeredStudentsSection);
    
    
    // Function to hide all sections
    function hideAllSections() {
        userInfoSection.classList.add("hidden");
        settingsSection.classList.add("hidden");
        dashboardSection.classList.add("hidden");
        registeredStudentsSection.classList.add("hidden");
        timetableSection.classList.add("hidden"); // Hide timetable section too

        
    }
    
    // Dashboard button click handler
    dashboardLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        dashboardSection.classList.remove("hidden");
    });
    
    // Function to fetch instructor data
    function fetchInstructorData() {
        return fetch("/get-instructor-data")
            .then(response => response.json())
            .then(data => {
                console.log("🔍 Data received from server:", data);
                return data;
            })
            .catch(error => {
                console.error("❌ Fetch Error:", error);
                alert("❌ Failed to fetch instructor data.");
                return null;
            });
    }
    
    // User Info button click handler
    userInfoLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        
        // Fetch instructor data from server
        fetchInstructorData().then(data => {
            if (data && data.success) {
                document.getElementById("instructor-id").textContent = `ID: ${data.instructor_id}`;
                document.getElementById("instructor-name").textContent = `Name: ${data.instructor_name}`;
                document.getElementById("course-id").textContent = `Course ID: ${data.course_id}`;
                document.getElementById("course-name").textContent = `Course: ${data.course_name}`;
            
                userInfoSection.classList.remove("hidden");
            }
        });
    });
    
    // Registered Students button click handler
// Add this after your existing event listeners
registeredStudentLink.addEventListener("click", function(event) {
    event.preventDefault();
    hideAllSections();
    document.getElementById("registered-students").classList.remove("hidden");
    loadEnrolledStudents();
});

function loadEnrolledStudents() {
    fetch("/get-instructor-data")
        .then(response => response.json())
        .then(instructorData => {
            if (instructorData.success) {
                return fetch(`/api/instructor-students/${instructorData.instructor_id}`);
            }
            throw new Error("Failed to get instructor data");
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                const tbody = document.querySelector('#students-table tbody');
                tbody.innerHTML = '';
                
                if (data.students.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="4" class="no-data">No students currently enrolled</td></tr>';
                    return;
                }

                data.students.forEach(student => {
                    const statusClass = student.status.toLowerCase();
                    tbody.innerHTML += `
                        <tr>
                            <td>${student.student_id}</td>
                            <td>${student.student_name}</td>
                            <td>${student.student_email}</td>
                            <td>
                                <span class="status-badge ${statusClass}">
                                    ${student.status}
                                </span>
                            </td>
                        </tr>
                    `;
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            const tbody = document.querySelector('#students-table tbody');
            tbody.innerHTML = '<tr><td colspan="4" class="error-message">Error loading students. Please try again.</td></tr>';
        });
}// Add this function for viewing student details
window.viewStudentDetails = function(studentId) {
    // Implement student details view functionality
    alert('View student details functionality coming soon!');
};    
    
    // Settings button click handler
    settingsLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        settingsSection.classList.remove("hidden");
    });
    
    // Handle settings form submissions
    document.getElementById("email-form").addEventListener("submit", async function(e) {
        e.preventDefault();
        const newEmail = this.newEmail.value;
        const currentPassword = this.currentPassword.value;

        try {
            const res = await fetch("/update-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ newEmail, currentPassword })
            });

            const data = await res.json();
            alert(data.message || "Email updated successfully!");
        } catch (error) {
            console.error("Error updating email:", error);
            alert("Failed to update email. Please try again.");
        }
    });

    document.getElementById("password-form").addEventListener("submit", async function(e) {
        e.preventDefault();
        const currentPassword = this.currentPassword.value;
        const newPassword = this.newPassword.value;

        try {
            const res = await fetch("/update-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await res.json();
            alert(data.message || "Password updated successfully!");
        } catch (error) {
            console.error("Error updating password:", error);
            alert("Failed to update password. Please try again.");
        }
    });
    
    // Fetch instructor data and update welcome message when page loads
    fetchInstructorData().then(data => {
        if (data && data.success) {
            // Update the welcome message with instructor name
            document.querySelector(".welcome-message h2").textContent = `Welcome, ${data.instructor_name}!`;
        }
    });
    
    // Show dashboard by default when page loads
    hideAllSections();
    dashboardSection.classList.remove("hidden");
});
// filepath: c:\Users\Admin\Desktop\dbms\uces\public\instructor.js
// Add this code after existing event listeners

// Create the Timetable Section (only once)
const timetableSection = document.createElement("div");
timetableSection.id = "timetable-section";
timetableSection.classList.add("section", "hidden");
timetableSection.innerHTML = `
    <div class="card">
        <h2>Class Timetable</h2>
        <div class="table-section">
            <table id="timetable">
                <thead>
                    <tr>
                        <th>Day</th>
                        <th>Course</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Room</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Timetable entries will be loaded dynamically -->
                </tbody>
            </table>
        </div>
    </div>
`;
document.querySelector(".main-content").appendChild(timetableSection);

// Event handler for the Timetable link
document.querySelector(".timetable").addEventListener("click", function(event) {
    event.preventDefault();
    
    // Hide all sections (adjust if you have more sections)
    document.getElementById("user-info").classList.add("hidden");
    document.getElementById("settings").classList.add("hidden");
    document.getElementById("dashboard-section").classList.add("hidden");
    document.getElementById("registered-students").classList.add("hidden");
    
    // Show only the timetable section
    timetableSection.classList.remove("hidden");
    loadTimetable();
});

// Function to fetch and display timetable data
function formatTime(timeStr) {
    return new Date('1970-01-01T' + timeStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function loadTimetable() {
    const userId = document.getElementById("instructor-id").textContent.split(": ")[1];
    fetch(`/api/timetable/${userId}`)
        .then(response => response.json())
        .then(data => {
            const tbody = document.querySelector("#timetable tbody");
            tbody.innerHTML = "";
            if (data.success && data.timetable.length > 0) {
                data.timetable.forEach(entry => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${entry.day_of_week}</td>
                            <td>${entry.course_name}</td>
                            <td>${formatTime(entry.start_time)}</td>
                            <td>${formatTime(entry.end_time)}</td>
                            <td>${entry.room_number}</td>
                        </tr>
                    `;
                });
            } else {
                tbody.innerHTML = '<tr><td colspan="5">No timetable entries found.</td></tr>';
            }
        })
        .catch(error => {
            console.error("Error loading timetable:", error);
            const tbody = document.querySelector("#timetable tbody");
            tbody.innerHTML = '<tr><td colspan="5">Error loading timetable.</td></tr>';
        });
}