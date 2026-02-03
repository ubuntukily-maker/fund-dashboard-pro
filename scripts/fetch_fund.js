const fs = require("fs");
const axios = require("axios");

const codes = JSON.parse(fs.readFileSync("./src/fund_codes.json", "utf-8"));

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
      console.error("error:", code);
    }
  }

  fs.writeFileSync(
    "./src/fund_data.json",
    JSON.stringify(result, null, 2)
  );
})();
