import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/contractor")({ component: () => <RoleDashboard role="contractor" /> });
