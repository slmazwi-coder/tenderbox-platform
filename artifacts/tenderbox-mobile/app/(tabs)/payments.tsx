import { Feather } from "@expo/vector-icons";
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
  return new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);
}
function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-ZA", { day: "2-digit", month: "short", year: "numeric" });
}

const PAYMENT_STEPS = [
  { id: "qs", label: "QS Measurement" },
  { id: "pa", label: "PA Certification" },
  { id: "invoice", label: "Invoice Submitted" },
  { id: "pm", label: "PM Sign-off" },
  { id: "pmu", label: "PMU Sign-off" },
  { id: "cfo", label: "CFO Sign-off" },
  { id: "mm", label: "MM Sign-off" },
  { id: "released", label: "Payment Released" },
];

const ACTIVE_CERT = {
  id: "1",
  certificateNumber: "PC-2025-047-003",
  tenderRef: "TBX-2025-0031",
  tenderTitle: "Rehabilitation of Stormwater Drainage System",
  contractorName: "Sizwe Construction (Pty) Ltd",
  certifiedAmount: 1245000,
  daysRemaining: 22,
  invoiceDate: "2026-05-16",
  currentStep: "pmu",
  approvals: {
    qs: { completed: true, date: "2026-05-20T10:30:00" },
    pa: { completed: true, date: "2026-05-22T14:15:00" },
    invoice: { completed: true, date: "2026-05-16T09:00:00" },
    pm: { completed: true, date: "2026-05-24T11:45:00" },
    pmu: { completed: false, date: null },
    cfo: { completed: false, date: null },
    mm: { completed: false, date: null },
    released: { completed: false, date: null },
  } as Record<string, { completed: boolean; date: string | null }>,
};

const PAYMENT_HISTORY = [
  { id: "PC-2025-047-002", period: "Apr 2026", amount: 2150000, releasedDate: "2026-05-08", daysTaken: 16, status: "paid" },
  { id: "PC-2025-047-001", period: "Mar 2026", amount: 1875000, releasedDate: "2026-04-12", daysTaken: 22, status: "paid" },
  { id: "PC-2025-046-003", period: "Feb 2026", amount: 3240000, releasedDate: "2026-03-28", daysTaken: 28, status: "paid" },
  { id: "PC-2025-045-002", period: "Jan 2026", amount: 2980000, releasedDate: "2026-02-28", daysTaken: 31, status: "overdue" },
];

