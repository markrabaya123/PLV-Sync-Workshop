import { FileText, Table2, Presentation, Workflow } from "lucide-react";

const map = { Document: FileText, Spreadsheet: Table2, Slides: Presentation, Diagram: Workflow };

export default function FileIcon({ type, className = "h-4 w-4 shrink-0" }) {
  const Icon = map[type] || FileText;
  return <Icon className={className} />;
}