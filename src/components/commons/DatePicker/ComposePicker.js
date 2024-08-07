import React, { Component } from 'react';
import {
  View, TouchableHighlight, Modal, Text
} from 'react-native';
import moment from 'moment';
import Icon from 'react-native-vector-icons/FontAwesome';
import I18n from '../../../utils/i18n';
import DateRange from './DateRange';
import normalize from './normalizeText';
import { Input, Button } from '..';
import { PRIMARY } from '../../../../assets/colors/colors';
import AnimatedButton from '../AnimatedButton';  

const styles = {
  placeholderText: {
    color: '#c9c9c9',
    fontSize: normalize(15),
  },
  contentInput: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentText: {
    fontSize: normalize(15),
  },
};
export default class ComposePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      allowPointerEvents: true,
      showContent: false,
      selected: '',
      startDate: null,
      endDate: null,
      date: new Date(),
      focus: 'startDate',
      currentDate: moment(),
      inputStartDef: moment(),
      inputStart: moment().add(7, 'days'),
      inputStartDate: moment().add(7, 'days'),
      inputEndDate: moment().add(14, 'days'),
    };
  }

  isDateBlocked = (date) => {
    if (this.props.blockBefore) {
      return date.isBefore(moment(), 'day');
    } if (this.props.blockAfter) {
      return date.isAfter(moment(), 'day');
    }
    return false;
  }

  onDatesChange = (event) => {
    const {
      startDate, endDate, focusedInput, currentDate
    } = event;
    if (currentDate) {
      this.setState({ currentDate });
      return;
    }

    this.setState({ ...this.state, focus: focusedInput }, () => {
      this.setState({ ...this.state, startDate, endDate });
    });


  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }


  onConfirm = () => {
    const { onConfirmRange, onConfirmSingle } = this.props;
    const returnFormat = this.props.returnFormat || 'YYYY/MM/DD';
    const outFormat = this.props.outFormat || 'YYYY-MM-DD';
    if (!this.props.mode || this.props.mode === 'single') {
      const start = this.state.currentDate.format(outFormat);
      this.setState({ showContent: true, inputStart: this.state.currentDate, inputStartDef: start });
      onConfirmSingle(this.state);
      this.setModalVisible(false);
      if (typeof this.props.onConfirm === 'function') {
        this.props.onConfirm({ currentDate: this.state.currentDate.format(returnFormat) });
      }
      return;
    }

    if (this.state.startDate && this.state.endDate && (this.state.startDate !== this.state.endDate)) {
      const start = this.state.startDate.format(outFormat);

      const end = this.state.endDate.format(outFormat);



      this.setState({ inputStartDate: this.state.startDate, inputEndDate: this.state.endDate });
      onConfirmRange(this.state);
      this.setModalVisible(false);

      if (typeof this.props.onConfirm === 'function') {
        this.props.onConfirm({ startDate: this.state.startDate.format(returnFormat), endDate: this.state.endDate.format(returnFormat) });
      }
    } else {
      alert('please select correct date');
    }
  }

  getTitleElement(text) {
    const { placeholder, customStyles = {} } = this.props;
    const { showContent } = this.state;
    if (!showContent && placeholder) {
      text = { placeholder };
      return text;
    }

    return (
      <Text style={[styles.contentText, customStyles.contentText]}>
        {this.state.selected}
      </Text>
    );
  }


  renderButton = () => {
    const {
      customButton
    } = this.props;

    if (!customButton) {
      return customButton(this.onConfirm);
    }
    return (
      <View style={{
        flexDirection: 'row', marginRight: '5%'
      }}
      >
        <AnimatedButton text={I18n.t('cancel')} action={() => this.setModalVisible(false)} height={40} width={80} textMode></AnimatedButton>
        <AnimatedButton text={I18n.t('confirm')} action={this.onConfirm} height={40} width={80}></AnimatedButton>
      </View>
    )
  }

  rangeCalender() {
    const { inputEndDate, inputStartDate, inputStart } = this.state;
    if (this.props.mode === "range") {

      return (<View style={{ marginTop: 25, justifyContent: 'space-between', alignContent: 'flex-start', flexDirection: 'row' }}>
        <View style={{ width: '45%' }}>
          <Input disabled value={inputStartDate.format('MM-DD-YYYY')} modeInput="flat" label={I18n.t('departure')} />
          <Icon
            style={{
              position: 'absolute',
              top: 26,
              right: 10,
              color: PRIMARY,
              zIndex: 1200,
            }}
            name="calendar-o"
            size={20}
          />
        </View>
        <View style={{ width: '45%' }}>
          <Input disabled value={inputEndDate.format('MM-DD-YYYY')} modeInput="flat" label={I18n.t('return')} />
          <Icon
            style={{
              position: 'absolute',
              top: 26,
              right: 14,
              color: PRIMARY,
              zIndex: 1200,
            }}
            name="calendar-o"
            size={20}
          />
        </View>
      </View>
      )
    } if (this.props.mode === "single") {
      return (<View style={{ marginTop: 25, justifyContent: 'space-between', alignContent: 'flex-start', flexDirection: 'row' }}>
        <View style={{ width: '100%' }}>
          <Input disabled value={inputStart.format('MM-DD-YYYY')} modeInput="flat" label={I18n.t('departure')} />
          <Icon
            style={{
              position: 'absolute',
              top: 26,
              right: 14,
              color: PRIMARY,
              zIndex: 1200,
            }}
            name="calendar-o"
            size={20}
          />
        </View>

      </View>
      )

    }

  }

  render() {
    const {
      customStyles = {},
    } = this.props;

    const { inputEndDate, inputStartDate, mode } = this.state;

    let style = styles.stylish;
    style = this.props.centerAlign ? { ...style } : style;
    style = { ...style, ...this.props.style };


    return (
      <TouchableHighlight
        underlayColor="transparent"
        onPress={() => { this.setModalVisible(true); }}
        style={[{ width: '100%', height: '100%', justifyContent: 'center' }, style]}
      >
        <View>

          {this.rangeCalender()}

          <Modal
            animationType="slide"
            onRequestClose={() => this.setModalVisible(false)}
            transparent={false}
            visible={this.state.modalVisible}
          >
            <View stlye={{ flex: 1, flexDirection: 'column' }}>
              <View style={{ height: '90%' }}>
                <DateRange
                  headFormat={this.props.headFormat}
                  customStyles={customStyles}
                  markText={this.props.markText}
                  onDatesChange={this.onDatesChange}
                  isDateBlocked={this.isDateBlocked}
                  startDate={this.state.startDate}
                  endDate={this.state.endDate}
                  focusedInput={this.state.focus}
                  selectedBgColor={this.props.selectedBgColor || undefined}
                  selectedTextColor={this.props.selectedTextColor || undefined}
                  mode={this.props.mode || 'single'}
                  currentDate={this.state.currentDate}
                />
              </View>
              <View style={{
                paddingBottom: '5%',
                width: '100%',
                height: '10%',
                marginRight: '10%',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                alignItems: 'center'
              }}
              >
                {this.renderButton()}
              </View>
            </View>
          </Modal>
        </View>
      </TouchableHighlight>
    );
  }
}
