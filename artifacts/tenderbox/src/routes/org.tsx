import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/org")({ component: () => <RoleDashboard role="integrated_org" /> });
