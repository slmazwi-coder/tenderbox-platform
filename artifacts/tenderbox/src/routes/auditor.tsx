import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/auditor")({ component: () => <RoleDashboard role="auditor" /> });
