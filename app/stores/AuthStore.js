var AuthStoreObj = false;
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
    _this[key] = newState[key];
  }
  localStorage.removeItem('userName');
  localStorage.removeItem('userPass');
};

  if (!AuthStoreObj) {
    AuthStoreObj = alt_obj.createStore(AuthStore);
  }
  return AuthStoreObj;
};

module.exports = AuthStoreFunction;
