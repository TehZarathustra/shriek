var app = app || {};
// Если убираем test.js, то надо раскомментить
var socket = io();

socket.on('reconnect', function() {
  console.log('reconnect');
});

socket.on('connect_error', function() {
  console.log('connect_error');
});

socket.activeChannel = 'general';

// RECONNECT COMPONENT
var ReconnectComponent = require('../../views/components/reconnect.jsx')(socket);

// CHAT MODULE
var ChatComponent = require('../../views/components/message.jsx')(socket);

// CHANNEL LIST MODULE
var ChannelComponent = require('../../views/components/channel.jsx')(socket);

// USERS LIST
var UserComponent = require('../../views/components/userlist.jsx')(socket);

// LOGIN MODULE
var LoginComponent = require('../../views/components/login.jsx')(socket);

// PROFILE MODULE
var ProfileComponent = require('../../views/components/profile.jsx')(socket);

// SETTING MODULE
var SettingComponent = require('../../views/components/setting.jsx')(socket);

// SEARCH RESULTS
var SearchResultComponent = require('../../views/components/search-result.jsx')(socket);

(function () {
  'use strict';

  var Title = React.createClass({
    render: function () {
      return (
        <div className="heading">
          <div className="heading__fold clearfix">
            <div className="heading__arrow">
              <a href="#" className="fa fa-arrow-left"></a>
            </div>
            <div className="heading__main">
              <div className="header__logo"></div>
              <h3 className="header__slogan">Shriek<span className="header__hideable"> Chat</span></h3>
            </div>
          </div>
        </div>
      );
    }
  });

  var ChatApp = React.createClass({
    render: function () {
      var menu, main;

      menu = (
        <div className="nav">
          <Title />
          <ChannelComponent />
          <UserComponent />
        </div>
      );

      main = (
        <div className="content">
          <ProfileComponent/>
          <ChatComponent/>
        </div>
      );

      return (
        <div className="container">
          {menu}
          {main}
        </div>
      );
    }
  });

  var Content = React.createClass({
    render: function () {
      return (
        <div className="layout theme-default">
          <ReconnectComponent />
          <SettingComponent />
          <LoginComponent />
          <SearchResultComponent />
          <ChatApp />
        </ div >
      );
    }
  });

  function render() {
    React.render(
      <Content/>,
      document.body
    );
  }

  render();

  (function() {
    var nav = $('.nav');
    var trigger = $('.heading__arrow');
    var search = $('.search__form');
    var viewport = $(window).width();

    if (viewport < 810) {
      nav.addClass('folded');
    }

    $(window).on('resize', function() {
      viewport = $(window).width();
      if (viewport < 810) {
        nav.addClass('folded');
      } else {
        nav.removeClass('folded');
      }
    });

    trigger.click(function(e) {
      e.preventDefault();
      if (!nav.hasClass('folded')) {
        nav.addClass('folded');
        if (viewport < 690) {
          setTimeout(function() {
            search.removeClass('hidden');
          },200)
        }
      } else {
        nav.removeClass('folded');
        if (viewport < 690) {
          search.addClass('hidden');
        }
      }
    });
  })();

})();
