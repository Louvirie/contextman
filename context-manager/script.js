let commands = [];
let favorites = [];

window.onload = async () => {
  commands = await fetch("commands.json").then(res => res.json());
  loadFavorites();
  renderCategoryFilter();
  renderCommands();

  document.getElementById("search").oninput = renderCommands;
  document.getElementById("category-filter").onchange = renderCommands;
  document.getElementById("export").onclick = exportFavorites;
};

function renderCommands() {
  const container = document.getElementById("command-list");
  const search = document.getElementById("search").value.toLowerCase();
  const filter = document.getElementById("category-filter").value;

  container.innerHTML = "";

  commands
    .filter(cmd =>
      (!search || cmd.command.toLowerCase().includes(search)) &&
      (!filter || cmd.category === filter)
    )
    .forEach(cmd => {
      const card = document.createElement("div");
      card.className = "command-card";

      card.innerHTML = `
        <div class="category">${cmd.category}</div>
        <code>${cmd.command}</code>
        <p>${cmd.description}</p>
        <button onclick="toggleFavorite('${cmd.command}')">
          ${favorites.includes(cmd.command) ? "★ Remove Favorite" : "☆ Add Favorite"}
        </button>
      `;

      container.appendChild(card);
    });
}

function renderCategoryFilter() {
  const select = document.getElementById("category-filter");
  const categories = [...new Set(commands.map(c => c.category))];

  select.innerHTML = `<option value="">All Categories</option>`;
  categories.forEach(cat => {
    select.innerHTML += `<option value="${cat}">${cat}</option>`;
  });
}

function toggleFavorite(cmd) {
  if (favorites.includes(cmd)) {
    favorites = favorites.filter(c => c !== cmd);
  } else {
    favorites.push(cmd);
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderCommands();
}

function loadFavorites() {
  favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
}

function exportFavorites() {
  const data = commands.filter(c => favorites.includes(c.command));
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "favorites.json";
  a.click();
  URL.revokeObjectURL(url);
}
