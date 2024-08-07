import React from 'react';
import { Text as NativeText } from 'react-native-paper';
import PropTypes from 'prop-types';
import { THEME } from '../../../assets/colors/colors';

const Text = ({
  children, fontSize, fontFamily, uppercase, textAlign, color, style, onPress, defaultInputProps, numberOfLines
}) => (
  <NativeText // Encapsulado del texto nativo, para el uso de una misma fuente en toda la aplicación
    style={{
      fontSize,
      fontFamily,
      textAlign,
      color,
      ...style,
    }}
    theme={THEME}
    {...defaultInputProps}
    onPress={onPress}
    numberOfLines={numberOfLines}
  >
    {uppercase ? children.toString().toUpperCase() : children}
  </NativeText>
);

Text.propsType = {
  /** Children es el contenido que se envia entre tags, en este caso el texto a renderizar */
  children: PropTypes.element.isRequired,
  /** El tamaño de fuente del texto */
  fontSize: PropTypes.number,
  /** El tipo de letra */
  fontFamily: PropTypes.string,
  /** Indica el color del texto */
  color: PropTypes.string,
  /** Indica si el texto se mostrara en mayuscula */
  uppercase: PropTypes.bool,
  /** Alineamiento del texto */
  textAlign: PropTypes.oneOf(['auto', 'left', 'right', 'center', 'justify']),
  /** Style generico */
  style: PropTypes.any,
  /** Accion a ejecutar al presionar el boton de menu */
  onPress: PropTypes.func,
};

Text.defaultProps = {
  fontSize: 16,
  fontFamily: 'Roboto-Regular',
  color: 'white',
  uppercase: false,
  style: {},
};

export { Text };
