import React, {Component} from 'react';
import {StyleSheet, View, Modal, TouchableOpacity, Animated, TouchableWithoutFeedback} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import {PRIMARY, SECONDARY, GRAY01, GRAY02} from '../../assets/colors/colors';
import I18n from '../utils/i18n';
import {Button, Text} from './commons';
import AnimatedButton from './commons/AnimatedButton';
import { useRoute } from '@react-navigation/native';
import {getClasses} from '../redux/actions';

import {connect} from 'react-redux';
class LoadPassengers extends React.PureComponent {
	constructor(props) {
		super(props);

		this.animatedValue = new Animated.Value(6);
		this.statebk = {};
		this.state = {
			visible: this.props.visible,
			adultCount: 1,
			childCount: 0,
			infantCount: 0,
			adultIncrementDisabled: false,
			childIncrementDisabled: false,
			infantIncrementDisabled: false,
			adultDecrementDisabled: false,
			childDecrementDisabled: true,
			infantDecrementDisabled: true,
			selectedClass: '',
			classObj: {},
			travel_class_id: '1',
			listClass: this.props.settings.classes,
			classDescription: 'Economy',
			classDescription_sp: 'Economico',
		};
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.visible == true) {
			this.statebk = JSON.parse(JSON.stringify(this.state));
		}
	}

	componentWillMount = async () => {
		let classesObj = {};
 
	 

		this.props.settings.classes.forEach((classObj, i) => {
			classesObj[classObj.class_name] = classObj;
			classesObj[classObj.class_name].isSelected = i == 1 ? true : false;
		});

		 
		this.setState({
			classObj: classesObj,
		});
	};

	// Increment adult function
	incrementAdult = () => {
		const {adultCount, infantCount} = this.state;
		this.setState({adultCount: adultCount + 1});
		if (adultCount >= 0) {
			this.setState({adultDecrementDisabled: false});
		}

		if (adultCount === infantCount) {
			this.setState({infantIncrementDisabled: false});
		}

		if (adultCount === 0 && infantCount === 0) {
			this.setState({infantIncrementDisabled: true});
		}

		if (adultCount >= 0 && infantCount === 0) {
			this.setState({infantIncrementDisabled: false});
		}

		if (adultCount >= 9) {
			this.setState({adultIncrementDisabled: true});
		}
	};

	// Decrement adult function
	decrementAdult = () => {
		const {adultCount, infantCount} = this.state;
		if (adultCount > 0) {
			this.setState({adultCount: adultCount - 1});
		}

		if (adultCount === 1) {
			this.setState({adultDecrementDisabled: true, infantDecrementDisabled: true});
		}
		if (adultCount <= infantCount && infantCount != 0) {
			this.setState({infantCount: infantCount - 1});
		}

		if (infantCount <= 0) {
			this.setState({infantDecrementDisabled: true});
		}

		if (adultCount - 1 === 0 && infantCount === 0) {
			this.setState({infantIncrementDisabled: true});
		}
		if (adultCount <= 10) {
			this.setState({adultIncrementDisabled: false});
		}
	};

	// Increment child function
	incrementChild = () => {
		const {childCount} = this.state;
		this.setState({childCount: childCount + 1, childDecrementDisabled: false});

		if (childCount >= 9) {
			this.setState({childIncrementDisabled: true});
		}
	};

	// Decrement child function
	decrementChild = () => {
		const {childCount} = this.state;
		if (childCount > 0) {
			this.setState({childCount: childCount - 1});
		}
		if (childCount <= 1) {
			this.setState({childDecrementDisabled: true});
		}

		if (childCount <= 10) {
			this.setState({childIncrementDisabled: false});
		}
	};

	// Increment infant function
	incrementInfant = () => {
		const {infantCount, adultCount} = this.state;

		if (adultCount - 1 === infantCount) {
			this.setState({infantIncrementDisabled: true});
		} else {
			this.setState({infantIncrementDisabled: false});
		}

		if (infantCount >= 0) {
			this.setState({infantDecrementDisabled: false});
		}

		if (adultCount > infantCount) {
			this.setState({infantCount: infantCount + 1});
		}
	};

	// Decrement infant function
	decrementInfant = () => {
		const {infantCount} = this.state;
		if (infantCount > 0) {
			this.setState({infantCount: infantCount - 1, infantIncrementDisabled: false});
		}
		if (infantCount <= 1) {
			this.setState({infantDecrementDisabled: true});
		}
	};

	close = () => {
		const {onCancel} = this.props;
		this.setState({...this.statebk});
		onCancel(this.setState({visible: false}));
	};

	confirmAction = () => {
		const {onConfirm} = this.props;
		onConfirm(this.state);
	};

	selectClass = () => {};

	animateButton(className) {
		let lc = this.state.classObj;

		Object.keys(lc).forEach(k => {
			lc[k].isSelected = className == k;
		});

		this.setState({
			classObj: lc,
			travel_class_id: lc[className].travel_class_id,
			classDescription: lc[className].description,
			classDescription_sp: lc[className].sp_translation,
		});

		this.setState({ShowToast: true}, () => {
			Animated.timing(this.animatedValue, {
				toValue: 4,
				duration: 1000,
			});
		});
	}

	renderClass(classObj) {
		return (
			<Animated.View style={[styles.animatedContainer, {flex: classObj.isSelected ? this.animatedValue : 1, backgroundColor: classObj.isSelected ? '#2775B7' : '#F5F5F5'}]}>
				<TouchableOpacity onPress={() => this.animateButton(classObj.class_name)}>
					<Text style={{alignSelf: 'center', textAlignVertical: 'center', marginHorizontal: 4}} color={classObj.isSelected ? 'white' : '#2775B7'}>
						{classObj.isSelected ? classObj.description : classObj.class_name}
					</Text>
				</TouchableOpacity>
			</Animated.View>
		);
	}

	renderAllClass() {
		let ar = [];
		for (let [key, value] of Object.entries(this.state.classObj)) {
			let sp = '';
			value.sp_translation.split(' ').forEach(obj => {
				sp += obj[0];
			});
			ar.push(
				<Animated.View key={key} style={[styles.animatedContainer, {flex: value.isSelected ? this.animatedValue : 2, backgroundColor: value.isSelected ? '#2775B7' : '#F5F5F5'}]}>
					<TouchableOpacity onPress={() => this.animateButton(value.class_name)} style={{flex: 1, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
						<Text style={{alignSelf: 'center', textAlignVertical: 'center', marginHorizontal: 5, fontSize: 14, textAlign: 'center'}} color={value.isSelected ? 'white' : '#2775B7'}>
							{value.isSelected ? (I18n.currentLanguage() == 'es' ? value.sp_translation : value.description) : I18n.currentLanguage() == 'es' ? sp : value.class_name}
						</Text>
					</TouchableOpacity>
				</Animated.View>
			);
		}
		return ar;
	}

	render() {
		const {visible, onConfirm, onCancel} = this.props;
		const { route } = this.props;
		const {
			adultCount,
			childCount,
			infantCount,
			adultIncrementDisabled,
			adultDecrementDisabled,
			childDecrementDisabled,
			childIncrementDisabled,
			infantDecrementDisabled,
			infantIncrementDisabled,
		} = this.state;
		return (
			<Modal onRequestClose={() => this.close()} visible={visible} animationType="slide" transparent>
				<View style={{backgroundColor: 'rgba(0,0,0,0.8)', height: '100%'}}>
					<View style={styles.containerModal}>
						<View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 5, paddingTop: 10, paddingBottom: 10}}>
							<Text color={SECONDARY} size={40}>
								{' '}
								{I18n.t('passengers')}
							</Text>
						</View>

						<View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, height: 50}}>
							<View style={{flexDirection: 'column'}}>
								<Text color={SECONDARY}>{I18n.t('adults')}s</Text>
								<Text style={styles.ageInfo} color={GRAY01}>
									{I18n.t('from12Years')}
								</Text>
							</View>

							<View style={{flexDirection: 'column', justifyContent: 'center'}}>
								<View style={{flexDirection: 'row', justifyContent: 'center', textAlignVertical: 'center', alignContent: 'center', paddingLeft: 5, paddingRight: 5}}>
									<TouchableOpacity
										style={[adultDecrementDisabled ? styles.incrementAndDecrementDisabled : styles.incrementAndDecrement]}
										onPress={() => this.decrementAdult()}
										disabled={adultDecrementDisabled}>
										<Icon name="minus" color="white" size={10} />
									</TouchableOpacity>

									<Text color={SECONDARY} style={{fontSize: 35, justifyContent: 'center', alignItems: 'center', paddingLeft: 20, paddingRight: 20}}>
										{adultCount}
									</Text>

									<TouchableOpacity style={styles.incrementAndDecrement} onPress={() => this.incrementAdult()} disabled={adultIncrementDisabled}>
										<Icon name="plus" color="white" size={10} />
									</TouchableOpacity>
								</View>
							</View>
						</View>
						<View style={styles.line} />
						<View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, height: 50, paddingTop: 5}}>
							<View style={{flexDirection: 'column'}}>
								<Text color={SECONDARY}>{I18n.t('childs')}s</Text>
								<Text style={styles.ageInfo} color={GRAY01}>
									{I18n.t('from2To12Years')}
								</Text>
							</View>

							<View style={{flexDirection: 'column', justifyContent: 'center'}}>
								<View style={{flexDirection: 'row', justifyContent: 'center', textAlignVertical: 'center', alignContent: 'center', paddingLeft: 5, paddingRight: 5}}>
									<TouchableOpacity
										style={[childDecrementDisabled ? styles.incrementAndDecrementDisabled : styles.incrementAndDecrement]}
										onPress={() => this.decrementChild()}
										disabled={childDecrementDisabled}>
										<Icon name="minus" color="white" size={10} />
									</TouchableOpacity>

									<Text color={SECONDARY} style={{fontSize: 35, justifyContent: 'center', alignItems: 'center', paddingLeft: 20, paddingRight: 20}}>
										{childCount}
									</Text>

									<TouchableOpacity style={styles.incrementAndDecrement} onPress={() => this.incrementChild()} disabled={childIncrementDisabled}>
										<Icon name="plus" color="white" size={10} />
									</TouchableOpacity>
								</View>
							</View>
						</View>
						<View style={styles.line} />
						<View style={{flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, height: 50, paddingTop: 5}}>
							<View style={{flexDirection: 'column'}}>
								<Text color={SECONDARY}>{I18n.t('infants')}s</Text>
								<Text style={styles.ageInfo} color={GRAY01}>
									{I18n.t('from0to2Years')}
								</Text>
							</View>

							<View style={{flexDirection: 'column', justifyContent: 'center'}}>
								<View style={{flexDirection: 'row', justifyContent: 'center', textAlignVertical: 'center', alignContent: 'center', paddingLeft: 5, paddingRight: 5}}>
									<TouchableOpacity
										style={[infantDecrementDisabled ? styles.incrementAndDecrementDisabled : styles.incrementAndDecrement]}
										onPress={() => this.decrementInfant()}
										disabled={infantDecrementDisabled}>
										<Icon name="minus" color="white" size={10} />
									</TouchableOpacity>

									<Text color={SECONDARY} style={{fontSize: 35, justifyContent: 'center', alignItems: 'center', paddingLeft: 20, paddingRight: 20}}>
										{infantCount}
									</Text>

									<TouchableOpacity
										style={[infantIncrementDisabled ? styles.incrementAndDecrementDisabled : styles.incrementAndDecrement]}
										onPress={() => this.incrementInfant()}
										disabled={infantIncrementDisabled}>
										<Icon name="plus" color="white" size={10} />
									</TouchableOpacity>
								</View>
							</View>
						</View>
						<View style={styles.line} />

						<View style={{flexDirection: 'row', justifyContent: 'flex-start', paddingHorizontal: 5, paddingTop: 25, paddingBottom: 5}}>
							<Text color={SECONDARY} size={40}>
								{' '}
								{I18n.t('classes')}
							</Text>
						</View>

						<View style={{flexDirection: 'row', justifyContent: 'center', paddingHorizontal: 10, paddingTop: 5, paddingBottom: 25}}>{this.renderAllClass()}</View>
						<View style={styles.buttonContainer}>
							<AnimatedButton text={I18n.t('cancel')} action={this.close} height={40} width={100} textMode></AnimatedButton>
							<AnimatedButton text={I18n.t('ok')} action={this.confirmAction} height={40} width={80}></AnimatedButton>
						</View>
					</View>
				</View>
			</Modal>
		);
	}
}

