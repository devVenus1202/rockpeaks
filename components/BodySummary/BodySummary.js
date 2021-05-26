import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { truncate as _truncate } from 'lodash/string';

import './BodySummary.style.scss';

export class BodySummary extends Component {
  static propTypes = {
    bodyValue: PropTypes.string,
    bodySummary: PropTypes.string,
    trimLength: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    showMoreButton: PropTypes.bool,
  };

  static defaultProps = {
    bodyValue: null,
    bodySummary: null,
    trimLength: 300,
    showMoreButton: true,
  };

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      isExpanded: 'collapsed',
    };
  }

  toggle() {
    const { isExpanded } = this.state;
    this.setState({
      isExpanded: isExpanded === 'collapsed' ? 'expanded' : 'collapsed',
    });
  }

  render() {
    const { isExpanded } = this.state;
    const { bodyValue, bodySummary, trimLength, showMoreButton } = this.props;

    const bodyStates = {
      collapsed: {
        bodyText:
          bodyValue || _truncate(bodyValue, { length: trimLength }) || '<em>No description.</em>',
        buttonText: 'MORE',
      },
      expanded: {
        bodyText: bodyValue || '<em>No description.</em>',
        buttonText: 'LESS',
      },
    };

    const {
      [isExpanded]: { bodyText, buttonText },
    } = bodyStates;

    const button =      bodyValue && bodyValue.length > trimLength && showMoreButton ? (
      <Button onClick={this.toggle} className="btn-danger btn-sm">
        {buttonText}
      </Button>
      ) : null;

    return (
      <div className="body-summary">
        <div
          className={`text-muted mb-4 ${isExpanded}`}
          dangerouslySetInnerHTML={{ __html: bodyText }}
        />
        {button}
      </div>
    );
  }
}

export default BodySummary;
