const tableBody = document.getElementById('table-body');
const intervalSelect = document.getElementById('interval');
const refreshBtn = document.getElementById('refresh');
let timer = null;
let paths = [];

function fetchPaths() {
    return fetch('paths.txt')
        .then(r => r.text())
        .then(text => text.split('\n').map(x => x.trim()).filter(Boolean));
}

function pingSite(url) {

    return new Promise(resolve => {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 4000);
        fetch(url, {signal: controller.signal, credentials: 'omit'})
            .then(resp => {
                clearTimeout(timeout);
                if ((resp.status >= 200 && resp.status < 400)) {
                    resolve({status: 'OK', code: resp.status});
                } else {
                    resolve({status: 'FAIL', code: resp.status});
                }
            })
            .catch(e => {
                clearTimeout(timeout);
                resolve({status: 'FAIL', code: '-'});
            });
    });
}

async function updateTable() {
    tableBody.innerHTML = '';
    for (const url of paths) {
        const row = document.createElement('tr');
        const siteCell = document.createElement('td');
        siteCell.textContent = url;
        const statusCell = document.createElement('td');
        statusCell.textContent = '...';
        const codeCell = document.createElement('td');
        codeCell.textContent = '...';
        row.appendChild(siteCell);
        row.appendChild(statusCell);
        row.appendChild(codeCell);
        tableBody.appendChild(row);
        pingSite(url).then(res => {
            statusCell.textContent = res.status;
            statusCell.style.color = res.status === 'OK' ? 'green' : 'red';
            codeCell.textContent = res.code;
        });
    }
}

function startInterval() {
    if (timer) clearInterval(timer);
    timer = setInterval(updateTable, Number(intervalSelect.value) * 1000);
}

intervalSelect.addEventListener('change', () => {
    startInterval();
});
refreshBtn.addEventListener('click', updateTable);


window.addEventListener('DOMContentLoaded', () => {
    if (intervalSelect) {
        intervalSelect.value = '60';
    }
    fetchPaths().then(list => {
        paths = list;
        updateTable();
        startInterval();
    });
});
