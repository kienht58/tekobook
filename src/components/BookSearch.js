import React, {Component} from 'react'
import {Link} from 'react-router-dom'
import Autosuggest from 'react-autosuggest'

function escapeRegexCharacters(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getSuggestions(arr, value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('\\b' + escapedValue, 'i');

  var suggestion_name = arr.filter(item => regex.test(getSuggestionName(item)))
  var suggestion_author = arr.filter(item => regex.test(getSuggestionAuthor(item)))
  var suggestion_isbn = arr.filter(item => regex.test(getSuggestionISBN(item)))

  return suggestion_name.concat(suggestion_author, suggestion_isbn)
}

function getSuggestionName(suggestion) {
  return suggestion.name
}

function getSuggestionAuthor(suggestion) {
  return suggestion.author
}

function getSuggestionISBN(suggestion) {
  return suggestion.isbn
}

function renderSuggestion(suggestion, { query }) {
  const id = suggestion.id
  const name = suggestion.name
  const author = suggestion.author
  const cover = suggestion.cover
  const isbn = suggestion.isbn

  return (
    <Link to={'/tekobook/book/' + id} className='row suggestion-content'>
      <div className="cover col-xs-3 col-md-4 col-lg-4">
        <img src={cover} alt="book author"/>
      </div>
      <div className="book-info col-xs-9 col-md-8 col-lg-8">
        <h4>{name}</h4>
        <h5>{author}</h5>
        <p>{isbn}</p>
      </div>
  </Link>
  );
}

class BookSearch extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: [],
      dataSource: []
    };
  }

  onChange = (event, { newValue, method }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(this.state.dataSource, value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  onSuggestionSelected = () => {
      this.setState({
          value: ''
      })
  }

  componentWillReceiveProps(nextProps) {
    var books = nextProps.books
    if(this.state.dataSource !== books) {
      this.setState({
        dataSource: books
      })
    }
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: "Nhập tên sách, tên tác giả, vv ...",
      value,
      onChange: this.onChange
    };

    return (
      <div className="wow">
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
          onSuggestionsClearRequested={this.onSuggestionsClearRequested}
          onSuggestionSelected={this.onSuggestionSelected}
          getSuggestionValue={getSuggestionName}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps} />
      </div>
    );
  }
}

export default BookSearch