import { ThemeForm } from "@/components/admin/theme-form";

export default function NewThemePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Theme</h1>
        <p className="mt-1 text-sm text-white/60">
          Create a new musical category with its own visual identity
        </p>
      </div>
      <ThemeForm />
    </div>
  );
}
