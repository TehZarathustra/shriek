var LoginPassport = function (socket) {
var React = require('react');
// askLogin component
  var LoginPassport = React.createClass({

    render: function () {
      return (
        <div>
          <h2>Придумайте пароль</h2>
          <div className="form__row">
            <input className={this.props.classPass} onChange={this.props.handlePassword} type="password"id="inputPassword" placeholder="Ваш пароль"/>
          </div>
          <button className="btn" type="submit">Войти</button>
        </div>
      );

    }
  });

  return LoginPassport;
};

module.exports = LoginPassport;
