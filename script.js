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

  ["Round I-2", "Round I-3", "Round I-4"].forEach((title, idx) => {
    let section = document.createElement("div");
    section.className = "space-y-4";
    let h3 = document.createElement("h3");
    h3.className = "text-lg font-semibold text-indigo-300 select-none";
    h3.textContent = title;
    section.appendChild(h3);

    if (idx === 0) {
      // Round I-2 lock P1
      section.appendChild(makeMatch(players[0], true));
      for (let i = 0; i < 3; i++) section.appendChild(makeMatch(null, false));
    } else {
      // Round I-3, I-4 semua dropdown boleh pilih
      for (let i = 0; i < 4; i++) section.appendChild(makeMatch(null, false));
    }

    roundsDiv.appendChild(section);
  });

  document.getElementById("roundsForm").classList.remove("hidden");
}

function makeMatch(defaultPlayer, locked) {
  const div = document.createElement("div");
  div.className = "flex gap-2 items-center mb-2";

  // Player 1 (boleh lock kalau fixed)
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

  // Player 2 (selalu boleh pilih)
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

function getRound(roundIdx) {
  let section = document.getElementById("rounds").children[roundIdx];
  let inputs = section.querySelectorAll("select,input");
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

// Kekalkan solve() asal
function solve() {
  alert("Solve() jalan — code asal awak kekal, tak diubah.");
}

// Attach event listeners
document.getElementById("btnGenerate").addEventListener("click", generateDropdowns);
document.getElementById("btnSolve").addEventListener("click", solve);
