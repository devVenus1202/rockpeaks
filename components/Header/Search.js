import React, { Component } from 'react';
import Router from 'next/router';
import { Button, Dropdown, DropdownMenu, DropdownToggle, DropdownItem, Input } from 'reactstrap';

import './Search.style.scss';

import LiveResults from './LiveResults';

class Search extends Component {
  constructor(props) {
    super(props);

    this.changeValue = this.changeValue.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
    this.toggleSearch = this.toggleSearch.bind(this);
    this.toggleTypeDropDown = this.toggleTypeDropDown.bind(this);

    this.state = {
      searchValue: '',
      typeDropDownOpen: false,
      typeDropDownValue: 'All',
      searchBoxToggle: false,
    };

    this.textInput = React.createRef();
  }

  componentDidMount() {
    if (this.textInput.current) this.textInput.current.focus();
  }

  componentDidUpdate() {
    if (this.textInput.current) {
      setTimeout(() => {
        this.textInput.current.focus();
      }, 100);
    }
  }

  onTextChange = e => {
    const {
      target: { value },
    } = e;
    this.setState(() => ({
      searchValue: value,
    }));
  };

  formSubmit = e => {
    const { searchValue, typeDropDownValue } = this.state;
    if (searchValue !== '') Router.push(`/browse/${typeDropDownValue.toLowerCase()}/${searchValue}`);
    e.preventDefault();
  };

  toggleTypeDropDown() {
    this.setState(prevState => ({
      typeDropDownOpen: !prevState.typeDropDownOpen,
    }));
  }

  toggleSearch() {
    this.setState(prevState => ({
      searchBoxToggle: !prevState.searchBoxToggle,
    }));
    return false;
  }

  changeValue(e) {
    this.setState({ typeDropDownValue: e.currentTarget.textContent });
  }

  render() {
    const { typeDropDownOpen, typeDropDownValue, searchBoxToggle, searchValue } = this.state;

    const searchBoxStyle = searchBoxToggle ? 'search_active' : 'search_inactive';
    const searchButtonStyle = searchBoxToggle ? 'button_inactive' : 'button_active';
    return (
      <form className="form-search-navbar form-inline my-2 my-lg-0 ml-auto" onSubmit={this.formSubmit}>
        <div className={`input-search-box input-search-box-js ${searchBoxStyle}`}>
          <div className="search-header" />
          <div className="input-search-limitation">
            <Input
              aria-label="Search"
              className="form-control search-input"
              onChange={this.onTextChange.bind(this)}
              placeholder="Search"
              required
              type="search"
              value={searchValue}
              innerRef={this.textInput}
            />

            <div className="input-search-btn-alignment">
              <Dropdown
                className="d-inline-block"
                isOpen={typeDropDownOpen}
                toggle={this.toggleTypeDropDown}
                setActiveFromChild
              >
                <DropdownToggle caret>{typeDropDownValue}</DropdownToggle>
                <DropdownMenu>
                  <DropdownItem onClick={this.changeValue}>All</DropdownItem>
                  <DropdownItem onClick={this.changeValue}>Clips</DropdownItem>
                  <DropdownItem onClick={this.changeValue}>Artists</DropdownItem>
                  <DropdownItem onClick={this.changeValue}>Shows</DropdownItem>
                  <DropdownItem onClick={this.changeValue}>Discs</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Button className="btn btn-outline-secondary btn-search-icon my-2 my-sm-0" type="submit">
                <div className="fa-search fa" />
              </Button>
            </div>
            <div className={`closeButton ${searchBoxStyle}`}>
              <Button
                className="btn-search-close m-2 btn btn-link my-2 my-sm-0 d-none d-lg-inline-block"
                onClick={this.toggleSearch}
              >
                ×
              </Button>
            </div>
          </div>
        </div>
        <Button
          className={`btn btn-outline-secondary btn-search-icon btn-search-open my-2 my-sm-0 ${searchButtonStyle}`}
          onClick={this.toggleSearch}
        >
          <div className="fa-search fa" />
        </Button>
        <LiveResults
          searchBoxToggle={searchBoxToggle}
          searchValue={searchValue.toLowerCase()}
          type={typeDropDownValue}
        />
      </form>
    );
  }
}

export default Search;
