import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/client")({ component: () => <RoleDashboard role="client_entity" /> });
