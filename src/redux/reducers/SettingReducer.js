import moment from 'moment';
import {SET_LANGUAGE, SET_CLASSES} from '../actions/types';

const INITIAL_STATE = {
	selectedLanguage: moment.locale() == 'es-us' ? 'es' : 'en',
	classes: [],
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case SET_LANGUAGE:
			return {
				...state,
				selectedLanguage: action.payload,
			};
		case SET_CLASSES:
			return {
				...state,
				classes: action.payload,
			};
		default:
			return state;
	}
};
