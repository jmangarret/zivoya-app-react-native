import React, { useEffect } from 'react';
import { Text, Button } from './';
import { View, StyleSheet, TouchableOpacity, Modal, Platform, BackHandler } from 'react-native';
import { PRIMARY, SECONDARY, GRAY02 } from '../../../assets/colors/colors';
import { connect, useState } from 'react-redux';
import moment from 'moment';
import I18n from './../../utils/i18n';
import {
    fullFlightSelected,
    selectedFly,
    getFlights,
    calculatePrice
} from '../../redux/actions'
import Icon from 'react-native-vector-icons/AntDesign';
import AnimatedButton from './AnimatedButton';

const _ModalLeg = (props) => {

    const [mVisibleLeg, setModalVisibleLeg] = React.useState(false);
    const [selectedIndexLeg, setSelectedIndexLeg] = React.useState(0);
    const [selectedLeg, setSelectedLeg] = React.useState(props.selectedLeg);

    useEffect(() => {
        setModalVisibleLeg(props.visible)
        setSelectedLeg(props.selectedLeg)
        setSelectedIndexLeg(props.selectedIndexLeg)
    }, [props.visible]);

    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", backAction);

        return () =>
            BackHandler.removeEventListener("hardwareBackPress", backAction);
    }, []);


    /*hideModalLeg = () => {
        setModalVisibleLeg(false)
    }*/
    backAction = () => {
        console.log("BACK");
    }


    selectedScaleLeg = (index, flight) => {
        setSelectedIndexLeg(index);
        setSelectedLeg(flight)
    }

    connectionTime = (selectedLeg) => {
        if (selectedLeg.ConnectionTime) {
            return (
                <View>
                    <View style={styles.splitLine} />
                    <Text style={{ marginLeft: 15, marginVertical: Platform.OS == 'ios' ? 7 : 0 }} fontSize={12}>
                        {I18n.t('connectionTime')} <Text fontSize={12} fontFamily='Roboto-Bold'>{selectedLeg.ConnectionTime}</Text>
                    </Text>
                </View>
            )
        }
    }

    renderOperatingBy = (leg) => {

        if (leg.OperatingAirline.Code != leg.MarketingAirline.Code) {

            return (
                <View>
                    <Text fontSize={12} style={{ marginLeft: 15, marginVertical: Platform.OS == 'ios' ? 7 : 0 }} >{I18n.t('operatedBy')}{leg.OperatingAirline.Name}</Text>
                    <View style={styles.splitLine} />
                </View>
            )
        } else {
            return true
        }
    }

    setContent = () => {
        return (
            <View style={{ backgroundColor: 'rgba(0,0,0,0.8)', height: '100%' }} >
                <View style={styles.containerModal}>
                    <View style={{
                        marginTop: 30,
                        marginBottom: 15,
                        marginLeft: 15,
                        marginRight: 15
                    }} >
                        <Text fontSize={20} color={SECONDARY}>
                            {I18n.t('stopDetails')}
                        </Text>

                        <View style={{ marginTop: 10, marginBottom: 10 }} />
                        {/* Init scale */}
                        <View style={styles.scaleLine} />
                        <View style={{
                            marginLeft: '3%',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }} >
                            {props.flightDetailsLeg.details.map((flight, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => this.selectedScaleLeg(index, flight)} >
                                    <View key={index}>
                                        <Text
                                            style={
                                                index === selectedIndexLeg
                                                    ? styles.fontSelected
                                                    : styles.fontUnselected
                                            }
                                            fontSize={13}
                                            key={index}
                                            color={SECONDARY} >
                                            {flight.DepartureAirport.LocationCode}
                                        </Text>
                                        <View
                                            style={
                                                index === selectedIndexLeg
                                                    ? styles.circleSelected
                                                    : styles.circleUnselected
                                            }
                                        />
                                        <View
                                            style={index === selectedIndexLeg
                                                ? styles.triangleSelected
                                                : styles.triangleUnelected}
                                        />
                                    </View>
                                </TouchableOpacity>
                            ))}
                            <View>
                                <Text fontSize={13} color={SECONDARY}>
                                    {props.flightDetailsLeg.ArrivalAirport}
                                </Text>
                                <View style={styles.circleDisabled} />
                            </View>
                        </View>

                        <View style={styles.scaleContainer}>
                            <View style={{ marginBottom: 7, marginTop: 9 }}>
                                {this.renderOperatingBy(selectedLeg)}
                            </View>

                            <View
                                style={{
                                    marginLeft: 15,
                                    marginRight: 15,
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    marginBottom: 4,
                                    marginTop: 4
                                }} >
                                <View>
                                    <Text fontSize={12} fontFamily="Roboto-Bold">
                                        {I18n.t('departureDate')}
                                    </Text>
                                    <Text fontSize={12}>
                                        {selectedLeg.origin_iata_airport_code}
                                    </Text>
                                    <Text
                                        color={PRIMARY}
                                        fontFamily="Roboto-Bold"
                                        fontSize={12} >
                                        {moment(selectedLeg.departure_time, 'hh:mm').format(
                                            'hh:mm A'
                                        )}
                                    </Text>
                                </View>

                                <View>
                                    <Text fontSize={12} fontFamily="Roboto-Bold">
                                        {I18n.t('arrival')}
                                    </Text>
                                    <Text fontSize={12}>
                                        {selectedLeg.dest_iata_airport_code}
                                    </Text>
                                    <Text
                                        color={PRIMARY}
                                        fontFamily="Roboto-Bold"
                                        fontSize={12} >
                                        {moment(selectedLeg.arrival_time, 'hh:mm').format('hh:mm A')}
                                    </Text>
                                </View>

                                <View>
                                    <Text fontSize={12} fontFamily="Roboto-Bold">
                                        {selectedLeg.airline_name}
                                    </Text>
                                    <Text fontSize={12}>
                                        {selectedLeg.airline_code}
                                        -
                                        {selectedLeg.flight_number}
                                    </Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Text style={{ color: PRIMARY, marginTop: 3, fontFamily: 'zivoya', fontSize: 13, letterSpacing: 0, textAlign: 'center' }} >{','} </Text>
                                        <View style={{ marginTop: 1 }}>
                                            <Text color={PRIMARY} fontFamily="Roboto-Bold" fontSize={12}>
                                                {selectedLeg.flight_duration}
                                            </Text>
                                        </View>
                                    </View>

                                </View>
                            </View>



                            <View style={{ marginBottom: 9, marginTop: 6 }}>
                                {this.connectionTime(selectedLeg)}
                            </View>
                        </View>

                        <View style={{ marginTop: 10 }} />

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                            <AnimatedButton text={I18n.t('ok')} action={() => props.hideModalLeg()} height={40} width={'40%'}></AnimatedButton>
                    
                        </View>
                    </View>
                </View>
            </View >)
    }

    return (
        <>
            <Modal animationType="slide" transparent visible={mVisibleLeg}>

                {mVisibleLeg ? setContent() : null}

            </Modal>
        </>
    )
};

