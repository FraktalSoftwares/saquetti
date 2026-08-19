import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import type { AppTabScreenProps } from '../../navigation/types';

type Item = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  danger?: boolean;
  onPress: () => void;
};

/** Tela 8 Perfil (hub). */
export function PerfilScreen({ navigation }: AppTabScreenProps<'Perfil'>) {
  const insets = useSafeAreaInsets();
  const { colaborador } = useAuth();

  const itens: Item[] = [
    { key: 'dados', label: 'Meus dados', icon: 'person-outline', onPress: () => navigation.navigate('MeusDados') },
    { key: 'senha', label: 'Alterar senha', icon: 'lock-closed-outline', onPress: () => navigation.navigate('AlterarSenha') },
    { key: 'solic', label: 'Minhas solicitações', icon: 'document-text-outline', onPress: () => navigation.navigate('Solicitacoes') },
    { key: 'sair', label: 'Sair da conta', icon: 'log-out-outline', danger: true, onPress: () => logout() },
  ];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.xxl }]}>
        <Text style={styles.headerTitle}>Perfil</Text>
        <View style={styles.userRow}>
          <Avatar size={58} radius={14} />
          <View>
            <Text style={styles.nome}>{colaborador?.nomeCompleto ?? 'Colaborador'}</Text>
            <Text style={styles.cargo}>Saquetti · Operações</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {itens.map((it) => (
          <Pressable key={it.key} style={styles.row} onPress={it.onPress} accessibilityRole="button">
            <View style={[styles.iconTile, it.danger && styles.iconTileDanger]}>
              <Ionicons name={it.icon} size={20} color={it.danger ? '#DC2626' : colors.primary} />
            </View>
            <Text style={[styles.rowLabel, it.danger && styles.rowLabelDanger]}>{it.label}</Text>
            {!it.danger && <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />}
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F4F6FA' },
  header: { backgroundColor: colors.headerDark, paddingHorizontal: spacing.lg, paddingBottom: spacing.xxl },
  headerTitle: { ...typography.h2, fontSize: 17, color: colors.white, textTransform: 'uppercase', letterSpacing: 0.4 },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 18 },
  nome: { ...typography.h2, fontSize: 18, color: colors.white },
  cargo: { ...typography.body, fontSize: 13, color: colors.textMuted, marginTop: 2 },

  content: { padding: spacing.lg, gap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: 15,
  },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.iconTileBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconTileDanger: { backgroundColor: colors.dangerBg },
  rowLabel: { flex: 1, ...typography.bodySemibold, fontSize: 15, color: colors.textPrimary },
  rowLabelDanger: { color: '#B91C1C' },
});
