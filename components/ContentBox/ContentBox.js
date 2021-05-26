import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router } from '@root/routes.esm';
import { get as _get, range as _range } from 'lodash';
import { Row, Col } from 'reactstrap';
import { Query } from 'react-apollo';

import { withContext } from '@components/HOC/withContext';

import moment from 'moment';
import GET_NODE_CONTENTS from '@graphql/contents/NodeContents.graphql';
import { getConcatenatedURI } from '@helpers/urlHelper';
import MediaBox from '@components/Medias/MediaBox';
import MediaLoader from '@components/Medias/MediaBox/MediaLoader';
import AddToPlaylist from '@components/Dialogs/AddToPlaylist';

class ContentBox extends Component {
  state = {
    modalOpened: false,
    selectedNid: 0,
  };

  getUncheckedTypes = types => {
    if (types) {
      return Object.keys(types).filter(key => types[key] === false);
    }
    return [];
  };

  handleClickMediaBox = (nid, artist, show, clipTitle) => () => {
    Router.pushRoute(getConcatenatedURI('video', nid, artist, show, clipTitle));
  };

  addToPlaylist = clipId => {
    const { authentication, showLogin } = this.props;
    if (!authentication.isLogin) {
      showLogin();
      return;
    }
    this.setState({ modalOpened: true, selectedNid: clipId });
  };

  handleToggleModal = () => {
    const { modalOpened } = this.state;

    let nextStatus;
    if (modalOpened) {
      nextStatus = !modalOpened;
    } else {
      nextStatus = true;
    }
    this.setState({
      modalOpened: nextStatus,
    });
  };

  renderContents = (momentData, ind) => {
    const { category, types, theme } = this.props;
    const year = momentData.format('YYYY');
    const month = momentData.format('MM');
    const day = momentData.format('D');
    const dateInf = momentData.format('dddd, MMMM DD, YYYY');
    const uncheckedTypes = this.getUncheckedTypes(types);

    const filter = {
      conditions: [
        {
          field: 'field_year',
          value: year.toString(),
          operator: 'EQUAL',
        },
        {
          field: 'field_month',
          value: month.toString(),
          operator: 'EQUAL',
        },
        {
          field: 'field_day',
          value: day.toString(),
          operator: 'EQUAL',
        },
        {
          field: 'status',
          value: true,
          operator: 'EQUAL',
        },
      ],
    };

    if (category !== 'all') {
      filter.conditions.push({
        field: 'type',
        value: category,
        operator: 'EQUAL',
      });
      if (uncheckedTypes.length && category !== 'artist') {
        filter.conditions.push({
          field: `${category}_type`,
          value: uncheckedTypes,
          operator: 'NOT_IN',
        });
      }
    }

    return (
      <Query query={GET_NODE_CONTENTS} variables={{ filter }} key={ind}>
        {({ loading, error, data }) => {
          if (loading) {
            return <ContentLoader />;
          }
          if (error) return '';

          const entities = _get(data, 'nodeQuery.entities', []);
          if (entities.length === 0) {
            return '';
          }

          return entities.map((entity, index) => {
            const imgUrl =              _get(entity, 'legacyImage.url.path', '')
              || _get(entity, 'fieldStillImage.url', '');
            const nid = _get(entity, 'nid', null);
            const artist = _get(entity, 'artist.entity.title', '');
            const artistnid = _get(entity, 'artist.entity.nid', null);
            const show = _get(entity, 'show.entity.title', '');
            const shownid = _get(entity, 'show.entity.nid', null);
            const clipTitle = _get(entity, 'clipTitle', '');

            const data = {
              imgUrl,
              nid,
              artist,
              artistnid,
              show,
              shownid,
              clipTitle,
              dateTime: dateInf,
            };
            return (
              <MediaBox
                onClick={this.handleClickMediaBox(nid, artist, show, clipTitle)}
                data={data}
                key={index}
                onAddPlaylist={this.addToPlaylist}
              />
            );
          });
        }}
      </Query>
    );
  };

  render() {
    const { date, user } = this.props;
    const { modalOpened, selectedNid } = this.state;
    const leftDate = moment(date);
    const rightDate = moment(date);
    return (
      <div className="content-box">
        <Row key="1">
          <Col lg={12} xl={6}>
            <div
              className="content-scroll-box"
              key={leftDate.subtract(1, 'day')}
            >
              {this.renderContents(leftDate, 0)}
              {_range(15).map(num => {
                return this.renderContents(leftDate.subtract(1, 'day'), num);
              })}
            </div>
          </Col>
          <Col lg={12} xl={6}>
            <div
              className="content-scroll-box"
              key={rightDate.subtract(1, 'day')}
            >
              {_range(15).map(num => {
                return this.renderContents(rightDate.add(1, 'day'), num);
              })}
            </div>
          </Col>
        </Row>
        <AddToPlaylist
          isOpen={modalOpened}
          onToggle={this.handleToggleModal}
          clip={selectedNid}
          uid={user.user_id}
        />
      </div>
    );
  }
}
const ContentLoader = withContext(({ theme }) => {
  const loaderPrimaryColor = theme === 'dark' ? '#3d4d65' : '#fff';
  const loaderSecondaryColor = theme === 'dark' ? '#b9c5d8' : '#A5A4A0';
  return (
    <MediaLoader
      primaryColor={loaderPrimaryColor}
      secondaryColor={loaderSecondaryColor}
    />
  );
});

ContentBox.propTypes = {
  date: PropTypes.instanceOf(moment).isRequired,
  category: PropTypes.string.isRequired,
  types: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};

export default withContext(ContentBox);