_ModalLeg.defaultProps = {
    // flightDetailsLeg: {},
    // selectedLeg: {},
    // modalVisibleLeg: false,
    selectedIndexLeg: 0
};

const styles = StyleSheet.create({
    containerModal: {
        marginTop: 60,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        margin: 10,
        backgroundColor: 'white'
    },
    scaleLine: {
        marginLeft: '6%',
        marginRight: '4%',
        width: '90%',
        borderBottomColor: GRAY02,
        borderBottomWidth: 1,
        transform: [{ translateY: 22 }]
    },
    splitLine: {
        width: '100%',
        borderColor: '#5A6977',
        borderWidth: 0.6,
        marginBottom: 3,
        marginTop: 3
    },
    circleSelected: {
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: PRIMARY,
        alignSelf: 'center',
        marginBottom: 5
    },
    triangleSelected: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 6,
        borderRightWidth: 6,
        borderBottomWidth: 8,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: SECONDARY,
        alignSelf: 'center'
    }, circleUnselected: {
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: SECONDARY,
        alignSelf: 'center',
        marginBottom: 5
    },
    circleDisabled: {
        width: 8,
        height: 8,
        borderRadius: 8 / 2,
        backgroundColor: GRAY02,
        alignSelf: 'center',
        marginBottom: 5
    },
    scaleContainer: {
        width: '100%',
        backgroundColor: SECONDARY,
        borderRadius: 5
    },
    fontSelected: {
        color: PRIMARY
    },
    fontUnselected: {
        color: SECONDARY
    }
});

const mapStateToProps = state => (
    { ...state });

const ModalLeg = connect(mapStateToProps, {
    selectedFly,
    getFlights,
    calculatePrice,
    fullFlightSelected
})(_ModalLeg);

export { ModalLeg };