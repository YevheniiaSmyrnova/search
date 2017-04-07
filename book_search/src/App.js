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

  componentDidMount() {
    this.getBooksList();
  }

  getBooksList = () => {
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
        this.setState({books: []});
      }
    })
  }
  
  render() {
    var table = null;
    if (this.state.books.length) {
      table = <BooksTable books={this.state.books}/>;
    } else {
      table = <p>Books not found =(</p>;
    }

    return (
      <div>
      <h2>Books Table</h2>
        <SearchBar
          getBooksList={this.getBooksList}
          filterBooksList={this.filterBooksList}
        />
        {table}
      </div>
    );
  }
}


class SearchBar extends React.Component{
  handleSearchSubmit() {
    if (this.refs.filterTextInput.value) {
      this.props.filterBooksList(this.refs.filterTextInput.value);
    } else {
      this.props.getBooksList();
    }
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


class BooksTable extends React.Component {
  render() {
    var scoreTitle = null;
    var rov = this.props.books.map(function(book) {
      if (book.score) {
        scoreTitle = <th>Score</th>;
      }
      return <BookNode key={book.id} id={book.id} title={book.title} score={book.score}/>;
    });

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Books id</th>
              <th>Title</th>
              {scoreTitle}
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
    var scoreBody = null;
    if (this.props.score) {
      scoreBody = <td>{this.props.score}</td>;
    }


    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.props.title}</td>
        {scoreBody}
      </tr>
    );
  }
}


export default App;