const mapStateToProps = state => ({...state});

export default connect(mapStateToProps, {
	getClasses,
})(LoadPassengers);

const styles = StyleSheet.create({
	animatedContainer: {
		flexDirection: 'column',
		flex: 1,
		backgroundColor: '#2775B7',
		borderRadius: 15,
		height: 35,
		marginHorizontal: 5,
		justifyContent: 'center',
	},
	textClass: {
		alignSelf: 'center',
		textAlignVertical: 'center',
		color: '#F5F5F5',
	},
	containerTextClass: {
		height: 35,
		paddingBottom: 5,
		justifyContent: 'center',
		backgroundColor: '#2775B7',
	},
	containerModal: {
		borderBottomLeftRadius: 10,
		borderBottomRightRadius: 10,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		margin: 20,
		marginTop: '14%',
		marginBottom: '15%',
		backgroundColor: 'white',
		padding: 20,
	},
	ageInfo: {
		color: GRAY01,
		fontSize: 13,
	},
	incrementAndDecrement: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 25,
		height: 25,
		backgroundColor: PRIMARY,
		borderRadius: 25,
		textAlignVertical: 'center',
		alignSelf: 'center',
	},
	incrementAndDecrementDisabled: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 25,
		height: 25,
		backgroundColor: GRAY02,
		borderRadius: 25,
		textAlignVertical: 'center',
		alignSelf: 'center',
	},
	line: {
		borderBottomColor: GRAY02,
		borderBottomWidth: 1,
	},
	buttonOk: {
		width: 80,
	},
	buttonContainer: {
		flexDirection: 'row',
		justifyContent: 'flex-end',
		height: 50,
		marginTop: '5%',
	},
});
