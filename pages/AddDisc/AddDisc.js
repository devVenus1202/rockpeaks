import React, { Component } from 'react';
import PropTypes from 'prop-types';
import App from '@components/App';
import StepBar from '@components/StepBar';
import CheckDatabase from '@components/AddDiscForms/CheckDatabase';
import SelectType from '@components/AddDiscForms/SelectType';
import EnterMetadata from '@components/AddDiscForms/EnterMetadata';
import Publish from '@components/AddDiscForms/Publish';
import Router from 'next/router';
import { PageContentLoader } from '@components/Loader';
import { get as _get } from 'lodash';
import './AddDisc.style.scss';

class AddDisc extends Component {
  constructor(props) {
    super(props);

    const {
      url: {
        query: { playlist },
      },
    } = props;

    this.state = {
      step: playlist ? 1 : 0,
      discData: { metaData: {}, selectedPlaylist: playlist },
      loading: true,
    };
  }

  goToStep = step => () => {
    this.setState({ step });
  };

  setDiscData = (key, value) => {
    this.setState(prevState => ({
      discData: {
        ...prevState.discData,
        [key]: value,
      },
    }));
  };

  handleRefresh = () => {
    this.setState({ discData: { metatData: {} }, step: 0 });
  };

  componentDidMount() {
    const { authentication } = this.props;
    const authorized = _get(authentication, 'isLogin', false);
    if (!authorized) {
      Router.replace('/welcome');
    } else {
      this.setState({
        loading: false,
      });
    }
  }

  render() {
    const { step, discData } = this.state;
    const { loading } = this.state;

    return (
      <App pageClass="add-disc-page">
        <section className="section window-section">
          <div className="container">
            <div className="window-section-box ">
              {loading ? (
                <PageContentLoader />
              ) : (
                <>
                  <StepBar active={step} type="disc" />
                  {step === 0 && (
                  <CheckDatabase
                    onNext={this.goToStep(1)}
                    selectedPlaylist={discData.selectedPlaylist}
                    setDiscData={this.setDiscData}
                  />
                )}
                  {step === 1 && (
                  <SelectType
                    onNext={this.goToStep(2)}
                    onBack={this.goToStep(0)}
                    setDiscData={this.setDiscData}
                  />
                )}
                  {step === 2 && (
                  <EnterMetadata
                    onNext={this.goToStep(3)}
                    onBack={this.goToStep(1)}
                    metaData={discData.metaData}
                    setDiscData={this.setDiscData}
                  />
                )}
                  {step === 3 && (
                  <Publish
                    onNext={this.goToStep(0)}
                    onBack={this.goToStep(2)}
                    onRefresh={this.handleRefresh}
                    discData={discData}
                  />
                )}
                </>
              )}
            </div>
          </div>
        </section>
      </App>
    );
  }
}

AddDisc.propTypes = {
  url: PropTypes.object.isRequired,
};

export default AddDisc;
