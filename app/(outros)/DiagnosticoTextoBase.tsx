// PsychologicalReportScreen.tsx
// Tela elegante e rolável que busca um texto longo (diagnóstico) de uma tabela no Supabase
// Requisitos: Expo (SDK 50+), @supabase/supabase-js, expo-clipboard
// Tabela sugerida: diagnosticos(id uuid), patient_name text, content text, created_at timestamptz


import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Alert, RefreshControl, SafeAreaView, ScrollView, Share, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";

// Configure com variáveis de ambiente do Expo (app.json/app.config.ts)
// EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string;



// Props esperadas: route.params.reportId (string | number)
// Você pode adaptar para receber patientId e buscar o último relatório etc.
export default function PsychologicalReportScreen({ route }: any) {
    const reportId = route?.params?.reportId ?? null;

    const [content, setContent] = useState<string>("");
    const [patientName, setPatientName] = useState<string>("");
    const [createdAt, setCreatedAt] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(true);
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fontSize, setFontSize] = useState<number>(16);

    const loadReport = useCallback(async () => {
        try {
            setError(null);
            setLoading(true);

            // Exemplo de query: seleciona um diagnóstico por id
            // Ajuste o nome da tabela/colunas conforme seu schema
            const { data, error } = await supabase
                .from("autoavaliacao")
                .select("id, diagnostico, created_at")
                .eq("id", "32fa08d0-746a-4877-969c-e2192bac5e9c")
                .single();

            if (error) throw error;

            setContent(data?.diagnostico ?? "");
            //setPatientName(data?.patient_name ?? "Paciente");
            setCreatedAt(data?.created_at ?? "");
        } catch (err: any) {
            console.error(err);
            setError(err?.message ?? "Falha ao carregar o diagnóstico.");
        } finally {
            setLoading(false);
        }
    }, [reportId]);

    useEffect(() => {
        loadReport();
    }, [loadReport]);

    const onRefresh = useCallback(async () => {
        setRefreshing(true);
        await loadReport();
        setRefreshing(false);
    }, [loadReport]);

    const shareReport = useCallback(async () => {
        try {
            await Share.share({
                title: `Diagnóstico – ${patientName}`,
                message: `${patientName}\n\n${content}`,
            });
        } catch (e: any) {
            Alert.alert("Não foi possível compartilhar", e?.message ?? "Erro desconhecido");
        }
    }, [content, patientName]);

    const copyToClipboard = useCallback(async () => {
        await Clipboard.setStringAsync(content);
        Alert.alert("Copiado", "O texto do diagnóstico foi copiado para a área de transferência.");
    }, [content]);

    const dateLabel = useMemo(() => {
        if (!createdAt) return "";
        try {
            const d = new Date(createdAt);
            return d.toLocaleString();
        } catch {
            return createdAt;
        }
    }, [createdAt]);

    return (
        <SafeAreaView style={styles.safe}>
            <StatusBar barStyle="dark-content" />

            <View style={styles.header}>
                <TouchableOpacity style={styles.iconBtn} onPress={() => router.replace('/home')}>
                    <Ionicons name="home-outline" size={24} color="#1f2937" />
                </TouchableOpacity>
                <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                        Resumo da Sua Jornada
                    </Text>
                    {!!patientName && (
                        <Text style={styles.subtitle} numberOfLines={1}>
                            {patientName} {dateLabel ? `• ${dateLabel}` : ""}
                        </Text>
                    )}
                </View>


            </View>
            <View style={styles.header}>
                <View style={styles.actions}>
                    <HeaderButton label="A-" onPress={() => setFontSize((s) => Math.max(12, s - 1))} />
                    <HeaderButton label="A+" onPress={() => setFontSize((s) => Math.min(24, s + 1))} />
                    <HeaderButton label="Copiar" onPress={copyToClipboard} />
                    <HeaderButton label="Compart." onPress={shareReport} />
                </View>
            </View>

            {loading ? (
                <View style={styles.loadingWrap}>
                    <ActivityIndicator size="large" />
                    <Text style={styles.loadingText}>Carregando diagnóstico…</Text>
                </View>
            ) : error ? (
                <View style={styles.errorWrap}>
                    <Text style={styles.errorTitle}>Não foi possível carregar</Text>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryBtn} onPress={loadReport}>
                        <Text style={styles.retryText}>Tentar novamente</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <ScrollView
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                    contentContainerStyle={styles.scrollContent}
                >
                    <View style={styles.card}>
                        {content ? (
                            <Text style={[styles.content, { fontSize }]} selectable>
                                {content}
                            </Text>
                        ) : (
                            <Text style={styles.emptyText}>Sem conteúdo disponível para este relatório.</Text>
                        )}
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

function HeaderButton({ label, onPress }: { label: string; onPress: () => void }) {
    return (
        <TouchableOpacity onPress={onPress} style={styles.headerBtn}>
            <Text style={styles.headerBtnText}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    safe: {
        flex: 1,
        backgroundColor: "#F7F7FA",
    },
    header: {
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8,
        alignItems: "center",
    },
    title: {
        fontSize: 22,
        fontWeight: "700",
        color: "#111",
        flexShrink: 1,
    },
    subtitle: {
        marginTop: 2,
        fontSize: 13,
        color: "#666",
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    headerBtn: {
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderRadius: 14,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
    headerBtnText: {
        fontSize: 12,
        fontWeight: "600",
        color: "#333",
    },
    loadingWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: "#666",
    },
    errorWrap: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: "700",
        color: "#b00020",
        marginBottom: 6,
    },
    errorText: {
        textAlign: "center",
        color: "#555",
        marginBottom: 12,
    },
    retryBtn: {
        backgroundColor: "#111827",
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
    },
    retryText: {
        color: "#fff",
        fontWeight: "600",
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    card: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 18,
        elevation: 3,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
    },
    content: {
        lineHeight: 24,
        color: "#1f2937",
    },
    emptyText: {
        color: "#6b7280",
        fontStyle: "italic",
    },
    iconBtn: {
        padding: 6,
        backgroundColor: "#fff",
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
    },
});
