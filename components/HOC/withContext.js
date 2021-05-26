import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { AppConsumer } from '@components/AppContext';
import Login from '@components/Header/Login';

export const withContext = WrappedComponent => {
  class ComponentWithContext extends Component {
    static propTypes = {
      forwardedRef: PropTypes.object,
    };

    static defaultProps = {
      forwardedRef: {},
    };

    constructor(props) {
      super(props);
      this.login = React.createRef();
    }

    openLogin = () => {
      this.login.openLogin();
    };

    render() {
      const { forwardedRef, ...rest } = this.props;
      return (
        <AppConsumer>
          {state => {
            const {
              user,
              openedPlayerId,
              playlistTitle,
              setTheme,
              setUser,
              setPlayerStatusId,
              setScreenPercentage,
              theme,
              authentication,
            } = state;
            return (
              <>
                <WrappedComponent
                  ref={forwardedRef}
                  {...rest}
                  theme={theme || 'dark'}
                  user={user}
                  openedPlayerId={openedPlayerId}
                  setTheme={setTheme}
                  setUser={setUser}
                  playlistTitle={playlistTitle}
                  setPlayerStatusId={setPlayerStatusId}
                  setScreenPercentage={setScreenPercentage}
                  authentication={authentication}
                  showLogin={this.openLogin}
                />
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
              </>
            );
          }}
        </AppConsumer>
      );
    }
  }
  function forwardRef(props, ref) {
    return <ComponentWithContext {...props} forwardedRef={ref} />;
  }

  const name = Component.displayName || Component.name;
  forwardRef.displayName = `ComponentWithContext(${name})`;

  return React.forwardRef(forwardRef);
};
