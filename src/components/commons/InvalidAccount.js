import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal, SafeAreaView, StyleSheet, View, Image, TouchableHighlight, Platform } from 'react-native'
import { Button, Text } from './index'
import IconFeather from 'react-native-vector-icons/Feather';
import { PRIMARY, SECONDARY } from '../../../assets/colors/colors'
import I18n from '../../utils/i18n'
import { continueAsAGuest } from '../../redux/actions'
import { useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class InvalidAccount extends Component {



    async _continueAsAGuest() {
        const { route } = this.props;
        await this.props.continueAsAGuest(true);

        await AsyncStorage.setItem('id_account', '');
        await AsyncStorage.setItem('email', '');
        await AsyncStorage.setItem('code', '');
        await AsyncStorage.setItem('first_name', '');
        await AsyncStorage.setItem('last_name', '');
        await AsyncStorage.setItem('phone', '');
                
        if (route.name== 'ConfirmBooking') {
            this.props.onAccept()
            Actions.PaymentGuest()

        } else {
            this.props.onAccept()
        }
    }



    render() {

        return (
            <>
                <Modal animationType="slide" transparent visible={this.props.visible}>

                    <SafeAreaView style={{ backgroundColor: 'rgba(0,0,0,0.8)', height: '100%' }}>
                        <View style={{

                        }}>


                            <SafeAreaView style={styles.containerModal}>

                                <View style={{ alignItems: 'center', paddingTop: Platform.OS == 'ios' ? 25 : 0 }}>

                                    <Image style={{ width: 52, height: 52 }} source={require('../../../assets/images/erased-account.png')} />

                                    <View style={{ marginLeft: 15, marginRight: 15, marginTop: 15, marginBottom: 15 }}>
                                        <Text textAlign='center' color={SECONDARY}>{I18n.t('securityText')}</Text>
                                    </View>
                                </View>


                                <View style={{ marginVertical: 10, marginHorizontal: Platform.OS == 'ios' ? 20 : 12 }}>

                                    <TouchableHighlight style={styles.guestButton} onPress={() => { this._continueAsAGuest(); }}>
                                        <View style={{
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',


                                        }}>
                                            <View style={{ marginLeft: 30, marginRight: -15 }} >

                                                <IconFeather color='white' name="user" size={25} />
                                            </View>

                                            <View style={{ marginLeft: -10, marginRight: 35 }} >
                                                <Text style={{ alignSelf: 'center' }} >
                                                    {I18n.t('continueAsAGuest')}

                                                </Text>
                                            </View>
                                            <View />


                                        </View>
                                    </TouchableHighlight>


                                </View>

                                <View style={{ flexDirection: 'row', marginHorizontal: Platform.OS == 'ios' ? 20 : 15, marginTop: 15, marginBottom: 25 }}>
                                    <Text textAlign='center' color={SECONDARY}>{I18n.t('helpText')} <Text textAlign='center' color={PRIMARY}>305 500 2306</Text> </Text>

                                </View>



                            </SafeAreaView>

                        </View>
                    </SafeAreaView>
                </Modal>
            </>
        )
    }

}
const mapStateToProps = state => (
    {
        ...state
    });

export default connect(mapStateToProps, {
    continueAsAGuest
})(InvalidAccount);

const styles = StyleSheet.create({
    containerModal: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        margin: 20,
        marginTop: '15%',
        paddingTop: '6%',
        backgroundColor: 'white'
    },
    guestButton: {
        backgroundColor: SECONDARY,
        justifyContent: 'center',
        borderRadius: 5,
        height: 50,
        elevation: 10,

    },


})

