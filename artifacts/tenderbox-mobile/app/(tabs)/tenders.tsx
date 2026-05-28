import { Feather } from "@expo/vector-icons";
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

function getFutureDate(daysFromNow: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}
function getPastDate(daysAgo: number) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
}
function formatZAR(n: number) {
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);
}
function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}
function getCountdown(closingDate: string) {
  const diff = new Date(closingDate).getTime() - Date.now();
  if (diff <= 0) return { text: "Closed", urgent: false };
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  if (days > 0) return { text: `${days}d ${hours}h`, urgent: days <= 3 };
  return { text: `${hours}h`, urgent: true };
}

const TENDERS = [
  {
    id: "1", ref: "TBX-2025-0047",
    title: "Upgrading of Matatiele Access Roads Phase 2",
    entity: "Matatiele Local Municipality", province: "Eastern Cape",
    category: "Civil — Roads", budget: 8450000,
    closingDate: getFutureDate(14), cidbGrade: "5CE", status: "open" as const,
    description: "Phase 2 of the Matatiele access roads upgrading project covering 12km of rural road rehabilitation.",
  },
  {
    id: "2", ref: "TBX-2025-0051",
    title: "Construction of Community Hall — Ward 7 Emalahleni",
    entity: "Emalahleni Local Municipality", province: "Eastern Cape",
    category: "Building", budget: 3200000,
    closingDate: getFutureDate(7), cidbGrade: "4GB", status: "closing-soon" as const,
    description: "Construction of a new community hall including ablution facilities, kitchen, and parking area.",
  },
  {
    id: "3", ref: "TBX-2025-0039",
    title: "Installation of Water Reticulation Network — Phase 3",
    entity: "OR Tambo District Municipality", province: "Eastern Cape",
    category: "Civil — Water", budget: 14750000,
    closingDate: getPastDate(5), cidbGrade: "6CE", status: "closed" as const,
    description: "Phase 3 water reticulation network covering 5 villages in the OR Tambo district.",
  },
  {
    id: "4", ref: "TBX-2025-0031",
    title: "Rehabilitation of Stormwater Drainage System",
    entity: "Amathole District Municipality", province: "Eastern Cape",
    category: "Civil", budget: 6890000,
    closingDate: getPastDate(30), cidbGrade: "5CE", status: "awarded" as const,
    description: "Stormwater drainage rehabilitation in select urban areas within Amathole district.",
  },
];

type Status = "all" | "open" | "closing-soon" | "closed" | "awarded";
type Tender = (typeof TENDERS)[0];

const STATUS_FILTERS: { key: Status; label: string }[] = [
  { key: "all", label: "All" },
  { key: "open", label: "Open" },
  { key: "closing-soon", label: "Closing Soon" },
  { key: "closed", label: "Closed" },
  { key: "awarded", label: "Awarded" },
];

