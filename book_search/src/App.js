import React from 'react';
import './App.css';
import $ from 'jquery';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
    };
  }

  getBooksList(){
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: '/books',
      success: data => {
        console.log('success get');
        this.setState({books: data});
      },
      error: (xhr, status, err) => {
          console.log('error get', xhr);
      }
    });
  }

  componentDidMount() {
    this.getBooksList();
  }

  filterBooksList = (query) => {
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: '/books',
      data:  JSON.stringify({'query': query }),
      success: data => {
        console.log('success post');
        this.setState({books: data});
      },
      error: (xhr, status, err) => {
          console.log('error post', xhr, status, err);
      }
    })
  }

  render() {
    return (
      <div>
      <h2>Books Table</h2>
        <SearchBar
          filterBooksList={this.filterBooksList}
        />
        <BooksTable books={this.state.books}/>
      </div>
    );
  }
}


class BooksTable extends React.Component {
  render() {
    var rov = this.props.books.map(function(book) {
      return <BookNode key={book.id} id={book.id} title={book.title} score={book.score}/>;
    });

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Books id</th>
              <th>Title</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>{rov}</tbody>
        </table>
      </div>
    );
  }
}


class BookNode extends React.Component {
  render(){

    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.props.title}</td>
        <td>{this.props.score}</td>
      </tr>
    );
  }
}


class SearchBar extends React.Component{
  handleSearchSubmit() {
    this.props.filterBooksList(this.refs.filterTextInput.value);
  }

  render(){
    return (
      <div>
        <input
          type="text"
          placeholder="Search..."
          ref="filterTextInput"
        />
        <button onClick={this.handleSearchSubmit.bind(this)}>Search</button>
      </div>
    );
  }
}

export default App;
