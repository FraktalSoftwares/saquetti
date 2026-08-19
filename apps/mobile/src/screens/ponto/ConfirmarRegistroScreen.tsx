import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar, BackButton, Button, MapMock, PhotoThumb } from '../../components';
import { colors, radius, spacing, typography } from '../../theme';
import { useAuth } from '../../context/AuthContext';
import { registrarPonto } from '../../services/pontoService';
import { dataLonga, dataCurta, horaCompleta } from '../../utils/datetime';
import type { AppStackScreenProps } from '../../navigation/types';

/** Tela 3.4 Confirmar Registro. */
export function ConfirmarRegistroScreen({
  navigation,
  route,
}: AppStackScreenProps<'ConfirmarRegistro'>) {
  const insets = useSafeAreaInsets();
  const { colaborador } = useAuth();
  const { tipo, localizacao, fotoUri } = route.params;

  const [relogio, setRelogio] = useState(() => horaCompleta(new Date()));
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setRelogio(horaCompleta(new Date())), 1000);
    return () => clearInterval(t);
  }, []);

  const temFoto = colaborador?.capturarFoto ?? true;

  const confirmar = async () => {
    if (salvando) return;
    setSalvando(true);
    const comprovante = await registrarPonto({ tipo, localizacao, fotoUri });
    navigation.replace('Comprovante', { comprovante });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={[styles.header, { paddingTop: insets.top + spacing.sm }]}>
        <BackButton onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Confirmar registro</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.userCard}>
          <Avatar size={46} />
          <View>
            <Text style={styles.userName}>{colaborador?.nomeCompleto ?? 'Colaborador'}</Text>
            <Text style={styles.userDate}>
              {tipo} · {dataLonga(new Date())}
            </Text>
          </View>
        </View>

        <View style={styles.detailCard}>
          <DetailRow icon="time-outline" label="Data e hora" value={`${dataCurta(new Date())} – ${relogio}`} />

          {localizacao && (
            <>
              <View style={styles.divider} />
              <DetailRow
                icon="location-outline"
                label="Localização"
                value={localizacao.logradouro}
                sub={localizacao.complemento}
                right={<MapMock height={52} radius={8} gridGap={14} pinSize={16} style={styles.thumb} />}
              />
            </>
          )}

          {temFoto && (
            <>
              <View style={styles.divider} />
              <DetailRow
                icon="camera-outline"
                label="Foto de verificação"
                value={`Capturada às ${relogio}`}
                right={<PhotoThumb size={52} uri={fotoUri} />}
              />
            </>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + spacing.xl }]}>
        <Button title="Confirmar registro" onPress={confirmar} loading={salvando} />
        <Pressable onPress={() => navigation.popToTop()} style={styles.cancel} hitSlop={8}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </Pressable>
      </View>
    </View>
  );
}

function DetailRow({
  icon,
  label,
  value,
  sub,
  right,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  sub?: string;
  right?: React.ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.iconTile}>
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      <View style={styles.rowBody}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
        {sub && <Text style={styles.rowSub}>{sub}</Text>}
      </View>
      {right}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  headerTitle: {
    ...typography.h2,
    fontSize: 17,
    color: colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  content: { padding: spacing.lg },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  userName: { ...typography.bodySemibold, fontSize: 16, color: colors.textPrimary },
  userDate: { ...typography.body, color: colors.textSecondary, marginTop: 1 },

  detailCard: {
    marginTop: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderLight,
    borderRadius: radius.lg,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.md, padding: spacing.md },
  iconTile: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: colors.iconTileBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBody: { flex: 1 },
  rowLabel: { ...typography.caption, color: colors.textSecondary },
  rowValue: { ...typography.bodySemibold, fontSize: 15, color: colors.textPrimary, marginTop: 2 },
  rowSub: { ...typography.caption, color: colors.textMuted },
  divider: { height: 1, backgroundColor: colors.divider, marginHorizontal: spacing.md },
  thumb: { width: 52 },

  footer: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    backgroundColor: colors.surface,
  },
  cancel: { alignItems: 'center', paddingVertical: spacing.md, marginTop: spacing.xs },
  cancelText: { ...typography.bodyMedium, color: colors.textSecondary },
});
