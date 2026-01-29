@'
export default async function handler(req, res) {
  const path = req.query.path || "";
  const target = `https://api.baconalgo.com/${path}`;

  const r = await fetch(target, {
    method: req.method,
    headers: {
      "CF-Access-Client-Id": process.env.CF_ACCESS_CLIENT_ID,
      "CF-Access-Client-Secret": process.env.CF_ACCESS_CLIENT_SECRET,
      "Content-Type": req.headers["content-type"] || "application/json",
    },
  });

  const body = await r.text();
  res.status(r.status);
  res.setHeader("Content-Type", r.headers.get("content-type") || "application/json");
  res.send(body);
}
'@ | Set-Content -Encoding UTF8 .\api\proxy.js
