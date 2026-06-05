import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", background: "#0b0f17", color: "#e5e7eb" }}>
        <main style={{ textAlign: "center" }}>
          <h1>404 — Page not found</h1>
          <p>
            <Link href="/en" style={{ color: "#38bdf8" }}>Back to home</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
