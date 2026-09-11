"use client";

import { useEffect } from "react";

const BEBAS = "var(--font-bebas)";
const DM = "var(--font-dm-sans)";
const MONO = "var(--font-geist-mono)";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "access", label: "Access" },
  { id: "admin", label: "Admin Console" },
  { id: "behind", label: "Behind the Scenes" },
  { id: "payments", label: "Payments & Email" },
  { id: "domain", label: "Domain" },
  { id: "next", label: "Next Steps" },
  { id: "reference", label: "Reference" },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="pg-eyebrow"
      style={{ fontFamily: BEBAS, letterSpacing: "0.22em", textTransform: "uppercase", fontSize: 13, color: "var(--pg-accent-strong)", display: "block", marginBottom: 8 }}
    >
      {children}
    </span>
  );
}

function Card({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div className="pg-card">
      <div className="pg-card-icon">{icon}</div>
      <h3 style={{ fontFamily: DM, fontSize: 16, fontWeight: 600, margin: 0 }}>{title}</h3>
      <p style={{ color: "var(--pg-muted)", fontSize: 14, margin: "7px 0 0" }}>{children}</p>
    </div>
  );
}

function Panel({ badge, title, pill, children, who }: { badge: string; title: string; pill?: { label: string; tone: "good" | "warn" }; children: React.ReactNode; who?: React.ReactNode }) {
  return (
    <div className="pg-panel">
      <div className="pg-panel-badge" style={{ fontFamily: BEBAS }}>{badge}</div>
      <div style={{ flex: "1 1 auto", minWidth: 0 }}>
        <h3 style={{ fontFamily: DM, fontSize: 17, fontWeight: 600, margin: 0, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {title}
          {pill && <span className={`pg-pill pg-pill-${pill.tone}`}>{pill.label}</span>}
        </h3>
        <p style={{ color: "var(--pg-muted)", fontSize: 14.5, margin: "8px 0 0", maxWidth: "64ch" }}>{children}</p>
        {who && <p style={{ marginTop: 10, fontSize: 13 }}>{who}</p>}
      </div>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  return (
    <button
      type="button"
      className="pg-copybtn"
      onClick={(e) => {
        const btn = e.currentTarget;
        const prev = btn.textContent;
        navigator.clipboard
          ?.writeText(text)
          .then(() => {
            btn.textContent = "Copied";
            setTimeout(() => {
              btn.textContent = prev;
            }, 1200);
          })
          .catch(() => {});
      }}
    >
      Copy
    </button>
  );
}

export default function GuideContent() {
  useEffect(() => {
    const sections = SECTIONS.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => !!el);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const setActive = (id: string) => {
      document.querySelectorAll<HTMLAnchorElement>("[data-pg-nav]").forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === `#${id}`);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -70% 0px", threshold: 0 }
    );
    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="pg-root">
      <style>{`
        .pg-root {
          /* Aliases onto the shared admin theme tokens (src/app/globals.css)
             so this page follows the same light/dark toggle — and the same
             print override — as the rest of the console, not its own copy. */
          --pg-bg: var(--admin-bg); --pg-surface: var(--admin-card); --pg-ink: var(--admin-ink); --pg-muted: var(--admin-muted);
          --pg-line: var(--admin-border); --pg-accent: var(--admin-accent); --pg-accent-strong: var(--admin-accent); --pg-accent-tint: var(--admin-border-faint);
          --pg-good-fg: var(--admin-good-fg); --pg-good-bg: var(--admin-good-bg); --pg-warn-fg: var(--admin-warn-fg); --pg-warn-bg: var(--admin-warn-bg);
          max-width: 1180px; margin: 40px auto 0; padding: 0 24px 80px;
          font-family: ${DM}, system-ui, sans-serif; color: var(--pg-ink);
        }
        .pg-mobiletoc{ display:none; }
        .pg-shell{ display:flex; gap:44px; align-items:flex-start; }
        .pg-rail{ position:sticky; top:24px; flex:0 0 190px; display:flex; flex-direction:column; gap:2px; }
        .pg-rail a{ text-decoration:none; color:var(--pg-muted); font-size:14px; font-weight:500; padding:7px 10px; border-radius:7px; border-left:2px solid transparent; }
        .pg-rail a:hover{ color:var(--pg-ink); background:var(--pg-surface); }
        .pg-rail a.active{ color:var(--pg-accent-strong); border-left-color:var(--pg-accent); background:var(--pg-accent-tint); }
        .pg-main{ flex:1 1 auto; min-width:0; }
        .pg-section{ padding-top:50px; scroll-margin-top:20px; }
        .pg-section:first-of-type{ padding-top:0; }
        .pg-section h2{ font-family:${DM}; font-size:26px; font-weight:600; margin:0; }
        .pg-lede{ color:var(--pg-muted); font-size:15.5px; max-width:62ch; margin-top:10px; }
        .pg-divider{ height:1px; background:var(--pg-line); margin:48px 0 0; }
        .pg-journey{ display:flex; flex-wrap:wrap; margin-top:26px; border:1px solid var(--pg-line); border-radius:12px; overflow:hidden; background:var(--pg-surface); }
        .pg-step{ flex:1 1 150px; padding:16px 15px; display:flex; flex-direction:column; gap:6px; border-right:1px solid var(--pg-line); border-bottom:1px solid var(--pg-line); }
        .pg-step:last-child{ border-right:none; }
        .pg-step .n{ font-family:${MONO}; font-size:12px; color:var(--pg-accent-strong); }
        .pg-step .t{ font-weight:600; font-size:14px; }
        .pg-step .d{ color:var(--pg-muted); font-size:12.5px; line-height:1.45; }
        @media (max-width:820px){ .pg-step{ border-right:none; flex-basis:100%; } }
        .pg-cards{ display:grid; grid-template-columns:repeat(auto-fit, minmax(220px,1fr)); gap:14px; margin-top:20px; }
        .pg-card{ background:var(--pg-surface); border:1px solid var(--pg-line); border-radius:10px; padding:16px 16px 18px; }
        .pg-card-icon{ width:32px; height:32px; border-radius:8px; background:var(--pg-accent-tint); color:var(--pg-accent-strong); display:flex; align-items:center; justify-content:center; font-size:15px; font-weight:700; font-family:${DM}; margin-bottom:10px; }
        .pg-panel{ display:flex; gap:18px; background:var(--pg-surface); border:1px solid var(--pg-line); border-radius:12px; padding:20px; margin-top:16px; }
        .pg-panel-badge{ flex:0 0 auto; width:48px; height:48px; border-radius:10px; background:var(--pg-accent-tint); color:var(--pg-accent-strong); display:flex; align-items:center; justify-content:center; font-size:17px; letter-spacing:0.03em; }
        .pg-pill{ display:inline-flex; align-items:center; gap:6px; font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:0.04em; padding:3px 10px; border-radius:100px; }
        .pg-pill::before{ content:""; width:6px; height:6px; border-radius:50%; background:currentColor; }
        .pg-pill-good{ color:var(--pg-good-fg); background:var(--pg-good-bg); }
        .pg-pill-warn{ color:var(--pg-warn-fg); background:var(--pg-warn-bg); }
        .pg-checklist{ display:flex; flex-direction:column; gap:10px; margin-top:18px; }
        .pg-check{ display:flex; gap:14px; align-items:flex-start; background:var(--pg-surface); border:1px solid var(--pg-line); border-radius:10px; padding:13px 15px; }
        .pg-check .mark{ flex:0 0 auto; width:20px; height:20px; border-radius:6px; margin-top:1px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; }
        .pg-check.done .mark{ background:var(--pg-good-bg); color:var(--pg-good-fg); }
        .pg-check.todo .mark{ background:var(--pg-warn-bg); color:var(--pg-warn-fg); }
        .pg-check strong{ display:block; font-size:14px; font-weight:600; font-family:${DM}; }
        .pg-check span{ display:block; color:var(--pg-muted); font-size:13px; margin-top:2px; }
        .pg-tablewrap{ overflow-x:auto; margin-top:18px; border:1px solid var(--pg-line); border-radius:10px; }
        .pg-table{ border-collapse:collapse; width:100%; min-width:600px; font-size:13.5px; }
        .pg-table th{ text-align:left; font-size:11px; text-transform:uppercase; letter-spacing:0.06em; color:var(--pg-muted); padding:11px 15px; border-bottom:1px solid var(--pg-line); }
        .pg-table td{ padding:11px 15px; border-bottom:1px solid var(--pg-line); vertical-align:top; }
        .pg-table tr:last-child td{ border-bottom:none; }
        .pg-table .u{ font-family:${MONO}; font-size:12.5px; }
        .pg-copybtn{ border:1px solid var(--pg-line); background:var(--pg-bg); color:var(--pg-muted); font-size:11px; border-radius:6px; padding:2px 7px; cursor:pointer; margin-left:8px; font-family:${DM}; }
        .pg-copybtn:hover{ color:var(--pg-ink); border-color:var(--pg-accent); }
        .pg-callout{ background:var(--pg-accent-tint); border:1px solid var(--pg-line); border-radius:10px; padding:15px 17px; margin-top:18px; font-size:14px; }
        .pg-callout strong{ color:var(--pg-accent-strong); }
        .pg-footer{ margin-top:60px; padding:22px 0 10px; border-top:1px solid var(--pg-line); color:var(--pg-muted); font-size:13px; }
        @media (max-width:900px){
          .pg-shell{ flex-direction:column; }
          .pg-rail{ display:none; }
          .pg-mobiletoc{ display:flex; gap:8px; overflow-x:auto; position:sticky; top:0; z-index:5; background:var(--pg-bg); padding:10px 0; margin:0 -24px 12px; padding-left:24px; border-bottom:1px solid var(--pg-line); }
          .pg-mobiletoc a{ flex:0 0 auto; font-size:12.5px; font-weight:600; color:var(--pg-muted); text-decoration:none; padding:6px 12px; border-radius:100px; border:1px solid var(--pg-line); white-space:nowrap; }
          .pg-mobiletoc a.active{ color:var(--pg-accent-strong); border-color:var(--pg-accent); background:var(--pg-accent-tint); }
        }
        @media print {
          .pg-rail, .pg-mobiletoc, .pg-copybtn { display: none !important; }
          .pg-shell { display: block; }
          .pg-root { max-width: none; }
        }
      `}</style>

      <div className="pg-mobiletoc">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} data-pg-nav>
            {s.label}
          </a>
        ))}
      </div>

      <div className="pg-shell">
        <nav className="pg-rail">
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#${s.id}`} data-pg-nav>
              {s.label}
            </a>
          ))}
        </nav>

        <main className="pg-main">
          <section id="overview" className="pg-section">
            <Eyebrow>01 — The Big Picture</Eyebrow>
            <h2>A customer&apos;s visit, step by step</h2>
            <p className="pg-lede">
              Elyxier isn&apos;t one piece of software — it&apos;s several specialist tools connected together, each doing the
              one thing it&apos;s best at. Here&apos;s the path an order actually takes.
            </p>

            <div className="pg-journey">
              <div className="pg-step">
                <span className="n">01</span>
                <span className="t">Customer visits elyxier.com</span>
                <span className="d">The storefront itself — built with Next.js, hosted on Vercel.</span>
              </div>
              <div className="pg-step">
                <span className="n">02</span>
                <span className="t">Page loads content &amp; products</span>
                <span className="d">Photos and copy come from Sanity. Prices, stock, and discounts come from Neon, a database.</span>
              </div>
              <div className="pg-step">
                <span className="n">03</span>
                <span className="t">Customer signs in (optional)</span>
                <span className="d">Clerk handles accounts — passwords, verification codes, staying logged in.</span>
              </div>
              <div className="pg-step">
                <span className="n">04</span>
                <span className="t">Customer checks out</span>
                <span className="d">Payment runs through PayPal. Neon records the order and inventory drops.</span>
              </div>
              <div className="pg-step">
                <span className="n">05</span>
                <span className="t">Confirmation goes out</span>
                <span className="d">Resend emails the receipt to the customer and a heads-up to you.</span>
              </div>
              <div className="pg-step">
                <span className="n">06</span>
                <span className="t">You take it from here</span>
                <span className="d">The order shows up in this Admin Console, and you ship it via Pirate Ship as usual.</span>
              </div>
            </div>

            <div className="pg-callout">
              <strong>The one place you&apos;ll actually live day-to-day</strong> is this Admin Console. Sanity, Neon,
              Clerk, and the rest work quietly in the background — you shouldn&apos;t need to touch them directly for
              normal operations. Sections 3–4 explain what each one does anyway, so nothing is a mystery.
            </div>
          </section>

          <div className="pg-divider" />

          <section id="access" className="pg-section">
            <Eyebrow>02 — Getting In</Eyebrow>
            <h2>Getting access</h2>
            <p className="pg-lede">There are two separate logins that matter to you — they unlock different things, and neither requires the other.</p>

            <div className="pg-cards">
              <Card icon="A" title="Admin Console — for running the store">
                One shared password gets in here. This is where you&apos;ll spend nearly all your time: products, photos,
                prices, site copy, and shipping settings.
              </Card>
              <Card icon="V" title="Vercel — for hosting &amp; technical oversight">
                <span className="u" style={{ fontFamily: MONO }}>elyxier702@gmail.com</span> is being added as a member of
                the Vercel team that hosts the site. Vercel is the platform the site runs on — think of it as the
                building the store is inside, not the store itself.
              </Card>
            </div>

            <div className="pg-callout">
              <strong>What Vercel access gives you:</strong> visibility into whether the site is online, a history of
              every update that&apos;s been published, and where the domain and secret keys are configured.{" "}
              <strong>What it&apos;s not for:</strong> day-to-day changes to products or content — that&apos;s what the
              Admin Console is for. Vercel settings are easy to break by accident, so treat that side as
              &quot;look, don&apos;t touch&quot; unless you&apos;re working through a change with your developer.
            </div>
          </section>

          <div className="pg-divider" />

          <section id="admin" className="pg-section">
            <Eyebrow>03 — Day to Day</Eyebrow>
            <h2>The Admin Console</h2>
            <p className="pg-lede">Everything below lives in the Products and Site Content tabs above. No coding, no waiting on a developer for routine updates.</p>

            <div className="pg-cards">
              <Card icon="$" title="Products, pricing &amp; stock">Add a new scent, update a price, adjust inventory, or flip the &quot;For sale&quot; switch to pull something off the shelf without deleting it.</Card>
              <Card icon="%" title="Discounts">Percentage or dollar-off, with an optional start and end date. Leave the end date blank and it runs until you turn it off.</Card>
              <Card icon="B" title="Bundles">Package two or more products as a single set with its own price. Stock is calculated automatically from whatever&apos;s inside it.</Card>
              <Card icon="✎" title="Site copy">The homepage headline, story section, testimonials, footer, and section titles — all editable text, no developer required.</Card>
              <Card icon="→" title="Shipping settings">Your flat shipping rate and the order amount that qualifies for free shipping, both set in one place.</Card>
              <Card icon="●" title="&quot;We're Live&quot; badges">A manual switch that puts a pulsing &quot;Live Now&quot; badge on the site linking to your Instagram or TikTok while you&apos;re streaming.</Card>
            </div>
          </section>

          <div className="pg-divider" />

          <section id="behind" className="pg-section">
            <Eyebrow>04 — Under the Hood</Eyebrow>
            <h2>Behind the scenes</h2>
            <p className="pg-lede">You won&apos;t need to log into these for everyday tasks, but knowing what they do means nothing on this list is a mystery when your developer mentions it.</p>

            <Panel badge="SI" title="Sanity" pill={{ label: "Active", tone: "good" }}
              who={<><b>Who has an account:</b> your developer, on a free plan under a personal Gmail login. Worth moving to an account tied to the business before this is handed off long-term.</>}
            >
              The content engine behind product photos and page copy. The Admin Console is a simplified front door to
              it — Sanity&apos;s own dashboard (&quot;Studio&quot;) is the raw, more technical version underneath, reachable at{" "}
              <span style={{ fontFamily: MONO }}>elyxier.com/studio</span>. Stick to the Admin Console; there&apos;s rarely a
              reason to use Studio directly.
            </Panel>

            <Panel badge="NE" title="Neon" pill={{ label: "Active", tone: "good" }}>
              The database — think of it as the filing cabinet holding every order, every customer, every inventory
              count. It&apos;s what the Admin Console reads from and writes to. You&apos;ll never open it directly; it just
              needs to keep running, and it does.
            </Panel>

            <Panel badge="CL" title="Clerk" pill={{ label: "Active", tone: "good" }}>
              Handles customer accounts — sign-up, sign-in, and password recovery. When a customer creates an account,
              Clerk is the bouncer checking ID at the door. Once signed in, customers can save a default shipping
              address and see their order history on their own account page.
            </Panel>
          </section>

          <div className="pg-divider" />

          <section id="payments" className="pg-section">
            <Eyebrow>05 — Money &amp; Messages</Eyebrow>
            <h2>Payments &amp; email</h2>
            <p className="pg-lede">This is the section to read most carefully before telling customers the store is open.</p>

            <Panel badge="PP" title="PayPal" pill={{ label: "Being Connected", tone: "warn" }}>
              Checkout runs through PayPal. The button and order flow are built and ready — it&apos;s waiting on business
              account credentials from you (a Client ID and Secret from a PayPal Developer account) before it can
              process a genuine sale. That&apos;s the one step standing between &quot;built&quot; and &quot;live.&quot;
            </Panel>

            <Panel badge="RS" title="Resend" pill={{ label: "Active", tone: "good" }}>
              Sends every transactional email — order confirmations to customers, contact form replies, and a
              heads-up to <span style={{ fontFamily: MONO }}>elyxier702@gmail.com</span> whenever an order comes in. One
              note: brand-new sending domains sometimes land in spam for the first few emails while Gmail and others
              build trust in it. Marking one &quot;Not Spam&quot; speeds that up.
            </Panel>
          </section>

          <div className="pg-divider" />

          <section id="domain" className="pg-section">
            <Eyebrow>06 — Where It Lives</Eyebrow>
            <h2>Domain &amp; hosting</h2>
            <p className="pg-lede">Two different companies, two different jobs — worth knowing apart so the right request goes to the right place.</p>

            <div className="pg-cards">
              <Card icon="G" title="GoDaddy — owns the address">
                <span style={{ fontFamily: MONO }}>elyxier.com</span> is registered and its DNS is managed at GoDaddy.
                This is where the domain&apos;s ownership and renewal lives.
              </Card>
              <Card icon="V" title="Vercel — runs the site">
                GoDaddy simply points the domain at Vercel, which is where the actual website is built, hosted, and
                updated every time a change is published.
              </Card>
            </div>
          </section>

          <div className="pg-divider" />

          <section id="next" className="pg-section">
            <Eyebrow>07 — What&apos;s Left</Eyebrow>
            <h2>Status &amp; next steps</h2>
            <p className="pg-lede">The short list standing between &quot;fully built&quot; and &quot;fully live.&quot;</p>

            <div className="pg-checklist">
              <div className="pg-check done">
                <div className="mark">✓</div>
                <div><strong>Storefront, admin console &amp; customer accounts</strong><span>Built, deployed, and tested.</span></div>
              </div>
              <div className="pg-check done">
                <div className="mark">✓</div>
                <div><strong>Order emails &amp; contact form</strong><span>Sending live, verified with a real delivery.</span></div>
              </div>
              <div className="pg-check todo">
                <div className="mark">!</div>
                <div><strong>Add PayPal business credentials</strong><span>Required before any real payment can be accepted.</span></div>
              </div>
              <div className="pg-check todo">
                <div className="mark">!</div>
                <div><strong>Confirm elyxier702@gmail.com has Vercel access</strong><span>So there&apos;s a backup login to the hosting account.</span></div>
              </div>
            </div>
          </section>

          <div className="pg-divider" />

          <section id="reference" className="pg-section">
            <Eyebrow>08 — Bookmark These</Eyebrow>
            <h2>Quick reference</h2>
            <p className="pg-lede">Every address you&apos;ll need, in one place.</p>

            <div className="pg-tablewrap">
              <table className="pg-table">
                <thead>
                  <tr><th>Where</th><th>Address</th><th>What it&apos;s for</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Storefront</td>
                    <td><span className="u">elyxier.com</span><CopyButton text="https://elyxier.com" /></td>
                    <td>The live site customers see.</td>
                  </tr>
                  <tr>
                    <td>Admin Console</td>
                    <td><span className="u">elyxier.com/admin/login</span><CopyButton text="https://elyxier.com/admin/login" /></td>
                    <td>Products, pricing, content, shipping — your main login.</td>
                  </tr>
                  <tr>
                    <td>Customer sign-in</td>
                    <td><span className="u">elyxier.com/sign-in</span><CopyButton text="https://elyxier.com/sign-in" /></td>
                    <td>Where customers log into their own accounts.</td>
                  </tr>
                  <tr>
                    <td>Sanity Studio</td>
                    <td><span className="u">elyxier.com/studio</span><CopyButton text="https://elyxier.com/studio" /></td>
                    <td>Raw content editor behind the Admin Console. Rarely needed.</td>
                  </tr>
                  <tr>
                    <td>Vercel dashboard</td>
                    <td><span className="u">vercel.com/dashboard</span><CopyButton text="https://vercel.com/dashboard" /></td>
                    <td>Hosting status, deployment history, technical settings.</td>
                  </tr>
                  <tr>
                    <td>Domain (GoDaddy)</td>
                    <td><span className="u">godaddy.com</span><CopyButton text="https://godaddy.com" /></td>
                    <td>Domain registration and renewal for elyxier.com.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <div className="pg-footer">
            Prepared as a working reference for the Elyxier team — ping your developer if anything here stops matching what you see on screen.
          </div>
        </main>
      </div>
    </div>
  );
}
