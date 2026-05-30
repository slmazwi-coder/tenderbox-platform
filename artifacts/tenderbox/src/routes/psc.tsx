import { createFileRoute } from "@tanstack/react-router";
import { RoleDashboard } from "@/components/RoleDashboard";

export const Route = createFileRoute("/psc")({ component: () => <RoleDashboard role="psc_community" /> });
