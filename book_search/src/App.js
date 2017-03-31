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
      // crossDomain: true,
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

  render() {
    return (
      <div>
      <h2>Books Table</h2>
        <SearchBar
          books={this.state.books}
        />
      </div>
    );
  }
}


class BooksTable extends React.Component {
  render() {
    // var res = this.props.books.map((element) => {
    //   return (
    //      <BookNode key={element.id} id={element.id} title={element.title} score={element.score}/>
    //   )
    // });

    var res = [];
    this.props.books.forEach(function(element){
      res.push(<BookNode key={element.id} id={element.id} title={element.title} score={element.score}/>);
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
          <tbody>{res}</tbody>
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
  constructor(props) {
    super(props);
    this.state = {
      books: this.props.books,
      filterText: '',
      filterBooks: [],
    };
  }

  handleUserInput() {
    this.setState({filterText: this.refs.filterTextInput.value});
  }

  componentDidMount() {
    this.setState({table: <BooksTable books={this.props.books}/>});
    console.log('books', this.props.books);
    console.log('table', this.state.table);
  }

  componentWillReceiveProps(nextProps) {
    console.log('component Will Receive Props');
    if (this.props.books !== nextProps.books) {
      this.setState({books: nextProps.books});
      this.filterBooksList();
      this.getTable();
    }
  }

  filterBooksList(){
    $.ajax({
      type: 'POST',
      contentType: 'application/json',
      dataType: 'json',
      url: '/books',
      data:  JSON.stringify({'query': this.refs.filterTextInput.value }),
      success: data => {
        console.log('success post');
        this.setState({filterBooks: data});
        this.getTable();
      },
      error: (xhr, status, err) => {
          console.log('error post', xhr, status, err);
      }
    })
  }

  getTable(){
    if (!this.state.filterText) {
      this.setState({table: <BooksTable books={this.props.books}/>});
    } else {
      this.setState({table: <BooksTable books={this.state.filterBooks}/>});
    };
  }

  render(){
    return (
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={this.props.filterText}
          ref="filterTextInput"
          onChange={this.handleUserInput.bind(this)}
        />
        <button onClick={this.filterBooksList.bind(this)}>Search</button>
        {this.state.table}
      </div>
    );
  }
}


export default App;
