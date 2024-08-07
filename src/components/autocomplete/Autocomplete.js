import React, { Component } from 'react';
import {
  TouchableHighlight, Text, View, StyleSheet, ScrollView
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/Entypo';
import { TextInput } from 'react-native-paper';
import stringScore from 'string-score';
import {
  THEME, PRIMARY, GRAY02, GRAY01
} from '../../../assets/colors/colors';


class AutoComplete extends Component {
  componentDidMount() {

    this.suggestions = this.filterSugestions(
      this.props.suggestions, this.props.value
    );
  }

  componentWillUpdate(nextProps, nextState) {
    this.suggestions = this.filterSugestions(
      nextProps.suggestions, nextProps.value
    );
  }

  getSuggestionText = (suggestion) => {
    if (this.props.suggestionObjectTextProperty) {
      return suggestion[this.props.suggestionObjectTextProperty];
    }

    return suggestion;
  }

  isSimilar = (value, suggestionText) => {
    const suggestionScore = stringScore(
      suggestionText, value, this.props.comparationFuzziness
    );

    return suggestionScore >= this.props.minimumSimilarityScore;
  }

  shouldFilterSuggestions = (newSuggestions, value) => newSuggestions && newSuggestions.length
    && value && !this.selectedSuggestion

  filterSugestions = (newSuggestions, value) => {
    if (!this.shouldFilterSuggestions(newSuggestions, value)) {
      return {};
    }

    return newSuggestions.reduce((suggestions, suggestion) => {
      const suggestionText = this.getSuggestionText(suggestion);

      if (!suggestionText || !this.isSimilar(value, suggestionText)) {
        return suggestions;
      }

      suggestions[suggestionText] = suggestion;
      return suggestions;
    }, {});
  }

  onChangeText = (value) => {
    this.selectedSuggestion = false;

    if (this.props.onChangeText) {
      this.props.onChangeText(value);
    }
  }

  suggestionClick = suggestion => () => {
    this.selectedSuggestion = true;
    this.suggestions = {};
    this.props.onSelect(suggestion);
  }

  renderSuggestions = () => {
    const suggestionTexts = Object.keys(this.suggestions || {});

    if (!suggestionTexts.length) {
      return null;
    }

    return (
      <ScrollView style={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
        <View
        style={this.props.suggestionsWrapperStyle || Styles.suggestionsWrapper}
      >
        {
          suggestionTexts.map((key, index) => (
            <TouchableHighlight
              key={index}
              suggestionText={key}
              activeOpacity={0.6}
              style={this.props.suggestionStyle || Styles.suggestion}
              onPress={this.suggestionClick(this.suggestions[key])}
              underlayColor="white"
            >
              <View style={{ flexDirection: 'row', }}>
                <Icon
                  name="location-pin"
                  top={50}
                  size={30}
                  style={{ paddingLeft: 5, marginRight: 5}}
                />
                <View style={{ flexDirection: 'column' }}>
                  <Text style={Styles.principalText}>
               {key}
             </Text>
                  <Text style={Styles.secondaryText}>
               {this.suggestions[key].airport}
             </Text>
                </View>
              </View>
            </TouchableHighlight>
          ))
        }
      </View>

      </ScrollView>
    );
  }

  render() {
    return (
      <View style={this.props.style || Styles.wrapper}>
        <TextInput
          theme={THEME}
          {...this.props}
          onChangeText={this.onChangeText}
          style={this.props.inputStyle || Styles.input}
          autoFocus
        />

        {this.renderSuggestions()}
      </View>
    );
  }
}

AutoComplete.propsType = {
  suggestions: PropTypes.array,
  value: PropTypes.string,
  minimumSimilarityScore: PropTypes.number,
  comparationFuzziness: PropTypes.number,
  suggestionObjectTextProperty: PropTypes.string,
  onChangeText: PropTypes.func,
  onSelect: PropTypes.func.isRequired,
  suggestionsWrapperStyle: PropTypes.any,
  suggestionStyle: PropTypes.any,
  suggestionTextStyle: PropTypes.any,
  style: PropTypes.any,
  inputStyle: PropTypes.any,
  onRef: PropTypes.func
};

AutoComplete.defaultProps = {
  minimumSimilarityScore: 0.6,
  comparationFuzziness: 0.5
};

const Styles = StyleSheet.create({
  suggestionsWrapper: {
    marginTop: 20,
    marginBottom: 20,
    height: '100%'
  },
  suggestion: {
    width: '100%',
    height: 60,
    padding: 5,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  suggestionText: {
    fontSize: 15
  },
  input: {
    fontSize: 15
  },
  wrapper: {
    flex: 1,
  },
  principalText: {
    fontFamily: 'Roboto-Bold',
    fontSize: 16,
    color: 'black'
  },
  secondaryText: {
    fontFamily: 'Roboto-Regular',
    fontSize: 12,
    color: GRAY01
  }
});


export default AutoComplete;
