var AuthStoreObj = null;
var AuthStoreFunction = function () {

  var alt_obj = require('./../controllers/alt_obj');
  var AuthActions = require('./../actions/AuthActions');

  function AuthStore() {
  this.messages = [];
  this.displayName = 'AuthStore';
  this.bindListeners({
    logOut: AuthActions.LOG_OUT
  });
}

  AuthStore.prototype.logOut = function (newState) {
  var _this = this;
  for (var key in newState) {
    if (newState.hasOwnProperty(key)) {
      _this[key] = newState[key];
    }
  }

  var deleteCookie = function (name) {
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  };

  localStorage.removeItem('userName');
  localStorage.removeItem('userHash');
  deleteCookie('psUser');
  location.reload();
};

  if (AuthStoreObj === null) {
    AuthStoreObj = alt_obj.createStore(AuthStore);
  }
  return AuthStoreObj;
};

module.exports = AuthStoreFunction;
