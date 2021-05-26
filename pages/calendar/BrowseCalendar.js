import React from 'react';
import PropTypes from 'prop-types';
import { Router } from '@root/routes.esm';
import moment from 'moment';
import { Row, Col, Container } from 'reactstrap';
import App from '@components/App';
import ContentSelectPanel from '@components/ContentSelectPanel';
import DatePicker from '@components/DatePicker';
import TypeBox from '@components/TypeBox';
import DateSwitch from '@components/DateSwitch';
import DatePagination from '@components/DatePagination';
import ContentBox from '@components/ContentBox';
import { getMomentFromDate } from '@helpers/dateTimeHelper';

import './Browse.style.scss';

class BrowseCalendar extends React.Component {
  static propTypes = {
    url: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      category: 'clip',
      types: {},
    };
  }

  onChangeDate = curMoment => {
    Router.pushRoute(`/browse/calendar?date=${curMoment.format('YYYYMMDD')}`);
  };

  onSelectCategory = category => {
    this.setState({ category });
  };

  onChangeView = view => () => {
    if (view === 'table') {
      Router.pushRoute('/browse');
    }
  };

  onChangeTypes = types => {
    this.setState({ types });
  };

  render() {
    const { category, types } = this.state;

    const {
      url: {
        query: { date },
      },
      authentication: {
        userInfo: { themeState },
      },
    } = this.props;

    let curMoment = getMomentFromDate(date);

    if (!curMoment) {
      curMoment = moment();
    }

    const dataSwitchValue = curMoment.format('MMMM Do YYYY');

    return (
      <App pageClass="browse-page" page="browse">
        <ContentSelectPanel
          category={category}
          view="calendar"
          onSelectCategory={this.onSelectCategory}
          onChangeView={this.onChangeView}
        />
        <div className="section pb-0 browse-section-style">
          <Container>
            <Row className="flex-lg-nowrap">
              <Col className="fixed-col col-md-auto" style={{ 'padding-bottom': '30px' }}>
                <Row noGutters style={{ height: '100%' }}>
                  <Col className="left-col" sm={12} style={{ height: '100%' }}>
                    <DatePicker value={moment(curMoment)} onChange={this.onChangeDate} onChoose={this.onChangeDate} />
                  </Col>
                </Row>
              </Col>
              <Col className="overflow-hidden" style={{ 'min-width': '320px' }}>
                <DateSwitch value={dataSwitchValue} theme={themeState} />
                <DatePagination value={moment(curMoment)} onChange={this.onChangeDate} count={15} />
                <ContentBox date={moment(curMoment)} category={category} types={types} />
              </Col>
            </Row>
          </Container>
        </div>
      </App>
    );
  }
}

export default BrowseCalendar;
