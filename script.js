function solve() {
  const rounds = document.querySelectorAll(".round");
  const output = document.getElementById("output");
  output.innerHTML = "";

  rounds.forEach((roundDiv, roundIndex) => {
    const selects = roundDiv.querySelectorAll("select");
    let players = Array.from(selects).map((s) => s.value || "P?");

    // Group matchups: (P1 vs ...), (P2 vs ...), etc.
    let matches = [];
    for (let i = 0; i < players.length; i += 2) {
      if (players[i] && players[i + 1]) {
        matches.push([players[i], players[i + 1]]);
      }
    }

    // Round container
    let roundBox = document.createElement("div");
    roundBox.className =
      "bg-gray-800 p-4 rounded-xl shadow-lg border border-gray-700";

    let roundTitle = document.createElement("h2");
    roundTitle.className = "text-xl font-bold mb-3 text-indigo-400";
    roundTitle.textContent = `Round ${roundIndex + 1}`;
    roundBox.appendChild(roundTitle);

    // Each matchup
    matches.forEach((pair) => {
      let matchLine = document.createElement("p");

      // Highlight logic
      if (pair.includes("P1")) {
        matchLine.className =
          "font-semibold text-amber-400 text-lg mb-1 drop-shadow";
      } else if (pair.includes("P2") || pair.includes("P3") || pair.includes("P4")) {
        matchLine.className =
          "font-semibold text-sky-400 text-lg mb-1 drop-shadow";
      } else {
        matchLine.className = "text-gray-300 mb-1";
      }

      matchLine.textContent = `${pair[0]} vs ${pair[1]}`;
      roundBox.appendChild(matchLine);
    });

    output.appendChild(roundBox);
  });
}

