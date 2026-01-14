const BASE_API_URL =
    'https://api.cricheroes.in/api/v1/player/get-player-statistic';

const HEADERS = {
    'api-key': 'cr!CkH3r0s',
    'authorization': '2eb77740-f13d-11f0-969d-ffedfc29dd7e',
    'device-type': 'Chrome: 143.0.0.0',
    'origin': 'https://cricheroes.com',
    'referer': 'https://cricheroes.com/',
    'udid': 'eab2dacbd0235dd0ccde2eebbf71e99c',
};

const statsContainer = document.getElementById('statsContainer');
const tabs = document.querySelectorAll('.tab');
const playerSelect = document.getElementById('playerSelect');
const fetchBtn = document.getElementById('fetchPlayerBtn');

let allStatistics = {};

/**
 * Fetch stats for selected player
 */
async function fetchPlayerStats(playerId) {
    const url = `${BASE_API_URL}/${playerId}?pagesize=12`;
    const response = await fetch(url, { headers: HEADERS });
    const data = await response.json();
    return data?.data?.statistics || {};
}

/**
 * Render stats
 */
function renderStats(statArray = []) {
    statsContainer.innerHTML = '';

    statArray.forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.className = 'statWrapper';

        wrapper.innerHTML = `
            <p class="stat">${item.value}</p>
            <p class="statName">${item.title}</p>
        `;

        statsContainer.appendChild(wrapper);
    });
}

/**
 * Switch tabs using cached data
 */
function handleTabSwitch(tabName) {
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

    renderStats(allStatistics[tabName]);
}

/**
 * Fetch button click
 */
fetchBtn.addEventListener('click', async () => {
    const playerId = playerSelect.value;

    if (!playerId) {
        alert('Please select a player');
        return;
    }

    statsContainer.innerHTML = '<p>Loading...</p>';

    try {
        allStatistics = await fetchPlayerStats(playerId);
        handleTabSwitch('batting');
    } catch (error) {
        console.error(error);
        statsContainer.innerHTML = '<p>Error fetching player data</p>';
    }
});

/**
 * Tab click events
 */
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        handleTabSwitch(tab.dataset.tab);
    });
});
