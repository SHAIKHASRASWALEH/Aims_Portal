const host = 'http://localhost:3000/api/v1/';
const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log('Received enrollment message:', data);
    if (data.type === 'enrollment') {
        fetchPendingEnrollments();
        fetchPendingAdvisorApprovals();
    }
};

function preventBack(){
    window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload=function(){null};

// Fetch courses from the backend
async function fetchCourses() {
    try {
        const response = await fetch(`${host}courses/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Include credentials
        });
        if (response.status == 400) {
            throw new Error('Failed to fetch courses');
        }
        if(!response.ok){
            return;
        }
        const courses = await response.json();
        populateCoursesTable(courses);
    } catch (error) {
        console.error('Error fetching courses:', error);
        alert('Failed to load courses. Please try again later.');
    }
}

// Populate the course list in the table
function populateCoursesTable(courses) {
    const tableBody = document.getElementById('courses-list');
    tableBody.innerHTML = ''; // Clear existing rows

    courses.forEach(course => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${course.courseCode}</td>
            <td>${course.courseTitle}</td>
            <td>${course.academicSession}</td>
            <td>${course.Faculty.firstName} ${course.Faculty.lastName}</td>
            <td>${course.offeringDepartment}</td>
            <td>${course.status}</td>
            <td>${course.credits}</td>
        `;
        tableBody.appendChild(row);
    });
}

// Add a new course
async function addCourse() {
    const courseCode = document.getElementById('course-code').value;
    const courseTitle = document.getElementById('course-title').value;
    const academicSession = document.getElementById('academic-session').value;
    const instructorId = localStorage.getItem("id");
    const offeringDepartment = document.getElementById('offering-department').value;
    const status = document.getElementById('status').value;
    const credits = document.getElementById('credits').value;

    if (!courseCode || !courseTitle || !academicSession || !instructorId || !offeringDepartment || !status || !credits) {
        alert('Please fill in all fields.');
        return;
    }

    const newCourse = {
        courseCode,
        courseTitle,
        academicSession,
        instructorId,
        offeringDepartment,
        status,
        credits
    };

    try {
        const response = await fetch(`${host}courses/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCourse),
            credentials: 'include' // Include credentials
        });

        const message = await response.json().then(data => data.message);
        if(message === 'Course already exists'){
            alert('Course already exists');
            return;
        }

        if (!response.ok) {
            throw new Error('Failed to add course');
        }

        alert('Course added successfully!');
        fetchCourses(); // Refresh course list
    } catch (error) {
        console.error('Error adding course:', error);
        alert('Failed to add course. Please try again later.');
    }
}

// Fetch faculty details
async function fetchFacultyDetails() {
    try {
        const id = localStorage.getItem("id");
        const response = await fetch(`${host}faculty/${id}`, { // Fetch for a particular faculty ID, update the ID as necessary
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        if (response.status == 400) {
            throw new Error('Failed to fetch faculty details');
        }
        if(!response.ok){
            return;
        }
        const faculty = await response.json();
        document.getElementById('faculty-name').innerHTML = `<strong>Name: </strong>${faculty.firstName} ${faculty.lastName}`;
        document.getElementById('faculty-department').innerHTML = `<strong>Department: </strong>${faculty.department}`;
        document.getElementById('faculty-email').innerHTML = `<strong>Email: </strong>${faculty.email}`;
        document.getElementById('faculty-phoneNumber').innerHTML = `<strong>Phone Number: </strong>${faculty.phoneNumber}`;
        document.getElementById('faculty-isAdvisor').innerHTML = `<strong>Advisor: </strong>${faculty.isAdvisor}`;

    } catch (error) {
        console.error('Error fetching faculty details:', error);
        alert('Failed to load faculty details. Please try again later.');
    }
}

// Show/hide Add Course section
function openAddCourse() {
    const addCourseSection = document.getElementById('add-course-section');
    const coursesListSection = document.getElementById('courses-list-section');
    const pendingRequestsSection = document.getElementById('pending-requests'); // Add this line
    // Show Add Course section
    addCourseSection.style.display = 'block'; 
    const facultyDetails = document.getElementById('faculty-details');
    const facultyPhoto = document.getElementById('faculty-photo');
    const facultySection = document.getElementById('faculty-section');
    facultySection.style.display = 'none'; // Hide Faculty section
    facultyPhoto.style.display = 'none'; // Hide Faculty Photo section
    facultyDetails.style.display = 'none'; // Show Faculty Details section
    coursesListSection.style.display = 'none'; // Hide Courses List when adding a course
    pendingRequestsSection.style.display = 'none'; // Hide Pending Requests section when adding a course
    const isAdvisor = document.getElementById('faculty-isAdvisor').textContent.split(":")[1].trim() === 'true'; // New line - Check if the faculty is an advisor
    if(isAdvisor){
        const pendingAdvisorApprovalSection = document.getElementById('pending-advisor-approval'); // New line
        pendingAdvisorApprovalSection.style.display = 'none'; // New line - Show Pending Advisor Approval section
        //fetchPendingAdvisorApprovals(); // New line - Fetch pending advisor approvals
    }
    //window.scrollTo({ top: addCourseSection.offsetTop, behavior: 'smooth' }); // Smooth scroll to the Add Course section
}

// Show courses list
function viewCourses() {
    const addCourseSection = document.getElementById('add-course-section');
    const coursesListSection = document.getElementById('courses-list-section');
    const pendingRequestsSection = document.getElementById('pending-requests'); // Add this line
    const pendingAdvisorApprovalSection = document.getElementById('pending-advisor-approval'); // New line
    const facultyDetails = document.getElementById('faculty-details');
    const facultyPhoto = document.getElementById('faculty-photo');
    const facultySection = document.getElementById('faculty-section');
    facultySection.style.display = 'none'; // Hide Faculty section
    facultyPhoto.style.display = 'none'; // Hide Faculty Photo section
    facultyDetails.style.display = 'none'; // Show Faculty Details section
    addCourseSection.style.display = 'none'; // Hide Add Course section
    coursesListSection.style.display = 'block'; // Show Courses List section
    pendingRequestsSection.style.display = 'none'; // Hide Pending Requests section when going to Home
    pendingAdvisorApprovalSection.style.display = 'none'; // New line - Hide Pending Advisor Approval section when going to Home
    
    //window.scrollTo({ top: coursesListSection.offsetTop, behavior: 'smooth' }); // Smooth scroll to the Courses List
}

// Navigate to Home
function navigateToHome() {
    const addCourseSection = document.getElementById('add-course-section');
    const coursesListSection = document.getElementById('courses-list-section');
    const pendingRequestsSection = document.getElementById('pending-requests'); // Add this line
    const pendingAdvisorApprovalSection = document.getElementById('pending-advisor-approval'); // New line
    const facultyDetails = document.getElementById('faculty-details');
    const facultyPhoto = document.getElementById('faculty-photo');
    const facultySection = document.getElementById('faculty-section');
    facultySection.style.display = 'flex'; // Show Faculty section
    facultyPhoto.style.display = 'block'; // Hide Faculty Photo section
    facultyDetails.style.display = 'block'; // Show Faculty Details section
    addCourseSection.style.display = 'none'; // Hide Add Course section
    coursesListSection.style.display = 'none'; // Show Courses List section
    pendingRequestsSection.style.display = 'none'; // Hide Pending Requests section when going to Home
    pendingAdvisorApprovalSection.style.display = 'none'; // New line - Hide Pending Advisor Approval section when going to Home
    
    //window.scrollTo({ top: coursesListSection.offsetTop, behavior: 'smooth' }); // Smooth scroll to the Courses List
}


// View requests (Placeholder)
function viewRequests() {
    window.location.href = '/requests'; // Navigate to the requests page
}

// Logout function to send request to backend
async function logout() {
    try {
        const response = await fetch(`${host}auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Ensure credentials are sent (important for session-based authentication)
        });

        if (!response.ok) {
            throw new Error('Logout failed');
        }

        alert('Logged out successfully');
        window.location.href = '/frontend/index.html';  // Redirect the user to the login page after logging out
    } catch (error) {
        console.error('Logout error:', error);
        alert('Failed to log out. Please try again.');
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    fetchFacultyDetails();
    fetchCourses();
    navigateToHome();
});

