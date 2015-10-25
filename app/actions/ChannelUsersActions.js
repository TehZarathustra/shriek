var alt_obj = require('./../controllers/alt_obj');

var ChannelsUsersActions = alt_obj.createActions({
  displayName: 'ChannelsUsersActions',

  getInfoChannelUsers: function (data) {
    this.dispatch(data);
  },

  getUsersChannel: function (data) {
    this.dispatch(data);
  },

  initChannels: function (socket) {
    var _this = this;

    socket.on('channel info', function (data) {
      if (data.status === 'ok') {
        _this.actions.getInfoChannelUsers(data.channel);
      }
    });

    socket.on('channel create', function (data) {
      if (data.status === 'ok') {
        if (data.creator === socket.username) {
          _this.actions.getInfoChannelUsers(data.channel);
        }
      }
    });

    socket.on('user list', function (data) {
      if (data.status === 'ok') {
        var usersList = [];
        usersList = data.users.map(function (user) {
          return ({username: user.username, online: user.online});
        });
        usersList.unshift({username: socket.username, online: 'online'});
        _this.actions.getUsersChannel(usersList);
      }
    });
  }
});

module.exports = alt_obj.createActions('ChannelsUsersActions', ChannelsUsersActions);
