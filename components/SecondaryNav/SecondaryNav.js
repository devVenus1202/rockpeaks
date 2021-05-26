import React, { Component, Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Navbar, NavbarBrand, Nav, NavItem, Tooltip } from 'reactstrap';
import { merge, get } from 'lodash';
import { withApollo } from 'react-apollo';

import { ICONS } from '@lib/icons';
import AccountSetting from '@components/AccountSetting';
import EditShow from '@components/Dialogs/EditShow';
import EditClip from '@components/Dialogs/EditClip';
import CurateDialog from '@components/Dialogs/CurateDialog';
import WikiDialog from '@components/Dialogs/WikiDialog';
import TrackDialog from '@components/Dialogs/TrackDialog';
import VitalsDialog from '@components/Dialogs/VitalsDialog';
import EditReview from '@components/Dialogs/EditReview';
import AddToPlaylist from '@components/Dialogs/AddToPlaylist';

import { withContext } from '@components/HOC/withContext';
import { handleClickLink } from '@helpers/routeHelper';
import { decodeHtmlSpecialChars } from '@helpers/stringHelper';

import { auth } from '@helpers/auth';
import Login from '@components/Header/Login';

import Icon from '../Icon';
import DropdownClips from './DropdownClips';
import DropdownDiscs from './DropdownDiscs';
import { setFlagEntity, unsetFlagEntity } from '../../lib/mutations';
import './SecondaryNav.style.scss';

const TooltipButton = props => {
  const [showTooltip, setShowTooltip] = useState(false);
  const { onClick, buttonColor, tooltipLabel, icon, id } = props;
  const handleShowTooltip = () => {
    setShowTooltip(true);
  };
  const handleHideTooltip = () => {
    setShowTooltip(false);
  };
  return (
    <>
      <Button
        onClick={onClick}
        onMouseEnter={handleShowTooltip}
        onMouseLeave={handleHideTooltip}
        id={id}
        className="btn-outline-light"
      >
        <Icon icon={icon} color={buttonColor} />
      </Button>
      <Tooltip
        className="secondary-nav-tooltip"
        placement="bottom"
        target={id}
        isOpen={showTooltip}
        innerClassName="nav-tooltip"
      >
        {tooltipLabel}
      </Tooltip>
    </>
  );
};

TooltipButton.propTypes = {
  onClick: PropTypes.object.isRequired,
  buttonColor: PropTypes.string,
  tooltipLabel: PropTypes.object.isRequired,
};
TooltipButton.defaultProps = {
  buttonColor: '#FFF',
};

class SecondaryNav extends Component {
  state = {
    tooltips: {},
    modalOpened: {},
    message: '',
  };

  static defaultProps = {
    brand: '',
    brandLink: '/',
  };

  static propTypes = {
    brand: PropTypes.string,
    brandLink: PropTypes.string,
    type: PropTypes.string.isRequired,
    nid: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    subNid: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
      .isRequired,
    theme: PropTypes.string.isRequired,
    client: PropTypes.object.isRequired,
    data: PropTypes.object,
    setPlayerStatusId: PropTypes.func.isRequired,
    authentication: PropTypes.object.isRequired,
    reviews: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.login = React.createRef();
  }

  showTooltip = value => () => {
    this.setState(prevState => ({
      tooltips: merge(prevState.tooltips, { [value]: true }),
    }));
  };

  hideTooltip = value => () => {
    this.setState(prevState => ({
      tooltips: merge(prevState.tooltips, { [value]: false }),
    }));
  };

  handleToggleModal = name => () => {
    const { modalOpened } = this.state;

    let nextStatus;
    if (modalOpened.name && modalOpened.status) {
      nextStatus = !modalOpened.status;
    } else {
      nextStatus = true;
    }
    const { authentication } = this.props;
    if (!authentication.isLogin && name !== 'wiki' && name !== 'vitals') {
      this.login.openLogin();
    } else {
      this.setState({
        modalOpened: {
          name,
          status: nextStatus,
        },
      });
    }
  };

  handleSubmit = name => () => {};

