import React, { Component } from 'react';
import SideMenu from './SideMenu';
import { Appbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { Image, TouchableOpacity, Text, View, Platform, StyleSheet } from 'react-native';
import IconEntypo from 'react-native-vector-icons/Entypo';
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

      <View style={styles.container}>

       <Appbar.Header style={styles.header} >

          {this.props.route.name!='Home' && <Appbar.BackAction onPress={() => { this.props.navigation.goBack() }} />}

          {this.props.route.name=='Home' && <Appbar.Action />}

          <Image style={{ width: 94.91, height: 32.25 }} source={require('../../../assets/images/zivoya.png')} />

          <SideMenu onHide={(value) => this.setState({ confirmationLogOut: value })} visible={this.state.visibleMenu} setSideMenu={this.setSideMenu} applyFilters={this.applyFilters} onSwipeComplete={this.onSwipeComplete} showConfirmationLogOut={this.showConfirmationLogOut} route={this.props.route} ></SideMenu>

          {this.state.confirmationLogOut == true ? <LogOutConfirmation visible={this.state.confirmationLogOut} showConfirmationLogOut={this.showConfirmationLogOut} > </LogOutConfirmation> : null}

          <TouchableOpacity onPress={() => this.setSideMenu(true)} style={{ paddingRight: 15 }} >

            <IconEntypo color={'#F16D2B'} name="menu" size={25} />

          </TouchableOpacity>

        </Appbar.Header>

      </View>
    );


  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header:{
    elevation: 0, 
    shadowOpacity: 0, 
    justifyContent: 'space-between', 
  }
});

const mapStateToProps = state => ({ ...state });

export default connect(mapStateToProps, {
  saveIdAccount,
  continueAsAGuest,
  setLanguage,
  removeNotification,
  setNotification
})(Header);