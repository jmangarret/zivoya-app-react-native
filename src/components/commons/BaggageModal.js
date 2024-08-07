import React, { Component } from 'react';
import { View, StyleSheet, Modal } from 'react-native';
import { connect } from 'react-redux';
import { Button, Text } from './';
import { PRIMARY, SECONDARY, DISABLED, OPTIONAL } from '../../../assets/colors/colors'
import I18n from '../../utils/i18n';
import AnimatedButton from '../commons/AnimatedButton';

class BaggageModal extends Component {

    renderAllowed = (BaggageInfo) => {
        if (Object.keys(BaggageInfo.Allowance).length !== 0 && BaggageInfo.Allowance.Pieces != 0) {
            return (
                <View>
                    <View style={{ marginTop: 20 }}>
                        <Text fontFamily="Roboto-Medium" color={SECONDARY}>{I18n.t('allowed')}</Text>
                        <View style={{ marginTop: 5 }} />
                        <View style={{ flexDirection: 'row' }}>
                            <Text color={SECONDARY} fontFamily="Roboto-Medium">{I18n.t('pieces')}: </Text>
                            <Text color={SECONDARY}>{BaggageInfo.Allowance.Pieces}</Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text color={SECONDARY} fontFamily="Roboto-Medium">{I18n.t('weight')}: </Text>
                            <Text color={SECONDARY}>{I18n.t('upTo')} {BaggageInfo.Allowance.Weight.Kg} Kg </Text>
                        </View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text color={SECONDARY} fontFamily="Roboto-Medium">{I18n.t('size')}: </Text>
                            <Text color={SECONDARY}>{I18n.t('upTo')} {BaggageInfo.Allowance.Measure.Cm} cm </Text>
                        </View>

                    </View>
                </View>
            )
        }
    }

    renderCharge = (BaggageInformation) => {
        if (BaggageInformation.Charge.length != 0) {
            return (
                <View>
                    {BaggageInformation.Charge.map((item, index) => {
                        return (
                            <View key={index} style={{ marginTop: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text fontFamily="Roboto-Medium" color={SECONDARY}>Charge {index + 1}/{BaggageInformation.Charge.length}</Text>
                                    <Text fontFamily="Roboto-Bold" color={OPTIONAL}>{item.Price != null ? `$${item.Price}` : ' '}</Text>
                                </View>
                                <View style={{ marginTop: 5 }} />
                                <View style={{ flexDirection: 'row' }}>
                                    <Text color={SECONDARY} fontFamily="Roboto-Medium">{I18n.t('pieces')}: </Text>
                                    <Text color={SECONDARY}>{item.Pieces}</Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text color={SECONDARY} fontFamily="Roboto-Medium">{I18n.t('weight')}: </Text>
                                    <Text color={SECONDARY}>{I18n.t('upTo')} {item.Weight.Kg} kg </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <Text color={SECONDARY} fontFamily="Roboto-Medium">{I18n.t('size')}: </Text>
                                    <Text color={SECONDARY}>{I18n.t('upTo')} {item.Measure.Cm} cm </Text>
                                </View>
                            </View>
                        )
                    })}
                </View>



            )
        }
    }

    baggageInfo = () => {
        const { BaggageInfo, showBaggage } = this.props;


        if (BaggageInfo != undefined && Object.keys(BaggageInfo).length !== 0 && showBaggage) {
            return (
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginTop: 1 }}>
                            <Text color={SECONDARY} fontSize={20} fontFamily='zivoya'>{'<'} </Text>
                        </View>
                        <Text color={SECONDARY} fontFamily="Roboto-Medium" fontSize={18}>{I18n.t('baggageInfo')}</Text>
                    </View>
                    {this.renderAllowed(BaggageInfo.BaggageInformation)}

                    <View style={styles.lineGray} />

                    {this.renderCharge(BaggageInfo.BaggageInformation)}

                </View>
            )
        }
    }


