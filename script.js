let barChartInstance;
let pieChartInstance;

function generateReport() {
    const studentName = document.getElementById("name").value;
    const studentClass = document.getElementById("class").value;
    const marks = {
        math: Number(document.getElementById("math").value),
        science: Number(document.getElementById("science").value),
        english: Number(document.getElementById("english").value),
        history: Number(document.getElementById("history").value),
        geography: Number(document.getElementById("geography").value)
    };

    // Display details
    document.getElementById("studentName").innerText = studentName;
    document.getElementById("studentClass").innerText = studentClass;
    document.getElementById("dispMath").innerText = marks.math;
    document.getElementById("dispScience").innerText = marks.science;
    document.getElementById("dispEnglish").innerText = marks.english;
    document.getElementById("dispHistory").innerText = marks.history;
    document.getElementById("dispGeography").innerText = marks.geography;

    document.querySelector(".report-card").style.display = "block";

    const subjectNames = ["Math", "Science", "English", "History", "Geography"];
    const subjectColors = ["#FF5733", "#33FF57", "#3357FF", "#F4D03F", "#D35400"];
    const scores = Object.values(marks);

    
    if (barChartInstance) barChartInstance.destroy();
    if (pieChartInstance) pieChartInstance.destroy();

    // Bar Chart
    const barChartCanvas = document.getElementById("barChart").getContext('2d');
    barChartInstance = new Chart(barChartCanvas, {
        type: "bar",
        data: {
            labels: subjectNames,
            datasets: [{
                label: "Marks",
                data: scores,
                backgroundColor: subjectColors,
                borderColor: "black",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            scales: {
                x: {
                    ticks: { color: "black" },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: "black" },
                    grid: { color: 'rgba(0, 0, 0, 0.1)' }
                }
            },
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Subject Marks',
                    color: 'black'
                }
            }
        }
    });

    // Pie Chart
    const pieChartCanvas = document.getElementById("pieChart").getContext('2d');
    pieChartInstance = new Chart(pieChartCanvas, {
        type: "pie",
        data: {
            labels: subjectNames,
            datasets: [{
                data: scores,
                backgroundColor: subjectColors
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, 
            plugins: {
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Subject Distribution',
                    color: 'black'
                }
            }
        }
    });

    // Custom Legend
    const legendContainer = document.querySelector('.pie-legend-container');
    legendContainer.innerHTML = '';
    subjectNames.forEach((subject, index) => {
        const legendItem = document.createElement('div');
        legendItem.classList.add('legend-item');
        const colorBox = document.createElement('span');
        colorBox.classList.add('legend-color-box');
        colorBox.style.backgroundColor = subjectColors[index];
        const label = document.createElement('span');
        label.classList.add('legend-label');
        label.innerText = subject;
        legendItem.appendChild(colorBox);
        legendItem.appendChild(label);
        legendContainer.appendChild(legendItem);
    });

    document.getElementById("downloadPdfBtn").style.display = "block";
}


document.getElementById("downloadPdfBtn").addEventListener('click', async () => {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'mm', 'a4'); 
    const report = document.querySelector(".report-card");

    
    report.style.display = "block";

    const scale = 2; 
    const canvas = await html2canvas(report, {
        scale: scale,
        useCORS: true,
        logging: true, 
        allowTaint: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const imgWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save("student_report_card.pdf");

   
});