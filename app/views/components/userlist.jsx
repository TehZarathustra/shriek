var UserComponent = function (socket) {
  var React = require('react');
  var Users;

  var UsersList = React.createClass({
    getInitialState: function() {
      return {
        users: []
      };
    },

    componentDidMount: function () {
      var _this = this;

      socket.on('user list', function(data) {
        if (data.status === 'ok') {
          _this.setState({users: data.users});
        }
      });
    },

    render: function () {
      Users = (<div>Loading users...</div>);

      if (this.state.users) {
        Users = this.state.users.map(function(user) {
          return (<User key={user._id} user={user} />);
        });
      }

      return (
        <div className="group group_users">
          <div className="heading heading_group">
            <h3 className="heading__header">Пользователи</h3>
          </div>

          <input type="checkbox" id="showAllUsers" className="show_all_checkbox" />
          <ul className="list list_users">
            {Users}
          </ul>

          <MoreUsers/>
        </div>
      );
    }
  });

  var User = React.createClass({
      componentWillMount: function () {
        this.setState(this.props.user);
      },

      componentDidMount: function () {
        var _this = this;

        socket.on('user connected', function(data) {
          if (data.status === 'ok') {
            socket.emit('user connected');

            data.user.online = true;

            _this.updateUser(data.user);
          }
        });

        socket.on('user disconnected', function(data) {
          if (data.status === 'ok') {
            data.user.online = false;

            _this.updateUser(data.user);
          }
        });
      },

      updateUser: function (user) {
        if (user.username === this.state.username) {
          this.setState(user);
        }
      },

      render: function() {
        var cx = require('classnames');
        var classesList = cx({
          'list__item': true,
          'online': this.state.online
        });

        return (
          <li className={classesList}>
            <a className="name clearfix">
              <div className="list__left">
              <div className="user__image"><img src={this.props.user.setting.image}/></div>
              </div>
              <div className="list__right">
                <div className="list__name">{this.props.user.username}</div>
                <div className="list__description">
                  {this.state.online && (
                    <div>
                      {this.props.user.setting.description && (
                        <div>
                          {this.props.user.setting.description}
                        </div>
                      )}
                      {!this.props.user.setting.description && (
                        <div>
                          online
                        </div>
                      )}
                    </div>
                  )}
                  {!this.state.online && (
                    <div className="offline">
                      offline
                    </div>
                  )}
                </div>
              </div>
            </a>
          </li>
        );
      }
  });

  var MoreUsers = React.createClass({
    render: function() {
      var usersDisplaying = 5;
      var hiddenUsersCount = Users.length - usersDisplaying;

      // Отображаем «Показать» только в случае избыточного количества пользователей
      // return hiddenUsersCount > 0 && (
      //   <label className="more show_all_label" htmlFor="showAllUsers">
      //     <span>Показать +{hiddenUsersCount}</span>
      //   </label>
      // );

      return hiddenUsersCount > 0 && (
        <label className="more" htmlFor="showAllUsers">
          <span className="fa fa-sort-desc"></span>
        </label>
      );
    }
  });

  return UsersList;
};

module.exports = UserComponent;
