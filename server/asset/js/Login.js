'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function ($) {
    // Auth class.

    var Auth = function () {
        function Auth(form) {
            _classCallCheck(this, Auth);

            this._form = form;
            this._errorMsg = $('.error-msg');
            this._inputs = $('input[required]');
            this._form_valid = true;
            this._save_checkbox = $('input[name="save-password"]');
            this._sendingObj = {
                login: '',
                password: ''

            };
        }

        _createClass(Auth, [{
            key: 'init',
            value: function init() {
                var self = this;

                this.event(self);
            }
        }, {
            key: 'event',
            value: function event(self) {
                this._form.on('submit', function (e) {

                    e.preventDefault();
                    // перебираете инпуты и на каждом инпуте вызываете метод validate
                    // проверить что форма заполнена корректно для этого используйте
                    // переменную переключатель
                    var inputs = Array.prototype.slice.call(self._inputs);
                    // self._required_inputs = self._inputs.filter(input => input.hasAttribute('required'));
                    self._form_valid = true;
                    inputs.forEach(function (input) {
                        return self.validate(input);
                    });
                    self.sendRequest(self);
                });
            }
        }, {
            key: 'validate',
            value: function validate(input) {
                //проверять инпуты
                var dataRegexp = input.dataset.regexp,
                    reg = new RegExp(dataRegexp);
                console.log(input.dataset);

                if (!reg.test(input.value)) {
                    input.classList.add('error');
                    this._form_valid = false;
                } else {
                    input.classList.remove('error');
                    this._sendingObj[input.name] = input.value;
                }
            }
        }, {
            key: 'showError',
            value: function showError(error, self) {
                //управлять выводом ошибок
                this._errorMsg.text(error);
                this._errorMsg.fadeIn();
                setTimeout(function () {
                    self._errorMsg.fadeOut();
                }, 3000);
            }
        }, {
            key: 'sendRequest',
            value: function sendRequest(self) {
                //проверить валидна ли форма, eсли нет вызвать метод showError
                console.log(this._sendingObj);
                if (!this._form_valid) return self.showError('\u041D\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043E \u043F\u043E\u043B\u0435', self);
                $.ajax({
                    method: 'POST',
                    data: JSON.stringify(this._sendingObj),
                    contentType: 'application/json',
                    url: 'http://localhost:8080/login',
                    success: function success(res) {
                        console.log(res);
                        self.setCookie(res._id, self);
                    },
                    error: function error(err) {
                        console.log(err);
                        self.showError('\u041D\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u044C\u043D\u043E \u0437\u0430\u043F\u043E\u043B\u043D\u0435\u043D\u043E \u043F\u043E\u043B\u0435', self);
                    }
                });
            }
        }, {
            key: 'setCookie',
            value: function setCookie(id, self) {
                var date = new Date();
                date.setSeconds(date.getSeconds() + 600000);

                document.cookie = this._save_checkbox.prop('checked') ? '_id=' + id + ';expires=' + date.toUTCString() : '_id=' + id;
                window.location = '/task';
            }
        }]);

        return Auth;
    }();

    var form = $('form[name="loginForm"]');
    var auth = new Auth(form);
    auth.init();
})(jQuery);