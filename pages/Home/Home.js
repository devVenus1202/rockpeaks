import React from 'react';
import App from '@components/App';
import Hero from '@components/Hero';
import { Heros } from '@locales/en/Heros';
import Tour from '@components/Dialogs/Tour';
import _ from 'lodash';
import AccountSetting from '@components/AccountSetting';

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalOpened: {
        name: 'tour',
        status: false,
        index: 0,
      },
    };
  }

  componentDidMount() {}

  handleToggleModal = (index, name) => () => {
    const { modalOpened } = this.state;

    let nextStatus;
    if (modalOpened.name && modalOpened.status) {
      nextStatus = !modalOpened.status;
    } else {
      nextStatus = true;
    }
    this.setState({
      modalOpened: {
        index,
        name,
        status: nextStatus,
      },
    });
  };

  HEROES = [
    {
      title: 'browse',
      bgClass: 'hero-bg-1',
      onClick: this.handleToggleModal(0, 'browse'),
      url: null,
    },
    {
      title: 'match',
      bgClass: 'hero-bg-2',
      onClick: this.handleToggleModal(1, 'match'),
      url: null,
    },
    {
      title: 'contribute',
      bgClass: 'hero-bg-3',
      onClick: this.handleToggleModal(2, 'contribute'),
      url: null,
    },
  ];

  render() {
    const {
      modalOpened: { index, name, status },
    } = this.state;
    return (
      <App headerType page="home">
        {this.HEROES.map((hero, ind) => {
          const type = ind !== this.HEROES.length - 1;

          return (
            <Hero
              bgClass={_.get(hero, 'bgClass')}
              title={Heros[hero.title].title}
              body={Heros[hero.title].body}
              nextSection={type ? Heros[this.HEROES[ind + 1].title].title : ' '}
              type={type}
              key={_.get(hero, 'title')}
              url={_.get(hero, 'url', null)}
              onClick={_.get(hero, 'onClick', null)}
            />
          );
        })}
        <Tour
          isOpen={status}
          activeTab={index}
          onToggle={this.handleToggleModal('tour')}
        />
      </App>
    );
  }
}
