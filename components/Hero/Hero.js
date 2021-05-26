import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import Link from 'next/link';
import { Link as ScrollLink, Events, animateScroll as scroll } from 'react-scroll';

import { withContext } from '@components/HOC/withContext';
import chevron from '@static/images/icons/dark/chevron.png';
import chevronLight from '@static/images/icons/light/chevron.png';
import './Hero.style.scss';

class Hero extends Component {
  componentDidMount() {
    Events.scrollEvent.register('begin', () => {});

    Events.scrollEvent.register('end', () => {});
  }

  componentWillUnmount() {
    Events.scrollEvent.remove('begin');
    Events.scrollEvent.remove('end');
  }

  scrollDown = () => {
    scroll.scrollMore(100);
  };

  renderScrollButton = () => {
    const { nextSection, theme } = this.props;

    return (
      <ScrollLink className="btn-next-step" to={nextSection} duration={800} smooth>
        <img src={theme === 'light' ? chevronLight : chevron} alt="" />
      </ScrollLink>
    );
  };

  render() {
    const { bgClass, body, title, url, type, onClick } = this.props;

    let More = null;

    if (!url && onClick) {
      More = (
        <Button className="btn btn-danger section-hero-btn" onClick={onClick}>
          LEARN MORE
        </Button>
      );
    }

    if (url) {
      More = (
        <Link href={url}>
          <a className="btn btn-danger section-hero-btn" href="#">
            LEARN MORE
          </a>
        </Link>
      );
    }

    return (
      <section className={`hero ${bgClass}`} name={title}>
        <div className="container-wrapper">
          <div className="container center-aligned">
            <h2 className="section-title text-shadow-1">{title}</h2>
            <p className="lead text-shadow-1">{body}</p>
            <div className="text-center">{More}</div>
            <div className="text-center">{type && this.renderScrollButton()}</div>
          </div>
        </div>
      </section>
    );
  }
}

Hero.propTypes = {
  bgClass: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
  onClick: PropTypes.func,
  nextSection: PropTypes.string.isRequired,
  type: PropTypes.bool.isRequired,
};

Hero.defaultProps = {
  onClick: null,
  url: null,
};

export default withContext(Hero);
