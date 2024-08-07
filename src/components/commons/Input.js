import React from 'react';
import PropTypes from 'prop-types';
import {HelperText, TextInput} from 'react-native-paper';
import {THEME, PRIMARY} from '../../../assets/colors/colors';

const Input = React.forwardRef(
  (
    {
      type,
      label,
      placeholder,
      value,
      modeInput,
      disabled,
      error,
      errorText,
      onChangeText,
      selectionColor,
      underlineColor,
      placeholderColor,
      multiline,
      numberOfLines,
      onFocus,
      onBlur,
      secureTextEntry,
      autoFocus,
      onSubmitEditing,
      ...defaultInputProps
    },
    ref,
  ) => {
    const inputRef = React.useRef();

    React.useImperativeHandle(ref, () => ({
      focus() {
        inputRef.current.focus();
      },
    }));

    return (
      <>
        <TextInput
          keyboardInput={type}
          theme={THEME}
          label={label}
          placeholder={placeholder}
          value={value}
          mode={modeInput}
          disabled={disabled}
          error={error}
          multiline={multiline}
          numberOfLines={numberOfLines}
          secureTextEntry={secureTextEntry}
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={autoFocus}
          onSubmitEditing={onSubmitEditing}
          ref={inputRef}
          onChangeText={text => onChangeText({text})}
          {...defaultInputProps}
        />

        <HelperText theme={THEME} type="error" visible={error}>
          {errorText}
        </HelperText>
      </>
    );
  },
);

Input.propTypes = {
  /** Tipo de input, enum('none', 'sentences', 'words', 'characters') */
  // eslint-disable-next-line react/forbid-prop-types
  type: PropTypes.any,
  /**  Texto que se muestra sobre el input */
  label: PropTypes.string.isRequired,
  /** Texto que se muestra dentro del input * */
  placeholder: PropTypes.string,
  /** Valor del input* */
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.any,
    PropTypes.object,
  ]).isRequired,
  /** Define el modo en que se ve el input. * */
  modeInput: PropTypes.oneOf(['flat', 'outlined']).isRequired,
  /** Desabilita el input * */
  disabled: PropTypes.bool,
  /** Pone en modo error el input. Habilita el style de error* */
  error: PropTypes.bool,
  /** Texto para definir el mensaje de error* */
  errorText: PropTypes.string,
  /** Color que se muestra al seleccionar el input. Por defecto es azul * */
  selectionColor: PropTypes.string,
  /** Color que se muestra en el subrayado el input. Por defecto es azul * */
  underlineColor: PropTypes.string,
  /** Color que se muestra en el placeholder. Por defecto es azul * */
  placeholderColor: PropTypes.string,
  /** Habilita al input a tener multiples lineas. * */
  multiline: PropTypes.bool,
  /** Numero de lineas que puede tener el input. Solo para android * */
  numberOfLines: PropTypes.number,
  /** Pone el input en modo seguro, se visualiza * en lugar del caracter * */
  secureTextEntry: PropTypes.bool,
  /** Funcion que se ejecuta al hacer focus en el input * */
  onFocus: PropTypes.func,
  /** Funcion que se ejecuta al hacer blur en el input  * */
  onBlur: PropTypes.func,
  /** Funcion que se ejecuta cuando cambia el valor del input* */
  style: PropTypes.any,
  onChangeText: PropTypes.func,
  onChange: PropTypes.func,
};

Input.defaultProps = {
  type: null,
  placeholder: '',
  disabled: false,
  error: undefined,
  selectionColor: PRIMARY,
  underlineColor: PRIMARY,
  placeholderColor: PRIMARY,
  multiline: false,
  numberOfLines: 1,
  secureTextEntry: false,
  onFocus: undefined,
  onBlur: undefined,
  errorText: '',
  onChange: undefined,
  style: {backgroundColor: 'white'},
};

export {Input};
