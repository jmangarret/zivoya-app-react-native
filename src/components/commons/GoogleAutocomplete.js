import React from 'react';
import { View, Image } from 'react-native';
import { GooglePlacesAutocomplete } from '../autocomplete/GooglePlacesAutocomplete';
import I18n from '../../utils/i18n';

const GooglePlacesInput = props => (
	<GooglePlacesAutocomplete

		{...props}


		getDefaultValue={() => ''}
		value={props.value}
		cleanCache={props.cleanCache}
		query={{
			// available options: https://developers.google.com/places/web-service/autocomplete
			key: 'AIzaSyAIvUqecwYM5ERpUGHFYbgDbfXkbZ-ALrI',
			libraries: 'places',
			language: 'en',
			types: 'address'
		}}

		styles={[{
			textInputContainer: {
				width: '100%'
			},
			description: {
				fontWeight: 'bold'
			},
			predefinedPlacesDescription: {
				color: '#1faadb'
			}
		}, props.styles]}
		suppressDefaultStyles={true}

		enablePoweredByContainer={false}

		currentLocation={false} // Will add a 'Current location' button at the top of the predefined places list
		currentLocationLabel="Current location"
		nearbyPlacesAPI="GooglePlacesSearch" // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
		GoogleReverseGeocodingQuery={{
			// available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
		}}
		GooglePlacesSearchQuery={{
			// available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
			rankby: 'distance',
			types: 'food'
		}}

		filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities

		debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.


	/>
);

export { GooglePlacesInput };
