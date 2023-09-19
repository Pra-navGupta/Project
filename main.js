document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/getWazirXData')
        .then(response => response.json())
        .then(data => {
            const cryptoData = document.getElementById('cryptoData');
            data.forEach(item => {
                cryptoData.innerHTML += `
                    <tr>

                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>${item.last}</td>
                        <td>${item.buy}</td>
                        <td>${item.sell}</td>
                        <td>${item.volume}</td>
                        <td>${item.base_unit}</td>
                    </tr>
                `;
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
});

// Function to toggle the theme
function toggleTheme() {
    const body = document.body;
    const button = document.getElementById("toggle-button");

    if (body.classList.contains("dark-theme")) {
        // Switch to light theme
        body.classList.remove("dark-theme");
        // button.textContent = "Toggle Dark Theme";
    } else {
        // Switch to dark theme
        body.classList.add("dark-theme");
        // button.textContent = "Toggle Light Theme";
    }
}

// Add a click event listener to the button
const toggleButton = document.getElementById("toggle-button");
toggleButton.addEventListener("click", toggleTheme);


// function updateProgress() {
//     const progressBar = document.getElementById('progressFill');
//     const progressText = document.getElementById('progressText');
//     let progress = 60;

//     const interval = setInterval(function () {
//         progress -= 1;
//         progressBar.style.width = progress + '%';
//         progressText.textContent = progress + '%';

//         if (progress <= 1) {
//             clearInterval(interval);
//         }
//     }, 1000); // Update every 1 second (adjust as needed)
// }

// window.onload = function() {
//     updateProgress();
// };

let totalTime = 60; // Total time in seconds
let timerInterval; // Interval ID for the timer

function startTimer() {
    const progressBar = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    progressBar.style.width = '100%';

    timerInterval = setInterval(function () {
        if (totalTime > 0) {
            totalTime--;
            progressBar.style.width = (totalTime / 60 * 100) + '%';
            progressText.textContent = totalTime;
        } else {
            clearInterval(timerInterval);
        }
    }, 1000); // Update every 1 second
}
window.onload = function() {
    startTimer();
}