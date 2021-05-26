import React, { Component } from 'react';
import { Row, Col, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import RateBox from '@components/Utilities/RatingBox';
import { handleClickLink } from '@helpers/routeHelper';
import './CurateContent.style.scss';

class ClipContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  static propTypes = {
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
    show: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
    ranking: PropTypes.number.isRequired,
    date: PropTypes.string.isRequired,
  };

  handleClickMore = () => {
    this.setState(prevState => ({
      expanded: !prevState.expanded,
    }));
  };

  render() {
    const { title, artist, show, artistNid, showNid, body, ranking, date } = this.props;
    const { expanded } = this.state;
    const activeStyle = expanded ? 'expanded' : 'collapsed';

    return (
      <div className="uploaded-file-text clip-content-wrapper">
        <h2 className="clip-title ">{title}</h2>
        <Row>
          <Col lg={7}>
            <h5
              className=" clip-title-link"
              onClick={handleClickLink('artists', artistNid, artist)}
            >
              {artist}
            </h5>
            <h5 className="mb-3  clip-title-link" onClick={handleClickLink('shows', showNid, show)}>
              {show}
            </h5>
          </Col>
          <Col lg={5}>
            <RateBox rating={ranking} value={date} />
          </Col>
        </Row>
        <div className={activeStyle} dangerouslySetInnerHTML={{ __html: body }} />
        <p className="pt-3 mb-4">
          <Button onClick={this.handleClickMore} type="button" color="danger" size="sm">
            More
          </Button>
        </p>
      </div>
    );
  }
}

export default ClipContent;
