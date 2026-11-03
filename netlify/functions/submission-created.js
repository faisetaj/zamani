// Runs automatically on every verified Netlify Forms submission from /updates.
//
// Opens a GitHub issue labeled `site-update` + `needs-triage`. It deliberately does NOT
// mention @claude — the agent only runs after the request is approved in the ops panel
// (gate 1). That keeps junk and ambiguous requests from ever costing tokens, and lets the
// instruction be sharpened before the agent reads it.
//
// Required env vars (Netlify site settings → Environment variables):
//   GH_TOKEN   – fine-grained PAT with Issues:write + Contents:write on this repo
//   REPO       – e.g. "faisetaj/ameze"
// Optional:
//   NETLIFY_TOKEN – lets client-uploaded images get committed into the repo automatically

const GH_API = "https://api.github.com";
const MAX_UPLOAD = 8 * 1024 * 1024;

exports.handler = async (event) => {
  let payload;
  try {
    ({ payload } = JSON.parse(event.body));
  } catch {
    return { statusCode: 400, body: "Bad payload" };
  }

  const d = (payload && payload.data) || {};
  const repo = process.env.REPO;
  const ghToken = process.env.GH_TOKEN;
  if (!repo || !ghToken) {
    console.error("Missing REPO or GH_TOKEN env var");
    return { statusCode: 500, body: "Not configured" };
  }

  const gh = (path, opts = {}) =>
    fetch(`${GH_API}${path}`, {
      ...opts,
      headers: {
        Authorization: `Bearer ${ghToken}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        ...(opts.headers || {}),
      },
    });

  // Copy any attached image into the repo so the agent can reference a real path.
  // Netlify stores uploads behind an authenticated URL.
  let attachmentNote = "";
  const fileUrl = typeof d.attachment === "string" ? d.attachment : d.attachment?.url;
  if (fileUrl) {
    attachmentNote = `\n**Attachment (Netlify-hosted):** ${fileUrl}`;
    const nlToken = process.env.NETLIFY_TOKEN;
    if (nlToken) {
      try {
        const res = await fetch(fileUrl, { headers: { Authorization: `Bearer ${nlToken}` } });
        if (res.ok) {
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.length <= MAX_UPLOAD) {
            const stamp = new Date().toISOString().slice(0, 10);
            const clean = (fileUrl.split("/").pop() || "upload").replace(/[^\w.\-]/g, "_");
            const path = `img/uploads/${stamp}-${clean}`;
            const put = await gh(`/repos/${repo}/contents/${encodeURI(path)}`, {
              method: "PUT",
              body: JSON.stringify({
                message: `Add client-uploaded asset ${path}`,
                content: buf.toString("base64"),
              }),
            });
            if (put.ok) attachmentNote = `\n**Attachment committed to repo:** \`${path}\``;
            else console.error("Attachment commit failed:", put.status, await put.text());
          } else {
            console.error("Attachment too large:", buf.length);
          }
        }
      } catch (e) {
        console.error("Attachment copy failed:", e.message);
      }
    }
  }

  // The portal serializes its rows into `operations` (JSON) and `operations_text` (readable).
  let ops = [];
  try {
    ops = JSON.parse(d.operations || "[]");
  } catch {
    /* fall back to the text rendering below */
  }

  const opsBlock = d.operations_text
    ? "```\n" + d.operations_text + "\n```"
    : "_(no structured operations submitted)_";

  const summary = ops.length
    ? ops.map((o) => (o.type || "other").toUpperCase()).join(" · ")
    : "change request";

  const title = `[site-update] ${summary}`.slice(0, 120);

  const body = [
    `## Website change request`,
    ``,
    `| Field | Value |`,
    `| --- | --- |`,
    `| Site | ${d.site || repo} |`,
    `| From | ${d.name || "?"} (${d.email || "no email"}) |`,
    `| Requested | ${new Date().toISOString().slice(0, 16).replace("T", " ")} UTC |`,
    `| Deadline | ${d.deadline || "not specified"} |`,
    `| Operations | ${ops.length || "—"} |`,
    ``,
    `### Requested changes`,
    ``,
    opsBlock,
    attachmentNote,
    ``,
    `<!-- operations-json`,
    JSON.stringify(ops),
    `-->`,
    ``,
    `---`,
    `⏸ **Awaiting triage.** The agent has not run. Approve this in the ops panel to`,
    `dispatch it — approving posts the final instruction as a comment mentioning @claude.`,
  ].join("\n");

  const issue = await gh(`/repos/${repo}/issues`, {
    method: "POST",
    body: JSON.stringify({ title, body, labels: ["site-update", "needs-triage"] }),
  });

  if (!issue.ok) {
    console.error("Issue creation failed:", issue.status, await issue.text());
    return { statusCode: 502, body: "Issue creation failed" };
  }

  const created = await issue.json();
  console.log(`Opened issue #${created.number}: ${created.html_url}`);
  return { statusCode: 200, body: `Issue #${created.number} created` };
};
