import React, { Component } from 'react';
import { View, TouchableHighlight, Modal, Alert, Platform } from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/Feather';
import I18n from '../utils/i18n';
import { Button, Text } from '../components/commons';
import { THEME } from '../../assets/colors/colors';
import Calendar from 'react-native-calendario';
import CommunErrors from './commons/errors/CommunErrors';
import AnimatedButton from './commons/AnimatedButton';

export default class DateRangeSelector extends Component {
    constructor(props) {

        super(props);

        this.state = {
            modalVisible: this.props.visible || false,
            hiddenInput: this.props.hiddenInput || false,
            allowPointerEvents: true,
            showContent: false,
            selected: '',
            startDate: moment().add(7, 'days').format('YYYY-MM-DD'),
            startDateTemp: moment().add(7, 'days'),
            endDate: moment().add(14, 'days').format('YYYY-MM-DD'),
            endDateTemp: moment().add(14, 'days'),
            date: new Date(),
            focus: 'startDate',
            currentDate: moment(),
            minDate: moment().add(-1, 'days'),
            startDateRange: moment().add(7, 'days'),
            endDateRange: moment().add(14, 'days'),
            singleDate: moment().add(7, 'days'),
            markedDates: {},
            errorVisible: false,
            errorType: '',
            lang: I18n.currentLanguage()
        };

    }

    componentDidMount() {

        this.setState({
            calendarRange: <Calendar disableOffsetDays={true} locale={I18n.currentLanguage()} monthHeight={340} onChange={this.onDatesChange} theme={themeCalendar} minDate={this.state.minDate} startDate={this.state.startDate} endDate={this.state.endDate} />,
            calendarSingle: <Calendar disableOffsetDays={true} locale={I18n.currentLanguage()} monthHeight={340} onChange={this.onDatesChange} theme={themeCalendar} minDate={this.state.minDate} startDate={this.state.singleDate} disableRange={true} />
        })
    }

    componentWillReceiveProps(nProps) {

        this.setState({
            startDate: nProps.startDate,
            startDateRange: moment(nProps.startDate),
            endDate: nProps.endDate,
            endDateRange: moment(nProps.endDate),
            singleDate: moment(nProps.singleDate),
            calendarRange: <Calendar disableOffsetDays={true} locale={I18n.currentLanguage()} monthHeight={340} onChange={this.onDatesChange} theme={themeCalendar} minDate={this.state.minDate} startDate={nProps.startDate} endDate={nProps.endDate} />,
            calendarSingle: <Calendar disableOffsetDays={true} locale={I18n.currentLanguage()} monthHeight={340} onChange={this.onDatesChange} theme={themeCalendar} minDate={this.state.minDate} startDate={nProps.singleDate} disableRange={true} />
        })

        if (nProps.mode == "range") {
            this.setState({
                startDate: nProps.startDate,
                endDate: nProps.endDate,
                calendarRange: <Calendar disableOffsetDays={true} locale={I18n.currentLanguage()} monthHeight={340} onChange={this.onDatesChange} theme={themeCalendar} minDate={this.state.minDate} startDate={this.state.startDate} endDate={this.state.endDate} />
            });
        } else {
            this.setState({
                //startDate: nProps.startDate,
                singleDate: moment(nProps.singleDate)
            }, function () {
                this.setState({
                    calendarSingle: <Calendar disableOffsetDays={true} locale={I18n.currentLanguage()} monthHeight={340} onChange={this.onDatesChange} theme={themeCalendar} minDate={this.state.minDate} startDate={nProps.singleDate} disableRange={true} />
                });
            });

        }
        //}
        if (this.state.lang != I18n.currentLanguage()) {
            this.setState({
                lang: I18n.currentLanguage(),
                calendarRange: <Calendar disableOffsetDays={true} locale={I18n.currentLanguage()} monthHeight={340} onChange={this.onDatesChange} theme={themeCalendar} minDate={this.state.minDate} startDate={this.state.startDate} endDate={this.state.endDate} />,
                calendarSingle: <Calendar disableOffsetDays={true} locale={I18n.currentLanguage()} monthHeight={340} onChange={this.onDatesChange} theme={themeCalendar} minDate={this.state.minDate} startDate={this.state.singleDate} disableRange={true} />
            })
        } else if (this.props.visible != nProps.visible) {
            this.setState({ modalVisible: nProps.visible })
        }
    }

