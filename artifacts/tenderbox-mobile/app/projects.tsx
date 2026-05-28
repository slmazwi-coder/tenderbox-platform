import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  FlatList,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);
}
function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

type ProjectStatus = "Active" | "Completed" | "On Hold" | "Under Termination";

interface Project {
  id: string;
  name: string;
  client: string;
  location: string;
  sector: string;
  role: string;
  startDate: string;
  endDate: string | null;
  status: ProjectStatus;
  contractValue: number;
  certifiedValue: number;
  completion: number;
  verificationStatus: "Verified" | "Pending" | "Not Submitted";
}

const PROJECTS: Project[] = [
  { id: "1", name: "N3 Pavement Rehabilitation — Heidelberg", client: "SANRAL", location: "Heidelberg, Gauteng", sector: "Roads", role: "Main Contractor", startDate: "2023-02-01", endDate: "2024-08-30", status: "Completed", contractValue: 84500000, certifiedValue: 84500000, completion: 100, verificationStatus: "Verified" },
  { id: "2", name: "Sebokeng Stormwater Upgrade", client: "Emfuleni Local Municipality", location: "Sebokeng, Gauteng", sector: "Stormwater", role: "Main Contractor", startDate: "2022-06-15", endDate: "2023-05-10", status: "Completed", contractValue: 22100000, certifiedValue: 22100000, completion: 100, verificationStatus: "Verified" },
  { id: "3", name: "Soshanguve Internal Roads", client: "City of Tshwane", location: "Soshanguve, Pretoria", sector: "Roads", role: "Subcontractor", startDate: "2021-10-01", endDate: "2022-07-22", status: "Completed", contractValue: 11750000, certifiedValue: 11750000, completion: 100, verificationStatus: "Pending" },
  { id: "4", name: "Alexandra Township Water Infrastructure", client: "City of Johannesburg", location: "Alexandra, Johannesburg", sector: "Water & Sanitation", role: "Main Contractor", startDate: "2024-09-01", endDate: null, status: "Active", contractValue: 125000000, certifiedValue: 47800000, completion: 38, verificationStatus: "Verified" },
  { id: "5", name: "Durban Harbour Road Access", client: "Transnet", location: "Durban, KwaZulu-Natal", sector: "Roads", role: "JV Partner", startDate: "2025-01-15", endDate: null, status: "Active", contractValue: 67500000, certifiedValue: 18900000, completion: 28, verificationStatus: "Not Submitted" },
  { id: "6", name: "Mamelodi Community Hall", client: "City of Tshwane", location: "Mamelodi, Pretoria", sector: "Building", role: "Main Contractor", startDate: "2024-03-01", endDate: null, status: "On Hold", contractValue: 18500000, certifiedValue: 8200000, completion: 44, verificationStatus: "Verified" },
  { id: "7", name: "Midrand Stormwater Catchment", client: "City of Johannesburg", location: "Midrand, Gauteng", sector: "Stormwater", role: "Main Contractor", startDate: "2025-06-01", endDate: null, status: "Active", contractValue: 56000000, certifiedValue: 0, completion: 0, verificationStatus: "Not Submitted" },
];

type Filter = "all" | ProjectStatus;
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "Active", label: "Active" },
  { key: "Completed", label: "Completed" },
  { key: "On Hold", label: "On Hold" },
];

