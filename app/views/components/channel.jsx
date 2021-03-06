var ChannelComponent = function (socket) {
var React = require('react');
var ReactDOM = require('react-dom');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
var ChannelsStore = require('./../../stores/ChannelsStore')(socket); // подключаем стор
var ChannelsActions = require('./../../actions/ChannelsActions'); // подключаем экшены
var MessagesActions = require('./../../actions/MessagesActions'); // подключаем экшены

  var ChannelsList = React.createClass({
    getInitialState: function () {
      return ChannelsStore.getState(); // теперь мы возвращаем стор, внутри которого хранятся значения стейтов по умолчанию
    },

    componentDidMount: function () {
      ChannelsStore.listen(this.onChange); // подписываемся на изменения store
      ChannelsActions.initChannels(socket); // вызываем функцию, которая внутри экшена подпишется на событие сокета
    },

    componentWillUnmount: function () {
      ChannelsStore.unlisten(this.onChange); // отписываемся от изменений store
    },

    // эта функция выполняется когда store триггерит изменения внутри себя
    onChange: function (state) {
      this.setState(state);
    },

    changeChannel: function (event) {
      var slug = $(event.target).closest('.list__item').find('a').data('slug');
      socket.activeChannel = slug;

      $('.msg__loading').fadeIn();

      socket.emit('channel get', {
        channel: slug,
        limit: 20,
        force: true,
        scrollAfter: true
      });

      socket.emit('channel join', {
        channel: slug
      });

      socket.emit('channel info', {
        slug: socket.activeChannel
      });

      this.refs.show_all_checkbox.checked = false;
    },

    render: function () {
      var Channels = (<div>Loading channels...</div>);
      var _this = this;
      var len_channels = 0;
      if (this.state.channels) {
        Channels = this.state.channels.map(function (channel) {
          return (
            <Channel
              channel={channel}
              changeChannel={_this.changeChannel}
              key={channel._id} />
          );
        });

        len_channels = Channels.length;
      }

      return (
        <div className="group group_channels">
          <div className="heading heading_group">
            <h3 className="heading__header">Каналы</h3>
            <ButtonAddChannel ref="showModalButton"/>
          </div>
          <input type="checkbox" id="showAllChannels" ref='show_all_checkbox' className="show_all_checkbox" />
          <ul className="list list_channels">
            {Channels}
          </ul>
          <MoreChannels len = {len_channels}/>
          {this.state.show_modal === true && (
            <AddChannelModal userlist = {this.state.userList}/>
          )}
        </div>
      );
    }
  });

  var Channel = React.createClass({
    clickHandler: function (event) {
      this.props.changeChannel(event);
    },

    render: function () {
      var cx = require('classnames');

      var classesList = cx({
        'list__item': true,
        'active': this.props.channel.isActive,
        'unread': this.props.channel.isUnread
      });

      return (
        <li className={classesList}>
          <a
            className="name clearfix"
            onClick={this.clickHandler}
            data-slug={this.props.channel.slug}
          >
          <div className="list__left">
            <div className="channel__image">
              {this.props.channel.image && this.props.channel.image.length > 0 && (
                <img src={this.props.channel.image}/>
              )}
            </div>
          </div>
          <div className="list__right">
            <div className="list__name">{this.props.channel.name}</div>
            <div className="list__description">{this.props.channel.description}</div>
          </div>
          </a>
        </li>
      );
    }
  });

  var MoreChannels = React.createClass({
    render: function () {
      var channelsDisplaying = 4;
      var hiddenChannelsCount = this.props.len - channelsDisplaying;

      // Отображаем «Показать» только в случае избыточного количества каналов
      return hiddenChannelsCount > 0 && (
        <label className="more" htmlFor="showAllChannels">
          <span className="fa fa-sort-desc"></span>
        </label>
      );
    }
  });

  var ButtonAddChannel = React.createClass({
    handleShowModal: function() {
        ChannelsActions.updateShowModal(true);
    },

    render: function () {
      return (
        <span className="heading__plus" onClick={this.handleShowModal}>
          <i className="fa fa-plus-square-o fa-lg"></i>
        </span>
      );
    }
  });

  var UserList = React.createClass({
    render: function () {
      var UsersList = [];
      UsersList = this.props.userlist.map(function (user) {
        return (<User key={user._id} user={user} />);
      });

      return (
        <div className="userlist__wrap">
          <h3 className="userlist__heading">Выберите пользователей</h3>
          <ul className="userlist__list">
            {UsersList}
          </ul>
        </div>
      );
    }
  });

  var User = React.createClass({
    clickCheckboxHandler: function (e) {
      if (e.target.checked) {
        ChannelsActions.addUserToNewChannel(this.props.user.username);
      } else {
        ChannelsActions.deleteUserFromNewChannel(this.props.user.username);
      }
    },

    render: function () {
      return (
        <li className="userlist__item">
          <label>
            <input type="checkbox" onClick={this.clickCheckboxHandler} />
            <span>{this.props.user.username}</span>
          </label>
        </li>
      );
    }
  });

  var AddChannelModal = React.createClass({
    handleSubmit: function (e) {
      e.preventDefault();
      var name = ReactDOM.findDOMNode(this.refs.сhannelName).value.trim();
      var description = ReactDOM.findDOMNode(this.refs.channelDesc).value.trim();
      var image = ReactDOM.findDOMNode(this.refs.сhannelPic).value.trim();

      var names = ['name','description','image'];
      var values = [name,description,image];

      var obj = {};

      for (var i = 0; i < names.length; ++i) {
        if (values[i].length > 0) {
          obj[names[i]] = values[i];
        }
      }

      ChannelsActions.addNewChannel(obj);
    },

    handleCloseModal: function () {
      ChannelsActions.updateShowModal(false);
    },

    handleSetPrivate: function (e) {
      var statePrivate = false;
      if (e.target.checked) statePrivate = true;
      ChannelsActions.setPrivateMoreUsersChannel(statePrivate);
    },

    render: function () {
      return (
        <div className="modal">
          <form className="form modal__body default__modal" onSubmit={this.handleSubmit}>
          <ReactCSSTransitionGroup
              transitionName = {{
                enter: 'enter',
                leave: 'flipOutX',
                appear: 'fadeIn'
              }} transitionAppear={true}
              transitionAppearTimeout={1500}
              transitionEnterTimeout={1500}
              transitionLeaveTimeout={1500} >
              <div className="animated">
            <h2 className="modal__heading heading">Новый канал</h2>
            <div className="form__row">
                  {ChannelsStore.getState().hasError &&(
                    <div>{ChannelsStore.getState().hasError}</div>
                  )}
                </div>
            <div className="form__row">
              <label className="form__label" htmlFor="channelName"><i className="fa fa-users"></i></label>
              <input className="form__text" type="text" id="channelName" ref="сhannelName" placeholder="Назовите" />
            </div>
            <div className="form__row">
              <label className="form__label" htmlFor="channelPic"><i className="fa fa-image"></i></label>
              <input className="form__text" type="text" id="channelPic" ref="сhannelPic" placeholder="Картинка" />
            </div>
            <div className="form__row">
              <label className="form__label" htmlFor="channelDesc"><i className="fa fa-edit"></i></label>
              <textarea className="form__textarea" type="text" id="channelDesc" ref="channelDesc" placeholder="Описание канала"></textarea>
            </div>
            <div className="form__row userlist">
              {this.props.userlist.length > 0 && (<div>
                <input type="checkbox" className="userlist__checkbox" id="privateChannel" onClick={this.handleSetPrivate}/>
                <label htmlFor="privateChannel">Приватный канал</label>
                <UserList userlist={this.props.userlist}/>
              </div>)}
            </div>
            <button className="btn" type="submit">Добавить</button>
            </div>
             </ReactCSSTransitionGroup>
          </form>
          <div className="close-button" onClick={this.handleCloseModal}></div>
        </div>
      );
    }
  });

  return ChannelsList
};

module.exports = ChannelComponent;
