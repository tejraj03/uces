document.getElementById("showUserInfo").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default link behavior

    // Hide settings when showing user info
    document.getElementById("settings").classList.add("hidden");

    fetch("/get-instructor-data")
        .then(response => response.json())
        .then(data => {
            console.log("🔍 Data received from server:", data);

            if (data.success) {
                document.getElementById("instructor-id").textContent = `ID: ${data.instructor_id}`;
                document.getElementById("instructor-name").textContent = `Name: ${data.instructor_name}`;
                document.getElementById("course-id").textContent = `Course ID: ${data.course_id}`;
                document.getElementById("course-name").textContent = `Course: ${data.course_name}`;
            
                const userInfo = document.getElementById("user-info");
                userInfo.classList.remove("hidden");       // Removes hidden class
                userInfo.style.display = "block";          // Forces it to show
                userInfo.style.zIndex = 10;                // Makes sure it's on top
            }
            
        })
        .catch(error => {
            console.error("❌ Fetch Error:", error);
            alert("❌ Failed to fetch instructor data.");
        });
});

document.getElementById("showSettings").addEventListener("click", function (e) {
    e.preventDefault();
    // Hide user info when showing settings
    document.getElementById("user-info").classList.add("hidden");
    document.getElementById("settings").classList.remove("hidden");
});
  
// Handle settings form submission
document.getElementById("email-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const newEmail = this.newEmail.value;
    const currentPassword = this.currentPassword.value;

    const res = await fetch("/update-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail, currentPassword })
    });

    const data = await res.json();
    alert(data.message);
});

document.getElementById("password-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const currentPassword = this.currentPassword.value;
    const newPassword = this.newPassword.value;

    const res = await fetch("/update-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword })
    });

    const data = await res.json();
    alert(data.message);
});


