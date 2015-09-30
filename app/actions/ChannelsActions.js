var alt_obj = require('./../controllers/alt_obj');

var ChannelsActions = alt_obj.createActions({
  displayName: 'ChannelsActions', // обязательное поле в ES5

  updateChannels: function (channels) {  // на эту функцию мы будем подписываться в сторе
    this.dispatch(channels); // это блин ТРИГГЕР, на который реагирует стор
  },
  setActiveChannel: function (channelSlug) {
    this.dispatch(channelSlug);
  },
  addChannel: function (channel) {
    this.dispatch(channel);
  },
  setUnreadChannel: function (channelSlug) {
    this.dispatch(channelSlug);
  },
  setStateShowModal: function (stateShowModal) {
    this.dispatch(stateShowModal);
  },

  initChannels: function (socket) { // это функция инициализации, тут мы подписываемся на сообщение из сокета
    var _this = this;

    socket.on('channel list', function (data) {
      _this.actions.updateChannels(data); // получили данные и передали в функцию, которая умеет триггерить стор
    });

    socket.on('channel get', function (data) {
      _this.actions.setActiveChannel(data.slug);
    });

    socket.on('message send', function (data) {
      if (data.message.channel != socket.activeChannel) { // только если сообщение пришло в не активный канал
        _this.actions.setUnreadChannel(data.message.channel);
      }
    });

    socket.on('channel create', function (data) {
      if (data.status === 'ok') {
        _this.actions.addChannel(data);

        if (data.creator === socket.username) {
          _this.actions.setActiveChannel(data.channel.slug);
          socket.emit('channel get', {
            channel: data.channel.slug,
            date: new Date()
          });
        }
      }
    });
  },
  modalHadlers: function (showModal) {
    var _this = this;

    showModal.onclick = function () {
      _this.actions.setStateShowModal(true);
    };
  },
  getChannels: function (socket) {
    socket.emit('channel list'); // дергаем бекенд, чтобы получить список каналов
  }

});

module.exports = alt_obj.createActions('ChannelsActions', ChannelsActions); // первый параметр имя экшена — обязательный в ES5
