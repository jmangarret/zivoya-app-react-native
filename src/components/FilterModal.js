import React, { Component } from 'react';
import { StyleSheet, View, Image, ScrollView, TouchableOpacity, Platform } from 'react-native';
import I18n from '../utils/i18n';
import { PRIMARY, SECONDARY, GRAY01, DISABLED, GRAY02 } from '../../assets/colors/colors';
import { Text, Button } from './commons';
import Modal from "react-native-modal";
import { List, RadioButton } from 'react-native-paper';
import { connect } from 'react-redux';
import { setFilters } from '../redux/actions/FlightActions';
import { useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import AnimatedButton from './commons/AnimatedButton';

const filterSkull = {
    typeFlightFilter: 'all',
    carrierFilter: 'all',
    stopsFilter: 'anyStops',
    departureTimeFilter: 'all',
    returnTimeFilter: 'all'
};

class FilterModal extends Component {

    state = {
        filters: {
            typeFlightFilter: 'all',
            carrierFilter: this.props.flight.filters.carrier,
            stopsFilter: this.props.flight.filters.stops,
            departureTimeFilter: this.props.flight.filters.departure_time,
            returnTimeFilter: this.props.flight.filters.return_time
        },
        currentAccordion: '',
        modifiedFilterObject: false,
        visible: true
    }

    constructor(props) {
        super(props);
        this.save = this.save.bind(this);
        this.modalHide = this.modalHide.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    /**
     * Renderiza raddiobuttons
     * @param {*} filterValue 
     * @param {*} nameFilter 
     * @param {*} name 
     */
    renderRadioButton(filterValue, nameFilter, name, slim) {
        if (slim) {
            return <View style={{ marginTop: 0, paddingTop: 0, paddingLeft: 10, top: Platform.OS === 'ios' ? -15 : -10, height: 30 }} ><RadioButton.Android onPress={() => { this.updateRadioState(nameFilter, name) }} color={PRIMARY} uncheckedColor={SECONDARY} style={{ marginLeft: 20 }} status={filterValue.toUpperCase() === nameFilter.toUpperCase() ? 'checked' : 'unchecked'} /></View>
        } else {
            return <View style={{ marginTop: 0, paddingTop: 0, paddingLeft: 10, top: -7, height: 30 }} ><RadioButton.Android onPress={() => { this.updateRadioState(nameFilter, name) }} color={PRIMARY} uncheckedColor={SECONDARY} style={{ marginLeft: 20 }} status={filterValue.toUpperCase() === nameFilter.toUpperCase() ? 'checked' : 'unchecked'} /></View>
        }
    }

    /**
     * Actualiza el valor de los raddiobuttons
     * @param {*} value 
     * @param {*} name 
     */
    updateRadioState = async (value, name) => {

        let filters = JSON.parse(JSON.stringify(this.state.filters));

        filters[name] = value;

        this.setState({ filters: filters });

    }

    /**
     * Mantiene expandido un solo acordeon a la vez
     * @param {*} accordion 
     */
    updateAccordion(accordion) {
        if (accordion == this.state.currentAccordion) {
            this.setState({ currentAccordion: '' });
        } else {
            this.setState({ currentAccordion: accordion });
        }
    }

    /**
     * Pone valores por defecto en los filtros
     */
    resetFilters() {

        this.setState({
            filters: JSON.parse(JSON.stringify(filterSkull))
        })

    }

    /**
     * cierra el modal
     */
    save = async () => {

        this.setState({ modifiedFilterObject: true })

        await this.props.setFilters(this.state.filters);

        this.setState({ visible: false })
    }

    closeModal() {
        this.setState({ visible: false })
    }

    /**
     * set variables on the main view
     */
    modalHide() {
        const { route } = this.props;
        if (route.name=== 'FlightResults' && this.state.modifiedFilterObject === true) {
            this.props.applyFilters();
        } else {
            this.props.setFilterModal(false);
        }
    }

    /**
     * crea un boton basado en la vista 
     */
    renderButton(setFilterModal) {
        const { route } = this.props;
        if (route.name=== 'flightSearch') {
            return <AnimatedButton text={I18n.t('save')} action={this.save} height={40} width={130}  ></AnimatedButton>
        } else {
            return <AnimatedButton text={I18n.t('apply')} action={this.save} height={40} width={130}  ></AnimatedButton>
        }

    }

    renderItem(option, nameFilter, filterObj, description) {

        if (description) {
            return (<TouchableOpacity style={{ flex: 1, flexDirection: 'row', color: SECONDARY, backgroundColor: GRAY02, padding: 2 }} onPress={() => this.updateRadioState(option, nameFilter)}>
                {this.renderRadioButton(filterObj, option, nameFilter)}
                <View style={{ flexDirection: "column" }}>
                    <Text style={{ flexDirection: 'column', marginTop: ((nameFilter == 'departureTimeFilter' || nameFilter == 'returnTimeFilter') && option != 'all') ? -3 : 0, paddingTop: Platform.OS === 'ios' ? 0 : 2, color: SECONDARY, fontSize: 14 }}> {I18n.t(option)}</Text>
                    <Text style={{ flexDirection: 'column', paddingTop: Platform.OS === 'ios' ? 0 : 4, color: GRAY01, fontSize: 12 }}> ({I18n.t(description)})</Text>
                </View>
            </TouchableOpacity>)
        } else {
            return (<TouchableOpacity style={{ flex: 1, flexDirection: 'row', color: SECONDARY, backgroundColor: GRAY02, padding: 2 }} onPress={() => this.updateRadioState(option, nameFilter)}>
                {this.renderRadioButton(filterObj, option, nameFilter)}
                <Text style={{ flexDirection: 'column', paddingTop: Platform.OS === 'ios' ? 3 : 2, color: SECONDARY, fontSize: 14 }}> {I18n.t(option)}</Text>
            </TouchableOpacity>)
        }

    }

    render() {
        const { route } = this.props;
        const { setFilterModal } = this.props;

        const { filters, visible } = this.state;

        return (
            <Modal isVisible={visible} animationInTiming={400} onBackButtonPress={this.closeModal} animationOutTiming={800} propagateSwipe={true}
                onSwipeComplete={this.closeModal} style={{ width: '100%', height: '75%', margin: 0, padding: 0, marginTop: Platform.OS === 'ios' ? 220 : 180 }}
                swipeDirection={['down']} coverScreen={true} swipeThreshold={50} onModalHide={this.modalHide} onBackdropPress={this.closeModal} >

                <View style={styles.containerModal}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 5 }} >
                        <View style={{ color: SECONDARY, flexDirection: 'row', justifyContent: 'center' }}>
                            <Text style={{ color: GRAY01, fontFamily: 'zivoya', fontSize: 16, letterSpacing: 0, textAlign: 'center' }} >{'$'} </Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 0 }} >
                        <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                            <Text style={{ flexDirection: 'column', color: PRIMARY, fontFamily: 'zivoya', fontSize: 16, paddingTop: 12, textAlign: 'right' }} >{'%'} </Text>
                            <Text style={{ flexDirection: 'column', paddingTop: Platform.OS === 'ios' ? 10 : 8, color: PRIMARY }}> {I18n.t('filters')}</Text>
                        </View>
                    </View>

                    <ScrollView style={{ height: "66%", marginTop: 5 }} persistentScrollbar={true}>

                        <View style={{ backgroundColor: GRAY02, marginRight: 10, marginLeft: 10, marginBottom: 5, marginTop: 5 }}>

                            <View style={{ flex: 1, color: SECONDARY, backgroundColor: GRAY02, height: 40, padding: 10, paddingLeft: 20 }}>
                                <Text style={{ color: SECONDARY, fontSize: 16 }}>{I18n.t('typeFlightFilter')}</Text>
                            </View>

                            {this.renderItem('all', 'carrierFilter', filters.carrierFilter)}

                            {this.renderItem('airline', 'carrierFilter', filters.carrierFilter)}

                            {this.renderItem('charter', 'carrierFilter', filters.carrierFilter)}

                        </View>

                        <View style={{ backgroundColor: GRAY02, marginRight: 10, marginLeft: 10, marginBottom: 5, marginTop: 5 }}>

                            <View style={{ flex: 1, color: SECONDARY, backgroundColor: GRAY02, height: 40, padding: 10, paddingLeft: 20 }}>
                                <Text style={{ color: SECONDARY, fontSize: 16 }}>{I18n.t('stopsFilter')}</Text>
                            </View>

                            {this.renderItem('anyStops', 'stopsFilter', filters.stopsFilter)}

                            {this.renderItem('noStop', 'stopsFilter', filters.stopsFilter)}

                            {this.renderItem('stop1', 'stopsFilter', filters.stopsFilter)}

                            {this.renderItem('stop2', 'stopsFilter', filters.stopsFilter)}

                        </View>


                        <View style={{ backgroundColor: GRAY02, marginRight: 10, marginLeft: 10, marginBottom: 5, marginTop: 5 }}>

                            <View style={{ flex: 1, color: SECONDARY, backgroundColor: GRAY02, height: 40, padding: 10, paddingLeft: 20 }}>
                                <Text style={{ color: SECONDARY, fontSize: 16 }}>{I18n.t('departureTimeFilter')}</Text>
                            </View>

                            {this.renderItem('all', 'departureTimeFilter', filters.departureTimeFilter, '')}

                            {this.renderItem('earlyMorning', 'departureTimeFilter', filters.departureTimeFilter, 'earlyMorningTime')}

                            {this.renderItem('morning', 'departureTimeFilter', filters.departureTimeFilter, 'morningTime')}

                            {this.renderItem('evening', 'departureTimeFilter', filters.departureTimeFilter, 'eveningTime')}

                            {this.renderItem('night', 'departureTimeFilter', filters.departureTimeFilter, 'nightTime')}

                        </View>

                        <View style={{ backgroundColor: GRAY02, marginRight: 10, marginLeft: 10, marginBottom: 5, marginTop: 5 }}>

                            <View style={{ flex: 1, color: SECONDARY, backgroundColor: GRAY02, height: 40, padding: 10, paddingLeft: 20 }}>
                                <Text style={{ color: SECONDARY, fontSize: 16 }}>{I18n.t('returnTimeFilter')}</Text>
                            </View>

                            {this.renderItem('all', 'returnTimeFilter', filters.returnTimeFilter, '')}

                            {this.renderItem('earlyMorning', 'returnTimeFilter', filters.returnTimeFilter, 'earlyMorningTime')}

                            {this.renderItem('morning', 'returnTimeFilter', filters.returnTimeFilter, 'morningTime')}

                            {this.renderItem('evening', 'returnTimeFilter', filters.returnTimeFilter, 'eveningTime')}

                            {this.renderItem('night', 'returnTimeFilter', filters.returnTimeFilter, 'nightTime')}

                        </View>

                    </ScrollView>

                    <View style={{ flexDirection: 'row', height: 5 }}>
                        <LinearGradient colors={['white', DISABLED]} style={styles.linearGradient}>
                        </LinearGradient>
                    </View>

                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
                        <TouchableOpacity style={styles.resetFilters}
                            onPress={() => this.resetFilters()}>
                            <Text style={{ flexDirection: 'column', paddingTop: Platform.OS === 'ios' ? 10 : 8, color: GRAY01, fontSize: 16 }}> {I18n.t('resetFilters')}</Text>
                        </TouchableOpacity>
                        {this.renderButton(setFilterModal)}

                    </View>
                </View>
            </Modal >
        );
    }
}

const styles = StyleSheet.create({
    containerModal: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        backgroundColor: 'white',
        height: "100%",
        width: "100%",
        flex: 1,
        margin: 0,
        padding: 0
    },
    buttonStyle: {
        color: PRIMARY
    },
    linearGradient: {
        flex: 1
    },
    resetFilters: {
        height: 40,
        width: 120,
        textAlign: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        flexDirection: 'row',
    },
    itemRow: {
        height: 40,
        paddingBottom: 0,
        paddingTop: 0
    },
    itemRowLarge: {
        height: 40,
        paddingBottom: 0
    },
    titleItemRow: {
        color: SECONDARY,
        fontSize: 15,
        top: Platform.OS === 'ios' ? -5 : -7
    },
    titleItemRowSlim: {
        color: SECONDARY,
        fontSize: 15,
        top: Platform.OS === 'ios' ? -8 : -4
    },
    largeDescriptionRow: {
        padding: 0,
        margin: 0,
        top: Platform.OS === 'android' ? -10 : -5
    }
});

const mapStateToProps = state => (
    { ...state }
);

export default connect(mapStateToProps, {
    setFilters
})(FilterModal);
