import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

const EVALUATION_DATA = {
  tenderRef: "TBX-2025-0039",
  tenderTitle: "Installation of Water Reticulation Network — Phase 3",
  entity: "OR Tambo District Municipality",
  daysSinceStart: 5,
  stats: { totalBids: 7, disqualified: 2, belowThreshold: 0, proceeding: 5 },
};

const BIDDERS = [
  { id: "1", rank: 1, company: "Sizwe Construction (Pty) Ltd", compliance: 100, functionality: 92, price: 78, bbbee: 95, total: 87.4, redFlags: 0, status: "recommended" as const },
  { id: "2", rank: 2, company: "Mokoena Infrastructure", compliance: 95, functionality: 85, price: 75, bbbee: 90, total: 82.1, redFlags: 0, status: "proceeding" as const },
  { id: "3", rank: 3, company: "Dlamini Civils", compliance: 90, functionality: 82, price: 72, bbbee: 88, total: 79.8, redFlags: 0, status: "proceeding" as const },
  { id: "4", rank: 4, company: "Ndaba Projects", compliance: 88, functionality: 78, price: 70, bbbee: 85, total: 76.2, redFlags: 0, status: "proceeding" as const },
  { id: "5", rank: 5, company: "Khoza Engineering", compliance: 85, functionality: 75, price: 68, bbbee: 80, total: 71.5, redFlags: 0, status: "proceeding" as const },
  { id: "6", rank: 6, company: "Ntuli Civil Works", compliance: 72, functionality: 65, price: 82, bbbee: 75, total: null, redFlags: 1, status: "disqualified" as const, flag: "Abnormally low tender — 19% below PCE" },
  { id: "7", rank: 7, company: "Ubuntu Infrastructure", compliance: 68, functionality: 58, price: 65, bbbee: 70, total: null, redFlags: 1, status: "disqualified" as const, flag: "CIDB grade insufficient (Grade 4CE vs required 6CE)" },
];

const INTEGRITY_CHECKS = [
  { check: "Administrative compliance check", status: "pass" as const },
  { check: "Tax compliance (SARS TCS)", status: "pass" as const },
  { check: "CIDB grade verification", status: "alert" as const },
  { check: "CSD registration status", status: "pass" as const },
  { check: "Briefing attendance confirmed", status: "pass" as const },
  { check: "Bid rigging pattern analysis", status: "pass" as const },
  { check: "Shell company detection", status: "pass" as const },
  { check: "Evaluator conflict of interest check", status: "pass" as const },
  { check: "PCE bracket compliance", status: "alert" as const },
  { check: "Abnormally low tender check", status: "alert" as const },
  { check: "Beneficial ownership cross-check", status: "pass" as const },
  { check: "Repeat winner pattern check", status: "pass" as const },
];

const BAC_MEMBERS = [
  { role: "BEC Chairperson", name: "Adv. P. Nkosi", status: "signed" as const, date: "18 May 2026, 14:30" },
  { role: "BAC Member — Senior Manager", name: "Mr. S. Mthembu", status: "signed" as const, date: "19 May 2026, 09:15" },
  { role: "BAC Member — CFO", name: "Ms. R. Pillay", status: "pending" as const, date: null },
  { role: "BAC Member — SCM Manager", name: "Mr. T. Dlamini", status: "pending" as const, date: null },
  { role: "BAC Member — Technical Expert", name: "Eng. M. Singh", status: "pending" as const, date: null },
  { role: "Municipal Manager", name: "Mr. K. Ndlovu", status: "pending" as const, date: null },
];

