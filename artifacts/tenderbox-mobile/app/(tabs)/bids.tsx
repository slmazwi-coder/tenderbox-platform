import { Feather } from "@expo/vector-icons";
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

const BIDS = [
  {
    id: "1", trackingId: "BID-2026-0142", tenderRef: "JHB-2026-014",
    tenderTitle: "Stormwater Drainage System Upgrade - Alexandra Township",
    entity: "City of Johannesburg",
    submissionDate: "2026-05-20T14:32:00", bidAmount: 47850000,
    status: "under_review" as const,
    scores: { compliance: 92, functionality: 85, price: 78, bbbee: 95, total: 86.8 },
    rank: null,
  },
  {
    id: "2", trackingId: "BID-2026-0138", tenderRef: "ETH-2026-082",
    tenderTitle: "Supply and Delivery of Medical Equipment",
    entity: "eThekwini Municipality",
    submissionDate: "2026-05-18T09:15:00", bidAmount: 124200000,
    status: "awarded" as const,
    scores: { compliance: 100, functionality: 88, price: 82, bbbee: 95, total: 89.5 },
    rank: 1,
  },
  {
    id: "3", trackingId: "BID-2026-0129", tenderRef: "TSH-2026-007",
    tenderTitle: "Construction of Community Hall - Soshanguve",
    entity: "City of Tshwane",
    submissionDate: "2026-05-15T16:45:00", bidAmount: 18200000,
    status: "rejected" as const,
    scores: { compliance: 72, functionality: 68, price: 75, bbbee: 95, total: 74.2 },
    rank: 4,
  },
  {
    id: "4", trackingId: "BID-2026-0115", tenderRef: "CPT-2026-031",
    tenderTitle: "Resurfacing of Major Arterial Roads - Phase 2",
    entity: "City of Cape Town",
    submissionDate: "2026-05-10T11:20:00", bidAmount: 88500000,
    status: "under_review" as const,
    scores: { compliance: 88, functionality: null, price: null, bbbee: 95, total: null },
    rank: null,
  },
  {
    id: "5", trackingId: "BID-2026-0108", tenderRef: "NMB-2026-045",
    tenderTitle: "Installation of Solar PV Systems",
    entity: "Nelson Mandela Bay",
    submissionDate: "2026-05-05T08:30:00", bidAmount: 31800000,
    status: "draft" as const,
    scores: { compliance: null, functionality: null, price: null, bbbee: 95, total: null },
    rank: null,
  },
];

type Filter = "all" | "draft" | "under_review" | "awarded" | "rejected";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "under_review", label: "Under Review" },
  { key: "awarded", label: "Awarded" },
  { key: "rejected", label: "Rejected" },
  { key: "draft", label: "Draft" },
];

