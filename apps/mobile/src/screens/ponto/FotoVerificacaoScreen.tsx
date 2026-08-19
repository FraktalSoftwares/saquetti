import React, { useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BackButton, Button } from '../../components';
import { colors, spacing, typography } from '../../theme';
import type { AppStackScreenProps } from '../../navigation/types';

/** Telas 3.2 Foto de verificação + 3.3 Foto registrada (RF-008). */
export function FotoVerificacaoScreen({
  navigation,
  route,
}: AppStackScreenProps<'FotoVerificacao'>) {
  const insets = useSafeAreaInsets();
  const { tipo, localizacao } = route.params;
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [fotoUri, setFotoUri] = useState<string | null>(null);
  const [capturado, setCapturado] = useState(false);

  const capturar = async () => {
    try {
      const pic = await cameraRef.current?.takePictureAsync({ quality: 0.6 });
      setFotoUri(pic?.uri ?? null);
    } catch {
      setFotoUri(null); // sem câmera (ex.: web) — segue com placeholder
    }
    setCapturado(true);
  };

  const refazer = () => {
    setFotoUri(null);
    setCapturado(false);
  };

  const usarFoto = () => {
    navigation.navigate('ConfirmarRegistro', { tipo, localizacao, fotoUri });
  };

  // Estado: pré-visualização da foto capturada (3.3)
  if (capturado) {
    return (
      <View style={styles.dark}>
        <StatusBar style="light" />
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          <View style={styles.capturedTag}>
            <Ionicons name="checkmark" size={18} color={colors.successBright} />
            <Text style={styles.capturedText}>Foto capturada</Text>
          </View>
        </View>
        <View style={styles.center}>
          <View style={[styles.oval, styles.ovalOk]}>
            {fotoUri ? (
              <Image source={{ uri: fotoUri }} style={styles.ovalImage} resizeMode="cover" />
            ) : (
              <View style={styles.ovalPlaceholder}>
                <Ionicons name="person" size={150} color="#5A6B82" style={styles.figure} />
              </View>
            )}
          </View>
        </View>
        <View style={[styles.actions, { paddingBottom: insets.bottom + spacing.xl }]}>
          <Button title="Refazer" variant="secondary" onPress={refazer} style={styles.actionBtn} />
          <Button title="Usar Foto" onPress={usarFoto} style={styles.actionBtn} />
        </View>
      </View>
    );
  }

  // Permissão de câmera ainda não concedida (3.2 — gate)
  if (!permission?.granted) {
    return (
      <View style={styles.dark}>
        <StatusBar style="light" />
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          <BackButton onPress={() => navigation.goBack()} color={colors.white} />
          <Text style={styles.title}>Foto de verificação</Text>
        </View>
        <View style={styles.center}>
          <Ionicons name="camera-outline" size={56} color={colors.textOnDarkMuted} />
          <Text style={styles.permText}>
            Precisamos da câmera para a foto de verificação do seu ponto.
          </Text>
          <Button title="Permitir câmera" onPress={requestPermission} style={styles.permBtn} />
        </View>
      </View>
    );
  }

  // Câmera ativa (3.2)
  return (
    <View style={styles.dark}>
      <StatusBar style="light" />
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing="front" />
      <View style={styles.overlay}>
        <View style={[styles.topBar, { paddingTop: insets.top + spacing.sm }]}>
          <BackButton onPress={() => navigation.goBack()} color={colors.white} />
          <Text style={styles.title}>Foto de verificação</Text>
        </View>
        <View style={styles.center}>
          <View style={[styles.oval, styles.ovalGuide]}>
            <Ionicons name="person-outline" size={130} color="#6B7280" />
          </View>
          <Text style={styles.guideText}>Posicione seu rosto no círculo</Text>
        </View>
        <View style={[styles.shutterWrap, { paddingBottom: insets.bottom + spacing.xxl }]}>
          <Pressable
            style={styles.shutter}
            onPress={capturar}
            accessibilityRole="button"
            accessibilityLabel="Capturar foto"
          />
        </View>
      </View>
    </View>
  );
}

const OVAL_W = 222;
const OVAL_H = 300;

const styles = StyleSheet.create({
  dark: { flex: 1, backgroundColor: colors.cameraBg },
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'space-between' },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, paddingHorizontal: spacing.sm, height: 52 + 40 },
  title: { ...typography.h2, fontSize: 16, color: colors.white, textTransform: 'uppercase', letterSpacing: 0.5 },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 34 },
  oval: {
    width: OVAL_W,
    height: OVAL_H,
    borderRadius: 130,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  ovalGuide: { borderWidth: 2, borderColor: '#6B7280', borderStyle: 'dashed', backgroundColor: 'transparent' },
  ovalOk: { borderWidth: 2, borderColor: colors.successBright },
  ovalImage: { width: '100%', height: '100%' },
  ovalPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1A2536',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  figure: { marginBottom: -10 },
  guideText: { ...typography.body, fontSize: 14, color: colors.white, textAlign: 'center' },

  shutterWrap: { alignItems: 'center' },
  shutter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.white,
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.4)',
  },

  capturedTag: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 },
  capturedText: { ...typography.bodySemibold, color: colors.successBright },

  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  actionBtn: { flex: 1 },

  permText: {
    ...typography.subtitle,
    color: colors.textOnDarkMuted,
    textAlign: 'center',
    paddingHorizontal: spacing.xxl,
  },
  permBtn: { alignSelf: 'stretch', marginHorizontal: spacing.xxl },
});
