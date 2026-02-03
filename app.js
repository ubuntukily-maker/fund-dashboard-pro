let funds = [];
let codes = [];

async function load() {
  funds = await fetch("fund_data.json").then(r => r.json());
  codes = await fetch("fund_codes.json").then(r => r.json());
  render();
}

function render() {
  const box = document.getElementById("funds");
  box.innerHTML = "";

  funds.forEach(f => {
    const div = document.createElement("div");
    div.className = "card";

    const cls = Number(f.gszzl) >= 0 ? "up" : "down";

    div.innerHTML = `
      <b>${f.name}</b> (${f.code})<br/>
      净值：${f.jz}<br/>
      估值：<span class="${cls}">${f.gszzl}%</span><br/>
      <button onclick="removeFund('${f.code}')">删除</button>
    `;

    box.appendChild(div);
  });
}

function addFund() {
  const code = document.getElementById("codeInput").value.trim();
  if (!code || codes.includes(code)) return;

  codes.push(code);
  triggerUpdate();
}

function removeFund(code) {
  codes = codes.filter(c => c !== code);
  triggerUpdate();
}

function triggerUpdate() {
  fetch("https://api.github.com/repos/你的用户名/你的仓库/actions/workflows/deploy.yml/dispatches", {
    method: "POST",
    headers: {
      "Accept": "application/vnd.github+json"
    },
    body: JSON.stringify({
      ref: "main",
      inputs: {
        codes: JSON.stringify(codes)
      }
    })
  });

  alert("已提交，稍后自动更新");
}

load();
