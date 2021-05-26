import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TourData from './TourData';
import { ModalFooter } from 'reactstrap';
import { Button } from 'glamorous';

class TourContent extends Component {
  constructor(props) {
    super(props);
    this.setCount = this.setCount.bind(this);
    this.setPage = this.setPage.bind(this);

    this.state = {
      activePage: 0,
      count: 0,
    };
  }

  setCount(count) {
    this.setState({ count });
  }

  setPage({
    target: {
      dataset: { direction },
    },
  }) {
    const { activePage } = this.state;
    this.setState({ activePage: direction === 'next' ? activePage + 1 : activePage - 1 });
  }

  render() {
    const { active, title } = this.props;
    const { activePage, count } = this.state;
    const style = active ? 'tab-pane fade show active' : 'tab-pane fade';

    const paginationVisible = count > 1;

    let pagination = null;

    if (paginationVisible) {
      const back =
        activePage > 0 ? (
          <Button
            role="button"
            data-direction="back"
            className="btn btn-danger"
            onClick={this.setPage}
          >
            Back
          </Button>
        ) : null;
      const next =
        activePage + 1 < count ? (
          <Button
            role="button"
            data-direction="next"
            className="btn btn-danger"
            onClick={this.setPage}
          >
            Next
          </Button>
        ) : null;
      pagination = (
        <ModalFooter className="pr-0 pl-0 border-0">
          <p className="h4 m-0 mr-auto  d-inline-block">{`Step ${activePage + 1} of ${count}`}</p>
          {back}
          {next}
        </ModalFooter>
      );
    }

    return (
      <div className={style}>
        <div className="narrow-container text-muted p-2rem pl-0 all-width">
          <TourData title={title} activePage={activePage} setCountParent={this.setCount} />
        </div>
        {pagination}
      </div>
    );
  }
}

TourContent.propTypes = {
  active: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
};

export default TourContent;
