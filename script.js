function solve() {
  const roundsDiv = document.getElementById("rounds");
  const output = document.getElementById("output");
  output.innerHTML = "";

  // --- Legend ---
  const legend = document.createElement("div");
  legend.className = "mb-6 p-4 bg-gray-900 rounded-lg shadow flex flex-col sm:flex-row gap-4 text-sm";
  legend.innerHTML = `
    <div><span class="text-yellow-400 font-bold">● P1</span> = Highlight utama</div>
    <div><span class="text-blue-400 font-semibold">● P2–P4</span> = Secondary highlight</div>
    <div><span class="text-gray-200">● P5–P8</span> = Neutral</div>
  `;
  output.appendChild(legend);

  const sections = roundsDiv.querySelectorAll("div.space-y-4");
  const matches = [];

  // Loop setiap round
  sections.forEach((section, roundIndex) => {
    const inputs = section.querySelectorAll("input, select");
    const roundMatches = [];

    for (let i = 0; i < inputs.length; i += 2) {
      let a = inputs[i].value;
      let b = inputs[i + 1].value;
      if (a && b) roundMatches.push([a, b]);
    }

    matches.push(roundMatches);
  });

  // Output
  matches.forEach((round, idx) => {
    const div = document.createElement("div");
    div.className = "p-4 bg-gray-800 rounded-lg shadow mb-4";
    div.innerHTML = `<h2 class="font-bold mb-2 text-indigo-400">Round ${idx + 1}</h2>`;

    round.forEach(match => {
      const [p1, p2] = match;

      let colorA = "text-gray-200"; // default
      let colorB = "text-gray-200"; // default

      // highlight ikut nama player
      if (p1 === players[0]) colorA = "text-yellow-400 font-bold"; // P1
      if (p2 === players[0]) colorB = "text-yellow-400 font-bold";

      if ([1, 2, 3].includes(players.indexOf(p1))) colorA = "text-blue-400 font-semibold"; // P2–P4
      if ([1, 2, 3].includes(players.indexOf(p2))) colorB = "text-blue-400 font-semibold";

      div.innerHTML += `<p><span class="${colorA}">${p1}</span> vs <span class="${colorB}">${p2}</span></p>`;
    });

    output.appendChild(div);
  });
}
