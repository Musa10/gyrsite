import Link from "next/link";

export default function RootNotFound() {
  return (
    <html lang="en" dir="ltr">
      <body style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", fontFamily: "system-ui", background: "#ffffff", color: "#0a0a0a" }}>
        <main style={{ textAlign: "center" }}>
          <h1>404 | Page not found</h1>
          <p>
            <Link href="/en" style={{ color: "#0a0a0a", textDecoration: "underline" }}>Back to home</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