export default function ProjectsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const bottomPad = isWeb ? 34 : insets.bottom + 16;

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = PROJECTS.filter((p) => {
    const q = search.toLowerCase();
    const matchQ = !q || p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q);
    const matchF = filter === "all" || p.status === filter;
    return matchQ && matchF;
  });

  const stats = {
    active: PROJECTS.filter((p) => p.status === "Active").length,
    completed: PROJECTS.filter((p) => p.status === "Completed").length,
    totalValue: PROJECTS.filter((p) => p.status === "Active").reduce((s, p) => s + p.contractValue, 0),
    certified: PROJECTS.filter((p) => p.status === "Active").reduce((s, p) => s + p.certifiedValue, 0),
  };

  const statusConf = (s: ProjectStatus) => {
    const m: Record<ProjectStatus, { color: string; icon: string }> = {
      Active: { color: colors.primary, icon: "briefcase" },
      Completed: { color: colors.success, icon: "check-circle" },
      "On Hold": { color: colors.warning, icon: "pause-circle" },
      "Under Termination": { color: colors.danger, icon: "alert-circle" },
    };
    return m[s];
  };

  const verConf = (v: Project["verificationStatus"]) => {
    const m = { Verified: colors.success, Pending: colors.warning, "Not Submitted": colors.mutedForeground };
    return m[v];
  };

  return (
    <>
      <Stack.Screen options={{ title: "Projects", headerShown: true }} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Summary stats */}
        <View style={[styles.statsRow, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {[
            { label: "Active", val: stats.active, color: colors.primary },
            { label: "Done", val: stats.completed, color: colors.success },
            { label: "Contract", val: `R${Math.round(stats.totalValue / 1e6)}M`, color: colors.accent },
            { label: "Certified", val: `R${Math.round(stats.certified / 1e6)}M`, color: colors.warning },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Search + filter */}
        <View style={[styles.filterArea, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="search" size={14} color={colors.mutedForeground} />
            <TextInput
              style={[styles.searchInput, { color: colors.foreground }]}
              placeholder="Search projects..."
              placeholderTextColor={colors.mutedForeground}
              value={search}
              onChangeText={setSearch}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 10 }}>
            {FILTERS.map((f) => (
              <Pressable
                key={f.key}
                style={[
                  styles.chip,
                  filter === f.key
                    ? { backgroundColor: colors.primary, borderColor: colors.primary }
                    : { backgroundColor: colors.card, borderColor: colors.border },
                ]}
                onPress={() => setFilter(f.key)}
              >
                <Text style={[styles.chipText, { color: filter === f.key ? colors.primaryForeground : colors.mutedForeground }]}>
                  {f.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <FlatList
          data={filtered}
          keyExtractor={(p) => p.id}
          contentContainerStyle={{ padding: 16, paddingBottom: bottomPad }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Feather name="briefcase" size={36} color={colors.mutedForeground} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No projects found</Text>
            </View>
          }
          renderItem={({ item: p }) => {
            const sc = statusConf(p.status);
            const expanded = expandedId === p.id;
            return (
              <Pressable
                style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}
                onPress={() => setExpandedId(expanded ? null : p.id)}
              >
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.projName, { color: colors.foreground }]}>{p.name}</Text>
                    <Text style={[styles.projClient, { color: colors.mutedForeground }]}>{p.client} · {p.role}</Text>
                    <View style={styles.metaRow}>
                      <Feather name="map-pin" size={11} color={colors.mutedForeground} />
                      <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{p.location} · {p.sector}</Text>
                    </View>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: sc.color + "18", borderColor: sc.color + "30" }]}>
                    <Feather name={sc.icon as "briefcase"} size={10} color={sc.color} />
                    <Text style={[styles.statusText, { color: sc.color }]}>{p.status}</Text>
                  </View>
                </View>

                {/* Progress */}
                <View style={styles.progressSection}>
                  <View style={styles.progressHead}>
                    <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>Completion</Text>
                    <Text style={[styles.progressPct, { color: colors.foreground }]}>{p.completion}%</Text>
                  </View>
                  <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
                    <View style={[styles.progressFill, { width: `${p.completion}%` as any, backgroundColor: p.completion === 100 ? colors.success : colors.primary }]} />
                  </View>
                </View>

                <View style={[styles.cardFooter, { borderTopColor: colors.border }]}>
                  <View>
                    <Text style={[styles.footerLabel, { color: colors.mutedForeground }]}>Contract Value</Text>
                    <Text style={[styles.footerVal, { color: colors.foreground }]}>{formatZAR(p.contractValue)}</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={[styles.footerLabel, { color: colors.mutedForeground }]}>Verification</Text>
                    <Text style={[styles.footerVal, { color: verConf(p.verificationStatus) }]}>{p.verificationStatus}</Text>
                  </View>
                  <Feather name={expanded ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
                </View>

                {expanded && (
                  <View style={[styles.expandSection, { borderTopColor: colors.border }]}>
                    {[
                      { label: "Start Date", val: formatDate(p.startDate) },
                      { label: "End Date", val: p.endDate ? formatDate(p.endDate) : "In Progress" },
                      { label: "Certified", val: formatZAR(p.certifiedValue) },
                      { label: "Remaining", val: formatZAR(p.contractValue - p.certifiedValue) },
                    ].map((r) => (
                      <View key={r.label} style={[styles.expandRow, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                        <Text style={[styles.expandLabel, { color: colors.mutedForeground }]}>{r.label}</Text>
                        <Text style={[styles.expandVal, { color: colors.foreground }]}>{r.val}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Pressable>
            );
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  statsRow: { flexDirection: "row", paddingVertical: 14, paddingHorizontal: 16, borderBottomWidth: StyleSheet.hairlineWidth },
  statItem: { flex: 1, alignItems: "center" },
  statVal: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 2 },
  filterArea: { padding: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 9, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  chip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  card: { borderRadius: 12, padding: 14, borderWidth: 1 },
  cardTop: { flexDirection: "row", gap: 10, marginBottom: 12 },
  projName: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 18 },
  projClient: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  metaText: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, alignSelf: "flex-start" },
  statusText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  progressSection: { marginBottom: 12 },
  progressHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  progressLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  progressPct: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  progressTrack: { height: 5, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 5, borderRadius: 3 },
  cardFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  footerLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textTransform: "uppercase", letterSpacing: 0.5 },
  footerVal: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  expandSection: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingTop: 12, marginTop: 12, borderTopWidth: StyleSheet.hairlineWidth },
  expandRow: { width: "48%", borderRadius: 8, padding: 10, borderWidth: 1 },
  expandLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textTransform: "uppercase", letterSpacing: 0.4 },
  expandVal: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 3 },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular" },
});
