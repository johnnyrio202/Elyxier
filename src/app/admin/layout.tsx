import AdminThemeToggle from "./AdminThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div id="admin-theme-root" data-admin-theme="dark">
      {/* Runs before hydration so a saved "light" preference applies
          immediately instead of flashing the dark default first. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('admin-theme');if(t==='light'){document.getElementById('admin-theme-root').setAttribute('data-admin-theme','light');}}catch(e){}})();`,
        }}
      />
      {children}
      <AdminThemeToggle />
    </div>
  );
}
