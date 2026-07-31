import { createFileRoute } from "@tanstack/react-router";
import { LockKeyhole, LogOut, Plus, ShieldCheck } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { products } from "@/data/products";

const SESSION_KEY = "affiliate-admin-session";

export const Route = createFileRoute("/control-room")({
  head: () => ({
    meta: [{ title: "Control room" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: ControlRoom,
});

function ControlRoom() {
  const [signedIn, setSignedIn] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(0);

  useEffect(() => setSignedIn(sessionStorage.getItem(SESSION_KEY) === "active"), []);

  function signIn(event: FormEvent) {
    event.preventDefault();
    // Demo-only gateway: replace with a server-side session check before publishing.
    if (passcode !== "admin-demo") {
      setError("That passcode is not recognised.");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "active");
    setSignedIn(true);
  }

  if (!signedIn) {
    return <Login passcode={passcode} setPasscode={setPasscode} error={error} onSubmit={signIn} />;
  }

  return (
    <main className="min-h-screen bg-secondary/40 p-5 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <header className="flex items-center justify-between border-b border-border pb-6">
          <div>
            <p className="eyebrow">Private workspace</p>
            <h1 className="mt-2 text-3xl font-bold">Affiliate control room</h1>
          </div>
          <button
            onClick={() => {
              sessionStorage.removeItem(SESSION_KEY);
              setSignedIn(false);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </header>

        <section className="mt-8 grid gap-5 md:grid-cols-3">
          <Metric label="Live listings" value={String(products.length + added)} />
          <Metric
            label="Featured picks"
            value={String(products.filter((p) => p.featured).length)}
          />
          <Metric label="Tracked links" value="Add links" />
        </section>

        <section className="mt-8 rounded-2xl border border-border bg-background p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Product listings</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Use your Amazon Associates URL for every product.
              </p>
            </div>
            <button
              onClick={() => setAdded((value) => value + 1)}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
            >
              <Plus className="size-4" /> New product
            </button>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <tr>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Affiliate link</th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 8).map((product) => (
                  <tr key={product.id} className="border-b border-border/70">
                    <td className="py-4 font-medium">{product.name}</td>
                    <td className="py-4 text-muted-foreground">{product.category}</td>
                    <td className="py-4">${product.price}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs">
                        {product.affiliateUrl ? "Connected" : "Needs URL"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
        <p className="mt-5 text-xs leading-relaxed text-muted-foreground">
          Prototype notice: this UI does not persist changes or protect credentials on a server.
          Connect it to server-side authentication and a database before production administration.
        </p>
      </div>
    </main>
  );
}

function Login({
  passcode,
  setPasscode,
  error,
  onSubmit,
}: {
  passcode: string;
  setPasscode: (value: string) => void;
  error: string;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 p-5">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-3xl border border-border bg-background p-8 shadow-sm"
      >
        <div className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <LockKeyhole className="size-5" />
        </div>
        <p className="mt-7 eyebrow">Restricted access</p>
        <h1 className="mt-2 text-3xl font-bold">Control room</h1>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Enter your administrator passcode to manage affiliate listings.
        </p>
        <label className="mt-7 block text-sm font-medium">
          Passcode
          <input
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            type="password"
            autoFocus
            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground">
          <ShieldCheck className="size-4" /> Unlock admin
        </button>
        <p className="mt-5 text-center text-xs text-muted-foreground">Demo passcode: admin-demo</p>
      </form>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
