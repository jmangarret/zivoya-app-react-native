import React, {Component} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import { useRoute } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import SplashScreen from 'react-native-splash-screen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {connect} from 'react-redux';
import {getFlights, selectedFly, saveIdAccount, setEmail, setLanguage, setUserData, removeNotification, setFilters, checkAccount, setCode, setNotification, getClasses} from '../../redux/actions';

class SplashScreenView extends React.PureComponent {
	componentDidMount = async () => {
		let cachedPassenger = await AsyncStorage.getItem('cachedState');

		if (cachedPassenger == null || JSON.parse(cachedPassenger).length == 0) {
			cachedPassenger = [];
			cachedPassenger = JSON.stringify(cachedPassenger);
			await AsyncStorage.setItem('cachedState', cachedPassenger);
		}

		const numberAccount = await AsyncStorage.getItem('id_account');

		const email = await AsyncStorage.getItem('email');
		const code = await AsyncStorage.getItem('code');
		const first_name = await AsyncStorage.getItem('first_name');
		const last_name = await AsyncStorage.getItem('last_name');
		const phone = await AsyncStorage.getItem('phone');

		if (email != null && email != '') {
			this.props.setEmail(email);
		}

		if (code != null && code != '') {
			this.props.setCode(JSON.stringify(code));
		}

		const userData = {
			id_account: numberAccount || '',
			email: email || '',
			code: code || '',
			first_name: first_name || '',
			last_name: last_name || '',
			phone: phone || '',
		};

		this.props.setUserData(userData);

		const classesList = await this.props.getClasses();

		SplashScreen.hide();
		setTimeout(() => {
			Actions.replace('flightSearch');
		}, 3000);
	};

	render() {
		let resource = Platform.OS == 'ios' ? require('../../../assets/animation/splash.json') : require('../../../assets/animation/splashAndroid.json');

		return (
			<View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', backgroundColor: '#F16D2B'}}>
				<View style={{flexDirection: 'column', justifyContent: 'center'}}>
					<LottieView style={styles.sizeSpinner} source={resource} autoPlay />
				</View>
			</View>
		);
	}
}

const mapStateToProps = state => ({...state});

export default connect(mapStateToProps, {
	selectedFly,
	saveIdAccount,
	setEmail,
	setLanguage,
	setUserData,
	removeNotification,
	setFilters,
	checkAccount,
	setCode,
	setNotification,
	getClasses
})(SplashScreenView);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white',
	},
	title: {
		fontSize: 32,
		textAlign: 'center',
		fontFamily: 'Quicksand-Light',
	},
	sizeSpinner: {
		width: 120,
		height: 120,
	},
});
