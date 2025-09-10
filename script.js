// Initialize player inputs on page load
window.onload = () => {
  const container = document.getElementById("playerInputs");
  for (let i = 1; i <= 8; i++) {
    let div = document.createElement("div");
    div.innerHTML = `
      <label for="P${i}" class="block text-gray-400 text-sm mb-1 font-medium select-none">P${i}${i === 1 ? " (You)" : ""}</label>
      <input id="P${i}" type="text" class="w-full rounded-md bg-gray-700 border border-gray-600 placeholder-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition px-3 py-2" placeholder="Player ${i} Name" />
    `;
    container.appendChild(div);
  }
};

let players = [];

function generateDropdowns() {
  players = [];
  for (let i = 1; i <= 8; i++) {
    let val = document.getElementById("P" + i).value.trim();
    if (!val) {
      alert("KEPALA COCOT ISI SEMUA NAMA PLAYER LAH");
      return;
    }
    players.push(val);
  }
  if (new Set(players).size !== 8) {
    alert("ISI LAH NAMA PLAYER SHORTFORM PUN OK");
    return;
  }

  let roundsDiv = document.getElementById("rounds");
  roundsDiv.innerHTML = "";

  ["Round I-1", "Round I-2", "Round I-3", "Round I-4"].forEach((title) => {
    let section = document.createElement("div");
    section.className = "space-y-4";
    let h3 = document.createElement("h3");
    h3.className = "text-lg font-semibold text-indigo-300 select-none";
    h3.textContent = title;
    section.appendChild(h3);
    for (let i = 0; i < 4; i++) section.appendChild(makeMatch());
    roundsDiv.appendChild(section);
  });

  document.getElementById("roundsForm").classList.remove("hidden");
  attachFilterEvents();
}

function makeMatch() {
  let row = document.createElement("div");
  row.className = "flex flex-col sm:flex-row items-center gap-2 mb-2 py-2";

  function createSelect() {
    let select = document.createElement("select");
    select.className =
      "player-select rounded-md bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 w-full sm:w-80% focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";
    let optionDefault = document.createElement("option");
    optionDefault.value = "";
    optionDefault.textContent = "-- select --";
    select.appendChild(optionDefault);
    players.forEach((p) => {
      let opt = document.createElement("option");
      opt.value = p;
      opt.textContent = p;
      select.appendChild(opt);
    });
    return select;
  }

  let select1 = createSelect();
  let vsSpan = document.createElement("span");
  vsSpan.className = "text-gray-400 select-none";
  vsSpan.textContent = "vs";
  let select2 = createSelect();
  row.appendChild(select1);
  row.appendChild(vsSpan);
  row.appendChild(select2);

  return row;
}

function attachFilterEvents() {
  document.querySelectorAll("#rounds > div").forEach((roundDiv) => {
    let selects = roundDiv.querySelectorAll("select");
    selects.forEach((sel) => {
      sel.addEventListener("change", () => {
        let chosen = Array.from(selects)
          .map((s) => s.value)
          .filter((v) => v !== "");
        selects.forEach((s) => {
          let current = s.value;
          s.innerHTML =
            `<option value="">-- select --</option>` +
            players
              .filter((p) => !chosen.includes(p) || p === current)
              .map(
                (p) =>
                  `<option value="${p}" ${
                    p === current ? "selected" : ""
                  }>${p}</option>`
              )
              .join("");
        });
      });
    });
  });
}

function getRound(roundIdx) {
  let section = document.getElementById("rounds").children[roundIdx];
  let inputs = section.querySelectorAll("select");
  let pairs = [];
  for (let i = 0; i < inputs.length; i += 2) {
    let a = inputs[i].value;
    let b = inputs[i + 1].value;
    if (!a || !b) {
      alert("All dropdowns must be selected!");
      return null;
    }
    pairs.push([a, b]);
  }
  return pairs;
}

// --- UPGRADE solve() ---
function solve() {
  const output = document.getElementById("output");
  output.innerHTML = "";

  if (players.length < 8) {
    alert("Sila masukkan semua nama pemain (P1 - P8) dan tekan Generate Rounds.");
    return;
  }

  // Simpan lawan untuk P1 - P4
  const tracked = {
    [players[0]]: [], // P1
    [players[1]]: [], // P2
    [players[2]]: [], // P3
    [players[3]]: []  // P4
  };

  const roundTitles = ["Round I-1", "Round I-2", "Round I-3", "Round I-4"];

  // Check setiap round
  for (let r = 0; r < 4; r++) {
    const pairs = getRound(r);
    if (!pairs) return;

    pairs.forEach(([a, b]) => {
      if (tracked[a] !== undefined) tracked[a].push(`vs ${b}`);
      if (tracked[b] !== undefined) tracked[b].push(`vs ${a}`);
    });
  }

  // Buat card untuk setiap P1 - P4
  Object.keys(tracked).forEach((p, idx) => {
    const box = document.createElement("div");
    box.className = "bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-4";

    const title = document.createElement("h2");
    title.className = "text-xl font-bold mb-3 text-indigo-400";
    title.textContent = p;
    box.appendChild(title);

    tracked[p].forEach((opponent, i) => {
      const line = document.createElement("p");
      if (idx === 0) {
        line.className = "font-semibold text-amber-400 text-lg mb-1 drop-shadow";
      } else {
        line.className = "font-semibold text-sky-400 text-lg mb-1 drop-shadow";
      }
      line.textContent = `${roundTitles[i]} → ${opponent}`;
      box.appendChild(line);
    });

    output.appendChild(box);
  });
}

// Attach event listeners
document.getElementById("btnGenerate").addEventListener("click", generateDropdowns);
document.getElementById("btnSolve").addEventListener("click", solve);
