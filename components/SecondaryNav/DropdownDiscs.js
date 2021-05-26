import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Link } from '@root/routes.esm';

import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { get as _get } from 'lodash/object';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp, faCaretDown } from '@fortawesome/free-solid-svg-icons';

import ErrorMessage from '@lib/ErrorMessage';
import GET_DISCS from '@graphql/secondaryNav/Discs.graphql';
import { ICONS } from '@lib/icons';
import Spinner from '../Spinner';
import Icon from '../Icon';
import BodySummary from '../BodySummary';

const DiscsList = ({ nid, type, theme }) => {
  const buttonColor = theme === 'dark' ? '#8493a8' : '#374355';
  const field = type === 'clip' ? 'clips.entity.nid' : `clips.entity.${type}.entity.nid`;
  return (
    <Query
      partialRefetch
      fetchPolicy="cache-and-network"
      query={GET_DISCS}
      variables={{
        filter: {
          conditions: [
            {
              field: 'type',
              value: 'disc',
              operator: 'EQUAL',
            },
            {
              field: 'status',
              value: '1',
              operator: 'EQUAL',
            },
            {
              field,
              value: nid,
              operator: 'EQUAL',
            },
          ],
        },
      }}
    >
      {({ error, data, loading }) => {
        if (error) return <ErrorMessage message={`Error! ${error.message}`} />;
        if (loading && !_get(data, 'nodeQuery', false)) {
          return <Spinner className="spinner-empty mt-2 pb-4" />;
        }
        // const {
        //   nodeQuery: { entities },
        // } = data;
        const entities = _get(data, 'nodeQuery.entities', []);

        if (entities.length === 0) {
          return (
            <div className="p-2rem">
              <p>Currently, we have no discs associated with this artist.</p>
            </div>
          );
        }

        return entities.map(entity => {
          const entityId = _get(entity, 'entityId', null);
          const title = _get(entity, 'title', null);
          const clipsCountTotal = _get(entity, 'clipsCountTotal', 0);
          const clipsCountActive = _get(entity, 'clipsCountActive', 0);
          const bodyText = _get(entity, 'body.value', null);
          const placeholderUrl = '@static/images/clip-img-placeholder-alpha.svg';
          const imageUrl = _get(entity, 'legacyImage.url.path', placeholderUrl);
          const clips = _get(entity, 'clips', []);
          const route = `/discs/${entityId}`;

          return (
            <DropdownItem tag="div" key={entityId}>
              <div className="dropdown-discs-card">
                <div className="dropdown-discs-card-header">
                  <a className="btn btn-link btn-add-to-playlist" href="#0">
                    <Icon color={buttonColor} icon={ICONS.ADD_TO_PLAYLIST} />
                  </a>

                  <Link passHref route={route}>
                    <a>
                      <h4 className="mb-0">{title}</h4>
                    </a>
                  </Link>
                </div>
                <div className="dropdown-discs-card-body">
                  <div className="row">
                    <div className="col-xl-8">
                      <BodySummary
                        className="mb-4 mb-xl-5 text-grey-light"
                        bodyValue={bodyText}
                        trimLength={150}
                        showMoreButton={false}
                      />
                      <p>
                        <a className="p-0" href="#0">
                          Total videos:&nbsp;
                          {clipsCountTotal}
                        </a>
                      </p>
                      <p className="mb-4 mb-xl-0">
                        <a className="p-0" href="#0">
                          Active clips:&nbsp;
                          {clipsCountActive}
                        </a>
                      </p>
                    </div>
                    <div className="col-xl-4">
                      <Link passHref route={route}>
                        <a className="dropdown-discs-card-image-link" href="#0">
                          <img
                            className="dropdown-discs-card-image"
                            src={imageUrl}
                            alt={title}
                            onError={e => {
                              e.target.onerror = null;
                              e.target.src = placeholderUrl;
                            }}
                          />
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </DropdownItem>
          );
        });
      }}
    </Query>
  );
};

DiscsList.propTypes = {
  nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOfType([PropTypes.string]).isRequired,
  theme: PropTypes.oneOfType([PropTypes.string]).isRequired,
};

class DropdownDiscs extends Component {
  static propTypes = {
    nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    theme: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false,
      fadeOutClass: '',
    };
  }

  setOpened = () => {
    this.setState({
      dropdownOpen: true,
    });
  };

  setClosed = () => {
    this.setState({ fadeOutClass: 'fadeout' }, () => {
      setTimeout(() => {
        this.setState({
          dropdownOpen: false,
          fadeOutClass: '',
        });
      }, 450);
    });
  };

  toggle() {
    const { dropdownOpen } = this.state;
    if (dropdownOpen) {
      this.setClosed();
    } else {
      this.setOpened();
    }
  }

  render() {
    const { nid, type, theme } = this.props;
    const { dropdownOpen, fadeOutClass } = this.state;
    const buttonColor = theme === 'dark' ? '#8493a8' : '#374355';
    const title = (type === 'clip') ? 'Discs Featuring This Clip' : 'Complete Disc List';
    return (
      <Dropdown
        isOpen={dropdownOpen}
        toggle={this.toggle}
        nav
      >
        <DropdownToggle nav caret className={`${fadeOutClass}`}>
          <Icon color={buttonColor} icon={ICONS.DISC} />
          {title}
          <FontAwesomeIcon
            icon={dropdownOpen && !fadeOutClass ? faCaretUp : faCaretDown}
          />
        </DropdownToggle>
        <DropdownMenu className={`dropdown-discs-menu ${fadeOutClass}`}>
          <DiscsList nid={nid} type={type} />
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default DropdownDiscs;
