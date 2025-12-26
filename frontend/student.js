const host = 'http://localhost:3000/api/v1/';
const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = async function(event) {
    const data = JSON.parse(event.data);
    console.log('Received enrollment message:', data);
    if (data.type === 'enrollment') {
        // Fetch and display enrolled courses
        const enrolledCourses = await fetchEnrolledCourses();
        //console.log(enrolledCourses);
        populateCoursesTable(enrolledCourses, 'enrolled-courses');
    }
};

function preventBack(){
    window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload=function(){null};



// Fetch and display student details, enrolled courses, and available courses
async function initializeDashboard() {
    try {
        // Fetch and display student details
        const studentDetails = await fetchStudentDetails();
        displayStudentDetails(studentDetails);

        // Fetch and display enrolled courses
        const enrolledCourses = await fetchEnrolledCourses();
        //console.log(enrolledCourses);
        populateCoursesTable(enrolledCourses, 'enrolled-courses');

        // Fetch and display available courses
        const availableCourses = await fetchAvailableCourses();
        populateCoursesTable2(availableCourses, 'available-courses', true);
    } catch (error) {
        console.error('Error initializing dashboard:', error);
        //alert('Failed to load data. Please try again later.');
    }
}

// Fetch student details from the backend
async function fetchStudentDetails() {
    const id = localStorage.getItem('id');
    const response = await fetch(`${host}students/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if(response.status == 400) throw new Error('Failed to fetch student details');
    if (!response.ok) return;
    return response.json();
}

// Display student details in the HTML
function displayStudentDetails(details) {
    document.getElementById('student-name').textContent = details.firstName + ' ' + details.lastName;
    document.getElementById('student-id').textContent = details.rollNo;
    document.getElementById('student-email').textContent = details.email;
    document.getElementById('student-phone').textContent = details.phoneNumber; // New field
    document.getElementById('student-dob').textContent = details.dateOfBirth.split('T')[0]; // New field, formatting date
    document.getElementById('student-address').textContent = details.address; // New field
    document.getElementById('student-year').textContent = details.yearOfEntry;
    document.getElementById('student-department').textContent = details.department;
    document.getElementById('student-degree').textContent = details.degree; // New field
}

// Fetch enrolled courses from the backend
async function fetchEnrolledCourses() {
    const id=localStorage.getItem('id');
    const response = await fetch(`${host}enrollment/student/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (response.status == 400) throw new Error('Failed to fetch enrolled courses');
    if(!response.ok) return;
    return response.json();
}

// Fetch available courses from the backend
async function fetchAvailableCourses() {
    const response = await fetch(`${host}courses/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (response.status == 400) throw new Error('Failed to fetch available courses');
    if(!response.ok) return;
    return response.json();
}

// Populate the course tables
function populateCoursesTable(enrollments, tableId, showAction = false) {
    console.log(enrollments);
    if(enrollments == null || enrollments.error){
        return;
    }
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = ''; // Clear existing courses
    
    enrollments.forEach(enrollment => {
        const course = enrollment.Course;
        const instructorName = `${course.Faculty.firstName} ${course.Faculty.lastName}`;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${enrollment.Course.courseCode}</td>
            <td>${course.courseTitle}</td>
            <td>${course.academicSession}</td>
            <td>${instructorName}</td>
            <td>${enrollment.status}</td>
            <td>${course.credits}</td>
            ${showAction ? `<td><button onclick="applyCourse('${enrollment.id}')"><i class="fas fa-plus"></i> Apply</button></td>` : ''}
        `;
        tableBody.appendChild(row);
    });
}

function populateCoursesTable2(courses, tableId, showAction = false) {
    const tableBody = document.getElementById(tableId);
    tableBody.innerHTML = ''; // Clear existing courses
    if(courses.error){
        return;
    }
    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.courseCode}</td>
            <td>${course.courseTitle}</td>
            <td>${course.academicSession}</td>
            <td>${course.Faculty.firstName} ${course.Faculty.lastName}</td>
            <td>${course.status}</td>
            <td>${course.credits}</td>
            ${showAction ? `<td><button onclick="applyCourse('${course.id}')"><i class="fas fa-plus"></i> Apply</button></td>` : ''}
        `;
        tableBody.appendChild(row);
    });
}


// Apply for a course
async function applyCourse(courseId) {
    const id = localStorage.getItem('id');
    try {
        const response = await fetch(`${host}enrollment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ "enrollmentType": "Credit", "status": "Enrolled", "studentID": id, "courseID": courseId }),
            credentials: 'include',
        });
        const message = await response.json().then(data => data.message);
        if(message == 'Enrollment already exists') throw new Error('Enrollment request already made for this course');
        if (!response.ok) throw new Error('Failed to apply for the course');
        
        const result = await response.json();
        alert(`Successfully applied for the course`);
        initializeDashboard(); // Reload the dashboard to update the data
        socket.send(JSON.stringify({ type: 'enrollment' }));
    } catch (error) {
        console.error('Error applying for course:', error);
        alert(error);
    }
}

// Logout functionality
document.getElementById('logout-button').addEventListener('click', () => {
    fetch(`${host}auth/logout`, { method: 'POST', credentials: 'include' })
        .then(response => {
            if (response.ok) {
                alert('Logged out successfully');
                window.location.href = '/frontend/index.html'; // Redirect to login page
            } else {
                throw new Error('Logout failed');
            }
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('Logout failed. Please try again.');
        });
});

// Load the dashboard when the page is ready
document.addEventListener('DOMContentLoaded', initializeDashboard);
// Toggle section visibility
function toggleSection(sectionId) {
    const sectionContent = document.getElementById(sectionId);
    const chevron = sectionContent.previousElementSibling.querySelector('.fa-chevron-down');

    sectionContent.classList.toggle('collapsed');
    chevron.style.transform = sectionContent.classList.contains('collapsed') ? 'rotate(0deg)' : 'rotate(180deg)';
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeDashboard();

    // Collapse sections by default
    document.getElementById('enrolled-courses-content').classList.add('collapsed');
    document.getElementById('available-courses-content').classList.add('collapsed');
});

// Search functionality for courses
function searchCourses(tableId, searchInputId) {
    const searchInput = document.getElementById(searchInputId).value.toLowerCase();
    const tableBody = document.getElementById(tableId);
    const rows = tableBody.getElementsByTagName('tr');

    for (let row of rows) {
        const cells = row.getElementsByTagName('td');
        let match = false;

        for (let cell of cells) {
            if (cell.textContent.toLowerCase().includes(searchInput)) {
                match = true;
                break;
            }
        }

        row.style.display = match ? '' : 'none';
    }
}
