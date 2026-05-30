import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/consultant")({ component: () => <RoleDashboard role="consultant" /> });
