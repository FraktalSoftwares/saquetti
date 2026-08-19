import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Button, MapMock, PhotoThumb } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import type { AppStackScreenProps } from '../../navigation/types';

/** Tela 3.5 Comprovante. */
export function ComprovanteScreen({ navigation, route }: AppStackScreenProps<'Comprovante'>) {
  const insets = useSafeAreaInsets();
  const { comprovante } = route.params;
  const { tipo, dataExtenso, hora, localizacao, fotoUri } = comprovante;

  const voltarHome = () => {
    navigation.navigate('Tabs', { screen: 'Home' });
  };
  const verEspelho = () => {
    navigation.navigate('Tabs', { screen: 'CartaoPonto' });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successHead}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={38} color={colors.successBright} />
          </View>
          <Text style={styles.title}>Ponto registrado!</Text>
          <Text style={styles.subtitle}>Sua marcação de {tipo.toLowerCase()} foi confirmada.</Text>
        </View>

        <View style={styles.receipt}>
          <Text style={styles.receiptHeader}>COMPROVANTE</Text>
          <View style={styles.receiptBody}>
            <Row icon="time-outline" label="Data e hora" value={`${dataExtenso} – ${hora}`} />
            {localizacao && (
              <>
                <View style={styles.rDivider} />
                <Row
                  icon="location-outline"
                  label="Localização"
                  value={localizacao.logradouro}
                  right={<MapMock height={48} radius={8} gridGap={13} pinSize={14} style={styles.thumb48} />}
                />
              </>
            )}
            <View style={styles.rDivider} />
            <Row
              icon="camera-outline"
              label="Foto de verificação"
              value="Confirmada"
              right={<PhotoThumb size={48} uri={fotoUri} />}
            />
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Button title="Voltar para home" onPress={voltarHome} />
        <Pressable onPress={verEspelho} style={styles.link} hitSlop={8}>
          <Text style={styles.linkText}>Ver espelho do ponto</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  right,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={22} color={colors.receiptIcon} />
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  content: { paddingHorizontal: spacing.lg, paddingBottom: spacing.xl },

  successHead: { alignItems: 'center' },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.successBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.title, fontSize: 26, color: colors.textPrimary, marginTop: 18 },
  subtitle: { ...typography.body, fontSize: 14, color: colors.textSecondary, marginTop: 6 },

  receipt: {
    marginTop: spacing.xxl,
    backgroundColor: colors.receiptBg,
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  receiptHeader: {
    ...typography.overline,
    color: colors.white,
    letterSpacing: 1,
    paddingHorizontal: spacing.lg,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.receiptDivider,
  },
  receiptBody: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xs },

  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingVertical: 13 },
  rowBody: { flex: 1 },
  rowLabel: { ...typography.caption, color: colors.textMuted },
  rowValue: { ...typography.bodySemibold, fontSize: 15, color: colors.white, marginTop: 2 },
  rDivider: { height: 1, backgroundColor: colors.receiptDivider },
  thumb48: { width: 48 },

  footer: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  link: { alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.xs },
  linkText: { ...typography.bodyMedium, color: colors.textSecondary },
});