  handleTrackingState = async state => {
    const { nid, brand, client } = this.props;
    const handleResponse = res => {
      const errors = get(
        res,
        state ? 'data.flagEntity.errors' : 'data.unflagEntity.errors',
        '',
      );
      if (errors.length === 0) {
        this.setState({ message: `You are tracking this ${brand}` });
      } else {
        this.setState({ message: errors[0] });
      }
    };
    if (state) {
      setFlagEntity(client, nid).then(handleResponse);
    } else {
      unsetFlagEntity(client, nid).then(handleResponse);
    }
  };

  loadIntoPlayer = () => {
    const { setPlayerStatusId } = this.props;

    setPlayerStatusId('disc-player');
  };

  render() {
    const {
      brand,
      brandLink,
      nid,
      subNid,
      artistNid,
      showNid,
      type,
      theme,
      user,
      data,
    } = this.props;
    const userInfo = auth();
    const {
      tooltips,
      modalOpened: { name, status },
      message,
    } = this.state;

    const typeName = type === 'clip' ? 'artists' : `${type}s`;
    const buttonColor = theme === 'dark' ? '#b9c5d8' : '#374355';
    const defaultColor = theme === 'dark' ? '#8293A7' : '#544A3B';

    let { reviews } = this.props;
    reviews = get(reviews, 'entities', []);
    return (
      <div>
        <Navbar className={`secondary-navbar-style theme-${theme}`}>
          <NavbarBrand
            onClick={handleClickLink(typeName, nid, brand)}
            href={brandLink}
          >
            {type === 'disc' && (
              <span className="pr-2">
                <Icon size={20} icon={ICONS.DISC} color={defaultColor} />
              </span>
            )}
            {decodeHtmlSpecialChars(brand)}
          </NavbarBrand>
          {type !== 'disc' && (
            <Nav>
              <DropdownClips
                type={type}
                nid={artistNid || subNid}
                theme={theme}
              />
              <DropdownDiscs nid={nid} type={type} theme={theme} />
            </Nav>
          )}
          <Nav className="push">
            {type === 'clip' && (
              <React.Fragment>
                <NavItem>
                  <TooltipButton
                    onClick={this.handleToggleModal('editclip')}
                    buttonColor={buttonColor}
                    tooltipLabel="Edit Clip"
                    icon={ICONS.PENCIL}
                    id="edit-nav"
                    target="edit-nav"
                  />
                </NavItem>
                <NavItem>
                  <TooltipButton
                    onClick={this.handleToggleModal('addtoplaylist')}
                    buttonColor={buttonColor}
                    tooltipLabel="Add To Playlist"
                    icon={ICONS.ADD_TO_PLAYLIST}
                    id="addplaylist-nav"
                    target="addplaylist-nav"
                  />
                </NavItem>
                {reviews.length === 0 ? (
                  <NavItem>
                    <TooltipButton
                      onClick={this.handleToggleModal('editreview')}
                      buttonColor={buttonColor}
                      // tooltipLabel="Create / Edit Review"
                      tooltipLabel="Edit Description"
                      icon={ICONS.KEYBOARD}
                      id="editreview-nav"
                      target="editreview-nav"
                    />
                  </NavItem>
                ) : (
                  ''
                )}
              </React.Fragment>
            )}
            {type !== 'clip' && type !== 'disc' && (
              <Fragment>
                <NavItem>
                  <TooltipButton
                    onClick={this.handleToggleModal('editshow')}
                    buttonColor={buttonColor}
                    tooltipLabel="Edit"
                    icon={ICONS.KEYBOARD}
                    id="editshow-nav"
                    target="editshow-nav"
                  />
                </NavItem>
                <NavItem>
                  <TooltipButton
                    onClick={this.handleToggleModal('curate')}
                    buttonColor={buttonColor}
                    tooltipLabel="Curate"
                    icon={ICONS.GRADUATION_CAP}
                    id="curate-nav"
                    target="curate-nav"
                  />
                </NavItem>
              </Fragment>
            )}
            {type !== 'disc' && (
              <>
                <NavItem>
                  <TooltipButton
                    onClick={this.handleToggleModal('wiki')}
                    buttonColor={buttonColor}
                    tooltipLabel="Wikipedia"
                    icon={ICONS.WIKIPEDIA}
                    id="wikipedia-nav"
                  />
                </NavItem>
                <NavItem>
                  <TooltipButton
                    onClick={this.handleToggleModal('vitals')}
                    buttonColor={buttonColor}
                    tooltipLabel="Vitals"
                    icon={ICONS.STATS}
                    id="vitals-nav"
                  />
                </NavItem>
              </>
            )}
            {type !== 'clip' && type !== 'disc' && (
              <NavItem>
                <TooltipButton
                  onClick={this.handleToggleModal('track')}
                  buttonColor={buttonColor}
                  tooltipLabel="Track"
                  icon={ICONS.PAW_PRINT}
                  id="track-nav"
                />
              </NavItem>
            )}

            {type === 'disc' && (
              <>
                <NavItem>
                  <TooltipButton
                    onClick={this.handleToggleModal('editdisc')}
                    buttonColor={buttonColor}
                    tooltipLabel="Edit Disc"
                    icon={ICONS.KEYBOARD}
                    id="editdisc-nav"
                    target="editdisc-nav"
                  />
                </NavItem>

                <NavItem>
                  <TooltipButton
                    onClick={this.loadIntoPlayer}
                    buttonColor={buttonColor}
                    tooltipLabel="Load into Player"
                    icon={ICONS.LOADTOPLAYLIST}
                    id="loadtoplaylist-nav"
                    target="loadtoplaylist-nav"
                  />
                </NavItem>
              </>
            )}
            <NavItem>
              <TooltipButton
                onClick={() => {
                  window.location.reload();
                }}
                buttonColor={buttonColor}
                tooltipLabel="Reload"
                icon={ICONS.RELOAD}
                id="redo-nav"
                target="edit-nav"
              />
            </NavItem>
          </Nav>
        </Navbar>
        <div style={{ display: 'none' }}>
          <Login
            theme={theme}
            ref={component => {
              if (component) {
                this.login = component;
              }
            }}
          />
        </div>
        <AccountSetting
          theme={theme}
          isOpen={name === 'account' && status === true}
          onToggle={this.handleToggleModal('account')}
        />
        <EditShow
          theme={theme}
          isOpen={name === 'editshow' && status === true}
          onToggle={this.handleToggleModal('editshow')}
          data={data}
          type={type}
        />
        <EditClip
          theme={theme}
          isOpen={name === 'editclip' && status === true}
          onToggle={this.handleToggleModal('editclip')}
          data={data}
        />
        {(type === 'artist' || type === 'show') && (
          <CurateDialog
            theme={theme}
            isOpen={name === 'curate' && status === true}
            onToggle={this.handleToggleModal('curate')}
            uid={userInfo.user_id}
            nid={nid}
          />
        )}
        <WikiDialog
          theme={theme}
          isOpen={name === 'wiki' && status === true}
          onToggle={this.handleToggleModal('wiki')}
          title={brand}
          type={type}
          nid={type === 'show' ? nid : artistNid}
          user={user}
        />
        <VitalsDialog
          theme={theme}
          isOpen={name === 'vitals' && status === true}
          onToggle={this.handleToggleModal('vitals')}
          title={brand}
        />
        <TrackDialog
          theme={theme}
          isOpen={name === 'track' && status === true}
          brand={brand}
          nid={nid}
          type={type}
          message={message}
          onToggle={this.handleToggleModal('track')}
          onCancel={this.handleToggleModal('track')}
          onSubmit={this.handleSubmit('track')}
          onChangeTrackingState={this.handleTrackingState.bind(this)}
        />
        {reviews.length === 0 ? (
          <EditReview
            isOpen={name === 'editreview' && status === true}
            onToggle={this.handleToggleModal('editreview')}
            theme={theme}
            uid={userInfo.user_id}
            clip={nid}
            data={data}
          />
        ) : (
          ''
        )}
        <AddToPlaylist
          theme={theme}
          isOpen={name === 'addtoplaylist' && status === true}
          onToggle={this.handleToggleModal('addtoplaylist')}
          clip={nid}
          key={nid}
        />
      </div>
    );
  }
}
SecondaryNav.defaultProps = {
  data: {},
};
export default withContext(withApollo(SecondaryNav));
