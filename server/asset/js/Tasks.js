'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

;(function ($) {
    var Tasks = function () {
        function Tasks() {
            _classCallCheck(this, Tasks);
        }

        _createClass(Tasks, [{
            key: 'init',
            value: function init() {
                var self = this;

                this.checkToken(self).then(this.getTasks).then(this.sortTask).catch(this.logout);
            }
        }, {
            key: 'checkToken',
            value: function checkToken(self) {

                return new Promise(function (resolve, reject) {

                    var index = document.cookie.indexOf('_id');
                    var indexEnd = document.cookie.indexOf(';', index);
                    var token = indexEnd === -1 ? document.cookie.slice(index) : document.cookie.slice(index, indexEnd);

                    if (index !== -1) resolve(self);else reject('Text not found');
                });
            }
        }, {
            key: 'getTasks',
            value: function getTasks(self) {
                console.log('getting tasks ...');

                return new Promise(function (resolve, reject) {
                    $.ajax({
                        method: 'POST',
                        url: 'http://localhost:8080/allTasks',
                        success: function success(res) {
                            self.response = res;
                            resolve(self);
                        },
                        error: function error(_error) {
                            reject(_error);
                        }
                    });
                });
            }
        }, {
            key: 'logout',
            value: function logout() {
                window.location = '/login';
            }
        }, {
            key: 'sortTask',
            value: function sortTask(self) {
                console.log('sorting tasks...', self);

                var sortArr = self.response.slice(),
                    obj = {};

                sortArr.forEach(function (self) {

                    var day = new Date(self.date),
                        options = { month: 'short' };

                    self.ms = Date.now(self.date);
                    self.day = day.getDate();
                    self.month = day.toLocaleString('ru', options);

                    sortArr.sort(function (prev, next) {
                        if (prev.ms > next.ms) return 1;
                        if (prev.ms < next.ms) return -1;
                    });

                    sortArr.forEach(function (self) {
                        if (obj[self.date] === undefined) {
                            obj[self.date] = sortArr.filter(function (res) {
                                return res.date === self.date;
                            });
                        }
                    });
                });
                console.log(obj);
            }
        }, {
            key: 'render',
            value: function render(self) {
                console.log('Rendering tasks...');
            }
        }]);

        return Tasks;
    }();

    var tasks = new Tasks();
    tasks.init();
})(jQuery);