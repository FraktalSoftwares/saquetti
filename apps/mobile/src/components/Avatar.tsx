import React, { useEffect, useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { avatarLauraXml } from '../assets/svg';
import { useAuth } from '../context/AuthContext';
import { urlFotoPerfil } from '../services/authService';
import { colors } from '../theme';

/**
 * Avatar do colaborador logado. Exibe a foto de perfil quando houver
 * (`colaboradores.foto_perfil`, via URL assinada) e cai no asset de demonstração
 * enquanto o trabalhador não enviar uma imagem.
 */
export function Avatar({
  size = 46,
  radius = 12,
  bordered = true,
}: {
  size?: number;
  radius?: number;
  bordered?: boolean;
}) {
  const { colaborador } = useAuth();
  const caminho = colaborador?.fotoPerfil ?? null;
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let ativo = true;
    if (!caminho) {
      setUri(null);
      return;
    }
    urlFotoPerfil(caminho).then((u) => {
      if (ativo) setUri(u);
    });
    return () => {
      ativo = false;
    };
  }, [caminho]);

  return (
    <View
      style={[
        styles.wrap,
        { width: size, height: size, borderRadius: radius },
        bordered && styles.bordered,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: size, height: size }} resizeMode="cover" />
      ) : (
        <SvgXml xml={avatarLauraXml} width={size} height={size} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', backgroundColor: colors.borderLight },
  bordered: { borderWidth: 1, borderColor: colors.borderLight },
});
