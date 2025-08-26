import { Feather } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSearchParams } from "expo-router/build/hooks";
import { AudioLines, BookOpen, Dumbbell, Mic, Video } from "lucide-react-native";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";

type Categoria = "Áudios" | "Vídeos" | "Textos" | "Exercícios" | "Podcasts";

const iconesMap: Record<Categoria, React.ComponentType<any>> = {
    Áudios: AudioLines,
    Vídeos: Video,
    Textos: BookOpen,
    Exercícios: Dumbbell,
    Podcasts: Mic,
};

const recursosDetalhes: Record<Categoria, { id: string; titulo: string; descricao: string }[]> = {
    Áudios: [
        { id: "1", titulo: "Respiração Guiada", descricao: "Exercício de respiração para reduzir a ansiedade." },
        { id: "2", titulo: "Relaxamento Progressivo", descricao: "Técnica de relaxamento muscular." },
    ],
    Vídeos: [
        { id: "1", titulo: "Mindfulness", descricao: "Vídeo introdutório sobre atenção plena." },
    ],
    Textos: [
        { id: "1", titulo: "Diário de Emoções", descricao: "Escreva sobre seus sentimentos diariamente." },
    ],
    Exercícios: [
        { id: "1", titulo: "Alongamento", descricao: "Sequência de alongamentos para aliviar tensão." },
    ],
    Podcasts: [
        { id: "1", titulo: "Bem-estar Mental", descricao: "Podcast sobre dicas práticas para o dia a dia." },
    ],
};

const isCategoria = (v: any): v is Categoria =>
    ["Áudios", "Vídeos", "Textos", "Exercícios", "Podcasts"].includes(v);

export default function RecursoDetalhe() {
    const params = useSearchParams();
    const tituloStr = params.get("titulo");
    if (!tituloStr || !isCategoria(tituloStr)) {
        return <Text>Categoria inválida</Text>;
    }

    const titulo: Categoria = tituloStr as Categoria;
    const cor = "#fff"; // Pode usar params.get("cor") se quiser
    const Icone = iconesMap[titulo];

    return (
        <View style={styles.container}>
            {/* Header */}
            <LinearGradient
                colors={['#9333ea', '#d763f8']}
                style={styles.header}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            >
                <View style={styles.headerContent}>
                    {/* Esquerda → botão voltar */}
                    <TouchableOpacity onPress={() => router.back()}>
                        <Feather name="arrow-left" size={26} color="#fff" />
                    </TouchableOpacity>

                    {/* Centro → ícone + título */}
                    <View style={styles.centerContent}>
                        <Icone size={26} color={cor} />
                        <Text style={styles.headerTitle}>{titulo}</Text>
                    </View>

                    {/* Direita → placeholder para centralizar */}
                    <View style={{ width: 26 }} />
                </View>
            </LinearGradient>

            {/* Lista de Conteúdos */}
            <FlatList
                data={recursosDetalhes[titulo] || []}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity style={styles.card}>
                        <Text style={styles.cardTitle}>{item.titulo}</Text>
                        <Text style={styles.cardDesc}>{item.descricao}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f2f5f9' },
    header: { paddingTop: 50, paddingBottom: 20, marginBottom: 20 },
    headerContent: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    centerContent: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    headerTitle: { fontSize: 20, color: '#fff', fontWeight: 'bold' },
    card: {
        backgroundColor: "#fff",
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 5,
        elevation: 2,
    },
    cardTitle: { fontSize: 18, fontWeight: "600", color: "#111827" },
    cardDesc: { fontSize: 14, color: "#6B7280", marginTop: 4 },
});
