export default function Brand({ stacked = false }) {
  return (
    <div className={`flex items-center gap-2 ${stacked ? "flex-col text-center" : ""}`}>
      <img src={`${import.meta.env.BASE_URL}plv-logo.png`} alt="PLV logo" className={stacked ? "h-16 w-16" : "h-9 w-9"} />
      <span className={`font-bold leading-tight text-brand-700 ${stacked ? "text-xl" : "text-sm"}`}>
        Sync-Workshop: PLV Student Workspace
      </span>
    </div>
  );
}