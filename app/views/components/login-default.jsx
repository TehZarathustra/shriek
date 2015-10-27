var LoginDefault = function (socket) {

var React = require('react');

// LOGIN ERROR MODULE
var LoginError = require('../../views/components/login-error.jsx')(socket);

// askLogin component
  var LoginDefault = React.createClass({

    render: function () {
      return (
        <div>
          <h2>Добро пожаловать в<br/>Shriek Chat</h2>
          <div className="form__row">
            <input className={this.props.classUser} onChange={this.props.handleName} type="username" id="inputUsername" placeholder="Логин"/>
          </div>
          <div className="form__row">
            <input className={this.props.classPass} onChange={this.props.handlePassword} type="password"id="inputPassword" placeholder="Пароль"/>
          </div>
          <div>
            {this.props.error && (
              <LoginError error={this.props.error} />
            )}
          </div>
          <button className="btn" type="submit">Войти</button>
          <div className="form__row-social">
            <span>Или используйте:</span>
          </div>
          <a href="/auth/twitter" className="auth__btn">Twitter<i className="fa fa-twitter"></i></a>
          <a href="/auth/google" className="auth__btn">Google+<i className="fa fa-google-plus"></i></a>
          <a href="/auth/github" className="auth__btn">Github<i className="fa fa-github"></i></a>
        </div>
      );

    }
  });

  return LoginDefault;
};

module.exports = LoginDefault;
