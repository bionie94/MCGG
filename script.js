let players = [];

// Initialize player inputs on page load
window.onload = () => {
  const container = document.getElementById("playerInputs");
  for (let i = 1; i <= 8; i++) {
    let div = document.createElement("div");
    div.innerHTML = `
      <label for="P${i}" class="block text-gray-400 text-sm mb-1 font-medium select-none">P${i}${i === 1 ? " (You)" : ""}</label>
      <input type="text" id="P${i}" placeholder="Enter name" 
        class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white" />
    `;
    container.appendChild(div);
  }

  document.getElementById("btnGenerate").addEventListener("click", generateRounds);
  document.getElementById("btnSolve").addEventListener("click", solve);
  document.getElementById("btnShowAll").addEventListener("click", showAllMatchups);
};

function generateRounds() {
  players = [];
  for (let i = 1; i <= 8; i++) {
    let val = document.getElementById(`P${i}`).value || `P${i}`;
    players.push(val);
  }
  alert("Players saved! Now click Solve or Show All Matchups.");
}

// Example round generator (round-robin style)
function getRound(roundIndex) {
  if (players.length < 8) return null;

  const p = [...players];
  let pairs = [];

  // Round I-2
  if (roundIndex === 0) {
    pairs = [
      [p[0], p[7]],
      [p[1], p[6]],
      [p[2], p[5]],
      [p[3], p[4]],
    ];
  }
  // Round I-3
  else if (roundIndex === 1) {
    pairs = [
      [p[0], p[6]],
      [p[7], p[5]],
      [p[1], p[4]],
      [p[2], p[3]],
    ];
  }
  // Round I-4
  else if (roundIndex === 2) {
    pairs = [
      [p[0], p[5]],
      [p[6], p[4]],
      [p[7], p[3]],
      [p[1], p[2]],
    ];
  }

  return pairs;
}

// Solve one round (default Round I-2)
function solve() {
  const output = document.getElementById("output");
  output.innerHTML = "";

  const pairs = getRound(0);
  if (!pairs) return;

  const roundBox = document.createElement("div");
  roundBox.className = "bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-4";

  const roundTitle = document.createElement("h2");
  roundTitle.className = "text-xl font-bold mb-3 text-indigo-400";
  roundTitle.textContent = "Round I-2";
  roundBox.appendChild(roundTitle);

  pairs.forEach(([a, b]) => {
    const line = document.createElement("p");

    if (a === players[0] || b === players[0]) {
      line.className = "font-semibold text-amber-400 text-lg mb-1 drop-shadow";
    } else if (
      [players[1], players[2], players[3]].includes(a) ||
      [players[1], players[2], players[3]].includes(b)
    ) {
      line.className = "font-semibold text-sky-400 text-lg mb-1 drop-shadow";
    } else {
      line.className = "text-gray-300 mb-1";
    }

    line.textContent = `${a} vs ${b}`;
    roundBox.appendChild(line);
  });

  output.appendChild(roundBox);
}

// Show all rounds (I-2, I-3, I-4)
function showAllMatchups() {
  const output = document.getElementById("output");
  output.innerHTML = "";

  const roundTitles = ["Round I-2", "Round I-3", "Round I-4"];

  for (let r = 0; r < 3; r++) {
    const pairs = getRound(r);
    if (!pairs) return;

    const roundBox = document.createElement("div");
    roundBox.className = "bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-4";

    const roundTitle = document.createElement("h2");
    roundTitle.className = "text-xl font-bold mb-3 text-indigo-400";
    roundTitle.textContent = roundTitles[r];
    roundBox.appendChild(roundTitle);

    pairs.forEach(([a, b]) => {
      const line = document.createElement("p");

      if (a === players[0] || b === players[0]) {
        line.className = "font-semibold text-amber-400 text-lg mb-1 drop-shadow";
      } else if (
        [players[1], players[2], players[3]].includes(a) ||
        [players[1], players[2], players[3]].includes(b)
      ) {
        line.className = "font-semibold text-sky-400 text-lg mb-1 drop-shadow";
      } else {
        line.className = "text-gray-300 mb-1";
      }

      line.textContent = `${a} vs ${b}`;
      roundBox.appendChild(line);
    });

    output.appendChild(roundBox);
  }
}
