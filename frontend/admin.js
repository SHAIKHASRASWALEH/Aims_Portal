const host = 'http://localhost:3000/api/v1/';

const socket = new WebSocket('ws://localhost:3000');

socket.onmessage = async function(event) {
    const data = JSON.parse(event.data);
    console.log('Received enrollment message:', data);
    if (data.type === 'enrollment') {
        populateEnrollments();
    }
};

function preventBack(){
    window.history.forward();
}
setTimeout("preventBack()", 0);
window.onunload=function(){null};

// Fetch and display data on page load
document.addEventListener('DOMContentLoaded', async () => {
    await populateInstructors();
    await populateEnrollments();
});

// Populate instructors in the course registration form
async function populateInstructors() {
    const response = await fetch(`${host}faculty`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (response.status == 400) throw new Error('Failed to fetch instructors');
    if(response.status == 404) return;
    const instructors = await response.json();
    const select = document.getElementById('course-instructor');
    select.innerHTML = '';

    instructors.forEach(instructor => {
        const option = document.createElement('option');
        option.value = instructor.id;
        option.textContent = instructor.name;
        select.appendChild(option);
    });
}

// Register Student
document.getElementById('register-student-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    try {
        const response = await fetch(`${host}students`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to register student');

        alert('Student registered successfully');
        e.target.reset();
    } catch (error) {
        console.error('Error registering student:', error);
        alert('Failed to register student. Please try again.');
    }
});



// Register Instructor
document.getElementById('register-instructor-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    // Convert 'is-advisor' value to boolean
    data['is-advisor'] = data['is-advisor'] === 'true';

    try {
        const response = await fetch(`${host}faculty`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to register instructor');

        alert('Instructor registered successfully');
        e.target.reset();
        await populateInstructors(); // Refresh the instructor list
    } catch (error) {
        console.error('Error registering instructor:', error);
        alert('Failed to register instructor. Please try again.');
    }
});


// Register Course
document.getElementById('register-course-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
        const response = await fetch(`${host}courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to register course');

        alert('Course registered successfully');
        e.target.reset();
    } catch (error) {
        console.error('Error registering course:', error);
        alert('Failed to register course. Please try again.');
    }
});

// Populate instructors in the course registration form
async function populateInstructors() {
    const response = await fetch(`${host}faculty`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (response.status == 400) throw new Error('Failed to fetch instructors');
    if(response.status == 404) return;
    const instructors = await response.json();
    const select = document.getElementById('instructorId');
    select.innerHTML = '';

    instructors.forEach(instructor => {
        const option = document.createElement('option');
        option.value = instructor.id;
        option.textContent = instructor.firstName + ' ' + instructor.lastName;
        select.appendChild(option);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    await populateInstructors();
});


// Approve Enrollment
async function approveEnrollment(enrollmentId,status) {
    try {
        if(status === 'Pending Instructor Approval') {
            const response = await fetch(`${host}enrollment/${enrollmentId}/instructor-approve`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ enrollmentId }),
                credentials: 'include',
            });
            if (!response.ok) throw new Error('Failed to approve enrollment');
        }
        const response = await fetch(`${host}enrollment/${enrollmentId}/advisor-approve`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enrollmentId }),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to approve enrollment');

        alert('Enrollment approved successfully');
        socket.send(JSON.stringify({ type: 'enrollment' }));
        await populateEnrollments(); // Refresh the enrollments table
    } catch (error) {
        console.error('Error approving enrollment:', error);
        alert('Failed to approve enrollment. Please try again.');
    }
}

// Reject Enrollment
async function rejectEnrollment(enrollmentId) {
    try {
        const response = await fetch(`${host}enrollment/${enrollmentId}/reject`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ enrollmentId }),
            credentials: 'include',
        });
        if (!response.ok) throw new Error('Failed to reject enrollment');

        alert('Enrollment rejected successfully');
        socket.send(JSON.stringify({ type: 'enrollment' }));
        await populateEnrollments(); // Refresh the enrollments table
    } catch (error) {
        console.error('Error rejecting enrollment:', error);
        alert('Failed to reject enrollment. Please try again.');
    }
}

// Search Enrollments
function searchEnrollments() {
    const searchInput = document.getElementById('search-enrollments').value.toLowerCase();
    const tableBody = document.getElementById('enrollments-table');
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
// Toggle section visibility
function toggleSection(sectionId) {
    const sectionContent = document.getElementById(sectionId);
    const chevron = sectionContent.previousElementSibling.querySelector('.fa-chevron-down');

    sectionContent.classList.toggle('collapsed');
    chevron.style.transform = sectionContent.classList.contains('collapsed') ? 'rotate(0deg)' : 'rotate(180deg)';
}

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', () => {
    populateInstructors();
    populateEnrollments();

    // Collapse all sections by default
    document.getElementById('register-student-content').classList.add('collapsed');
    document.getElementById('register-instructor-content').classList.add('collapsed');
    document.getElementById('register-course-content').classList.add('collapsed');
    document.getElementById('enroll-students-content').classList.add('collapsed');
});

// Populate enrollments table
async function populateEnrollments() {
    const response = await fetch(`${host}enrollment`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    if (response.status == 400) throw new Error('Failed to fetch enrollments');
    if(response.status == 404) return;
    const enrollments = await response.json();
    const tableBody = document.getElementById('enrollments-table');
    tableBody.innerHTML = '';

    enrollments.forEach(enrollment => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${enrollment.Student.firstName} ${enrollment.Student.lastName}</td>
            <td>${enrollment.Course.courseTitle}</td>
            <td>${enrollment.Course.academicSession}</td> <!-- Session -->
            <td>${enrollment.Course.Faculty.firstName} ${enrollment.Course.Faculty.lastName}</td>
            <td>${enrollment.Course.credits}</td> <!-- Credits -->
            <td class="status-${enrollment.status.toLowerCase()}">${enrollment.status}</td>
            <td>
                ${enrollment.status != 'Enrolled' && enrollment.status!='Rejected' ? `
                    <button onclick="approveEnrollment('${enrollment.id}', '${enrollment.status}')">Approve</button>
                    <button onclick="rejectEnrollment('${enrollment.id}')">Reject</button>
                ` : ''}
            </td>
        `;
        tableBody.appendChild(row);
    });
}

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
