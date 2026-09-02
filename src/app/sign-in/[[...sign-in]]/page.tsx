import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0A0A08", padding: 24 }}>
      <SignIn
        appearance={{
          variables: { colorPrimary: "#D4920A", colorBackground: "#141410", colorForeground: "#FAF7F0" },
        }}
      />
    </div>
  );
}
