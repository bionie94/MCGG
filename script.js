let players = [];

// Initialize player inputs on page load
window.onload = () => {
  const container = document.getElementById("playerInputs");
  for (let i = 1; i <= 8; i++) {
    let div = document.createElement("div");
    div.innerHTML = `
      <label for="P${i}" class="block text-gray-400 text-sm mb-1 font-medium select-none">
        P${i}${i === 1 ? " (You)" : ""}
      </label>
      <input id="P${i}" 
        class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white" 
        placeholder="Enter name">
    `;
    container.appendChild(div);
  }

  document.getElementById("btnGenerate").onclick = generateDropdowns;
  document.getElementById("btnSolve").onclick = solve;
};

function makeMatch(defaultPlayer, locked) {
  const div = document.createElement("div");
  div.className = "flex gap-2 items-center";

  const sel1 = document.createElement("select");
  sel1.className = "flex-1 px-2 py-1 rounded bg-gray-800 border border-gray-700";
  if (locked) {
    let opt = document.createElement("option");
    opt.value = defaultPlayer;
    opt.text = defaultPlayer;
    sel1.appendChild(opt);
    sel1.disabled = true;
  }

  const sel2 = document.createElement("select");
  sel2.className = "flex-1 px-2 py-1 rounded bg-gray-800 border border-gray-700";

  div.appendChild(sel1);
  div.appendChild(document.createTextNode(" vs "));
  div.appendChild(sel2);

  return div;
}

function generateDropdowns() {
  players = [];
  for (let i = 1; i <= 8; i++) {
    let val = document.getElementById("P" + i).value.trim();
    if (!val) {
      alert("Sila isi semua nama pemain!");
      return;
    }
    players.push(val);
  }
  if (new Set(players).size !== 8) {
    alert("Nama pemain tak boleh sama!");
    return;
  }

  let roundsDiv = document.getElementById("rounds");
  if (!roundsDiv) {
    console.error("Element #rounds not found in DOM");
    return;
  }
  roundsDiv.innerHTML = "";

  ["Round I-2", "Round I-3", "Round I-4"].forEach((title) => {
    let section = document.createElement("div");
    section.className = "space-y-4";
    let h3 = document.createElement("h3");
    h3.className = "text-lg font-semibold text-indigo-300 select-none";
    h3.textContent = title;
    section.appendChild(h3);
    section.appendChild(makeMatch(players[0], true)); // P1 lock
    for (let i = 0; i < 3; i++) section.appendChild(makeMatch(null, false));
    roundsDiv.appendChild(section);
  });

  document.getElementById("roundsForm").classList.remove("hidden");
  attachFilterEvents();
}

function attachFilterEvents() {
  const selects = document.querySelectorAll("#rounds select");
  selects.forEach((sel) => {
    if (sel.disabled) return;
    sel.innerHTML = `<option value="">--Select--</option>`;
    players.forEach((p) => {
      let opt = document.createElement("option");
      opt.value = p;
      opt.text = p;
      sel.appendChild(opt);
    });
    sel.addEventListener("change", () => {
      filterOptions();
    });
  });
}

function filterOptions() {
  const selects = document.querySelectorAll("#rounds select");
  let chosen = Array.from(selects)
    .map((s) => s.value)
    .filter((v) => v);

  selects.forEach((sel) => {
    if (sel.disabled) return;
    let current = sel.value;
    sel.querySelectorAll("option").forEach((opt) => {
      if (!opt.value) return;
      if (opt.value === current) {
        opt.disabled = false;
      } else if (chosen.includes(opt.value)) {
        opt.disabled = true;
      } else {
        opt.disabled = false;
      }
    });
  });
}

function solve() {
  let rounds = document.querySelectorAll("#rounds > div");
  let results = [];
  let tracked = { P1: [], P2: [], P3: [], P4: [] };

  rounds.forEach((round, rIdx) => {
    let matches = [];
    let pairs = round.querySelectorAll("div.flex");
    pairs.forEach((pair) => {
      let sel = pair.querySelectorAll("select");
      let p1 = sel[0].value || sel[0].options[0]?.value;
      let p2 = sel[1].value;
      if (!p1 || !p2) {
        matches.push("Incomplete Match");
      } else {
        matches.push(`${p1} vs ${p2}`);
        // Track P1-P4 opponents
        if (p1.startsWith("P") && tracked[p1]) tracked[p1].push(p2);
        if (p2.startsWith("P") && tracked[p2]) tracked[p2].push(p1);
      }
    });
    results.push({ round: rIdx + 1, matches });
  });

  let outDiv = document.getElementById("output");
  outDiv.innerHTML = "";
  results.forEach((res) => {
    let sec = document.createElement("div");
    sec.className = "p-4 bg-gray-800 rounded";
    let h4 = document.createElement("h4");
    h4.className = "font-bold text-indigo-400 mb-2";
    h4.textContent = "Round " + res.round;
    sec.appendChild(h4);
    res.matches.forEach((m) => {
      let p = document.createElement("p");
      p.textContent = m;
      sec.appendChild(p);
    });
    outDiv.appendChild(sec);
  });

  // Show summary for P1-P4
  let summary = document.createElement("div");
  summary.className = "p-4 bg-green-800 rounded mt-4";
  summary.innerHTML = "<h4 class='font-bold text-yellow-300 mb-2'>Match Summary</h4>";
  Object.keys(tracked).forEach((p) => {
    let line = document.createElement("p");
    line.textContent = `${p} lawan: ${tracked[p].length ? tracked[p].join(", ") : "Tiada data"}`;
    summary.appendChild(line);
  });
  outDiv.appendChild(summary);
}
