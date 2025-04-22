# University Course Enrollment System (UCES)

A web-based system for managing university course enrollments, instructors, and student registrations.

## Features

### User Authentication & Authorization
- Multi-role login system (Admin/Instructor/Student)
- Remember me functionality
- Secure password hashing with bcrypt
- Session management

### Admin Dashboard
- Instructor Management (Add/Edit/Remove)
- Course Management (Add/Remove courses)
- Enrollment Management
- Timetable Management
- System Monitoring

### Instructor Portal
- View Assigned Courses
- Manage Student Enrollments
- Access Teaching Schedule
- Profile Management

### Student Features
- Course Registration
- View/Drop Enrolled Courses
- Personal Timetable
- Profile Settings

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express
- **Database:** MySQL
- **Security:** bcrypt, express-session

## Installation

1. **Clone Repository**
   ```
   git clone https://github.com/tejraj03/uces.git
   cd uces   
   ```
2. **Install Dependencies**
   ```
   npm install bcrypt body-parser express express-session mysql2
   ```
3. **Database Setup**
## Database Setup

### Create and Initialize Database
```sql
CREATE DATABASE University_Course_Enrollment;
USE University_Course_Enrollment;
```

### Create Tables

1. **Users Table**
```sql
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'student', 'instructor') NOT NULL
);
```

2. **Courses Table**
```sql
CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_name VARCHAR(200) NOT NULL,    
    credits INT NOT NULL CHECK (credits > 0)
);
```

3. **Students Table**
```sql
CREATE TABLE students (
    student_id INT PRIMARY KEY,
    student_name VARCHAR(30) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

4. **Enrollment Table**
```sql
CREATE TABLE enrollment (
    enrollment_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id INT NOT NULL,
    course_id INT NOT NULL,
    status ENUM('pending', 'approved', 'dropped') DEFAULT 'pending',
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, course_id)
);
```

5. **Instructor Table**
```sql
CREATE TABLE instructor (
    instructor_id INT PRIMARY KEY,
    instructor_name VARCHAR(30) NOT NULL,
    course_id INT NOT NULL,
    course_name VARCHAR(200) NOT NULL,
    FOREIGN KEY (instructor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE
);
```

6. **Admin Table**
```sql
CREATE TABLE admin (
    action_id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action_type VARCHAR(255) NOT NULL,
    action_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(user_id) ON DELETE CASCADE
);
```

7. **Timetable Table**
```sql
CREATE TABLE timetable (
    id INT PRIMARY KEY AUTO_INCREMENT,
    course_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(10) NOT NULL,
    FOREIGN KEY (course_id) REFERENCES courses(course_id) ON DELETE CASCADE,
    UNIQUE KEY unique_schedule (course_id, day_of_week, start_time, room_number)
);
```

### Create Default Admin User
```sql
INSERT INTO users (name, email, password, role) 
VALUES (
    'System Admin',
    'admin@uces.com',
    '$2b$10$YourHashedPasswordHere', -- Default: admin123
    'admin'
);
```

### Key Features:
- Auto-incrementing primary keys
- Referential integrity with CASCADE rules
- Unique constraints to prevent duplicates
- Default timestamps for audit trails
- Enum types for status and days
- Credit validation for courses
- Secure password storage (255 chars for bcrypt)
- Unique schedule validation for timetable

### Notes:
1. Run statements in order (tables with dependencies last)
2. Replace hashed password in admin creation
3. Backup existing data before modifications
4. All foreign keys use CASCADE delete
5. Email addresses must be unique
6. Course credits must be positive
7. Timetable prevents scheduling conflicts




4. **Configure Database Connection**
   
- Update server.js with your database credentials:
```
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "your_password",
    database: "University_Course_Enrollment"
});

```


6. **Start Server**
- Start server in terminal
```
npm start
```

## Default Admin Credentials
```
Email: admin@uces.com
Password: admin123
```

## Project Structure
```
uces/
├── public/
│   ├── admin.html      # Admin dashboard
│   ├── instructor.html # Instructor portal
│   ├── homepage.html   # Student dashboard
│   ├── login.html     
│   ├── signup.html    
│   ├── welcome.html   
│   ├── *.css          # Stylesheets
│   └── *.js           # Client-side scripts
├── server.js          # Main server file
└── package.json
```

## Security Notes

1. Change default admin password after first login
2. All passwords are hashed using bcrypt
3. Session management prevents unauthorized access

## Contributing Guidelines

1. Fork the repository
2. Create feature branch (`git checkout -b feature/YourFeature`)
3. Commit changes (`git commit -m 'Add YourFeature'`)
4. Push to branch (`git push origin feature/YourFeature`)
5. Open Pull Request

## All Rights Reserved

This project and associated source code are proprietary. Unauthorized copying, modification, or distribution is prohibited without written permission.

## Contact

Project Link: https://github.com/tejraj03/uces
