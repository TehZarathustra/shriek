var ProfileComponent = function (socket) {
var React = require('react');
if (!AuthStore) var AuthStore = require('./../../stores/AuthStore')(socket); // подключаем стор
var AuthActions = require('./../../actions/AuthActions'); // подключаем экшены

var SearchComponent = require('./search.jsx')(socket);

  var ProfileBlock = React.createClass({

    getInitialState: function () {
      return {
        image: 'http://cs540109.vk.me/c7005/v7005764/55da/NuoVVyzCGGs.jpg'
      };
    },

    componentWillMount: function() {
      var _this = this;

      socket.on('user info', function (data) {
        if (data.status === 'ok') {
          _this.setState({image: data.user.setting.image});
          _this.setState({name: data.user.username});
        }
      });

    },

    componentDidMount: function () {
      var _this = this;

      socket.on('user leave', function (data) {
        if (data.status === 'ok') {
          if (data.user.hasOwnProperty('username')) {
            if (socket.username === data.user.username) {
              AuthActions.makeLogOut();
            }
          }
        } else {
          alert('oh shit, im sorry');
        }
      });
    },

    handleSettingOpen: function (e) {
      window.dispatchEvent(new Event('openSetting'));
    },

    logout: function () {
      socket.emit('user leave');
    },

    render: function () {
      return (
        <div className='profile'>
          <SearchComponent/>
          <div className="profile__img">
            <img src={this.state.image}/>
          </div>
          <div className="profile__name">
            {this.state.name}
          </div>
          <div className="profile__tools" onClick={this.handleSettingOpen}><i className="fa fa-cog fa-lg"></i></div>
          <div className="profile__out" onClick={this.logout}><i className="fa fa-power-off fa-lg"></i></div>
        </div>
      );
    }
  });

  return ProfileBlock;
};

module.exports = ProfileComponent;
