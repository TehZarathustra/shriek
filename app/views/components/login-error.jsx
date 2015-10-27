var LoginError = function (socket) {

var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

// askLogin component
  var LoginError = React.createClass({

    render: function () {
      return (
        <div className = "login__error">
          <ReactCSSTransitionGroup
          transitionName = {{
            enter: 'enter',
            enterActive: 'enterActive',
            leave: 'leave',
            leaveActive: 'leaveActive',
            appear: 'fadeInDown',
            appearActive: 'appear'
          }} transitionAppear={true}
          transitionAppearTimeout={500}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300} >
          <div className="animated">{this.props.error}</div>
          </ReactCSSTransitionGroup>
        </div>
      );
    }
  });

  return LoginError;
};

module.exports = LoginError;
