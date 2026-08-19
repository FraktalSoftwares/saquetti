import React, { forwardRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, typography, layout } from '../theme';

type Props = TextInputProps & {
  label: string;
  required?: boolean;
  error?: string | null;
  /** Icone a direita (ex.: olho para senha). */
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onPressRightIcon?: () => void;
};

// RN tipa onFocus/onBlur com tipos distintos entre versoes; derivamos das proprias props.
type FocusHandler = NonNullable<TextInputProps['onFocus']>;
type BlurHandler = NonNullable<TextInputProps['onBlur']>;

export const TextField = forwardRef<TextInput, Props>(function TextField(
  { label, required, error, rightIcon, onPressRightIcon, onFocus, onBlur, style, ...rest },
  ref,
) {
  const [focused, setFocused] = useState(false);

  const handleFocus: FocusHandler = (e) => {
    setFocused(true);
    onFocus?.(e);
  };
  const handleBlur: BlurHandler = (e) => {
    setFocused(false);
    onBlur?.(e);
  };

  const hasError = !!error;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.asterisk}> *</Text>}
      </Text>

      <View
        style={[
          styles.inputWrap,
          focused && styles.inputWrapFocused,
          hasError && styles.inputWrapError,
        ]}
      >
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={colors.textMuted}
          onFocus={handleFocus}
          onBlur={handleBlur}
          accessibilityState={hasError ? { selected: false } : undefined}
          {...rest}
        />
        {rightIcon && (
          <Pressable
            onPress={onPressRightIcon}
            hitSlop={10}
            accessibilityRole="button"
            style={styles.rightIcon}
          >
            <Ionicons name={rightIcon} size={22} color={colors.textSecondary} />
          </Pressable>
        )}
      </View>

      {hasError && (
        <Text style={styles.error} accessibilityLiveRegion="polite">
          {error}
        </Text>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { width: '100%' },
  label: { ...typography.label, color: colors.textPrimary, marginBottom: 8 },
  asterisk: { color: colors.danger },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: layout.inputHeight,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    paddingHorizontal: 16,
  },
  inputWrapFocused: { borderColor: colors.primary },
  inputWrapError: { borderColor: colors.danger },
  input: { flex: 1, ...typography.input, color: colors.textPrimary, paddingVertical: 14 },
  rightIcon: { paddingLeft: 8 },
  error: { ...typography.caption, color: colors.danger, marginTop: 6 },
});