// Function to fetch pending enrollments
async function fetchPendingEnrollments() {
    try {
        const id= localStorage.getItem("id");
        const response = await fetch(`${host}enrollment/pendingInstructorApproval/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Include credentials like cookies if needed
        });
        if (!(response.status == 404 || response.status == 200)) {
            throw new Error('Failed to fetch enrollments');
        }
        if(response.status == 404){
            populatePendingEnrollmentsTable([]);
            return;
        }

        const enrollments = await response.json();

        // If there are no enrollments, show the empty message
        if (enrollments.length === 0) {
            populatePendingEnrollmentsTable([]);
        } else {
            // Filter enrollments that are pending instructor approval
            const pendingEnrollments = enrollments.filter(enrollment => enrollment.status === 'Pending Instructor Approval');
            populatePendingEnrollmentsTable(pendingEnrollments);
        }

    } catch (error) {
        console.error('Error fetching pending enrollments:', error);
        alert('Failed to load pending enrollments. Please try again later.');
        // Show an empty state if an error occurs
        populatePendingEnrollmentsTable([]);
    }
}

// Function to populate the table with pending enrollments
function populatePendingEnrollmentsTable(enrollments) {
    const tableBody = document.getElementById('pending-requests-list');
    tableBody.innerHTML = ''; // Clear the existing table rows

    // If there are no enrollments, show an empty message
    if (enrollments.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4">No pending requests at the moment.</td>`;
        tableBody.appendChild(row);
        return;
    }

    // Otherwise, populate the table with the enrollments
    enrollments.forEach(enrollment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${enrollment.Student.firstName} ${enrollment.Student.lastName}</td>
            <td>${enrollment.Course.courseCode}</td>
            <td>${enrollment.status}</td>
            <td>
                <button onclick="approveEnrollment(${enrollment.id})">Approve</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Function to approve an enrollment
async function approveEnrollment(enrollmentId) {
    try {
        const response = await fetch(`${host}enrollment/${enrollmentId}/instructor-approve`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Include credentials like cookies if needed
        });

        if (!response.ok) {
            throw new Error('Failed to approve enrollment');
        }

        alert('Enrollment approved successfully!');
        fetchPendingEnrollments(); // Refresh the list after approval
        socket.send(JSON.stringify({ type: 'enrollment' }));
    } catch (error) {
        console.error('Error approving enrollment:', error);
        alert('Failed to approve enrollment. Please try again later.');
    }
}

// Fetch pending advisor approvals
async function fetchPendingAdvisorApprovals() {
    try {
        const response = await fetch(`${host}enrollment/pendingAdvisorApproval`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Include credentials like cookies if needed
        });

        if (!(response.status == 404 || response.status == 200)) {
            throw new Error('Failed to fetch advisor approvals');
        }
        if(response.status == 404){
            populatePendingAdvisorApprovalsTable([]);
            return;
        }
        const approvals = await response.json();
        

        // If there are no approvals, show the empty message
        if (approvals.length === 0) {
            populatePendingAdvisorApprovalsTable([]);
        } else {
            const pendingApprovals = approvals.filter(approval => approval.status === 'Pending Advisor Approval');
            populatePendingAdvisorApprovalsTable(pendingApprovals);
        }
    } catch (error) {
        console.error('Error fetching advisor approvals:', error);
        alert('Failed to load pending advisor approvals. Please try again later.');
        populatePendingAdvisorApprovalsTable([]);
    }
}

// Populate the table with pending advisor approvals
function populatePendingAdvisorApprovalsTable(approvals) {
    const tableBody = document.getElementById('pending-advisor-approval-list');
    tableBody.innerHTML = ''; // Clear existing rows

    if (approvals.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `<td colspan="4">No pending requests at the moment.</td>`;
        tableBody.appendChild(row);
        return;
    }

    approvals.forEach(approval => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${approval.Student.firstName} ${approval.Student.lastName}</td>
            <td>${approval.Course.courseCode}</td>
            <td>${approval.status}</td>
            <td>
                <button onclick="approveAdvisorRequest(${approval.id})">Approve</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Approve an advisor request
async function approveAdvisorRequest(approvalId) {
    try {
        const response = await fetch(`${host}enrollment/${approvalId}/advisor-approve`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include' // Include credentials like cookies if needed
        });

        if (!response.ok) {
            throw new Error('Failed to approve advisor request');
        }

        alert('Advisor request approved successfully!');
        socket.send(JSON.stringify({ type: 'enrollment' }));
        fetchPendingAdvisorApprovals(); // Refresh the list after approval
    } catch (error) {
        console.error('Error approving advisor request:', error);
        alert('Failed to approve advisor request. Please try again later.');
    }
}

// View requests
function viewRequests() {
    const addCourseSection = document.getElementById('add-course-section');
    const coursesListSection = document.getElementById('courses-list-section');
    const pendingRequestsSection = document.getElementById('pending-requests');
    const home = document.getElementById('faculty-details');
    const facultyPhoto = document.getElementById('faculty-photo');
    facultyPhoto.style.display = 'none'; // Hide Faculty Photo section
    const facultySection = document.getElementById('faculty-section');
    facultySection.style.display = 'none'; // Hide Faculty section

    addCourseSection.style.display = 'none'; // Hide Add Course section
    coursesListSection.style.display = 'none'; // Hide Courses List section
    home.style.display = 'none'; // Hide Faculty Details section
    pendingRequestsSection.style.display = 'block'; // Show Pending Requests section

    fetchPendingEnrollments();

    const isAdvisor = document.getElementById('faculty-isAdvisor').textContent.split(":")[1].trim() === 'true'; // New line - Check if the faculty is an advisor
    if(isAdvisor){
        const pendingAdvisorApprovalSection = document.getElementById('pending-advisor-approval'); // New line
        pendingAdvisorApprovalSection.style.display = 'block'; // New line - Show Pending Advisor Approval section
        fetchPendingAdvisorApprovals(); // New line - Fetch pending advisor approvals
    }

    //window.scrollTo({ top: pendingRequestsSection.offsetTop, behavior: 'smooth' }); // Smooth scroll to the Pending Requests section
}

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