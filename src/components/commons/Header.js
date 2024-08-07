import React, { Component } from 'react';
import SideMenu from './SideMenu';
import { Appbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { Image, TouchableOpacity, Text, View, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import LinearGradient from 'react-native-linear-gradient';
import I18n from '../../utils/i18n';
import { saveIdAccount, continueAsAGuest, setLanguage, removeNotification, setNotification } from '../../redux/actions';
import LogOutConfirmation from '../../components/commons/LogOutconfirmation';
class Header extends Component {

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

  render() {

    return (

      <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={['white', 'white']} style={{ height: Platform.OS === 'ios' ? 100 : 60, paddingTop: Platform.OS === 'ios' ? 25 : 5 }}>

        <Appbar.Header style={{ elevation: 0, shadowOpacity: 0, paddingBottom: '-1%', flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'white' }} >

          <Appbar.Action />

          <Image style={{ width: 94.91, height: 32.25 }} source={require('../../../assets/images/zivoya.png')} />
          {/* onClose={() => this.setState({ confirmationLogOut: true })} */}

          <SideMenu onHide={(value) => this.setState({ confirmationLogOut: value })} visible={this.state.visibleMenu} setSideMenu={this.setSideMenu} applyFilters={this.applyFilters} onSwipeComplete={this.onSwipeComplete} showConfirmationLogOut={this.showConfirmationLogOut} ></SideMenu>


          {this.state.confirmationLogOut == true ? <LogOutConfirmation visible={this.state.confirmationLogOut} showConfirmationLogOut={this.showConfirmationLogOut} > </LogOutConfirmation> : null}

          <TouchableOpacity onPress={() => this.setSideMenu(true)} style={{ paddingRight: 15 }} >

            <Text style={{ backgroundColor: 'white', color: "#F16D2B", fontFamily: 'zivoya', fontSize: 32, textAlign: 'right', paddingTop: Platform.OS === 'ios' ? 1 : 0 }} >{':'} </Text>

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
})(Header);