document.addEventListener("DOMContentLoaded", function() {
    // Get all the main menu items
    const dashboardLink = document.querySelector(".dashboard");
    const userInfoLink = document.getElementById("showUserInfo");
    const registeredStudentLink = document.querySelector(".registered-student");
    const assignmentLink = document.querySelector(".assignment");
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
        <h2>Registered Students</h2>
        <p>Manage your students and their enrollment status here.</p>
        <table id="students-table">
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Student Name</th>
                    <th>Enrollment Date</th>
                </tr>
            </thead>
            <tbody>
                <!-- Students will be dynamically loaded here -->
            </tbody>
        </table>
    `;
    document.querySelector(".main-content").appendChild(registeredStudentsSection);
    
    // Create placeholder for assignments section
    const assignmentsSection = document.createElement("div");
    assignmentsSection.id = "assignments";
    assignmentsSection.classList.add("hidden");
    assignmentsSection.innerHTML = `
        <h2>Assignments</h2>
        <p>Create and manage assignments for your students.</p>
        <button id="create-assignment">Create New Assignment</button>
        <div id="assignments-list">
            <!-- Assignments will be dynamically loaded here -->
        </div>
    `;
    document.querySelector(".main-content").appendChild(assignmentsSection);
    
    // Function to hide all sections
    function hideAllSections() {
        userInfoSection.classList.add("hidden");
        settingsSection.classList.add("hidden");
        dashboardSection.classList.add("hidden");
        registeredStudentsSection.classList.add("hidden");
        assignmentsSection.classList.add("hidden");
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
    registeredStudentLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        registeredStudentsSection.classList.remove("hidden");
        
        // Mock data for demonstration - in a real app, this would be fetched from the server
        const mockStudents = [
            { id: "S001", name: "John Doe", enrollmentDate: "2023-09-01" },
            { id: "S002", name: "Jane Smith", enrollmentDate: "2023-09-02" },
            { id: "S003", name: "Robert Johnson", enrollmentDate: "2023-09-03" }
        ];
        
        const tbody = document.querySelector("#students-table tbody");
        tbody.innerHTML = ""; // Clear existing rows
        
        mockStudents.forEach(student => {
            tbody.innerHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>${student.enrollmentDate}</td>
                </tr>
            `;
        });
    });
    
    // Assignments button click handler
    assignmentLink.addEventListener("click", function(event) {
        event.preventDefault();
        hideAllSections();
        assignmentsSection.classList.remove("hidden");
        
        // Mock data for demonstration
        const mockAssignments = [
            { id: 1, title: "Midterm Assignment", dueDate: "2023-10-15" },
            { id: 2, title: "Final Project", dueDate: "2023-12-01" }
        ];
        
        const assignmentsList = document.getElementById("assignments-list");
        assignmentsList.innerHTML = ""; // Clear existing assignments
        
        mockAssignments.forEach(assignment => {
            const assignmentCard = document.createElement("div");
            assignmentCard.classList.add("assignment-card");
            assignmentCard.innerHTML = `
                <h3>${assignment.title}</h3>
                <p>Due Date: ${assignment.dueDate}</p>
                <div class="assignment-actions">
                    <button class="edit-assignment" data-id="${assignment.id}">Edit</button>
                    <button class="delete-assignment" data-id="${assignment.id}">Delete</button>
                </div>
            `;
            assignmentsList.appendChild(assignmentCard);
        });
    });
    
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