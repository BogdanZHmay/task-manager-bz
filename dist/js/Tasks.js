;(function ($) {
    class Tasks{
        constructor(){

        }

        init(){
            let self = this;

            this.checkToken(self)
                .then(this.getTasks)
                .then(this.sortTask)
                .catch(this.logout);
        }

        checkToken(self){

            return new Promise(function (resolve, reject) {

                let index = document.cookie.indexOf('_id');
                let indexEnd = document.cookie.indexOf(';', index);
                let token = indexEnd === -1 ?
                                document.cookie.slice(index) :
                                    document.cookie.slice(index, indexEnd);

                if(index !== -1) resolve(self);
                else reject('Text not found');
            })
        }

        getTasks(self){
            console.log('getting tasks ...');

            return new Promise(function (resolve, reject) {
                $.ajax({
                    method: 'POST',
                    url: 'http://localhost:8080/allTasks',
                    success: function(res){
                        self.response = res;
                        resolve(self)
                    },
                    error: function(error){
                        reject(error);
                    }
                })
            })

        }

        logout(){
            window.location = '/login';
        }

        sortTask(self){
            console.log('sorting tasks...', self);

            self.response.forEach(function (self) {

                let day = new Date(self.date),
                    options = {month: 'short'};

                self.ms = Date.now(self.date);
                self.day = day.getDate();
                self.month = day.toLocaleString('ru', options);



            });
            // self.response.forEach(function (self){
            //     self = `${self.date}`;
            // })

        }

        render(self){
            console.log('Rendering tasks...');
        }
    }

    let tasks = new Tasks();
    tasks.init();

})(jQuery);
