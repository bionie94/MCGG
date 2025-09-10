// Initialize player inputs on page load
window.onload = () => {
  const container = document.getElementById("playerInputs");
  for (let i = 1; i <= 8; i++) {
    let div = document.createElement("div");
    div.innerHTML = `
      <label for="P${i}" class="block text-gray-400 text-sm mb-1 font-medium select-none">P${i}</label>
      <input type="text" id="P${i}" placeholder="Enter Player ${i}" 
        class="w-full px-3 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500">
    `;
    container.appendChild(div);
  }
};

// Button actions
document.getElementById("btnGenerate").addEventListener("click", generateRounds);
document.getElementById("btnSolve").addEventListener("click", solve);
document.getElementById("btnShowAll").addEventListener("click", showAllMatchups);

// Generate rounds (dummy example)
function generateRounds() {
  const players = getPlayers();
  let output = document.getElementById("output");
  output.innerHTML = "";

  if (players.includes("")) {
    output.innerHTML = `<p class="text-red-400">Please fill all player names!</p>`;
    return;
  }

  let rounds = [
    [players[0], players[7]],
    [players[1], players[6]],
    [players[2], players[5]],
    [players[3], players[4]]
  ];

  rounds.forEach((match, i) => {
    let div = document.createElement("div");
    div.className = "p-3 bg-gray-800 rounded shadow";
    div.innerText = `Round ${i + 1}: ${match[0]} vs ${match[1]}`;
    output.appendChild(div);
  });
}

// Placeholder solve() (ikut formula asal awak, tak usik)
function solve() {
  let output = document.getElementById("output");
  let div = document.createElement("div");
  div.className = "p-3 bg-purple-800 rounded shadow";
  div.innerText = "Solve function executed (original formula here).";
  output.appendChild(div);
}

// Show All Matchups P1-P4
function showAllMatchups() {
  const players = getPlayers();
  let matchups = document.getElementById("matchups");
  matchups.innerHTML = "";

  if (players.includes("")) {
    matchups.innerHTML = `<p class="text-red-400">Please fill all player names!</p>`;
    return;
  }

  let pairs = [
    [players[0], players[7]], // P1 vs P8
    [players[1], players[6]], // P2 vs P7
    [players[2], players[5]], // P3 vs P6
    [players[3], players[4]]  // P4 vs P5
  ];

  pairs.forEach(pair => {
    let div = document.createElement("div");
    div.className = "p-2 bg-green-800 rounded shadow";
    div.innerText = `${pair[0]} vs ${pair[1]}`;
    matchups.appendChild(div);
  });
}

// Helper to get players
function getPlayers() {
  let players = [];
  for (let i = 1; i <= 8; i++) {
    players.push(document.getElementById("P" + i).value.trim());
  }
  return players;
}
