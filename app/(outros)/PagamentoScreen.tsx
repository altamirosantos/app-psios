import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PagamentoScreen({ user }: any) {
    const [loading, setLoading] = useState(false);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const [metodoPagamento, setMetodoPagamento] = useState<'PIX' | 'CREDIT_CARD'>('PIX');

    const planos = [
        { nome: 'Plano 1', valor: '10,00' },
        { nome: 'Plano 2', valor: '15,00' },
    ]

    const criarAssinatura = async (plano: any) => {
        try {
            setLoading(true);
            const res = await fetch('https://<SUA_SUPABASE_FUNCTION_URL>', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    nome: user.name,
                    email: user.email,
                    plano: plano.nome,
                    valor: plano.valor,
                    metodoPagamento
                }),
            });
            const data = await res.json();
            if (data.checkoutUrl) setCheckoutUrl(data.checkoutUrl);
            else Alert.alert('Erro', 'Não foi possível criar a assinatura');
        } catch (err) {
            console.error(err);
            Alert.alert('Erro', 'Erro ao conectar com o servidor');
        } finally {
            setLoading(false);
        }
    };

    if (checkoutUrl) {
        // Abre o checkout do Asaas
        return <WebView source={{ uri: checkoutUrl }} startInLoadingState renderLoading={() => <ActivityIndicator size="large" color="#007AFF" />} />;
    }

    return (
        <LinearGradient colors={['#9333ea', '#d763f8']} style={styles.containerRoot}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.containerImage}>
                    <Image source={require("@/assets/images/avatar-autoavaliacao.png")} style={styles.imagem} resizeMode="contain" />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 20, marginBottom: 10 }}>Escolha o plano:</Text>
                    {planos.map((plano: any) => (
                        <TouchableOpacity key={plano.nome} onPress={() => criarAssinatura(plano)} style={{ padding: 15, backgroundColor: '#007AFF', marginVertical: 5, borderRadius: 8 }}>
                            <Text style={{ color: '#fff' }}>{plano.nome} - R$ {plano.valor}</Text>
                        </TouchableOpacity>
                    ))}

                    <View style={{ flexDirection: 'row', marginTop: 20 }}>
                        <TouchableOpacity onPress={() => setMetodoPagamento('PIX')} style={{ flex: 1, padding: 10, backgroundColor: metodoPagamento === 'PIX' ? '#34C759' : '#ccc', marginRight: 5, borderRadius: 8 }}>
                            <Text style={{ color: '#fff', textAlign: 'center' }}>PIX</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setMetodoPagamento('CREDIT_CARD')} style={{ flex: 1, padding: 10, backgroundColor: metodoPagamento === 'CREDIT_CARD' ? '#34C759' : '#ccc', marginLeft: 5, borderRadius: 8 }}>
                            <Text style={{ color: '#fff', textAlign: 'center' }}>Cartão</Text>
                        </TouchableOpacity>
                    </View>

                    {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}
                </View>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    containerRoot: {
        flex: 1,
        paddingBottom: 50,
    },
    scrollContent: {
        padding: 5,
        alignItems: 'center',

    },
    containerImage: {
        position: 'relative',
        width: 220,
        height: 220,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    imagem: {
        width: 144,
        height: 144,
    },

});
