var SearchComponent = function (socket) {

var ChannelsStore = require('./../../stores/ChannelsStore')(socket); // подключаем стор

  var SearchBlock = React.createClass({

    getInitialState: function () {
      return {};
    },

    handleSearch: function (e) {
      e.preventDefault();

      if ($('#search').val().trim()) {
        var chList = [];

        ChannelsStore.getState().channels.map(function(ch) {
          chList.push(ch.slug);
        });

        socket.emit('search text', {
          channels: chList,
          text: $('#search').val().trim()
        });

        $('#search').val('');
      }
    },

    render: function () {
      return (
        <div className='search__form'>
          <div className='form__row'>
            <form onSubmit={this.handleSearch}>
              <label className='form__label' htmlFor='search'>
                <i className='fa fa-search'></i>
              </label>
              <input className='form__text' type='text' id='search' ref='search'/>
            </form>
          </div>
        </div>
      );
    }
  });

  return SearchBlock;
};

module.exports = SearchComponent;
