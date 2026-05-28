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

const CONTRACTOR = {
  company_name: "Sizwe Construction (Pty) Ltd",
  cipc_number: "2015/123456/07",
  csd_number: "MAAA0034521",
  vat_number: "4123456789",
  cidb_grade: "7CE",
  bbbee_level: 1,
  profile_type: "Contractor",
  sectors: "Civil Engineering, Roads, Stormwater, Water & Sanitation",
  tender_readiness_score: 94,
  score_breakdown: { documents: 100, experience: 92, profile_completeness: 90 },
};

const MANDATORY_DOCS = [
  { type: "CIDB Certificate of Registration", status: "Verified" as const, expiry: "2026-12-31", uploaded: "2025-11-12" },
  { type: "CSD Registration", status: "Verified" as const, expiry: "2026-09-30", uploaded: "2025-09-04" },
  { type: "SARS Tax Clearance Certificate", status: "Verified" as const, expiry: "2026-08-15", uploaded: "2025-08-20" },
  { type: "BBBEE Certificate", status: "Verified" as const, expiry: "2026-11-01", uploaded: "2025-11-02" },
  { type: "CIPC Company Registration", status: "Verified" as const, expiry: "2027-01-15", uploaded: "2025-01-15" },
  { type: "Workmen's Compensation Reg.", status: "Verified" as const, expiry: "2027-03-31", uploaded: "2025-03-20" },
  { type: "OHSA Safety File", status: "Verified" as const, expiry: "2026-06-10", uploaded: "2025-06-01" },
  { type: "Bank Confirmation Letter", status: "Verified" as const, expiry: "2027-06-30", uploaded: "2025-04-30" },
];

const EXPERIENCE = [
  { project: "Rehabilitation of Stormwater Drainage System", client: "Amathole DM", role: "Main Contractor", sector: "Stormwater", value: 6890000, start: "2024-06-01", end: "2025-03-30", completion: "Completed", verification: "Verified" },
  { project: "Installation of Water Reticulation Network — KwaMashu", client: "eThekwini Water Services", role: "Main Contractor", sector: "Water & Sanitation", value: 13450000, start: "2023-09-15", end: "2025-01-30", completion: "Completed", verification: "Verified" },
  { project: "Upgrading of Matatiele Access Roads Phase 2", client: "Matatiele Local Municipality", role: "Main Contractor", sector: "Roads", value: 8450000, start: "2024-02-01", end: null, completion: "In Progress", verification: "Verified" },
  { project: "Construction of Community Hall — Mthatha", client: "OR Tambo District Municipality", role: "Main Contractor", sector: "Building", value: 3200000, start: "2025-04-15", end: null, completion: "In Progress", verification: "Pending" },
];

