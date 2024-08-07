/* eslint-disable no-underscore-dangle */
import React, { Component } from 'react';
import { Appbar } from 'react-native-paper';
import SideMenu from './SideMenu';
import { connect } from 'react-redux';
import { Image, TouchableOpacity, Platform, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import I18n from '../../utils/i18n';
import { PRIMARY } from '../../../assets/colors/colors'
import { saveIdAccount, continueAsAGuest, setLanguage, removeNotification, setNotification } from '../../redux/actions';

import LogOutConfirmation from '../../components/commons/LogOutconfirmation';
class Header2 extends Component {

  state = {
    visibleMenu: false,
    confirmationLogOut: false
  }

  constructor(props) {
    super(props);
    this.setSideMenu = this.setSideMenu.bind(this);
    this.onSwipeComplete = this.onSwipeComplete.bind(this);
    this.showConfirmationLogOut = this.showConfirmationLogOut.bind(this);
  }

  setSideMenu(visible, message) {

    this.setState({ visibleMenu: visible, confirmationLogOut: false });

  }

  showConfirmationLogOut(visible) {
    // this.setState({ confirmationLogOut: visible });
  }

  onSwipeComplete() {
    this.setSideMenu(false);
  }

  leftIcon = () => (
    <Icon color={PRIMARY} name="chevron-thin-left" size={25} />
  );


  render() {

    return (

      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['white', 'white']} style={{ height: Platform.OS === 'ios' ? 100 : 60, paddingTop: Platform.OS === 'ios' ? 25 : 5 }}>

        <Appbar.Header style={{ elevation: 0, shadowOpacity: 0, paddingBottom: '-1%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' }} >

          <Appbar.Action icon={this.leftIcon} color={PRIMARY} onPress={() => this.props.onPressBack()} />

          <Image style={{ width: 94.91, height: 32.25 }} source={require('../../../assets/images/zivoya.png')} />

          <SideMenu onHide={(value) => this.setState({ confirmationLogOut: value })} visible={this.state.visibleMenu} setSideMenu={this.setSideMenu} applyFilters={this.applyFilters} onSwipeComplete={this.onSwipeComplete} showConfirmationLogOut={this.showConfirmationLogOut} ></SideMenu>

          {this.state.confirmationLogOut == true ? <LogOutConfirmation visible={this.state.confirmationLogOut} showConfirmationLogOut={this.showConfirmationLogOut} > </LogOutConfirmation> : null}

          <TouchableOpacity onPress={() => this.setSideMenu(true)} style={{ paddingRight: 15 }}              >
            <Text style={{ color: PRIMARY, fontFamily: 'zivoya', fontSize: 32, textAlign: 'right', paddingTop: Platform.OS === 'ios' ? 1 : 0 }} >{':'} </Text>

          </TouchableOpacity>

        </Appbar.Header>
      </LinearGradient>
    );


  }
}

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps, {
  saveIdAccount,
  continueAsAGuest,
  setLanguage,
  removeNotification,
  setNotification
})(Header2);