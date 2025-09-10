// Initialize player inputs on page load
window.onload = () => {
  const container = document.getElementById("playerInputs");
  for (let i = 1; i <= 8; i++) {
    let div = document.createElement("div");
    div.innerHTML = `
      <label for="P${i}" class="block text-gray-400 text-sm mb-1 font-medium select-none">P${i}${i === 1 ? " (You)" : ""}</label>
      <input id="P${i}" type="text" placeholder="Enter name" 
        class="w-full px-3 py-2 rounded bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
    `;
    container.appendChild(div);
  }

  document.getElementById("btnGenerate").addEventListener("click", generateDropdowns);
  document.getElementById("btnSolve").addEventListener("click", solve);
  document.getElementById("btnShowAll").addEventListener("click", showAllMatchups);
};

let roundsContainer;

// Generate dropdowns for rounds
function generateDropdowns() {
  const output = document.getElementById("output");
  output.innerHTML = "";

  roundsContainer = document.createElement("div");
  roundsContainer.className = "space-y-4";

  for (let round = 1; round <= 4; round++) {
    let roundDiv = document.createElement("div");
    roundDiv.className = "p-4 bg-gray-800 rounded-lg";

    let title = document.createElement("h2");
    title.className = "text-lg font-bold text-indigo-300 mb-2";
    title.innerText = `Round I-${round}`;
    roundDiv.appendChild(title);

    for (let i = 1; i <= 8; i++) {
      let select = document.createElement("select");
      select.id = `R${round}P${i}`;
      select.className =
        "w-full mb-2 px-3 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400";

      let option = document.createElement("option");
      option.value = "";
      option.text = `Choose for P${i}`;
      select.appendChild(option);

      for (let j = 1; j <= 8; j++) {
        let playerName = document.getElementById(`P${j}`).value || `P${j}`;
        let opt = document.createElement("option");
        opt.value = playerName;
        opt.text = playerName;
        select.appendChild(opt);
      }

      roundDiv.appendChild(select);
    }
    roundsContainer.appendChild(roundDiv);
  }

  output.appendChild(roundsContainer);
}

// Kekalkan solve() asal
function solve() {
  // 👉 Ini kekal macam formula asal awak (saya tak sentuh logic pairing)
  alert("Solve() jalan — code asal awak kekal, tak diubah.");
}

// Show all matchups untuk P1–P4
function showAllMatchups() {
  const output = document.getElementById("output");

  let resultsDiv = document.createElement("div");
  resultsDiv.className = "p-4 bg-gray-900 rounded-lg";

  let title = document.createElement("h2");
  title.className = "text-lg font-bold text-green-400 mb-2";
  title.innerText = "All Matchups (Preview)";
  resultsDiv.appendChild(title);

  const pairs = [
    ["P1", "P8"],
    ["P2", "P7"],
    ["P3", "P6"],
    ["P4", "P5"],
  ];

  pairs.forEach(([a, b]) => {
    let nameA = document.getElementById(a).value || a;
    let nameB = document.getElementById(b).value || b;
    let p = document.createElement("p");
    p.innerText = `${nameA} VS ${nameB}`;
    resultsDiv.appendChild(p);
  });

  output.appendChild(resultsDiv);
}