type Tab = "overview" | "compliance" | "experience";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const bottomPad = isWeb ? 34 : insets.bottom + 16;

  const [tab, setTab] = useState<Tab>("overview");

  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: "overview", label: "Overview", icon: "user" },
    { id: "compliance", label: "Compliance", icon: "shield" },
    { id: "experience", label: "Experience", icon: "briefcase" },
  ];

  const score = CONTRACTOR.tender_readiness_score;
  const scoreColor = score >= 80 ? colors.success : score >= 60 ? colors.warning : colors.danger;

  return (
    <>
      <Stack.Screen options={{ title: "Company Profile", headerShown: true }} />
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Tab selector */}
        <View style={[styles.tabBar, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          {TABS.map((t) => (
            <Pressable
              key={t.id}
              style={[styles.tabBtn, tab === t.id && { borderBottomColor: colors.primary }]}
              onPress={() => setTab(t.id)}
            >
              <Feather name={t.icon as "user"} size={14} color={tab === t.id ? colors.primary : colors.mutedForeground} />
              <Text style={[styles.tabBtnText, { color: tab === t.id ? colors.primary : colors.mutedForeground }]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: bottomPad }}
          showsVerticalScrollIndicator={false}
        >
          {tab === "overview" && (
            <View style={styles.section}>
              {/* Company card */}
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.companyAvatar, { backgroundColor: colors.primary + "18" }]}>
                  <Feather name="briefcase" size={28} color={colors.primary} />
                </View>
                <Text style={[styles.companyName, { color: colors.foreground }]}>{CONTRACTOR.company_name}</Text>
                <Text style={[styles.companySub, { color: colors.mutedForeground }]}>{CONTRACTOR.profile_type} · {CONTRACTOR.sectors}</Text>
                <View style={styles.tagRow}>
                  <View style={[styles.tag, { backgroundColor: colors.primary + "18" }]}>
                    <Text style={[styles.tagText, { color: colors.primary }]}>CIDB {CONTRACTOR.cidb_grade}</Text>
                  </View>
                  <View style={[styles.tag, { backgroundColor: colors.success + "18" }]}>
                    <Text style={[styles.tagText, { color: colors.success }]}>B-BBEE Level {CONTRACTOR.bbbee_level}</Text>
                  </View>
                </View>
              </View>

              {/* Fields */}
              <View style={styles.fieldsGrid}>
                {[
                  { label: "CIPC Number", value: CONTRACTOR.cipc_number },
                  { label: "VAT Number", value: CONTRACTOR.vat_number },
                  { label: "CSD Number", value: CONTRACTOR.csd_number },
                  { label: "Tender Readiness", value: `${CONTRACTOR.tender_readiness_score}%` },
                ].map((f) => (
                  <View key={f.label} style={[styles.fieldCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                    <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>{f.label}</Text>
                    <Text style={[styles.fieldValue, { color: colors.foreground }]}>{f.value}</Text>
                  </View>
                ))}
              </View>

              {/* Readiness score */}
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Tender Readiness Score</Text>
                <View style={[styles.scoreBig, { borderColor: scoreColor }]}>
                  <Text style={[styles.scoreBigNum, { color: scoreColor }]}>{score}%</Text>
                  <Text style={[styles.scoreBigLabel, { color: scoreColor }]}>Tender Ready</Text>
                </View>
                {[
                  { label: "Documents", val: CONTRACTOR.score_breakdown.documents },
                  { label: "Experience", val: CONTRACTOR.score_breakdown.experience },
                  { label: "Profile Completeness", val: CONTRACTOR.score_breakdown.profile_completeness },
                ].map((b) => (
                  <View key={b.label} style={styles.barRow}>
                    <View style={styles.barRowHead}>
                      <Text style={[styles.barLabel, { color: colors.foreground }]}>{b.label}</Text>
                      <Text style={[styles.barPct, { color: colors.success }]}>{b.val}%</Text>
                    </View>
                    <View style={[styles.barTrack, { backgroundColor: colors.muted }]}>
                      <View style={[styles.barFill, { width: `${b.val}%` as any, backgroundColor: colors.success }]} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {tab === "compliance" && (
            <View style={styles.section}>
              <View style={[styles.statusBanner, { backgroundColor: colors.success + "18", borderColor: colors.success + "40" }]}>
                <Feather name="shield" size={20} color={colors.success} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.bannerTitle, { color: colors.success }]}>Compliance Status: Verified</Text>
                  <Text style={[styles.bannerSub, { color: colors.mutedForeground }]}>
                    {MANDATORY_DOCS.filter(d => d.status === "Verified").length} of {MANDATORY_DOCS.length} documents verified
                  </Text>
                </View>
              </View>
              {MANDATORY_DOCS.map((doc, i) => (
                <View
                  key={doc.type}
                  style={[
                    styles.docRow,
                    { backgroundColor: colors.card, borderColor: colors.border },
                    i < MANDATORY_DOCS.length - 1 && { marginBottom: 8 },
                  ]}
                >
                  <View style={[styles.docIcon, { backgroundColor: colors.success + "18" }]}>
                    <Feather name="check-circle" size={16} color={colors.success} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={[styles.docName, { color: colors.foreground }]}>{doc.type}</Text>
                    <Text style={[styles.docMeta, { color: colors.mutedForeground }]}>
                      Expires {formatDate(doc.expiry)} · Uploaded {formatDate(doc.uploaded)}
                    </Text>
                  </View>
                  <View style={[styles.verifiedBadge, { backgroundColor: colors.success + "18", borderColor: colors.success + "30" }]}>
                    <Text style={[styles.verifiedText, { color: colors.success }]}>Verified</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {tab === "experience" && (
            <View style={styles.section}>
              <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>Project Experience Record</Text>
              {EXPERIENCE.map((p, i) => (
                <View
                  key={p.project}
                  style={[styles.expCard, { backgroundColor: colors.card, borderColor: colors.border }, i < EXPERIENCE.length - 1 && { marginBottom: 10 }]}
                >
                  <Text style={[styles.expProject, { color: colors.foreground }]}>{p.project}</Text>
                  <Text style={[styles.expClient, { color: colors.mutedForeground }]}>{p.client} · {p.role}</Text>
                  <View style={styles.expMeta}>
                    <View style={[styles.expBadge, { backgroundColor: p.completion === "Completed" ? colors.success + "18" : colors.warning + "18" }]}>
                      <Text style={[styles.expBadgeText, { color: p.completion === "Completed" ? colors.success : colors.warning }]}>
                        {p.completion}
                      </Text>
                    </View>
                    <View style={[styles.expBadge, { backgroundColor: p.verification === "Verified" ? colors.success + "18" : colors.warning + "18" }]}>
                      <Text style={[styles.expBadgeText, { color: p.verification === "Verified" ? colors.success : colors.warning }]}>
                        {p.verification}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.expFooter, { borderTopColor: colors.border }]}>
                    <Text style={[styles.expValue, { color: colors.foreground }]}>{formatZAR(p.value)}</Text>
                    <Text style={[styles.expPeriod, { color: colors.mutedForeground }]}>
                      {formatDate(p.start)} – {p.end ? formatDate(p.end) : "Ongoing"}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  tabBar: { flexDirection: "row", borderBottomWidth: StyleSheet.hairlineWidth },
  tabBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 12, borderBottomWidth: 2, borderBottomColor: "transparent" },
  tabBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  section: { gap: 12 },
  card: { borderRadius: 12, padding: 16, borderWidth: 1 },
  companyAvatar: { width: 56, height: 56, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  companyName: { fontSize: 18, fontFamily: "Inter_700Bold" },
  companySub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4, lineHeight: 17 },
  tagRow: { flexDirection: "row", gap: 8, marginTop: 10, flexWrap: "wrap" },
  tag: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  tagText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  fieldsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  fieldCard: { width: "48%", borderRadius: 10, padding: 12, borderWidth: 1 },
  fieldLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  fieldValue: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 4 },
  sectionLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8 },
  scoreBig: { alignSelf: "center", alignItems: "center", borderWidth: 3, borderRadius: 60, width: 100, height: 100, justifyContent: "center", marginVertical: 12 },
  scoreBigNum: { fontSize: 26, fontFamily: "Inter_700Bold" },
  scoreBigLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  barRow: { marginTop: 12 },
  barRowHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  barLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  barPct: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  barTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  barFill: { height: 6, borderRadius: 3 },
  statusBanner: { flexDirection: "row", alignItems: "center", borderRadius: 12, padding: 14, borderWidth: 1 },
  bannerTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  bannerSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  docRow: { flexDirection: "row", alignItems: "center", borderRadius: 10, padding: 12, borderWidth: 1 },
  docIcon: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  docName: { fontSize: 13, fontFamily: "Inter_500Medium", lineHeight: 17 },
  docMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  verifiedBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  verifiedText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  expCard: { borderRadius: 12, padding: 14, borderWidth: 1 },
  expProject: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 18 },
  expClient: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 3 },
  expMeta: { flexDirection: "row", gap: 6, marginTop: 8 },
  expBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  expBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  expFooter: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 10, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
  expValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  expPeriod: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