export default function PaymentsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const isWeb = Platform.OS === "web";
  const topPad = isWeb ? 67 : insets.top + 16;
  const bottomPad = isWeb ? 34 + 84 : insets.bottom + 84;

  const completedSteps = PAYMENT_STEPS.filter((s) => ACTIVE_CERT.approvals[s.id]?.completed).length;
  const progress = completedSteps / PAYMENT_STEPS.length;
  const progressColor = progress >= 0.75 ? colors.success : progress >= 0.4 ? colors.warning : colors.primary;

  const totalPaid = PAYMENT_HISTORY.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad, paddingHorizontal: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Payments</Text>
      <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Payment certificates and escrow tracking</Text>

      <View style={styles.summaryRow}>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="credit-card" size={20} color={colors.primary} />
          <Text style={[styles.summaryVal, { color: colors.foreground }]}>{formatZAR(ACTIVE_CERT.certifiedAmount)}</Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Active Certificate</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="check-circle" size={20} color={colors.success} />
          <Text style={[styles.summaryVal, { color: colors.foreground }]}>{formatZAR(totalPaid)}</Text>
          <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Total Received</Text>
        </View>
      </View>

      <View style={[styles.certCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.certHeader}>
          <View>
            <Text style={[styles.certNum, { color: colors.primary }]}>{ACTIVE_CERT.certificateNumber}</Text>
            <Text style={[styles.certRef, { color: colors.foreground }]}>{ACTIVE_CERT.tenderRef}</Text>
            <Text style={[styles.certTitle, { color: colors.mutedForeground }]} numberOfLines={1}>
              {ACTIVE_CERT.tenderTitle}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.certAmount, { color: colors.foreground }]}>{formatZAR(ACTIVE_CERT.certifiedAmount)}</Text>
            <View style={[styles.daysBadge, { backgroundColor: colors.warning + "18", borderColor: colors.warning + "40" }]}>
              <Feather name="clock" size={10} color={colors.warning} />
              <Text style={[styles.daysText, { color: colors.warning }]}>{ACTIVE_CERT.daysRemaining}d left</Text>
            </View>
          </View>
        </View>

        <View style={[styles.progressSection, { borderTopColor: colors.border }]}>
          <Text style={[styles.progressLabel, { color: colors.mutedForeground }]}>
            Approval Chain — {completedSteps} of {PAYMENT_STEPS.length} complete
          </Text>
          <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any, backgroundColor: progressColor }]} />
          </View>
        </View>

        <View style={styles.stepList}>
          {PAYMENT_STEPS.map((step, i) => {
            const approval = ACTIVE_CERT.approvals[step.id];
            const done = approval?.completed;
            const isCurrent = !done && PAYMENT_STEPS[i - 1] && ACTIVE_CERT.approvals[PAYMENT_STEPS[i - 1].id]?.completed;
            const color = done ? colors.success : isCurrent ? colors.warning : colors.mutedForeground;
            return (
              <View key={step.id} style={styles.step}>
                <View style={[styles.stepDot, { backgroundColor: done ? colors.success : isCurrent ? colors.warning + "30" : colors.muted, borderColor: color }]}>
                  {done ? (
                    <Feather name="check" size={10} color={colors.successForeground} />
                  ) : isCurrent ? (
                    <View style={[styles.dotInner, { backgroundColor: colors.warning }]} />
                  ) : null}
                </View>
                {i < PAYMENT_STEPS.length - 1 && (
                  <View style={[styles.stepLine, { backgroundColor: done ? colors.success : colors.border }]} />
                )}
                <View style={styles.stepContent}>
                  <Text style={[styles.stepLabel, { color: done ? colors.foreground : isCurrent ? colors.warning : colors.mutedForeground, fontFamily: isCurrent ? "Inter_600SemiBold" : "Inter_400Regular" }]}>
                    {step.label}
                  </Text>
                  {done && approval.date && (
                    <Text style={[styles.stepDate, { color: colors.mutedForeground }]}>
                      {formatDate(approval.date)}
                    </Text>
                  )}
                  {isCurrent && (
                    <View style={[styles.pendingBadge, { backgroundColor: colors.warning + "18" }]}>
                      <Text style={[styles.pendingText, { color: colors.warning }]}>Awaiting</Text>
                    </View>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      <Text style={[styles.histTitle, { color: colors.mutedForeground }]}>Payment History</Text>
      {PAYMENT_HISTORY.map((p, i) => (
        <View
          key={p.id}
          style={[
            styles.histRow,
            { backgroundColor: colors.card, borderColor: colors.border },
            i < PAYMENT_HISTORY.length - 1 && { marginBottom: 8 },
          ]}
        >
          <View style={{ flex: 1 }}>
            <Text style={[styles.histId, { color: colors.mutedForeground }]}>{p.id}</Text>
            <Text style={[styles.histPeriod, { color: colors.foreground }]}>{p.period}</Text>
            <Text style={[styles.histMeta, { color: colors.mutedForeground }]}>
              Released {formatDate(p.releasedDate)} · {p.daysTaken} days
            </Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={[styles.histAmount, { color: colors.foreground }]}>{formatZAR(p.amount)}</Text>
            <View style={[styles.histBadge, {
              backgroundColor: p.status === "paid" ? colors.success + "18" : colors.danger + "18",
              borderColor: p.status === "paid" ? colors.success + "40" : colors.danger + "40",
            }]}>
              <Text style={[styles.histBadgeText, { color: p.status === "paid" ? colors.success : colors.danger }]}>
                {p.status === "paid" ? "Paid" : "Overdue"}
              </Text>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 2 },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginBottom: 16 },
  summaryRow: { flexDirection: "row", gap: 10, marginBottom: 14 },
  summaryCard: { flex: 1, borderRadius: 12, padding: 14, borderWidth: 1, alignItems: "center", gap: 6 },
  summaryVal: { fontSize: 15, fontFamily: "Inter_700Bold", textAlign: "center" },
  summaryLabel: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center" },
  certCard: { borderRadius: 12, padding: 16, borderWidth: 1, marginBottom: 20 },
  certHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 14 },
  certNum: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.5 },
  certRef: { fontSize: 15, fontFamily: "Inter_700Bold", marginTop: 4 },
  certTitle: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  certAmount: { fontSize: 16, fontFamily: "Inter_700Bold" },
  daysBadge: { flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, marginTop: 6 },
  daysText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  progressSection: { borderTopWidth: StyleSheet.hairlineWidth, paddingTop: 14, marginBottom: 14 },
  progressLabel: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 8 },
  progressTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3 },
  stepList: { gap: 0 },
  step: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 6 },
  stepDot: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: "center", justifyContent: "center", marginRight: 10, marginTop: 2, zIndex: 1 },
  dotInner: { width: 8, height: 8, borderRadius: 4 },
  stepLine: { position: "absolute", left: 9, top: 22, width: 2, height: "100%", zIndex: 0 },
  stepContent: { flex: 1 },
  stepLabel: { fontSize: 13, lineHeight: 18 },
  stepDate: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  pendingBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginTop: 4, alignSelf: "flex-start" },
  pendingText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  histTitle: { fontSize: 10, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 10 },
  histRow: { borderRadius: 10, padding: 14, borderWidth: 1, flexDirection: "row", alignItems: "center" },
  histId: { fontSize: 10, fontFamily: "Inter_400Regular", letterSpacing: 0.5 },
  histPeriod: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  histMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  histAmount: { fontSize: 15, fontFamily: "Inter_700Bold" },
  histBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1, marginTop: 6 },
  histBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
});