    fareInfo = () => {
        const { BaggageInfo, showBaggage } = this.props;
        if (!showBaggage && Object.keys(BaggageInfo).length !== 0) {
            return (
                <View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ marginTop: 1 }}>
                            <Text color={SECONDARY} fontSize={20} fontFamily='zivoya'>{'='} </Text>
                        </View>
                        <Text color={SECONDARY} fontFamily="Roboto-Medium" fontSize={18}>{I18n.t('fareDetails')}</Text>
                    </View>

                    <View style={styles.fareInfo}>
                        <View style={{ width: '50%' }}>
                            <Text color={SECONDARY} fontFamily="Roboto-Medium">{I18n.t('fareBase')}: </Text>

                        </View>

                        <View style={{ width: '50%' }}>
                            <Text color={SECONDARY}>{BaggageInfo.fare_basis.name}</Text>

                        </View>

                    </View>

                    <View style={styles.fareInfo}>
                        <View style={{ width: '50%' }}>
                            <Text color={SECONDARY} fontFamily="Roboto-Medium">{I18n.t('bookingClass')}: </Text>
                        </View>

                        <View style={{ width: '50%' }}>
                            <Text color={SECONDARY}>{BaggageInfo.booking_class.name}</Text>
                        </View>

                    </View>
                    <View style={styles.lineGray} />
                    <View style={styles.fareInfo}>
                        <View style={{ width: '50%' }}>
                            <Text color={SECONDARY} fontFamily="Roboto-Medium">{I18n.t('baggageAllowance')}: </Text>
                        </View>

                        <View style={{ width: '50%' }}>
                            <View>
                                {BaggageInfo.baggage_allowance.ADT != undefined ? <Text color={SECONDARY}>{I18n.t('adults')} {BaggageInfo.baggage_allowance.ADT.Weight} {BaggageInfo.baggage_allowance.ADT.WeightMeasureQualifier}</Text> : null}
                                {BaggageInfo.baggage_allowance.CNN != undefined ? <Text color={SECONDARY}>{I18n.t('childs')} {BaggageInfo.baggage_allowance.CNN.Weight} {BaggageInfo.baggage_allowance.CNN.WeightMeasureQualifier}</Text> : null}
                                {BaggageInfo.baggage_allowance.INF != undefined ? <Text color={SECONDARY}>{I18n.t('infants')} {BaggageInfo.baggage_allowance.INF.Weight} {BaggageInfo.baggage_allowance.INF.WeightMeasureQualifier}</Text> : null}
                            </View>
                        </View>

                    </View>
                    <View style={styles.lineGray} />
                    <View style={styles.fareInfo}>
                        <View style={{ width: '50%' }}>
                            <Text color={SECONDARY} fontFamily="Roboto-Medium">{I18n.t('exchange')}: </Text>
                        </View>

                        <View style={{ width: '50%' }}>
                            <Text color={SECONDARY}>{BaggageInfo.fare_rules.VoluntaryChange.Code == 'Forbidden' ? I18n.t('notAllowed') : I18n.t('allowed')} </Text>
                        </View>

                    </View>
                    <View style={styles.lineGray} />
                    <View style={styles.fareInfo} >
                        <View style={{ width: '50%' }}>
                            <Text color={SECONDARY} fontFamily="Roboto-Medium">{I18n.t('refund')}: </Text>
                        </View>

                        <View style={{ width: '50%' }}>
                            <Text color={SECONDARY}>{BaggageInfo.fare_rules.VoluntaryRefund.Code == 'Forbidden' ? I18n.t('notAllowed') : I18n.t('allowed')}</Text>
                        </View>

                    </View>

                </View>

            )
        }
    }

    state = {
        visible: this.props.visible
    }

    cancelAction = () => {
        const { onCancel } = this.props;
        onCancel(this.setState({ visible: false }))
    }

    render() {

        return (

            <Modal
                visible={this.props.visible}
                animationType="slide"
                transparent >
                <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', height: '100%' }}>
                    <View style={styles.containerModal}>
                        <View style={{ marginHorizontal: 20 }}>

                            <View style={{ marginTop: '5%' }} />
                            {this.baggageInfo()}

                            {this.fareInfo()}

                            <View style={{ marginTop: '5%' }} />

                            <View style={{ flexDirection: 'row', justifyContent: 'center', paddingRight: 10, paddingBottom: 10 }} >
                                <AnimatedButton text={I18n.t('ok')} action={this.cancelAction} height={40} width={'90%'}></AnimatedButton>
                            </View>

                        </View>
                    </View>
                </View>
            </Modal>

        )
    }

}

const mapStateToProps = state => ({
    ...state
});

export default connect(
    mapStateToProps,
    {}
)(BaggageModal);

const styles = StyleSheet.create({

    containerModal: {

        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        margin: 20,
        marginTop: '14%',
        marginBottom: '15%',
        backgroundColor: 'white'
    },
    lineGray: {
        width: "100%",
        marginTop: 10,
        marginBottom: 0,
        borderBottomColor: DISABLED,
        borderBottomWidth: 1,

    },
    fareInfo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start',
        marginTop: 10
    }
})

