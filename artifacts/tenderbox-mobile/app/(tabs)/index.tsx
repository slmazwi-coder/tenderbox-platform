import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
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

const USER = { name: "Thabo Mokoena", role: "Procurement Officer" };

const STATS = [
  { label: "Active Tenders", value: "24", hint: "8 closing this week", icon: "file-text" as const, colorKey: "primary" },
  { label: "Submitted Bids", value: "12", hint: "3 under review", icon: "send" as const, colorKey: "accent" },
  { label: "Payments Due", value: "R 184k", hint: "2 invoices overdue", icon: "credit-card" as const, colorKey: "warning" },
  { label: "Compliance", value: "92%", hint: "1 doc expiring", icon: "shield" as const, colorKey: "success" },
];

const RECENT = [
  { ref: "JHB-2026-014", entity: "City of Johannesburg", date: "29 May 2026", status: "approved" },
  { ref: "ETH-2026-082", entity: "eThekwini Municipality", date: "2 Jun 2026", status: "pending" },
  { ref: "CPT-2026-031", entity: "City of Cape Town", date: "11 Jun 2026", status: "pending" },
  { ref: "TSH-2026-007", entity: "City of Tshwane", date: "18 Jun 2026", status: "rejected" },
];

export default function DashboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top + 16;
  const bottomPad = isWeb ? 34 + 84 : insets.bottom + 84;

  const statColor = (key: string) => {
    const m: Record<string, string> = { primary: colors.primary, accent: colors.accent, warning: colors.warning, success: colors.success };
    return m[key] ?? colors.primary;
  };
  const statusColor = (s: string) => s === "approved" ? colors.success : s === "rejected" ? colors.danger : colors.warning;
  const statusLabel = (s: string) => s === "approved" ? "Approved" : s === "rejected" ? "Rejected" : "Pending";

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad, paddingHorizontal: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 14 }]}>
        <View style={styles.row}>
          <View style={[styles.avatar, { backgroundColor: colors.primary + "20" }]}>
            <Text style={[styles.avatarLetter, { color: colors.primary }]}>T</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={[styles.name, { color: colors.foreground }]}>Welcome, {USER.name}</Text>
            <Text style={[styles.role, { color: colors.mutedForeground }]}>{USER.role}</Text>
          </View>
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Snapshot of your tendering activity and compliance status.
        </Text>
      </View>

      {/* Stats */}
      <View style={styles.grid}>
        {STATS.map((s) => {
          const c = statColor(s.colorKey);
          return (
            <View key={s.label} style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.iconBox, { backgroundColor: c + "18" }]}>
                <Feather name={s.icon} size={18} color={c} />
              </View>
              <Text style={[styles.statVal, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              <Text style={[styles.statHint, { color: colors.mutedForeground }]}>{s.hint}</Text>
            </View>
          );
        })}
      </View>

      {/* Quick actions */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 14 }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Quick Actions</Text>
        <Pressable
          style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
          onPress={() => router.push("/(tabs)/tenders")}
        >
          <Feather name="file-text" size={15} color={colors.primaryForeground} />
          <Text style={[styles.primaryBtnText, { color: colors.primaryForeground }]}>View Open Tenders</Text>
          <Feather name="arrow-right" size={15} color={colors.primaryForeground} />
        </Pressable>
        <View style={styles.row2}>
          <Pressable
            style={[styles.secondBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
            onPress={() => router.push("/(tabs)/payments")}
          >
            <Feather name="credit-card" size={13} color={colors.foreground} />
            <Text style={[styles.secondBtnText, { color: colors.foreground }]}>Payments</Text>
          </Pressable>
          <Pressable
            style={[styles.secondBtn, { backgroundColor: colors.muted, borderColor: colors.border }]}
            onPress={() => router.push("/(tabs)/compliance")}
          >
            <Feather name="shield" size={13} color={colors.foreground} />
            <Text style={[styles.secondBtnText, { color: colors.foreground }]}>Compliance</Text>
          </Pressable>
        </View>
      </View>

      {/* Recent activity */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 14 }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Recent Tender Activity</Text>
        {RECENT.map((r, i) => (
          <View
            key={r.ref}
            style={[
              styles.actRow,
              i < RECENT.length - 1 && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.border },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.actRef, { color: colors.foreground }]}>{r.ref}</Text>
              <Text style={[styles.actEntity, { color: colors.mutedForeground }]}>{r.entity}</Text>
              <Text style={[styles.actDate, { color: colors.mutedForeground }]}>{r.date}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: statusColor(r.status) + "18", borderColor: statusColor(r.status) + "40" }]}>
              <Text style={[styles.badgeText, { color: statusColor(r.status) }]}>{statusLabel(r.status)}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 12, padding: 16, borderWidth: 1 },
  row: { flexDirection: "row", alignItems: "center" },
  row2: { flexDirection: "row", gap: 8, marginTop: 8 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center" },
  avatarLetter: { fontSize: 18, fontFamily: "Inter_700Bold" },
  name: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  role: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 10, lineHeight: 18 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 14 },
  statCard: { width: "48%", borderRadius: 12, padding: 14, borderWidth: 1 },
  iconBox: { width: 36, height: 36, borderRadius: 8, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  statVal: { fontSize: 22, fontFamily: "Inter_700Bold" },
  statLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },
  statHint: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 3, lineHeight: 15 },
  sectionTitle: { fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 },
  primaryBtn: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 8, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8 },
  primaryBtnText: { flex: 1, fontSize: 14, fontFamily: "Inter_600SemiBold" },
  secondBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 8, paddingVertical: 10, borderWidth: 1 },
  secondBtnText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  actRow: { paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 10 },
  actRef: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  actEntity: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  actDate: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});
