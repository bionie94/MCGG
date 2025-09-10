// Senarai player (default kosong, akan diisi dari input)
let players = [];

// Generate input nama player P1–P8
window.onload = () => {
  const container = document.getElementById("playerInputs");
  for (let i = 1; i <= 8; i++) {
    let div = document.createElement("div");
    div.innerHTML = `
      <label for="P${i}" class="block text-gray-400 text-sm mb-1 font-medium select-none">P${i}${i <= 4 ? " (Lock)" : ""}</label>
      <input id="P${i}" type="text" placeholder="Enter name"
        class="w-full px-3 py-2 rounded bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"/>
    `;
    container.appendChild(div);
  }

  document.getElementById("btnGenerate").addEventListener("click", generateDropdowns);
  document.getElementById("btnSolve").addEventListener("click", solve);
  document.getElementById("btnShowAll").addEventListener("click", showAllMatchups);
};

// Buat satu pairing (dropdown vs dropdown)
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
  } else {
    sel1.innerHTML = `<option value="">--Select--</option>`;
    players.forEach((p) => {
      let opt = document.createElement("option");
      opt.value = p;
      opt.text = p;
      sel1.appendChild(opt);
    });
  }

  const sel2 = document.createElement("select");
  sel2.className = "flex-1 px-2 py-1 rounded bg-gray-800 border border-gray-700";
  sel2.innerHTML = `<option value="">--Select--</option>`;
  players.forEach((p) => {
    let opt = document.createElement("option");
    opt.value = p;
    opt.text = p;
    sel2.appendChild(opt);
  });

  div.appendChild(sel1);
  div.appendChild(document.createTextNode(" vs "));
  div.appendChild(sel2);

  return div;
}

// Generate semua dropdown Round I-2 sampai I-5
function generateDropdowns() {
  // collect nama player dari input
  players = [];
  for (let i = 1; i <= 8; i++) {
    const val = document.getElementById("P" + i).value.trim() || "P" + i;
    players.push(val);
  }

  let roundsDiv = document.getElementById("rounds");
  if (!roundsDiv) return;
  roundsDiv.innerHTML = "";

  // Lock ikut giliran
  let lockedPlayers = [players[0], players[1], players[2], players[3]]; // P1–P4

  for (let r = 0; r < 4; r++) {
    let section = document.createElement("div");
    section.className = "mb-6 p-4 rounded bg-gray-900 border border-gray-700";

    let title = document.createElement("h3");
    title.className = "text-lg font-semibold text-indigo-400 mb-3";
    title.textContent = `Round I-${r + 2}`;
    section.appendChild(title);

    // Lock ikut giliran
    section.appendChild(makeMatch(lockedPlayers[r], true));

    // Tambah 3 match lain
    for (let i = 0; i < 3; i++) {
      section.appendChild(makeMatch(null, false));
    }

    roundsDiv.appendChild(section);
  }

  attachFilterEvents();
}

// Filter supaya nama tak duplicate dalam 1 round
function attachFilterEvents() {
  const roundsDiv = document.getElementById("rounds");
  if (!roundsDiv) return;

  roundsDiv.querySelectorAll("div").forEach((roundSection) => {
    let selects = roundSection.querySelectorAll("select");
    selects.forEach((sel) => {
      sel.addEventListener("change", () => {
        let chosen = Array.from(selects).map((s) => s.value);
        selects.forEach((s) => {
          Array.from(s.options).forEach((opt) => {
            if (opt.value && chosen.includes(opt.value) && s.value !== opt.value) {
              opt.disabled = true;
            } else {
              opt.disabled = false;
            }
          });
        });
      });
    });
  });
}

// Kekalkan solve() asal
function solve() {
  alert("Solve() jalan — masukkan balik formula asal awak kat sini");
}

// Show semua pairing dari dropdown
function showAllMatchups() {
  const roundsDiv = document.getElementById("rounds");
  const output = document.getElementById("output");
  output.innerHTML = "";

  let roundSections = roundsDiv.querySelectorAll("> div");
  roundSections.forEach((section, idx) => {
    let lines = section.querySelectorAll("select");
    let roundBox = document.createElement("div");
    roundBox.className = "bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700 mb-4";

    let roundTitle = document.createElement("h2");
    roundTitle.className = "text-xl font-bold mb-3 text-indigo-400";
    roundTitle.textContent = `Round I-${idx + 2}`;
    roundBox.appendChild(roundTitle);

    for (let i = 0; i < lines.length; i += 2) {
      let p1 = lines[i].value || "?";
      let p2 = lines[i + 1].value || "?";

      let matchLine = document.createElement("p");
      if (["P1", players[0]].includes(p1) || ["P1", players[0]].includes(p2)) {
        matchLine.className = "font-semibold text-amber-400 text-lg mb-1 drop-shadow";
      } else if (
        ["P2", players[1]].includes(p1) || ["P2", players[1]].includes(p2) ||
        ["P3", players[2]].includes(p1) || ["P3", players[2]].includes(p2) ||
        ["P4", players[3]].includes(p1) || ["P4", players[3]].includes(p2)
      ) {
        matchLine.className = "font-semibold text-sky-400 text-lg mb-1 drop-shadow";
      } else {
        matchLine.className = "text-gray-300 mb-1";
      }

      matchLine.textContent = `${p1} vs ${p2}`;
      roundBox.appendChild(matchLine);
    }

    output.appendChild(roundBox);
  });
}
