import React, { forwardRef, useState } from 'react';
import { TextInput } from 'react-native';
import { TextField } from './TextField';

type Props = React.ComponentProps<typeof TextField>;

/** Campo de senha com toggle de visibilidade (icone de olho). */
export const PasswordField = forwardRef<TextInput, Props>(function PasswordField(props, ref) {
  const [visible, setVisible] = useState(false);
  return (
    <TextField
      ref={ref}
      secureTextEntry={!visible}
      autoCapitalize="none"
      autoCorrect={false}
      textContentType="password"
      rightIcon={visible ? 'eye-off-outline' : 'eye-outline'}
      onPressRightIcon={() => setVisible((v) => !v)}
      {...props}
    />
  );
});