    isDateBlocked = (date) => {
        if (this.props.blockBefore) {
            return date.isBefore(moment(), 'day');
        } if (this.props.blockAfter) {
            return date.isAfter(moment(), 'day');
        }
        return false;
    }

    onDatesChange = ({ startDate, endDate }) => {
        startDate = startDate || ''
        endDate = endDate || ''
        this.setState({
            startDate: moment(startDate).format('YYYY-MM-DD'),
            endDate: moment(endDate).format('YYYY-MM-DD')
        });
    }

    setModalVisible = (visible) => {

        if (visible) {
            this.setState({ startDateTemp: this.state.startDate, endDateTemp: this.state.endDate });
        }

        this.setState({ modalVisible: visible });
    }


    onConfirm = () => {

        const { onConfirmRange, onConfirmSingle } = this.props;

        if (this.props.mode) {
            if (this.props.mode === 'single') {

                this.setModalVisible(false);

                const fStart = moment(this.state.startDate);

                this.setState({ singleDate: fStart }, function () {

                    this.setState({ calendarSingle: <Calendar disableOffsetDays={true} locale={I18n.currentLanguage()} monthHeight={340} onChange={this.onDatesChange} theme={themeCalendar} minDate={this.state.minDate} startDate={this.state.singleDate} disableRange={true} /> })
                });

                onConfirmSingle(this.state.startDate);


            } else if (this.state.startDate && this.state.endDate && this.state.endDate != "Invalid date") {

                this.setModalVisible(false);

                const fStart = moment(this.state.startDate);

                const fEnd = moment(this.state.endDate);

                this.setState({ startDateRange: fStart, endDateRange: fEnd });

                this.setState({ calendarRange: <Calendar disableOffsetDays={true} locale={I18n.currentLanguage()} monthHeight={340} onChange={this.onDatesChange} theme={themeCalendar} minDate={this.state.minDate} startDate={this.state.startDate} endDate={this.state.endDate} /> })

                onConfirmRange(this.state.startDate, this.state.endDate);

            } else {
                //this.setState({ loading: false, errorVisible: true, errorType: 'noRange' });
                Alert.alert(
                    I18n.t('important'),
                    I18n.t('pickerDates'),
                    [
                        { text: 'OK', onPress: () => { } },
                    ],
                    { cancelable: false }
                )
            }
        }
    }

    onCancel = () =>{
        this.setModalVisible(false); 
        this.setState({ startDate: this.state.startDateTemp, endDate: this.state.endDateTemp }); 
        if (this.props.hiddenInput == true){
            this.props.onClose(false)
        }
    }

    renderButton = () => {
        const { customButton } = this.props;

        if (!customButton) {
            return customButton(this.onConfirm);
        }

        return (
            <View style={{ flexDirection: 'row', marginRight: '5%' }}>
                <AnimatedButton text={I18n.t('cancel')} action={this.onCancel} height={34} width={100} textMode ></AnimatedButton>
                <AnimatedButton text={I18n.t('confirm')} action={this.onConfirm} height={34} width={140}  ></AnimatedButton>
            </View>
        )
    }

    rangeCalender() {
        const { startDateRange, endDateRange, singleDate } = this.state;
        if (this.props.mode === "range") {
            return (<View style={{ alignContent: 'space-between', flexDirection: 'row', backgroundColor: 'transparent', height: 50, margin: 5 }}>

                <View style={{ flex: 1, borderRadius: 5, marginLeft: 5, marginTop: 5, marginBottom: 5, marginRight: 5, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'center' }}>
                    <Icon style={styles.iconCalendar} name="calendar" size={25} />
                    <Text style={styles.textRegular}>{startDateRange.format('MM-DD-YYYY')}</Text>
                </View>

                <View style={{ flex: 1, borderRadius: 5, marginLeft: 0, marginTop: 5, marginBottom: 5, marginRight: 4, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'center' }}>
                    <Icon style={styles.iconCalendar} name="calendar" size={25} />
                    <Text style={styles.textRegular}>{endDateRange.format('MM-DD-YYYY')}</Text>
                </View>

            </View>)
        } if (this.props.mode === "single") {
            return (<View style={styles.inputContainer}>
                <View style={{ flex: 1, borderRadius: 5, margin: 5, backgroundColor: 'white', flexDirection: 'column', justifyContent: 'center' }}>
                    <Icon style={styles.iconCalendar} name="calendar" size={25} />
                    <Text style={{ color: 'black', fontSize: 16, marginLeft: 50, textAlignVertical: 'center', position: 'absolute', }}>{singleDate.format('MM-DD-YYYY')}</Text>
                </View>
            </View>
            )
        }
    }

