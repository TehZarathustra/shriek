var SettingComponent = function (socket) {
var React = require('react');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

  var SettingBlock = React.createClass({

    getInitialState: function () {
      return {
        email: '',
        image: '',
        first_name: '',
        last_name: '',
        sex: '',
        description: '',
        opened: false
      };
    },

    componentDidMount: function () {
      var _this = this;
      var username;
      var storageTheme = localStorage.userTheme;

      if (storageTheme && storageTheme.length > 0) {
        _this.setState({theme: storageTheme})
      }

      window.addEventListener('openSetting', function () {
        _this.setState({opened: true});
      });

      socket.on('user info', function (data) {
        if (data.status === 'ok') {
          _this.setState({
            email: data.user.setting.email,
            image: data.user.setting.image,
            first_name: data.user.setting.first_name,
            last_name: data.user.setting.last_name,
            description: data.user.setting.description,
            sex: data.user.setting.sex
          });
        }
      });

      socket.on('user update', function (data) {
        if (data != 'empty' && data.status == 'ok') {
          socket.emit('user info', {username: data.user.username});
          _this.handleClose();
        }
      });
    },

    handleThemeChange: function (e) {
      var cont = $('.layout');
      cont.removeClass(localStorage.userTheme);

      localStorage.removeItem('userTheme');
      this.setState({theme: e.target.value});
      localStorage.setItem('userTheme', e.target.value);

      cont.addClass(''+e.target.value+'');
    },

    handleEmailChange: function (e) {
      this.setState({email: e.target.value});
    },

    handleImageChange: function (e) {
      this.setState({image: e.target.value});
    },

    handleFirstNameChange: function (e) {
      this.setState({first_name: e.target.value});
    },

    handleLastNameChange: function (e) {
      this.setState({last_name: e.target.value});
    },

    handleSexChange: function (e) {
      this.setState({sex: e.target.value});
    },

    handleDescriptionChange: function (e) {
      this.setState({description: e.target.value});
    },

    handleSave: function (e) {
      e.preventDefault();

      if (this.state != null) {
        socket.emit('user update', {
          username: socket.username,
          setting: {
            email: this.state.email,
            image: this.state.image,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            description: this.state.description,
            sex: this.state.sex
          }
        });
      }
    },

    handleClose: function (e) {
      this.setState({opened: false});
    },

    render: function () {
      var formSetting;
      var nickname = socket.username;

      formSetting = (
        <div>
        <form className="form modal__body setting animated default__modal" onSubmit={this.handleSave}>
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
          <h2 className="modal__heading heading">Ваш профиль</h2>
          <div className="setting__image">
            <img src={this.state.image} />
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="inputEmail"><i className="fa fa-envelope-o"></i></label>
            <input className="form__text" onChange={this.handleEmailChange} type="email" id="inputEmail" placeholder="Email" value={this.state.email} />
          </div>
          <div className="form__row">
            <label className="form__label" htmlFor="inputImage"><i className="fa fa-picture-o"></i></label>
            <input className="form__text" onChange={this.handleImageChange} type="url" id="inputImage" placeholder="Ссылка на картинку" value={this.state.image} />
          </div>
          <div className="form__row form__row-radio">
            <input className="form__radio" name="sex" onChange={this.handleSexChange} type="radio" id="inputSexMale" value="male" defaultChecked={this.state.sex === 'male'} />
            <label htmlFor="inputSexMale" className="btn">
              <i className="fa fa-mars"></i>
            </label>
            <input className="form__radio" name="sex" onChange={this.handleSexChange} type="radio" id="inputSexFemale" value="female" defaultChecked={this.state.sex === 'female'} />
            <label htmlFor="inputSexFemale" className="btn">
              <i className="fa fa-venus"></i>
            </label>
          </div>
          <div className="form__row">Поменять оформление</div>
          <div className="form__row form__row-radio">
            <input className="form__radio" name="theme" onChange={this.handleThemeChange} type="radio" id="inputDefaultTheme" value="theme-default" defaultChecked={this.state.theme === 'theme-default'} />
            <label htmlFor="inputDefaultTheme" className="btn">
              <i className="fa theme-icon theme-icon-default">Оранжевое</i>
            </label>

            <input className="form__radio" name="theme" onChange={this.handleThemeChange} type="radio" id="inputGreenTheme" value="theme-green" defaultChecked={this.state.theme === 'theme-green'} />
            <label htmlFor="inputGreenTheme" className="btn">
              <i className="fa theme-icon theme-icon-green">Зеленое</i>
            </label>

            <input className="form__radio" name="theme" onChange={this.handleThemeChange} type="radio" id="inputBordoTheme" value="theme-bordo" defaultChecked={this.state.theme === 'theme-bordo'} />
            <label htmlFor="inputBordoTheme" className="btn">
              <i className="fa theme-icon theme-icon-bordo">Бордовое</i>
            </label>
          </div>

          <div className="form__row">
            <label className="form__label" htmlFor="inputDescription"><i className="fa fa-edit"></i></label>
            <textarea className="form__textarea" onChange={this.handleDescriptionChange} id="inputDescription" placeholder="Статус" value={this.state.description} />
          </div>
          <button className="btn" onClick={this.handleSave} type="submit">Сохранить</button>
          </div>
          </ReactCSSTransitionGroup>
        </form>
        <div className="close-button" onClick={this.handleClose}></div>
        </div>
      );

      return (
        <div>
          {this.state.opened == true && (
            <div className="modal" ref="overlaySetting">
                {formSetting}
            </div>
          )}
        </div>
      );
    }

  });

  return SettingBlock;
};

module.exports = SettingComponent;
