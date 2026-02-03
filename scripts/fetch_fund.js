const fs = require("fs");
const axios = require("axios");

let codes;

try {
  const raw = fs.readFileSync("./src/fund_codes.json", "utf-8");
  const parsed = JSON.parse(raw);

  if (Array.isArray(parsed)) {
    codes = parsed;
  } else if (parsed && Array.isArray(parsed.codes)) {
    codes = parsed.codes;
  } else {
    throw new Error("fund_codes.json 格式错误");
  }
} catch (e) {
  console.error("❌ 无法读取基金代码列表:", e.message);
  process.exit(1);
}

async function fetchFund(code) {
  const url = `https://fundgz.1234567.com.cn/js/${code}.js?rt=${Date.now()}`;
  const res = await axios.get(url);
  const json = res.data.replace(/^jsonpgz\((.*)\);$/, "$1");
  return JSON.parse(json);
}

(async () => {
  const result = [];

  for (const code of codes) {
    try {
      const f = await fetchFund(code);
      result.push({
        name: f.name,
        code: f.fundcode,
        jz: f.dwjz,
        gszzl: f.gszzl,
        gztime: f.gztime
      });
    } catch (e) {
      console.error("❌ 获取失败:", code);
    }
  }

  fs.writeFileSync(
    "./src/fund_data.json",
    JSON.stringify(result, null, 2)
  );
})();
