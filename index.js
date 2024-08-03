const fetch = require('node-fetch');
const cron = require('node-cron');
const fs = require('fs');
const { URL } = require('url');

const GROWTOPIA_URL =  'https://growtopiagame.com/detail';
const CHART_URL = 'https://quickchart.io/chart';

let onlineData = [];

const get_online = async () => {
  try {
    const response = await fetch(GROWTOPIA_URL);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (jsonError) {
      throw new Error('Failed to parse JSON');
    }

    if (data && typeof data.online_user === 'string') {
      const onlineUsers = parseInt(data.online_user, 10);

      onlineData.push({
        timestamp: new Date(),
        onlineUsers: onlineUsers,
      });

      const reset = new Date(Date.now() - 15 * 60 * 1000);
      onlineData = onlineData.filter(entry => entry.timestamp > reset);

      await createGraph();
    } else {
      throw new Error('`online_user` field not found in JSON data');
    }
  } catch (error) {
    console.error('Error mengambil data:', error);
  }
};

const createGraph = async () => {
  const CHART_RES = new URL(CHART_URL);
  
  const changes = onlineData.map((entry, index) => {
    if (index === 0) return 0;
    return entry.onlineUsers - onlineData[index - 1].onlineUsers;
  });

  CHART_RES.searchParams.set('c', JSON.stringify({
    type: 'line',
    data: {
      labels: onlineData.map(entry => entry.timestamp.toLocaleTimeString()),
      datasets: [{
        label: 'Growtopia Online Listener',
        data: onlineData.map(entry => entry.onlineUsers),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        fill: true,
        borderWidth: 2,
        pointRadius: 5,
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 2,
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            autoSkip: true,
            maxTicksLimit: 10
          }
        },
        y: {
          beginAtZero: true
        }
      },
      plugins: {
        legend: {
          labels: {
            color: 'rgba(54, 162, 235, 1)'
          },
          position: 'top'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Pengguna Online: ${context.raw}`;
            }
          }
        },
        datalabels: {
          display: true,
          color: '#444',
          align: 'top',
          anchor: 'end',
          formatter: (value, context) => {
            const change = changes[context.dataIndex] || 0;
            if (change > 0) return `+${change}`;
            if (change < 0) return `${change}`;
            return '';
          },
          font: {
            weight: 'bold'
          },
          offset: 10
        }
      }
    }
  }));

  try {
    const response = await fetch(CHART_RES.href);
    const buffer = await response.buffer();
    fs.writeFileSync('graph.png', buffer);
    console.log('Succesfully generated graph')
  } catch (error) {
    console.error('Error membuat grafik:', error);
  }
};

cron.schedule('*/3 * * * *', () => {
  console.log('Mengambil data pengguna online...');
  get_online();
});

get_online();