export default function TendersScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top + 16;
  const bottomPad = isWeb ? 34 + 84 : insets.bottom + 84;

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status>("all");
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);

  const filtered = TENDERS.filter((t) => {
    const q = search.toLowerCase();
    const matchQ = !q || t.title.toLowerCase().includes(q) || t.ref.toLowerCase().includes(q) || t.entity.toLowerCase().includes(q);
    const matchS = statusFilter === "all" || t.status === statusFilter;
    return matchQ && matchS;
  });

  const statusColor = (s: string) => {
    const m: Record<string, string> = { open: colors.success, "closing-soon": colors.warning, closed: colors.mutedForeground, awarded: colors.primary };
    return m[s] ?? colors.mutedForeground;
  };
  const statusLabel = (s: string) => ({ open: "Open", "closing-soon": "Closing Soon", closed: "Closed", awarded: "Awarded" }[s] ?? s);

  if (selectedTender) {
    return (
      <TenderDetail
        tender={selectedTender}
        onBack={() => setSelectedTender(null)}
        colors={colors}
        insets={insets}
        isWeb={isWeb}
        statusColor={statusColor}
        statusLabel={statusLabel}
        bottomPad={bottomPad}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={[styles.searchHeader, { paddingTop: topPad, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.screenTitle, { color: colors.foreground }]}>Open Tenders</Text>
        <Text style={[styles.screenSubtitle, { color: colors.mutedForeground }]}>Government tenders across South Africa</Text>
        <View style={[styles.searchBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Search tenders..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          {STATUS_FILTERS.map((f) => (
            <Pressable
              key={f.key}
              style={[
                styles.filterChip,
                statusFilter === f.key
                  ? { backgroundColor: colors.primary, borderColor: colors.primary }
                  : { backgroundColor: colors.card, borderColor: colors.border },
              ]}
              onPress={() => setStatusFilter(f.key)}
            >
              <Text style={[styles.filterChipText, { color: statusFilter === f.key ? colors.primaryForeground : colors.mutedForeground }]}>
                {f.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text style={[styles.countText, { color: colors.mutedForeground }]}>
          {filtered.length} tender{filtered.length !== 1 ? "s" : ""}
        </Text>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="file-text" size={40} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No tenders found</Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>Adjust your search or filter</Text>
          </View>
        }
        renderItem={({ item: t }) => {
          const cd = getCountdown(t.closingDate);
          const sc = statusColor(t.status);
          return (
            <View style={[styles.tenderCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.tenderTop}>
                <Text style={[styles.tenderRef, { color: colors.foreground }]}>{t.ref}</Text>
                <View style={[styles.badge, { backgroundColor: sc + "18", borderColor: sc + "40" }]}>
                  <Text style={[styles.badgeText, { color: sc }]}>{statusLabel(t.status)}</Text>
                </View>
              </View>
              <Text style={[styles.tenderTitle, { color: colors.foreground }]}>{t.title}</Text>
              <View style={styles.metaRow}>
                <Feather name="map-pin" size={12} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{t.entity}</Text>
              </View>
              <View style={styles.metaRow}>
                <Feather name="dollar-sign" size={12} color={colors.mutedForeground} />
                <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{formatZAR(t.budget)}</Text>
                <View style={styles.spacer} />
                <Feather name="clock" size={12} color={cd.urgent ? colors.danger : colors.mutedForeground} />
                <Text style={[styles.metaText, { color: cd.urgent ? colors.danger : colors.mutedForeground }]}>{cd.text}</Text>
              </View>
              <View style={[styles.tenderFooter, { borderTopColor: colors.border }]}>
                <View style={[styles.cidbBadge, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
                  <Text style={[styles.cidbText, { color: colors.primary }]}>CIDB {t.cidbGrade}</Text>
                </View>
                <Pressable
                  style={[styles.viewBtn, { backgroundColor: colors.primary }]}
                  onPress={() => setSelectedTender(t)}
                >
                  <Text style={[styles.viewBtnText, { color: colors.primaryForeground }]}>View</Text>
                  <Feather name="chevron-right" size={14} color={colors.primaryForeground} />
                </Pressable>
              </View>
            </View>
          );
        }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />
    </View>
  );
}

function TenderDetail({ tender, onBack, colors, insets, isWeb, statusColor, statusLabel, bottomPad }: {
  tender: (typeof TENDERS)[0];
  onBack: () => void;
  colors: ReturnType<typeof import("@/hooks/useColors").useColors>;
  insets: ReturnType<typeof useSafeAreaInsets>;
  isWeb: boolean;
  statusColor: (s: string) => string;
  statusLabel: (s: string) => string;
  bottomPad: number;
}) {
  const topPad = isWeb ? 67 : insets.top + 16;
  const sc = statusColor(tender.status);
  const cd = getCountdown(tender.closingDate);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad, paddingHorizontal: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <Pressable style={styles.backBtn} onPress={onBack}>
        <Feather name="arrow-left" size={16} color={colors.mutedForeground} />
        <Text style={[styles.backText, { color: colors.mutedForeground }]}>Tenders</Text>
      </Pressable>

      <View style={[styles.detailHeader, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.tenderTop}>
          <Text style={[styles.tenderRef, { color: colors.foreground }]}>{tender.ref}</Text>
          <View style={[styles.badge, { backgroundColor: sc + "18", borderColor: sc + "40" }]}>
            <Text style={[styles.badgeText, { color: sc }]}>{statusLabel(tender.status)}</Text>
          </View>
        </View>
        <Text style={[styles.detailTitle, { color: colors.foreground }]}>{tender.title}</Text>
        <Text style={[styles.detailEntity, { color: colors.mutedForeground }]}>{tender.entity} · {tender.province}</Text>
        <View style={[styles.budgetRow, { borderTopColor: colors.border }]}>
          <View>
            <Text style={[styles.budgetLabel, { color: colors.mutedForeground }]}>Budget</Text>
            <Text style={[styles.budgetVal, { color: colors.foreground }]}>{formatZAR(tender.budget)}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.budgetLabel, { color: colors.mutedForeground }]}>Closes</Text>
            <Text style={[styles.budgetVal, { color: cd.urgent ? colors.danger : colors.foreground }]}>{cd.text}</Text>
          </View>
        </View>
      </View>

      <View style={[styles.detailSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Description</Text>
        <Text style={[styles.descText, { color: colors.foreground }]}>{tender.description}</Text>
      </View>

      <View style={[styles.detailSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>Details</Text>
        {[
          { label: "Category", value: tender.category },
          { label: "Province", value: tender.province },
          { label: "CIDB Grade", value: `Grade ${tender.cidbGrade}` },
          { label: "Closing Date", value: formatDate(tender.closingDate) },
        ].map((row) => (
          <View key={row.label} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
            <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
            <Text style={[styles.detailValue, { color: colors.foreground }]}>{row.value}</Text>
          </View>
        ))}
      </View>

      <Pressable style={[styles.submitBtn, { backgroundColor: colors.primary }]}>
        <Text style={[styles.submitBtnText, { color: colors.primaryForeground }]}>Submit Bid</Text>
        <Feather name="chevron-right" size={16} color={colors.primaryForeground} />
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  searchHeader: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: StyleSheet.hairlineWidth },
  screenTitle: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 2 },
  screenSubtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 12 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, borderWidth: 1, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular" },
  filterScroll: { marginBottom: 10 },
  filterChip: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, marginRight: 8, borderWidth: 1 },
  filterChipText: { fontSize: 13, fontFamily: "Inter_500Medium" },
  countText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  tenderCard: { borderRadius: 12, padding: 14, borderWidth: 1 },
  tenderTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 8 },
  tenderRef: { fontSize: 12, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  tenderTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold", lineHeight: 20, marginBottom: 8 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginBottom: 4 },
  metaText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  spacer: { flex: 1 },
  tenderFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTopWidth: StyleSheet.hairlineWidth },
  cidbBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  cidbText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  viewBtn: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 8 },
  viewBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  badge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1 },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular" },
  backBtn: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16 },
  backText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  detailHeader: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 12 },
  detailTitle: { fontSize: 18, fontFamily: "Inter_700Bold", lineHeight: 24, marginTop: 8 },
  detailEntity: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 4 },
  budgetRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 14, paddingTop: 14, borderTopWidth: StyleSheet.hairlineWidth },
  budgetLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  budgetVal: { fontSize: 16, fontFamily: "Inter_700Bold", marginTop: 2 },
  detailSection: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 12 },
  sectionTitle: { fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
  descText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 20 },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth },
  detailLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  detailValue: { fontSize: 13, fontFamily: "Inter_500Medium" },
  submitBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 10, paddingVertical: 14, marginBottom: 12 },
  submitBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
});