export default function EvaluationScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const bottomPad = isWeb ? 34 : insets.bottom + 16;

  const [expandedBidder, setExpandedBidder] = useState<string | null>(null);
  const signedCount = BAC_MEMBERS.filter((m) => m.status === "signed").length;
  const bacProgress = signedCount / BAC_MEMBERS.length;

  const scoreColor = (v: number | null) => {
    if (v === null) return colors.mutedForeground;
    if (v >= 80) return colors.success;
    if (v >= 70) return colors.foreground;
    return colors.danger;
  };

  const statusConf = (s: string) => {
    if (s === "recommended") return { color: colors.warning, icon: "award" as const, label: "Recommended" };
    if (s === "proceeding") return { color: colors.success, icon: "check-circle" as const, label: "Proceeding" };
    return { color: colors.danger, icon: "x-circle" as const, label: "Disqualified" };
  };

  const passCount = INTEGRITY_CHECKS.filter((c) => c.status === "pass").length;
  const alertCount = INTEGRITY_CHECKS.filter((c) => c.status === "alert").length;

  return (
    <>
      <Stack.Screen options={{ title: "Gate 2 Evaluation", headerShown: true }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
        {/* Status banner */}
        <View style={[styles.banner, { backgroundColor: colors.warning + "18", borderColor: colors.warning + "40" }]}>
          <View style={styles.bannerRow}>
            <Feather name="clock" size={18} color={colors.warning} />
            <Text style={[styles.bannerTitle, { color: colors.warning }]}>Evaluation Complete — Awaiting BAC Sign-off</Text>
          </View>
          <Text style={[styles.bannerRef, { color: colors.mutedForeground }]}>{EVALUATION_DATA.tenderRef} · {EVALUATION_DATA.tenderTitle}</Text>
          <Text style={[styles.bannerDay, { color: colors.mutedForeground }]}>Day {EVALUATION_DATA.daysSinceStart} since evaluation started</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: "Total Bids", val: EVALUATION_DATA.stats.totalBids, color: colors.primary },
            { label: "Disqualified", val: EVALUATION_DATA.stats.disqualified, color: colors.danger },
            { label: "Below Threshold", val: EVALUATION_DATA.stats.belowThreshold, color: colors.warning },
            { label: "Proceeding", val: EVALUATION_DATA.stats.proceeding, color: colors.success },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[styles.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Ranked bidders */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Ranked Bidders</Text>
        {BIDDERS.map((b) => {
          const sc = statusConf(b.status);
          const expanded = expandedBidder === b.id;
          const isDQ = b.status === "disqualified";
          return (
            <Pressable
              key={b.id}
              style={[
                styles.bidderCard,
                { backgroundColor: isDQ ? colors.danger + "08" : b.rank === 1 ? colors.warning + "10" : colors.card, borderColor: isDQ ? colors.danger + "30" : b.rank === 1 ? colors.warning + "40" : colors.border },
              ]}
              onPress={() => setExpandedBidder(expanded ? null : b.id)}
            >
              <View style={styles.bidderTop}>
                <View style={[styles.rankBubble, { backgroundColor: isDQ ? colors.danger + "20" : b.rank === 1 ? colors.warning : colors.muted }]}>
                  {isDQ ? (
                    <Feather name="x" size={12} color={colors.danger} />
                  ) : (
                    <Text style={[styles.rankNum, { color: b.rank === 1 ? colors.warningForeground : colors.foreground }]}>#{b.rank}</Text>
                  )}
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={[styles.bidderName, { color: isDQ ? colors.mutedForeground : colors.foreground }]}>{b.company}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: sc.color + "18", borderColor: sc.color + "30" }]}>
                  <Feather name={sc.icon} size={10} color={sc.color} />
                  <Text style={[styles.statusText, { color: sc.color }]}>{sc.label}</Text>
                </View>
              </View>

              <View style={[styles.scoreRow, { borderTopColor: colors.border }]}>
                {[
                  { label: "Compliance", val: b.compliance },
                  { label: "Functionality", val: b.functionality },
                  { label: "Price", val: b.price },
                  { label: "B-BBEE", val: b.bbbee },
                  { label: "Total", val: b.total },
                ].map((s) => (
                  <View key={s.label} style={styles.scoreItem}>
                    <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
                    <Text style={[styles.scoreVal, { color: scoreColor(s.val) }]}>
                      {s.val !== null ? `${s.val}%` : "—"}
                    </Text>
                  </View>
                ))}
              </View>

              {expanded && b.redFlags > 0 && "flag" in b && (
                <View style={[styles.flagBox, { backgroundColor: colors.danger + "12", borderColor: colors.danger + "30" }]}>
                  <Feather name="alert-triangle" size={13} color={colors.danger} />
                  <Text style={[styles.flagText, { color: colors.danger }]}>{(b as any).flag}</Text>
                </View>
              )}

              <View style={styles.expandHint}>
                <Feather name={expanded ? "chevron-up" : "chevron-down"} size={14} color={colors.mutedForeground} />
              </View>
            </Pressable>
          );
        })}

        {/* Integrity checks */}
        <View style={[styles.integrityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.integrityHeader}>
            <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Automated Integrity Checks</Text>
            <View style={styles.integrityBadges}>
              <View style={[styles.intBadge, { backgroundColor: colors.success + "18" }]}>
                <Text style={[styles.intBadgeText, { color: colors.success }]}>{passCount} pass</Text>
              </View>
              <View style={[styles.intBadge, { backgroundColor: colors.danger + "18" }]}>
                <Text style={[styles.intBadgeText, { color: colors.danger }]}>{alertCount} alerts</Text>
              </View>
            </View>
          </View>
          {INTEGRITY_CHECKS.map((c, i) => (
            <View
              key={i}
              style={[styles.checkRow, i < INTEGRITY_CHECKS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border }]}
            >
              <Feather
                name={c.status === "pass" ? "check-circle" : "alert-triangle"}
                size={14}
                color={c.status === "pass" ? colors.success : colors.danger}
              />
              <Text style={[styles.checkText, { color: c.status === "pass" ? colors.foreground : colors.danger }]}>{c.check}</Text>
            </View>
          ))}
        </View>

        {/* BAC sign-off */}
        <View style={[styles.bacCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>BAC Sign-off Progress</Text>
          <View style={styles.bacProgress}>
            <Text style={[styles.bacProgressText, { color: colors.foreground }]}>{signedCount} of {BAC_MEMBERS.length} signatures</Text>
          </View>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { width: `${bacProgress * 100}%` as any, backgroundColor: colors.success }]} />
          </View>
          <View style={{ marginTop: 16, gap: 8 }}>
            {BAC_MEMBERS.map((m, i) => (
              <View key={i} style={[styles.bacRow, { borderBottomColor: colors.border }, i < BAC_MEMBERS.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bacRole, { color: colors.mutedForeground }]}>{m.role}</Text>
                  <Text style={[styles.bacName, { color: colors.foreground }]}>{m.name}</Text>
                </View>
                {m.status === "signed" ? (
                  <View style={[styles.bacBadge, { backgroundColor: colors.success + "18", borderColor: colors.success + "30" }]}>
                    <Feather name="check" size={10} color={colors.success} />
                    <Text style={[styles.bacBadgeText, { color: colors.success }]}>Signed</Text>
                  </View>
                ) : (
                  <View style={[styles.bacBadge, { backgroundColor: colors.warning + "18", borderColor: colors.warning + "30" }]}>
                    <Feather name="clock" size={10} color={colors.warning} />
                    <Text style={[styles.bacBadgeText, { color: colors.warning }]}>Pending</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Deviation warning */}
        <View style={[styles.deviationBox, { backgroundColor: colors.warning + "10", borderColor: colors.warning + "40" }]}>
          <Feather name="alert-octagon" size={16} color={colors.warning} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={[styles.devTitle, { color: colors.foreground }]}>Mandatory Deviation Reporting</Text>
            <Text style={[styles.devDesc, { color: colors.mutedForeground }]}>
              If the BAC awards other than the top-ranked bidder, a written justification is mandatory and automatically reported to the Auditor-General.
            </Text>
          </View>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  banner: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 16 },
  bannerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  bannerTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  bannerRef: { fontSize: 12, fontFamily: "Inter_400Regular" },
  bannerDay: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 4 },
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 10, padding: 12, borderWidth: 1, alignItems: "center" },
  statVal: { fontSize: 20, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 9, fontFamily: "Inter_400Regular", marginTop: 2, textAlign: "center" },
  sectionTitle: { fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
  bidderCard: { borderRadius: 12, padding: 12, borderWidth: 1, marginBottom: 8 },
  bidderTop: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  rankBubble: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  rankNum: { fontSize: 11, fontFamily: "Inter_700Bold" },
  bidderName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  statusText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  scoreRow: { flexDirection: "row", paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
  scoreItem: { flex: 1, alignItems: "center" },
  scoreLabel: { fontSize: 8, fontFamily: "Inter_400Regular", textTransform: "uppercase" },
  scoreVal: { fontSize: 12, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  flagBox: { flexDirection: "row", alignItems: "flex-start", gap: 6, borderRadius: 8, padding: 10, borderWidth: 1, marginTop: 10 },
  flagText: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 16 },
  expandHint: { alignItems: "center", marginTop: 6 },
  integrityCard: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 14 },
  integrityHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  integrityBadges: { flexDirection: "row", gap: 6 },
  intBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  intBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  checkRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 8 },
  checkText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  bacCard: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 14 },
  bacProgress: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
  bacProgressText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden", marginBottom: 4 },
  progressFill: { height: 6, borderRadius: 3 },
  bacRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  bacRole: { fontSize: 10, fontFamily: "Inter_400Regular" },
  bacName: { fontSize: 13, fontFamily: "Inter_500Medium", marginTop: 1 },
  bacBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  bacBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  deviationBox: { flexDirection: "row", alignItems: "flex-start", borderRadius: 12, padding: 14, borderWidth: 1 },
  devTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  devDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
});
