import React, { Component } from 'react';
import { StyleSheet, View, Modal, Image } from 'react-native';
import I18n from '../../utils/i18n';
import Icon from 'react-native-vector-icons/Feather';
import { PRIMARY, SECONDARY, GRAY01, DISABLED } from '../../../assets/colors/colors';
import { Text, Input, Button } from './';
import AnimatedButton from '../../components/commons/AnimatedButton';

const regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;

export default class EditInputModal extends Component {
    state = {
        visible: this.props.visible,

        emailInput: {
            value: '',
            errorformat: '',
            error: false,
            message: ''
        }
    }

    /**
    * Valida los inputs de contraseñas
    * @param {string} text valor a validar
    * @param {string} field nombre del input
    */
    checkEmail(text, field) {

        const testText = !regEmail.test(text);

        const message = testText ? I18n.t('invalidEmail') : '';

        const obj = {
            value: text,
            errorformat: testText,
            error: testText,
            message: message
        }

        this.setState({ [field]: { ...obj } });
    }

    render() {

        const { visible } = this.props;
        const { emailInput } = this.state;

        return (
            <Modal visible={visible} animationType="slide" transparent >
                <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', height: '100%' }}>
                    <View style={styles.containerModal}>
                        <View style={{ marginTop: 20, flexDirection: 'row', justifyContent: 'center' }}>
                            <Icon style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', color: DISABLED }} name="mail" size={60} />
                        </View>
                        <View style={{ marginTop: 10, marginBottom: 15, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text fontSize={16} style={{ color: SECONDARY }} >{I18n.t('setNewEmailLabel')}</Text>
                        </View>
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                            <Input
                                ref="refEmail"
                                label={I18n.t('email')}
                                error={emailInput.error}
                                errorText={emailInput.message}
                                value={emailInput.value}
                                modeInput="flat"
                                onChangeText={event => this.checkEmail(event.text, "emailInput")}
                            />
                        </View>
                        <View style={{ marginTop: 5, marginBottom: 15, flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <AnimatedButton text={I18n.t('cancel')} action={() => this.props.hideModalLeg()} height={40} width={'40%'}></AnimatedButton>
                            <AnimatedButton text={I18n.t('ok')} action={() => this.props.setNewValue(emailInput.value)} height={40} width={'40%'}></AnimatedButton>
                        </View>
                    </View>
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    containerModal: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        margin: 20,
        marginTop: '15%',
        backgroundColor: 'white'
    },
    buttonStyle: {
        color: PRIMARY
    }
});