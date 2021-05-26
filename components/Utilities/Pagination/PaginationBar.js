import React, { Component } from 'react';
import { Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import PropTypes from 'prop-types';
import './PaginationBar.style.scss';

class PaginationBar extends Component {
  static propTypes = {
    totalItems: PropTypes.number.isRequired,
    pageSize: PropTypes.number.isRequired,
    onSelect: PropTypes.func.isRequired,
    maxPaginationNumbers: PropTypes.number,
    activePage: PropTypes.number,
    paginationProps: PropTypes.shape(),
    firstComponent: PropTypes.node,
    lastComponent: PropTypes.node,
    prevComponent: PropTypes.node,
    nextComponent: PropTypes.node,
  };

  static defaultProps = {
    maxPaginationNumbers: 5,
    activePage: 1,
    paginationProps: {},
    firstComponent: 'First',
    lastComponent: 'Last',
    prevComponent: 'Prev',
    nextComponent: 'Next',
  };

  constructor(props) {
    super(props);
    const { activePage } = this.props;
    this.state = {
      activePage,
      firstPaginationNumber: 8,
    };
    this.pages = this.getNumberOfPages(this.props);
  }

  componentDidMount() {
    const { activePage } = this.state;
    this.handlePaginationNumber(activePage);
  }

  getNumberOfPages = props => {
    const auxPages = props.totalItems / props.pageSize;
    let pages = parseInt(auxPages, 10);
    pages += pages !== auxPages ? 1 : 0;
    return pages;
  };

  paginationItems = firstPaginationNumber => {
    const items = [];
    this.lastPaginationNumber = this.getLastPaginationNumber();
    items.push(this.firstOrLastPagItem('First', 1));
    items.push(this.nextOrPreviousPageItem('Previous', 1, 'l'));
    for (let i = firstPaginationNumber; i <= this.lastPaginationNumber; i += 1) {
      items.push(this.numberedPageItem(i));
    }
    items.push(this.nextOrPreviousPageItem('Next', this.pages, 'r'));
    items.push(this.firstOrLastPagItem('Last', this.pages));
    return items;
  };

  getLastPaginationNumber = () => {
    const { maxPaginationNumbers } = this.props;
    const { firstPaginationNumber } = this.state;
    const minNumberPages = Math.min(this.pages, maxPaginationNumbers);
    return firstPaginationNumber + minNumberPages - 1;
  };

  numberedPageItem = i => {
    const { activePage } = this.state;
    return (
      <PaginationItem
        key={i}
        id={`pagebutton${i}`}
        active={activePage.toString() === i.toString()}
        onClick={this.handleClick}
      >
        <PaginationLink
          href="#"
          onClick={e => {
            e.preventDefault();
          }}
        >
          {i}
        </PaginationLink>
      </PaginationItem>
    );
  };

  nextOrPreviousPageItem = (name, page, direction) => {
    const { prevComponent, nextComponent } = this.props;
    const { activePage } = this.state;
    return (
      <PaginationItem
        key={name}
        disabled={activePage === page}
        onClick={event => this.handleSelectNextOrPrevious(event, direction)}
      >
        <PaginationLink
          href="#"
          onClick={e => {
            e.preventDefault();
          }}
        >
          {name === 'Previous' ? prevComponent || name : nextComponent || name}
        </PaginationLink>
      </PaginationItem>
    );
  };

  firstOrLastPagItem = (name, page) => {
    const event = {
      currentTarget: {
        getAttribute: () => `pagebutton${page}`,
      },
    };
    const { firstComponent, lastComponent } = this.props;
    const { activePage } = this.state;
    return (
      <PaginationItem key={name} disabled={activePage === page} onClick={() => this.handleClick(event)}>
        <PaginationLink
          href="#"
          onClick={e => {
            e.preventDefault();
          }}
        >
          {name === 'First' ? firstComponent || name : lastComponent || name}
        </PaginationLink>
      </PaginationItem>
    );
  };

  handleClick = event => {
    const newActivePage = parseInt(
      event.currentTarget
        .getAttribute('id')
        .split('pagebutton')
        .pop(),
      10,
    );
    const { onSelect } = this.props;
    this.setState({
      activePage: newActivePage,
    });
    this.handlePaginationNumber(newActivePage);
    onSelect(newActivePage);
  };

  handleSelectNextOrPrevious = (event, direction) => {
    const { onSelect } = this.props;
    const { activePage } = this.state;
    if ((direction === 'r' && activePage === this.pages) || (direction === 'l' && activePage === 1)) {
      return;
    }

    const newActivePage = direction === 'r' ? activePage + 1 : activePage - 1;

    this.setState({
      activePage: newActivePage,
    });

    this.handlePaginationNumber(newActivePage);
    onSelect(newActivePage);
    event.stopPropagation();
  };

  handlePaginationNumber = activePage => {
    const { maxPaginationNumbers } = this.props;
    const { firstPaginationNumber } = this.state;
    const distance = Math.floor(maxPaginationNumbers / 2);
    const newFPNumber = activePage - distance;
    const newLPNumber = activePage + distance;
    if (newFPNumber <= distance) {
      if (firstPaginationNumber !== 1) {
        this.setState({
          firstPaginationNumber: 1,
        });
      }
    } else if (newLPNumber <= this.pages) {
      this.setState({
        firstPaginationNumber: newFPNumber,
      });
    } else if (newLPNumber >= this.pages) {
      this.setState({
        firstPaginationNumber: this.pages - maxPaginationNumbers + 1,
      });
    }
  };

  render() {
    const { paginationProps } = this.props;
    const { firstPaginationNumber } = this.state;
    return (
      <Pagination className="justify-content-start" {...paginationProps}>
        {this.paginationItems(firstPaginationNumber)}
      </Pagination>
    );
  }
}

export default PaginationBar;
