var SearchResultComponent = function (socket) {
var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');
  var ChannelsStore = require('./../../stores/ChannelsStore')(socket); // подключаем стор
  var MessagesActions = require('./../../actions/MessagesActions'); // подключаем экшены

  var SearchResultList = React.createClass({
    getInitialState: function () {
      return {};
    },

    handleClose: function() {
      this.props.handleClose();
    },

    render: function () {
      var _this = this;
      var Messages = (<div>Грузим сообщения...</div>);
      if (this.props.messages) {
        Messages = this.props.messages.map(function (message) {
          return (<SearchResult message={message} key={'search' + message._id} handleClose={_this.handleClose} />);
        });
      }
      return (
        <div className='search-results'>
          {Messages}
        </div>
      );
    }
  });

  var SearchResult = React.createClass({
    handleJump: function (e) {
      var dataset = e.currentTarget.dataset;

      socket.activeChannel = dataset.channel;
      socket.emit('channel get',
        {
          channel: dataset.channel,
          date: dataset.date,
          limit: -1, rtl:
          'gte',
          force: true,
          scrollAfter: false
        }
      );
      var id = dataset.id;
      setTimeout(function () {
        socket.emit('channel get',
          {
            channel: dataset.channel,
            date: dataset.date,
            limit: 20,
            scrollAfter: false
          }
        );
        setTimeout(function () {
          MessagesActions.highlightMessage(id);
          $('.msg__list').scrollTop($('.msg__searched').offset().top - 500);
        }, 1000)
      }, 500);

      this.props.handleClose();
    },

    render: function () {
      var localDate = new Date(this.props.message.created_at);
      var hour = localDate.getHours();
      var minutes = localDate.getMinutes();
      var date = ('0' + hour).slice(-2) + ':' + ('0' + minutes).slice(-2);
      var day = localDate.getDate();
      var month = localDate.getMonth();
      var fullDate = date + ' ' + ('0' + day).slice(-2) + '/' +
        ('0' + month).slice(-2) + '/' + localDate.getFullYear();
      return (
        <div
          data-id={this.props.message._id}
          data-channel={this.props.message.channel}
          data-date={this.props.message.created_at}
          onClick={this.handleJump}
         className='search-result'>
          <span className='search-result__author'>{this.props.message.username} ({this.props.message.channel})</span>
          <span className='search-result__date'>{fullDate}</span>
          <div className="clearfix"></div>
          <div

            className='search-result__text'
            dangerouslySetInnerHTML={{
              __html: this.props.message.text
            }} />
        </div>
      );
    }
  });

  var SearchModel = React.createClass({

    getInitialState: function () {
      return {
        showSearchResult: false,
        messages: []
      };
    },

    componentWillMount: function () {
      var _this = this;

      socket.on('search text', function (data) {
        if (data.status === 'ok') {
          _this.setState({showSearchResult: true});
          _this.setState({messages: data.messages})
        }
      });
    },

    handleSearch: function (e) {
    },

    handleClose: function (e) {
      this.setState({showSearchResult: false});
    },

    render: function () {
      return (
        <div>
          {this.state.showSearchResult == true && (
            <div className="modal" ref="overlaySearchResult">

                <div className="form modal__body modal__search modal__default">
                <ReactCSSTransitionGroup
                  transitionName = {{
                    enter: 'enter',
                    enterActive: 'enterActive',
                    leave: 'flipOutX',
                    leaveActive: 'flipOutX',
                    appear: 'fadeIn',
                    appearActive: 'appear'
                  }} transitionAppear={true}
                  transitionAppearTimeout={1500}
                  transitionEnterTimeout={1500}
                  transitionLeaveTimeout={1500} >
                <div className="animated">
                  <h2 className="modal__heading heading">Результат поиска</h2>
                  <SearchResultList messages={this.state.messages} handleClose={this.handleClose} />
                  </div>
                </ReactCSSTransitionGroup>
                </div>
                <div className="close-button" onClick={this.handleClose}></div>

            </div>
          )}
        </div>
      );
    }
  });

  return SearchModel;
};

module.exports = SearchResultComponent;
