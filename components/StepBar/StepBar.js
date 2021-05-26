import React, { Component } from 'react';
import { range as _range } from 'lodash';
import PropTypes from 'prop-types';
import Checked from '@static/images/icons/checked.png';
import './StepBar.style.scss';

class StepBar extends Component {
  render() {
    const { active, type = 'clip' } = this.props;
    const styles = _range(4).map((value, ind) => {
      if (ind < active) {
        return 'checked';
      }
      if (ind === active) {
        return 'active';
      }
      return '';
    });

    return (
      <div className="step-list-container">
        <ul className="step-list">
          <li className={styles[0]}>
            <div className="step-list-number">
              <img src={Checked} alt="" />
              <span>1</span>
            </div>
            {type === 'clip' ? (
              <div className="step-list-text">Check Database</div>
            ) : (
              <div className="step-list-text">Choose playlist</div>
            )}
          </li>
          <li className={styles[1]}>
            <div className="step-list-number">
              <img src={Checked} alt="" />
              <span>2</span>
            </div>
            <div className="step-list-text">
              SELECT&nbsp;
              <br />
              TYPE
            </div>
          </li>
          <li className={styles[2]}>
            <div className="step-list-number">
              <img src={Checked} alt="" />
              <span>3</span>
            </div>
            <div className="step-list-text">
              ENTER&nbsp;
              <br />
              METADATA
            </div>
          </li>
          <li className={styles[3]}>
            <div className="step-list-number">
              <img src={Checked} alt="" />
              <span>4</span>
            </div>
            <div className="step-list-text">
              PUBLISH
              <br />
              &nbsp;
            </div>
          </li>
        </ul>
      </div>
    );
  }
}

StepBar.propTypes = {
  active: PropTypes.number.isRequired,
};

export default StepBar;
