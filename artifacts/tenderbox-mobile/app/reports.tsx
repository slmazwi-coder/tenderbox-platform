import { Feather } from "@expo/vector-icons";
import { Stack } from "expo-router";
import React from "react";
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useColors } from "@/hooks/useColors";

function formatZAR(n: number) {
  if (n >= 1e9) return `R ${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `R ${(n / 1e6).toFixed(0)}M`;
  if (n >= 1e3) return `R ${(n / 1e3).toFixed(0)}K`;
  return `R ${n}`;
}

const BID_HISTORY = [
  { month: "Nov", submitted: 5, awarded: 1, value: 125000000 },
  { month: "Dec", submitted: 3, awarded: 2, value: 89000000 },
  { month: "Jan", submitted: 4, awarded: 0, value: 156000000 },
  { month: "Feb", submitted: 6, awarded: 1, value: 234000000 },
  { month: "Mar", submitted: 5, awarded: 2, value: 178000000 },
  { month: "Apr", submitted: 7, awarded: 1, value: 312000000 },
];

const SECTOR_PERFORMANCE = [
  { sector: "Roads & Transport", bids: 12, awarded: 4, winRate: 33 },
  { sector: "Civil Engineering", bids: 8, awarded: 2, winRate: 25 },
  { sector: "Stormwater", bids: 5, awarded: 2, winRate: 40 },
  { sector: "Water & Sanitation", bids: 4, awarded: 1, winRate: 25 },
  { sector: "Building", bids: 6, awarded: 1, winRate: 17 },
  { sector: "Renewable Energy", bids: 3, awarded: 1, winRate: 33 },
];

const STATUS_DISTRIBUTION = [
  { status: "Awarded", count: 7, pct: 18, color: "success" as const },
  { status: "Under Review", count: 12, pct: 32, color: "warning" as const },
  { status: "Rejected", count: 8, pct: 21, color: "danger" as const },
  { status: "Draft", count: 11, pct: 29, color: "muted" as const },
];

const INSIGHTS = [
  { title: "Strongest Performance", desc: "Stormwater sector has your highest win rate at 40%.", icon: "trending-up" as const, colorKey: "success" as const },
  { title: "Opportunity Gap", desc: "Building sector shows 17% win rate. Target smaller contracts.", icon: "activity" as const, colorKey: "warning" as const },
  { title: "Compliance Alert", desc: "1 compliance doc expired. May affect 3 active tenders.", icon: "alert-circle" as const, colorKey: "danger" as const },
];

export default function ReportsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const bottomPad = isWeb ? 34 : insets.bottom + 16;

  const totalBids = BID_HISTORY.reduce((s, m) => s + m.submitted, 0);
  const totalAwarded = BID_HISTORY.reduce((s, m) => s + m.awarded, 0);
  const totalValue = BID_HISTORY.reduce((s, m) => s + m.value, 0);
  const winRate = Math.round((totalAwarded / totalBids) * 100);
  const maxBids = Math.max(...BID_HISTORY.map((m) => m.submitted));

  const colorOf = (key: "success" | "warning" | "danger" | "muted") => {
    const m = { success: colors.success, warning: colors.warning, danger: colors.danger, muted: colors.mutedForeground };
    return m[key];
  };

  const winRateColor = (wr: number) => wr >= 30 ? colors.success : wr >= 20 ? colors.warning : colors.danger;

  return (
    <>
      <Stack.Screen options={{ title: "Reports & Analytics", headerShown: true }} />
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary KPIs */}
        <View style={styles.kpiGrid}>
          {[
            { label: "Total Bids", val: `${totalBids}`, sub: "submitted", color: colors.primary, icon: "file-text" as const },
            { label: "Win Rate", val: `${winRate}%`, sub: `${totalAwarded} awarded`, color: colors.success, icon: "trending-up" as const },
            { label: "Contract Value", val: formatZAR(totalValue), sub: "across all bids", color: colors.accent, icon: "bar-chart-2" as const },
            { label: "Avg. Bid", val: formatZAR(Math.round(totalValue / totalBids)), sub: "per submission", color: colors.warning, icon: "pie-chart" as const },
          ].map((k) => (
            <View key={k.label} style={[styles.kpiCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.kpiIcon, { backgroundColor: k.color + "18" }]}>
                <Feather name={k.icon} size={16} color={k.color} />
              </View>
              <Text style={[styles.kpiVal, { color: colors.foreground }]}>{k.val}</Text>
              <Text style={[styles.kpiLabel, { color: colors.mutedForeground }]}>{k.label}</Text>
              <Text style={[styles.kpiSub, { color: colors.mutedForeground }]}>{k.sub}</Text>
            </View>
          ))}
        </View>

        {/* Bar chart — bid history */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Bid Activity History</Text>
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Submitted</Text>
            <View style={[styles.legendDot, { backgroundColor: colors.success, marginLeft: 10 }]} />
            <Text style={[styles.legendText, { color: colors.mutedForeground }]}>Awarded</Text>
          </View>
          <View style={styles.barChart}>
            {BID_HISTORY.map((m) => (
              <View key={m.month} style={styles.barGroup}>
                <View style={styles.barPair}>
                  <View style={[styles.bar, { height: (m.submitted / maxBids) * 90, backgroundColor: colors.primary }]} />
                  <View style={[styles.bar, { height: m.awarded > 0 ? (m.awarded / maxBids) * 90 : 3, backgroundColor: colors.success, opacity: m.awarded > 0 ? 1 : 0.3 }]} />
                </View>
                <Text style={[styles.barMonth, { color: colors.mutedForeground }]}>{m.month}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Status distribution */}
        <View style={[styles.chartCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Bid Status Distribution</Text>
          {STATUS_DISTRIBUTION.map((item) => (
            <View key={item.status} style={styles.distRow}>
              <View style={styles.distHead}>
                <Text style={[styles.distLabel, { color: colors.foreground }]}>{item.status}</Text>
                <Text style={[styles.distCount, { color: colors.foreground }]}>{item.count}</Text>
              </View>
              <View style={[styles.distTrack, { backgroundColor: colors.muted }]}>
                <View style={[styles.distFill, { width: `${item.pct}%` as any, backgroundColor: colorOf(item.color) }]} />
              </View>
            </View>
          ))}
        </View>

        {/* Sector performance */}
        <View style={[styles.tableCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Performance by Sector</Text>
          {SECTOR_PERFORMANCE.map((s, i) => (
            <View
              key={s.sector}
              style={[
                styles.sectorRow,
                i < SECTOR_PERFORMANCE.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={[styles.sectorName, { color: colors.foreground }]}>{s.sector}</Text>
                <Text style={[styles.sectorMeta, { color: colors.mutedForeground }]}>{s.bids} bids · {s.awarded} won</Text>
              </View>
              <View style={styles.sectorRight}>
                <View style={[styles.winRateTrack, { backgroundColor: colors.muted }]}>
                  <View style={[styles.winRateFill, { width: `${s.winRate}%` as any, backgroundColor: winRateColor(s.winRate) }]} />
                </View>
                <Text style={[styles.winRateText, { color: winRateColor(s.winRate) }]}>{s.winRate}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Insights */}
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground, marginBottom: 10 }]}>Insights</Text>
        {INSIGHTS.map((ins) => {
          const c = colorOf(ins.colorKey);
          return (
            <View key={ins.title} style={[styles.insightCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.insightIcon, { backgroundColor: c + "18" }]}>
                <Feather name={ins.icon} size={18} color={c} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={[styles.insightTitle, { color: colors.foreground }]}>{ins.title}</Text>
                <Text style={[styles.insightDesc, { color: colors.mutedForeground }]}>{ins.desc}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  kpiGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  kpiCard: { width: "48%", borderRadius: 12, padding: 14, borderWidth: 1 },
  kpiIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  kpiVal: { fontSize: 18, fontFamily: "Inter_700Bold" },
  kpiLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 },
  kpiSub: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 2 },
  chartCard: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 14 },
  tableCard: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 14 },
  sectionTitle: { fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 },
  legend: { flexDirection: "row", alignItems: "center", marginBottom: 14 },
  legendDot: { width: 10, height: 10, borderRadius: 2 },
  legendText: { fontSize: 11, fontFamily: "Inter_400Regular", marginLeft: 5 },
  barChart: { flexDirection: "row", alignItems: "flex-end", height: 110, gap: 6 },
  barGroup: { flex: 1, alignItems: "center" },
  barPair: { flexDirection: "row", alignItems: "flex-end", gap: 2, height: 90 },
  bar: { width: 10, borderRadius: 3 },
  barMonth: { fontSize: 9, fontFamily: "Inter_400Regular", marginTop: 4 },
  distRow: { marginBottom: 10 },
  distHead: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  distLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  distCount: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  distTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  distFill: { height: 6, borderRadius: 3 },
  sectorRow: { paddingVertical: 12 },
  sectorName: { fontSize: 13, fontFamily: "Inter_500Medium" },
  sectorMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  sectorRight: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 6 },
  winRateTrack: { flex: 1, height: 5, borderRadius: 3, overflow: "hidden" },
  winRateFill: { height: 5, borderRadius: 3 },
  winRateText: { fontSize: 12, fontFamily: "Inter_600SemiBold", width: 36, textAlign: "right" },
  insightCard: { flexDirection: "row", alignItems: "flex-start", borderRadius: 12, padding: 14, borderWidth: 1, marginBottom: 10 },
  insightIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  insightTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  insightDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17, marginTop: 4 },
});
