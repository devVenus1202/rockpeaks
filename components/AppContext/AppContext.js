import React, { Component } from 'react';

// first we will make a new context
const AppContext = React.createContext();

// Then create a provider Component
class AppProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: props.authentication.userInfo.themeState || 'dark',
      authentication: props.authentication,
      user: props.authentication.userInfo,
      openedPlayerId: null,
      playlistTitle: '',
      screenPercentage: 0,
    };
  }

  UNSAFE_componentWillReceiveProps(props) {
    if (props.trackingList) {
      this.setState({ userTrackingList: props.trackingList });
    }
  }

  setTheme = theme => {
    this.setState({ theme });
  };

  setUser = userInfo => {
    console.log(userInfo);
    const { user } = this.state;
    if (user !== userInfo) {
      this.setState({ user: userInfo });
    }
  };

  setPlayerStatusId = (statusId, playlistTitle = '') => {
    this.setState({
      openedPlayerId: statusId,
      playlistTitle,
    });
  };

  setScreenPercentage = value => {
    this.setState({
      screenPercentage: value,
    });
    console.log('value', value);
  };

  changeTrackingList(nid, status) {
    const { userTrackingList } = this.state;
    if (status) {
      userTrackingList.push(nid);
    } else {
      const index = userTrackingList.findIndex(item => item === nid);
      userTrackingList.splice(index, 1);
    }
    this.setState({ userTrackingList });
  }

  render() {
    return (
      <AppContext.Provider
        value={{
          ...this.state,
          setTheme: this.setTheme,
          setUser: this.setUser,
          setPlayerStatusId: this.setPlayerStatusId,
          setScreenPercentage: this.setScreenPercentage,
        }}
      >
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

// then make a consumer which will surface it
const AppConsumer = AppContext.Consumer;

export default AppProvider;
export { AppConsumer };