    render() {
        return (
            <TouchableHighlight
                underlayColor="transparent"
                onPress={() => { this.setModalVisible(true); }}
                style={[{ width: '100%', height: '100%', justifyContent: 'center', opacity: this.props.hiddenInput == true ? 0 : 100 }, this.props.style]} >
                <View>
                    <CommunErrors onConfirm={() => { this.setState({ childWarning: true, errorVisible: false }, () => this.searchFlights()); }} onClose={() => this.setState({ errorVisible: false })} type={this.state.errorType} visible={this.state.errorVisible} />
                    {this.props.hiddenInput == true ? <></> : this.rangeCalender()}

                    <Modal
                        animationType="slide"
                        onRequestClose={() => this.setModalVisible(false)}
                        transparent={false}
                        visible={this.state.modalVisible} >
                        <View stlye={{ flex: 1, flexDirection: 'column' }}>

                            <View style={{ height: '90%', paddingTop: Platform.OS === 'ios' ? 30 : 0 }}>
                                {this.props.mode == 'single' ? this.state.calendarSingle : this.state.calendarRange}
                            </View>
                            <View style={styles.buttonContainer}>
                                {this.renderButton()}
                            </View>
                        </View>
                    </Modal>
                </View>
            </TouchableHighlight>
        );

    }
}

const styles = {
    placeholderText: {
        color: '#c9c9c9',
        fontSize: 15,
    },
    contentInput: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentText: {
        fontSize: 15,
    },
    textThin: {
        fontFamily: THEME.fonts.regular,
        color: 'gray',
        top: 10,
        fontSize: 11,
        left: 10
    },
    textThinRight: {
        fontFamily: THEME.fonts.regular,
        color: 'gray',
        top: 10,
        fontSize: 11,
        left: 10,
        position: 'absolute',
        textAlign: 'left'
    },
    textRegular: {
        color: 'black',
        fontSize: 16,
        marginLeft: 50,
        textAlignVertical: 'center',
        position: 'absolute',
    },
    textRegularRight: {
        textAlign: 'right',
        color: 'black',
        top: 15,
        fontSize: 16,
        left: 30,
        position: 'absolute',
    },
    buttonContainer: {
        width: '100%',
        height: '10%',
        marginRight: '10%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    iconCalendar: {
        marginLeft: 10,
        textAlignVertical: 'center',
        color: THEME.colors.primary,
        zIndex: 1200,
    },
    inputContainer: {
        alignContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: 'transparent',
        height: 50,
        margin: 5
    },
    lineSeparator: {
        borderLeftColor: '#C9C9C9',
        borderLeftWidth: 1
    }

};

const themeCalendar = {
    activeDayColor: {},
    monthTitleTextStyle: {
        color: THEME.colors.primary,
        fontWeight: '300',
        fontSize: 16,
    },
    emptyMonthContainerStyle: {},
    emptyMonthTextStyle: {
        fontWeight: '200',
    },
    weekColumnsContainerStyle: {},
    weekColumnStyle: {
        paddingVertical: 10,
    },
    weekColumnTextStyle: {
        color: '#b6c1cd',
        fontSize: 13,
    },
    startDateContainerStyle: {},
    endDateContainerStyle: {},
    dayContainerStyle: {},
    dayTextStyle: {
        color: 'black',
        fontWeight: '400',
        fontSize: 15,
    },
    dayOutOfRangeContainerStyle: {
    },
    dayOutOfRangeTextStyle: {},
    todayContainerStyle: {},
    todayTextStyle: {
        color: THEME.colors.primary,
    },
    activeDayContainerStyle: {
        backgroundColor: THEME.colors.primary,
    },
    activeDayMiddleContainerStyle: {
        backgroundColor: "#F69C6F",
    },
    activeDayTextStyle: {
        color: 'white',
    },
    nonTouchableLastMonthDayTextStyle: {
    },
};

// module.exports = {
//     DateRangeSelector
// };

