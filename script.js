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

  ["Round I-2", "Round I-3", "Round I-4"].forEach((title) => {
    let section = document.createElement("div");
    section.className = "space-y-4";
    let h3 = document.createElement("h3");
    h3.className = "text-lg font-semibold text-indigo-300 select-none";
    h3.textContent = title;
    section.appendChild(h3);
    section.appendChild(makeMatch(players[0], true));
    for (let i = 0; i < 3; i++) section.appendChild(makeMatch(null, false));
    roundsDiv.appendChild(section);
  });

  document.getElementById("roundsForm").classList.remove("hidden");
  attachFilterEvents();
}

function makeMatch(fixed = null) {
  let row = document.createElement("div");
  row.className = "flex flex-col sm:flex-row items-center gap-2 mb-2 py-6";

  function createInput(value, disabled = false) {
    if (disabled) {
      let input = document.createElement("input");
      input.type = "text";
      input.className =
        "rounded-md bg-gray-700 border border-gray-600 text-gray-400 px-3 py-2 w-full sm:w-80% cursor-not-allowed";
      input.value = value;
      input.disabled = true;
      return input;
    } else {
      let select = document.createElement("select");
      select.className =
        "player-select rounded-md bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 w-full sm:w-80% focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition";
      let optionDefault = document.createElement("option");
      optionDefault.value = "";
      optionDefault.textContent = "-- select --";
      select.appendChild(optionDefault);
      players
        .filter((p) => p !== players[0])
        .forEach((p) => {
          let opt = document.createElement("option");
          opt.value = p;
          opt.textContent = p;
          select.appendChild(opt);
        });
      if (value) select.value = value;
      return select;
    }
  }

  if (fixed) {
    let inputFixed = createInput(fixed, true);
    let vsSpan = document.createElement("span");
    vsSpan.className = "text-gray-400 select-none";
    vsSpan.textContent = "vs";
    let selectOpp = createInput(null, false);
    row.appendChild(inputFixed);
    row.appendChild(vsSpan);
    row.appendChild(selectOpp);
  } else {
    let select1 = createInput(null, false);
    let vsSpan = document.createElement("span");
    vsSpan.className = "text-gray-400 select-none";
    vsSpan.textContent = "vs";
    let select2 = createInput(null, false);
    row.appendChild(select1);
    row.appendChild(vsSpan);
    row.appendChild(select2);
  }
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
              .filter(
                (p) =>
                  p !== players[0] &&
                  (!chosen.includes(p) || p === current)
              )
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
  let inputs = section.querySelectorAll("input,select");
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

// --- Algoritma inti ---
function simulate_rotation(order, fixed, n_rounds) {
  let res = [];
  let arr = order.slice();
  for (let r = 0; r < n_rounds; r++) {
    let pairs = [
      new Set([arr[0], fixed]),
      new Set([arr[1], arr[6]]),
      new Set([arr[2], arr[5]]),
      new Set([arr[3], arr[4]]),
    ];
    res.push(pairs);
    arr = [arr[6]].concat(arr.slice(0, 6));
  }
  return res;
}

function generate_schedule(order, fixed, n_rounds = 7) {
  let arr = order.slice();
  let schedule = [];
  for (let r = 1; r <= n_rounds; r++) {
    let pairs = [
      [arr[0], fixed],
      [arr[1], arr[6]],
      [arr[2], arr[5]],
      [arr[3], arr[4]],
    ];
    schedule.push(pairs);
    arr = [arr[6]].concat(arr.slice(0, 6));
  }
  return schedule;
}

function eqSets(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;
  let used = new Array(arr2.length).fill(false);
  for (let s1 of arr1) {
    let found = false;
    for (let j = 0; j < arr2.length; j++) {
      if (!used[j]) {
        let s2 = arr2[j];
        if (s1.size === s2.size && [...s1].every((v) => s2.has(v))) {
          used[j] = true;
          found = true;
          break;
        }
      }
    }
    if (!found) return false;
  }
  return true;
}

function solve() {
  let rounds = [];
  for (let i = 0; i < 3; i++) {
    let r = getRound(i);
    if (!r) return;
    rounds.push(r.map((p) => new Set(p)));
  }

  // Dummy jadual untuk contoh – integrate jadual betul ikut logic asal kalau perlu
  let sched = [
    ...rounds.map((rr) => Array.from(rr).map((s) => [...s])),
  ];

  // Mapping label round ikut contoh
  const roundLabels = {
    0: "I-2",
    1: "I-3",
    2: "I-4",
    3: "II-1",
    4: "II-2",
    5: "II-4",
    6: "II-5",
    7: "II-6",
    8: "III-1",
    9: "III-2",
    10: "III-4",
    11: "III-5",
    12: "III-6",
    13: "IV-1",
  };

  let container = document.getElementById("output");
  container.innerHTML = "";

  // Loop setiap player
  players.forEach((player) => {
    let txt = `${player}\n`;

    for (let r = 0; r < Object.keys(roundLabels).length; r++) {
      let match = sched[r] ? sched[r].find((m) => m.includes(player)) : null;
      if (match) {
        let opponent = match[0] === player ? match[1] : match[0];
        txt += `${roundLabels[r]} : ${opponent}\n`;
      }
    }

    let box = document.createElement("pre");
    box.className =
      "bg-gray-900 text-green-400 p-4 rounded-lg text-sm whitespace-pre-wrap";
    box.textContent = txt.trim();
    container.appendChild(box);
  });
}

// Helper function to generate dropdown HTML for manual input steps
function dropdownHTML(list) {
  return `<select class="player-select rounded-md bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition">
    <option value="">-- select --</option>
    ${list.map((p) => `<option value="${p}">${p}</option>`).join("")}
  </select>`;
}

// Attach event listeners
document
  .getElementById("btnGenerate")
  .addEventListener("click", generateDropdowns);
document.getElementById("btnSolve").addEventListener("click", solve);