export default function BidsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top + 16;
  const bottomPad = isWeb ? 34 + 84 : insets.bottom + 84;

  const [filter, setFilter] = useState<Filter>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = BIDS.filter((b) => filter === "all" || b.status === filter);

  const counts = {
    all: BIDS.length,
    under_review: BIDS.filter((b) => b.status === "under_review").length,
    awarded: BIDS.filter((b) => b.status === "awarded").length,
    rejected: BIDS.filter((b) => b.status === "rejected").length,
    draft: BIDS.filter((b) => b.status === "draft").length,
  };

  const statusConf = (s: string) => {
    const m: Record<string, { color: string; label: string; icon: string }> = {
      draft: { color: colors.mutedForeground, label: "Draft", icon: "edit-3" },
      under_review: { color: colors.warning, label: "Under Review", icon: "clock" },
      awarded: { color: colors.success, label: "Awarded", icon: "check-circle" },
      rejected: { color: colors.danger, label: "Rejected", icon: "x-circle" },
    };
    return m[s] ?? m.draft;
  };

  const scoreColor = (v: number | null) => {
    if (v === null) return colors.mutedForeground;
    if (v >= 80) return colors.success;
    if (v >= 60) return colors.warning;
    return colors.danger;
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.title, { color: colors.foreground }]}>My Bids</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Track and evaluate submitted bids</Text>
          </View>
          <View style={[styles.totalBadge, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "30" }]}>
            <Text style={[styles.totalText, { color: colors.primary }]}>{BIDS.length} total</Text>
          </View>
        </View>

        <View style={styles.miniStats}>
          {[
            { label: "Reviewing", count: counts.under_review, color: colors.warning },
            { label: "Awarded", count: counts.awarded, color: colors.success },
            { label: "Rejected", count: counts.rejected, color: colors.danger },
            { label: "Draft", count: counts.draft, color: colors.mutedForeground },
          ].map((s) => (
            <View key={s.label} style={[styles.miniStat, { backgroundColor: s.color + "14" }]}>
              <Text style={[styles.miniStatCount, { color: s.color }]}>{s.count}</Text>
              <Text style={[styles.miniStatLabel, { color: s.color }]}>{s.label}</Text>
            </View>
          ))}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
              <View style={[styles.chipCount, { backgroundColor: filter === f.key ? colors.primaryForeground + "30" : colors.muted }]}>
                <Text style={[styles.chipCountText, { color: filter === f.key ? colors.primaryForeground : colors.mutedForeground }]}>
                  {counts[f.key]}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(b) => b.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="send" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No bids</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No bids match this filter</Text>
          </View>
        }
        renderItem={({ item: bid }) => {
          const sc = statusConf(bid.status);
          const expanded = expandedId === bid.id;
          return (
            <Pressable
              style={[styles.bidCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              onPress={() => setExpandedId(expanded ? null : bid.id)}
            >
              <View style={styles.bidTop}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.trackId, { color: colors.mutedForeground }]}>{bid.trackingId}</Text>
                  <Text style={[styles.bidRef, { color: colors.foreground }]}>{bid.tenderRef}</Text>
                  <Text style={[styles.bidTitle, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {bid.tenderTitle}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: 6 }}>
                  <View style={[styles.badge, { backgroundColor: sc.color + "18", borderColor: sc.color + "40" }]}>
                    <Feather name={sc.icon as "clock"} size={10} color={sc.color} />
                    <Text style={[styles.badgeText, { color: sc.color }]}>{sc.label}</Text>
                  </View>
                  {bid.rank !== null && (
                    <View style={[styles.rankBadge, { backgroundColor: bid.rank === 1 ? colors.success : colors.muted }]}>
                      <Text style={[styles.rankText, { color: bid.rank === 1 ? colors.successForeground : colors.foreground }]}>
                        #{bid.rank}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              <View style={[styles.bidMeta, { borderTopColor: colors.border }]}>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Amount</Text>
                  <Text style={[styles.metaValue, { color: colors.foreground }]}>{formatZAR(bid.bidAmount)}</Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Score</Text>
                  <Text style={[styles.metaValue, { color: scoreColor(bid.scores.total) }]}>
                    {bid.scores.total !== null ? `${bid.scores.total}%` : "—"}
                  </Text>
                </View>
                <View style={styles.metaItem}>
                  <Text style={[styles.metaLabel, { color: colors.mutedForeground }]}>Submitted</Text>
                  <Text style={[styles.metaValue, { color: colors.foreground }]}>{formatDate(bid.submissionDate)}</Text>
                </View>
              </View>

              {expanded && (
                <View style={[styles.scoresRow, { borderTopColor: colors.border }]}>
                  {[
                    { label: "Compliance", v: bid.scores.compliance },
                    { label: "Functionality", v: bid.scores.functionality },
                    { label: "Price", v: bid.scores.price },
                    { label: "B-BBEE", v: bid.scores.bbbee },
                  ].map((s) => (
                    <View key={s.label} style={[styles.scoreBox, { backgroundColor: colors.muted, borderColor: colors.border }]}>
                      <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
                      <Text style={[styles.scoreVal, { color: scoreColor(s.v) }]}>
                        {s.v !== null ? `${s.v}%` : "—"}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <View style={styles.expandHint}>
                <Feather name={expanded ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
              </View>
            </Pressable>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  headerTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  totalBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, borderWidth: 1 },
  totalText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  miniStats: { flexDirection: "row", gap: 8, marginBottom: 12 },
  miniStat: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  miniStatCount: { fontSize: 18, fontFamily: "Inter_700Bold" },
  miniStatLabel: { fontSize: 10, fontFamily: "Inter_500Medium", marginTop: 2 },
  chip: { flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  chipCount: { borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
  chipCountText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  bidCard: { borderRadius: 12, padding: 14, borderWidth: 1 },
  bidTop: { flexDirection: "row", gap: 10, marginBottom: 12 },
  trackId: { fontSize: 10, fontFamily: "Inter_400Regular", letterSpacing: 0.5 },
  bidRef: { fontSize: 14, fontFamily: "Inter_700Bold", marginTop: 2 },
  bidTitle: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  badgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  rankBadge: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  rankText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  bidMeta: { flexDirection: "row", borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12 },
  metaItem: { flex: 1 },
  metaLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textTransform: "uppercase", letterSpacing: 0.5 },
  metaValue: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 3 },
  scoresRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 12, marginTop: 12 },
  scoreBox: { flex: 1, minWidth: "48%", borderRadius: 8, padding: 10, borderWidth: 1 },
  scoreLabel: { fontSize: 10, fontFamily: "Inter_400Regular", textTransform: "uppercase", letterSpacing: 0.5 },
  scoreVal: { fontSize: 18, fontFamily: "Inter_700Bold", marginTop: 4 },
  expandHint: { alignItems: "center", marginTop: 8 },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular" },
});
