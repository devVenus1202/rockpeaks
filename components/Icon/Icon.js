import React from 'react';
import PropTypes from 'prop-types';
import './Icon.style.scss';

const Icon = props => {
  const { icon, color, size } = props;

  const styles = {
    svg: {

    },
    path: {
      fill: color,
    },
  };

  const iconArr = (Array.isArray(icon)) ? icon : [icon];
  const paths = iconArr.map((icon, index) => (
    <path style={styles.path} d={icon} key={index} />
  ));

  return (
    <svg
      className="icon"
      style={styles.svg}
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 1024 1024"
    >
      {paths}
    </svg>
  );
};

Icon.propTypes = {
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  size: PropTypes.number,
  color: PropTypes.string,
};

Icon.defaultProps = {
  color: '#fffff',
  size: 16,
};

export default Icon;
