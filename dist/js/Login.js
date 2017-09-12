;(function ($) {
    // Auth class.

    class Auth{
        constructor(form){
            this._form = form;
            this._errorMsg = $('.error-msg');
            this._inputs = $('input[required]');
            this._form_valid = true;
            this._save_checkbox = $('input[name="save-password"]');
            this._sendingObj = {
                login: '',
                password: ''

            }

        }

        init(){
            let self = this;

            this.event(self);

        }

        event(self){
            this._form.on('submit', function (e) {

                e.preventDefault();
                // перебираете инпуты и на каждом инпуте вызываете метод validate
                // проверить что форма заполнена корректно для этого используйте
                // переменную переключатель
                let inputs = Array.prototype.slice.call(self._inputs);
                // self._required_inputs = self._inputs.filter(input => input.hasAttribute('required'));
                self._form_valid = true;
                inputs.forEach(input => self.validate(input));
                self.sendRequest(self);
            })
        }

        validate(input){
            //проверять инпуты
            let dataRegexp = input.dataset.regexp,
                reg = new RegExp(dataRegexp);
                console.log(input.dataset);

            if(!reg.test(input.value)){
                input.classList.add('error');
                this._form_valid = false;


            } else {
                input.classList.remove('error');
                this._sendingObj[input.name] = input.value;
            }

        }

        showError(error, self){
            //управлять выводом ошибок
            this._errorMsg.text(error);
            this._errorMsg.fadeIn();
            setTimeout(function () {
                self._errorMsg.fadeOut();
            }, 3000)

        }

        sendRequest(self){
            //проверить валидна ли форма, eсли нет вызвать метод showError
            console.log(this._sendingObj);
            if(!this._form_valid)
                return self.showError(`Не правильно заполнено поле`, self);
            $.ajax({
                method: 'POST',
                data: JSON.stringify(this._sendingObj),
                contentType: 'application/json',
                url: 'http://localhost:8080/login',
                success: function (res){
                    console.log(res);
                    self.setCookie(res._id, self)
                },
                error: function (err){
                    console.log(err);
                    self.showError(`Не правильно заполнено поле`, self)
                }
            })
        }

        setCookie(id, self){
            let date = new Date();
            date.setSeconds(date.getSeconds()+ 600000);

            document.cookie = this._save_checkbox.prop('checked') ?
                `_id=${id};expires=${date.toUTCString()}` :
                `_id=${id}`;
            window.location = '/task';
        }
    }

    let form = $('form[name="loginForm"]');
    let auth = new Auth(form);
    auth.init();



})(jQuery);
