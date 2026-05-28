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

type DocStatus = "Verified" | "Pending" | "Expired" | "Missing";

interface Doc {
  id: string;
  name: string;
  category: string;
  status: DocStatus;
  expiryDate: string | null;
  required: boolean;
}

const DOCS: Doc[] = [
  { id: "1", name: "CIPC Company Registration", category: "Company Registration", status: "Verified", expiryDate: "2027-01-15", required: true },
  { id: "2", name: "CIPC Annual Return", category: "Company Registration", status: "Verified", expiryDate: "2026-06-30", required: true },
  { id: "3", name: "SARS Tax Clearance Certificate", category: "Tax & Finance", status: "Verified", expiryDate: "2026-08-15", required: true },
  { id: "4", name: "VAT Registration Certificate", category: "Tax & Finance", status: "Verified", expiryDate: null, required: true },
  { id: "5", name: "B-BBEE Certificate (Level 1)", category: "B-BBEE", status: "Pending", expiryDate: "2026-07-31", required: true },
  { id: "6", name: "CIDB Certificate Grade 6CE", category: "CIDB & Safety", status: "Verified", expiryDate: "2026-09-30", required: true },
  { id: "7", name: "Construction Health & Safety Plan", category: "CIDB & Safety", status: "Expired", expiryDate: "2026-05-01", required: true },
  { id: "8", name: "Bank Confirmation Letter", category: "Banking", status: "Verified", expiryDate: null, required: true },
  { id: "9", name: "Audited Financial Statements", category: "Tax & Finance", status: "Pending", expiryDate: null, required: true },
  { id: "10", name: "Letter of Good Standing (COIDA)", category: "CIDB & Safety", status: "Missing", expiryDate: null, required: true },
];

const CATEGORIES = ["All", ...Array.from(new Set(DOCS.map((d) => d.category)))];

function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

export default function ComplianceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top + 16;
  const bottomPad = isWeb ? 34 + 84 : insets.bottom + 84;

  const [catFilter, setCatFilter] = useState("All");

  const verified = DOCS.filter((d) => d.status === "Verified").length;
  const score = Math.round((verified / DOCS.length) * 100);
  const filtered = catFilter === "All" ? DOCS : DOCS.filter((d) => d.category === catFilter);

  const statusConf = (s: DocStatus) => {
    const m: Record<DocStatus, { color: string; icon: string }> = {
      Verified: { color: colors.success, icon: "check-circle" },
      Pending: { color: colors.warning, icon: "clock" },
      Expired: { color: colors.danger, icon: "alert-triangle" },
      Missing: { color: colors.danger, icon: "x-circle" },
    };
    return m[s];
  };

  const scoreColor = score >= 90 ? colors.success : score >= 70 ? colors.warning : colors.danger;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.header, { paddingTop: topPad, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Compliance</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Document verification status</Text>

        <View style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.scoreLeft}>
            <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Compliance Score</Text>
            <Text style={[styles.scoreValue, { color: scoreColor }]}>{score}%</Text>
            <Text style={[styles.scoreSubtext, { color: colors.mutedForeground }]}>
              {verified} of {DOCS.length} documents verified
            </Text>
          </View>
          <View style={[styles.scoreCircle, { borderColor: scoreColor }]}>
            <Feather name="shield" size={28} color={scoreColor} />
          </View>
        </View>

        <View style={styles.statusRow}>
          {(["Verified", "Pending", "Expired", "Missing"] as DocStatus[]).map((s) => {
            const conf = statusConf(s);
            const cnt = DOCS.filter((d) => d.status === s).length;
            return (
              <View key={s} style={[styles.statusMini, { backgroundColor: conf.color + "14" }]}>
                <Text style={[styles.statusMiniCount, { color: conf.color }]}>{cnt}</Text>
                <Text style={[styles.statusMiniLabel, { color: conf.color }]}>{s}</Text>
              </View>
            );
          })}
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              style={[
                styles.chip,
                catFilter === cat
                  ? { backgroundColor: colors.primary, borderColor: colors.primary }
                  : { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setCatFilter(cat)}
            >
              <Text style={[styles.chipText, { color: catFilter === cat ? colors.primaryForeground : colors.mutedForeground }]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: bottomPad }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: doc }) => {
          const conf = statusConf(doc.status);
          return (
            <View style={[styles.docCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.docRow}>
                <View style={[styles.docIcon, { backgroundColor: conf.color + "18" }]}>
                  <Feather name={conf.icon as "check-circle"} size={18} color={conf.color} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[styles.docName, { color: colors.foreground }]}>{doc.name}</Text>
                  <Text style={[styles.docCat, { color: colors.mutedForeground }]}>{doc.category}</Text>
                  {doc.expiryDate && (
                    <Text style={[styles.docExpiry, { color: colors.mutedForeground }]}>
                      Expires: {formatDate(doc.expiryDate)}
                    </Text>
                  )}
                </View>
                <View style={[styles.statusBadge, { backgroundColor: conf.color + "18", borderColor: conf.color + "40" }]}>
                  <Text style={[styles.statusBadgeText, { color: conf.color }]}>{doc.status}</Text>
                </View>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2, marginBottom: 12 },
  scoreCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 12 },
  scoreLeft: { flex: 1 },
  scoreLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.6 },
  scoreValue: { fontSize: 36, fontFamily: "Inter_700Bold", marginTop: 4 },
  scoreSubtext: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 4 },
  scoreCircle: { width: 56, height: 56, borderRadius: 28, borderWidth: 3, alignItems: "center", justifyContent: "center" },
  statusRow: { flexDirection: "row", gap: 8, marginBottom: 12 },
  statusMini: { flex: 1, borderRadius: 8, paddingVertical: 8, alignItems: "center" },
  statusMiniCount: { fontSize: 18, fontFamily: "Inter_700Bold" },
  statusMiniLabel: { fontSize: 9, fontFamily: "Inter_500Medium", marginTop: 2 },
  chip: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6, marginRight: 8, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  docCard: { borderRadius: 12, padding: 14, borderWidth: 1 },
  docRow: { flexDirection: "row", alignItems: "center" },
  docIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  docName: { fontSize: 14, fontFamily: "Inter_600SemiBold", lineHeight: 18 },
  docCat: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  docExpiry: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  statusBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  statusBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
});
