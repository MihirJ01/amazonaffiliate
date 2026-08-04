import { Link, createFileRoute } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import {
  ExternalLink,
  LockKeyhole,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { useProducts } from "@/hooks/use-products";
import { type Product, type ProductInput, saveProduct } from "@/lib/products";
import { supabase } from "@/lib/supabase";
import { importAmazonProduct } from "@/server/amazon-import";

const SESSION_KEY = "affiliate-admin-session";
const emptyProduct: ProductInput = {
  name: "",
  brand: "",
  category: "Electronics",
  subcategory: "",
  price: 0,
  rating: 4.5,
  reviews: 0,
  deal: false,
  featured: true,
  image: "",
  blurb: "",
  affiliateUrl: "",
};

export const Route = createFileRoute("/control-room")({
  head: () => ({
    meta: [{ title: "Control room" }, { name: "robots", content: "noindex, nofollow" }],
  }),
  component: ControlRoom,
});

function ControlRoom() {
  const [signedIn, setSignedIn] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState<ProductInput>(emptyProduct);
  const [message, setMessage] = useState("");
  const [messageKind, setMessageKind] = useState<"error" | "success" | "info">("info");
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const queryClient = useQueryClient();
  const { data: products = [], isLoading, error: productsError, refetch } = useProducts();

  useEffect(() => setSignedIn(sessionStorage.getItem(SESSION_KEY) === "active"), []);
  const setField = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((current) => ({ ...current, [key]: value }));
  const showMessage = (value: string, kind: "error" | "success" | "info" = "info") => {
    setMessage(value);
    setMessageKind(kind);
  };

  async function signIn(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (supabase) {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: passcode,
      });
      if (authError) {
        setError("Your Supabase admin email or password is not recognised.");
        return;
      }
    } else if (passcode !== "admin-demo") {
      setError("That passcode is not recognised.");
      return;
    }
    sessionStorage.setItem(SESSION_KEY, "active");
    setSignedIn(true);
  }

  async function submitProduct(event: FormEvent) {
    event.preventDefault();
    if (!supabase) {
      showMessage(
        "Supabase is not connected. Add the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values in Vercel, then redeploy.",
        "error",
      );
      return;
    }
    setSaving(true);
    showMessage("");
    try {
      const savedProduct = await saveProduct(form);
      await queryClient.invalidateQueries({ queryKey: ["products"] });
      await refetch();
      setForm(emptyProduct);
      showMessage(
        `Saved “${savedProduct.name}” to Supabase. It is now visible in the live catalog below and on the public storefront.`,
        "success",
      );
    } catch (error) {
      showMessage(describeSupabaseError(error), "error");
    } finally {
      setSaving(false);
    }
  }

  async function importFromAmazon() {
    if (!supabase) {
      showMessage(
        "Supabase is not connected. Add the Vercel Supabase environment variables first.",
        "error",
      );
      return;
    }
    if (!form.affiliateUrl.trim()) {
      showMessage("Paste one complete Amazon product link first.", "error");
      return;
    }
    setImporting(true);
    showMessage("");
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;
      if (!accessToken) throw new Error("Please sign in again before importing.");
      const imported = await importAmazonProduct({
        data: { affiliateUrl: form.affiliateUrl, accessToken },
      });
      setForm((current) => ({ ...current, ...imported }));
      showMessage(
        "Product details imported. Review the preview, then click Save product.",
        "success",
      );
    } catch (error) {
      showMessage(
        error instanceof Error ? error.message : "SearchAPI could not import this product.",
        "error",
      );
    } finally {
      setImporting(false);
    }
  }

  if (!signedIn)
    return (
      <Login
        email={adminEmail}
        setEmail={setAdminEmail}
        passcode={passcode}
        setPasscode={setPasscode}
        error={error}
        onSubmit={signIn}
        useSupabase={Boolean(supabase)}
      />
    );
  const preview: Product = { ...form, id: "preview-product" };

  return (
    <main className="min-h-screen bg-secondary/40 p-4 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <p className="eyebrow">Private workspace</p>
            <h1 className="mt-2 text-3xl font-bold">Affiliate control room</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Paste an Amazon Associates link to fill the listing automatically, then review the
              visitor preview before saving.
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium"
            >
              <ExternalLink className="size-4" /> View storefront
            </Link>
            <button
              onClick={() => {
                supabase?.auth.signOut();
                sessionStorage.removeItem(SESSION_KEY);
                setSignedIn(false);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium"
            >
              <LogOut className="size-4" /> Sign out
            </button>
          </div>
        </header>
        <section className="mt-8 grid gap-5 sm:grid-cols-3">
          <Metric label="Listed products" value={String(products.length)} />
          <Metric
            label="Featured on home"
            value={String(products.filter((product) => product.featured).length)}
          />
          <Metric
            label="Connected Amazon links"
            value={String(products.filter((product) => product.affiliateUrl).length)}
          />
        </section>
        <section className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.3fr)_minmax(280px,0.7fr)]">
          <form
            onSubmit={submitProduct}
            className="rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-7"
          >
            <div className="flex items-center gap-3">
              <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Plus className="size-4" />
              </span>
              <div>
                <p className="eyebrow">New listing</p>
                <h2 className="text-xl font-semibold">Add a real product</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2 rounded-2xl border border-dashed border-border bg-secondary/50 p-4">
                <label>
                  <span className="text-sm font-medium">Amazon Associates link</span>
                  <input
                    type="url"
                    required
                    value={form.affiliateUrl}
                    onChange={(event) => setField("affiliateUrl", event.target.value)}
                    placeholder="Paste one Amazon product link"
                    className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  />
                </label>
                <button
                  type="button"
                  onClick={importFromAmazon}
                  disabled={importing}
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground disabled:opacity-60"
                >
                  <WandSparkles className="size-4" />
                  {importing ? "Importing from Amazon…" : "Fill details automatically"}
                </button>
                <p className="mt-2 text-xs text-muted-foreground">
                  Uses SearchAPI. Paste one complete Amazon link only, not the link twice.
                </p>
              </div>
              <Field
                label="Product name"
                value={form.name}
                onChange={(value) => setField("name", value)}
                required
              />
              <Field
                label="Brand"
                value={form.brand}
                onChange={(value) => setField("brand", value)}
              />
              <Field
                label="Price (INR)"
                type="number"
                value={String(form.price)}
                onChange={(value) => setField("price", Number(value))}
                required
              />
              <Field
                label="Rating (0–5)"
                type="number"
                value={String(form.rating)}
                onChange={(value) => setField("rating", Number(value))}
                required
              />
              <Field
                label="Number of reviews"
                type="number"
                value={String(form.reviews)}
                onChange={(value) => setField("reviews", Number(value))}
              />
              <Field
                label="Category"
                value={form.category}
                onChange={(value) => setField("category", value)}
                required
              />
              <Field
                label="Subcategory"
                value={form.subcategory}
                onChange={(value) => setField("subcategory", value)}
              />
              <Field
                label="Image URL"
                type="url"
                value={form.image}
                onChange={(value) => setField("image", value)}
                required
                className="sm:col-span-2"
              />
              <label className="sm:col-span-2">
                <span className="text-sm font-medium">Short description</span>
                <textarea
                  value={form.blurb}
                  onChange={(event) => setField("blurb", event.target.value)}
                  className="mt-2 min-h-24 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(event) => setField("featured", event.target.checked)}
                />{" "}
                Show on homepage
              </label>
              <label className="flex items-center gap-3 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.deal}
                  onChange={(event) => setField("deal", event.target.checked)}
                />{" "}
                Mark as deal
              </label>
            </div>
            <button
              disabled={saving}
              className="mt-6 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save product"}
            </button>
            {message && (
              <p
                role="status"
                className={`mt-3 rounded-xl px-4 py-3 text-sm ${
                  messageKind === "error"
                    ? "bg-destructive/10 text-destructive"
                    : messageKind === "success"
                      ? "bg-emerald-500/10 text-emerald-700"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {message}
              </p>
            )}
          </form>
          <aside className="rounded-2xl border border-border bg-background p-5 shadow-sm">
            <p className="eyebrow">Public preview</p>
            <h2 className="mt-2 text-xl font-semibold">Exactly as visitors see it</h2>
            <div className="mt-6">
              {form.name && form.image ? (
                <ProductCard product={preview} />
              ) : (
                <p className="rounded-xl bg-secondary p-6 text-sm leading-relaxed text-muted-foreground">
                  Fill in the name, image, price, rating and Amazon link. Your visitor-facing card
                  preview will appear here.
                </p>
              )}
            </div>
          </aside>
        </section>
        <section className="mt-8 rounded-2xl border border-border bg-background p-5 shadow-sm sm:p-7">
          <p className="eyebrow">Live catalog preview</p>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-xl font-semibold">Products currently visible to visitors</h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 text-sm font-medium underline"
              >
                <RefreshCw className="size-3.5" /> Refresh catalog
              </button>
              <Link to="/" className="text-sm font-medium underline">
                Open public site
              </Link>
            </div>
          </div>
          {productsError && (
            <p className="mt-5 rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {describeSupabaseError(productsError)}
            </p>
          )}
          {isLoading ? (
            <p className="mt-6 text-sm text-muted-foreground">Loading products…</p>
          ) : (
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
          {!isLoading && !products.length && (
            <p className="mt-6 rounded-xl bg-secondary p-6 text-sm text-muted-foreground">
              No products are listed yet. Add your first genuine product above after completing
              Supabase setup.
            </p>
          )}
        </section>
      </div>
    </main>
  );
}

function describeSupabaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown database error.";
  const detail =
    typeof error === "object" && error && "details" in error ? String(error.details ?? "") : "";
  const combined = `${message} ${detail}`.toLowerCase();
  if (combined.includes("relation") && combined.includes("products")) {
    return "Supabase cannot find the products table. Run supabase/schema.sql once in Supabase SQL Editor.";
  }
  if (combined.includes("row-level security") || combined.includes("permission denied")) {
    return "Supabase blocked this save. Sign out and back in with the administrator account, then verify the policies in supabase/schema.sql were run.";
  }
  if (combined.includes("affiliate_url") || combined.includes("image")) {
    return "Supabase needs a valid https:// Amazon link and a valid https:// image URL. Check both fields and try again.";
  }
  return `Supabase could not save or load the product: ${message}`;
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <label className={className}>
      <span className="text-sm font-medium">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
      />
    </label>
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
function Login({
  email,
  setEmail,
  passcode,
  setPasscode,
  error,
  onSubmit,
  useSupabase,
}: {
  email: string;
  setEmail: (value: string) => void;
  passcode: string;
  setPasscode: (value: string) => void;
  error: string;
  onSubmit: (event: FormEvent) => void;
  useSupabase: boolean;
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
          {useSupabase
            ? "Sign in with your Supabase administrator account to manage the catalog."
            : "Enter the demonstration passcode to preview the admin area."}
        </p>
        {useSupabase && (
          <label className="mt-7 block text-sm font-medium">
            Admin email
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              required
              autoFocus
              className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
            />
          </label>
        )}
        <label className="mt-7 block text-sm font-medium">
          {useSupabase ? "Password" : "Passcode"}
          <input
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
            type="password"
            autoFocus={!useSupabase}
            className="mt-2 w-full rounded-xl border border-input bg-background px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}
        <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 font-medium text-primary-foreground">
          <ShieldCheck className="size-4" /> Unlock admin
        </button>
        {!useSupabase && (
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Demo passcode: admin-demo
          </p>
        )}
      </form>
    </main>
  );
}
