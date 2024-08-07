import React from 'react';
import PropTypes from 'prop-types';
import { Button, Card as CardPaper } from 'react-native-paper';

const Card = ({
  children, title, subTitle, titleStyle, leftTitle, rightTitle, onCardPress, onCardLongPress,
  primaryActionName, primaryBtnProps,
  secondaryActionName, secondaryBtnProps,
  ...defaultProps
}) => (
  <CardPaper
    onLongPress={onCardLongPress}
    onPress={onCardPress}
    {...defaultProps}
  >
    {(title || subTitle)
    && (
    <CardPaper.Title
      titleStyle={titleStyle}
      subtitleStyle={{ titleStyle }}
      title={title}
      subTitle={subTitle}
      left={leftTitle}
      right={rightTitle}
    />
    )
    }

    <CardPaper.Content style={{ marginBottom: '2%' }}>
      {children}
    </CardPaper.Content>

    {(primaryActionName || secondaryActionName)
      && (
        <CardPaper.Actions style={{ marginLeft: 'auto' }}>
          {primaryBtnProps
            && <Button {...primaryBtnProps}>{primaryActionName}</Button>
          }
          {secondaryBtnProps
            && <Button {...secondaryBtnProps}>{secondaryActionName}</Button>
          }
        </CardPaper.Actions>
      )
    }

  </CardPaper>
);

Card.propsType = {
  /** Children es el contenido que se envia entre tags, en este el contenido de la Card */
  children: PropTypes.any.isRequired,
  title: PropTypes.string,
  titleColor: PropTypes.string,
  subTitle: PropTypes.string,
  /** Alinemiento para el Titulo */
  titleStyle: PropTypes.oneOf(['auto', 'left', 'right', 'center', 'justify']) || PropTypes.string,
  /** Callback que devuelve un elemento React para mostrar en el lado izquierdo. */
  leftTitle: PropTypes.func,
  /** Callback que devuelve un elemento React para mostrar en el lado derecho. */
  rightTitle: PropTypes.fun,
  /** Accion a ejecutar al presionar en la Card */
  onCardPress: PropTypes.func,
  /** Accion a ejecutar al presionar durante mas tiempo en la Card */
  onCardLongPress: PropTypes.func,
  /** Texto del boton de acciones primario */
  primaryActionName: PropTypes.string,
  /** Objeto con las props para el boton de acciones primario */
  primaryBtnProps: PropTypes.shape({
    onPress: PropTypes.func.isRequired,
    color: PropTypes.string
  }),
  /** Texto del boton de acciones secundario */
  secondaryActionName: PropTypes.string,
  /** Objeto con las props para el boton de acciones secundario */
  secondaryBtnProps: PropTypes.shape({
    onPress: PropTypes.func.isRequired,
  }),
}

Card.defaultProps = {
    textAling: 'center'
};

export {Card}
