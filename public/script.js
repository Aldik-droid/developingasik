let chartInstance = null;

async function fetchData(field, start, end) {
    let url = `/api/v1/measurements?field=${field}`;
    if (start) url += `&start_date=${start}`;
    if (end) url += `&end_date=${end}`;
    
    const response = await fetch(url);
    return await response.json();
}

async function fetchStats(field) {
    const response = await fetch(`/api/v1/stats?field=${field}`);
    return await response.json();
}

async function updateDashboard() {
    const field = document.getElementById('fieldSelect').value;
    const start = document.getElementById('startDate').value;
    const end = document.getElementById('endDate').value;

    const data = await fetchData(field, start, end);
    const labels = data.map(d => new Date(d.timestamp).toLocaleDateString() + ' ' + new Date(d.timestamp).getHours() + ':00');
    const values = data.map(d => d[field]);

    const ctx = document.getElementById('myChart').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: field.toUpperCase(),
                data: values,
                borderColor: '#007bff',
                backgroundColor: 'rgba(0, 123, 255, 0.1)',
                tension: 0.3,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: { x: { display: true }, y: { beginAtZero: false } }
        }
    });

    const stats = await fetchStats(field);
    document.getElementById('avgVal').innerText = stats.avgValue.toFixed(2);
    document.getElementById('minVal').innerText = stats.minValue.toFixed(2);
    document.getElementById('maxVal').innerText = stats.maxValue.toFixed(2);
    document.getElementById('stdVal').innerText = stats.stdDev.toFixed(2);
}

window.onload = () => {
    updateDashboard();
};