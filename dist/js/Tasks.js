;(function ($) {
    class Tasks{
        constructor(){

        }

        init(){
            let self = this;

            this.checkToken(self)
                .then(this.getTasks)
                .then(this.sortTask)
                .then(this.render)
                .then(this.addEvent)
                .then(Tasks.hidePreloader)
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

            let sortArr = self.response.slice(),
                obj = {};

            sortArr.forEach(function (task) {

                let day = new Date(task.date),
                    options = {month: 'short'};

                task.ms = Date.parse(task.date);
                task.day = day.getDate();
                task.month = day.toLocaleString('ru', options);

            });

            sortArr.sort((prev, next) => prev.ms - next.ms);

            let undoneTasks = sortArr.filter(task => task.status === 'undone');
            let doneTasks = sortArr.filter(task => task.status === 'done');

            self.undoneTasks = Tasks.createObjFromArr(undoneTasks);
            self.doneTasks = Tasks.createObjFromArr(doneTasks);

            return self;

        }

        render(self){
            console.log('Rendering tasks...', self);

            return new Promise(function (resolve, reject) {
                resolve(self);
            })
        }

        addEvent(self){
            console.log('Adding events...', self);

            $('.task-header').on('click', Tasks.taskAccordion)

        }

        static hidePreloader(){

            $('#loading').addClass('hide');
        }

        static createObjFromArr(arr){
            let obj = {};

            arr.forEach(function(task){
                if(!obj[task.date]){
                    obj[task.date] = arr.filter(el => el.date === task.date);
                }
            });

            return obj;
        }

        static taskAccordion(e){

            let parent = $(this).closest('.task');
            let content = $(parent).find('.task-content-wrap');

            if($(parent).hasClass('open')){
                $(content).slideUp(500, () => $(parent).removeClass('open'));
            } else{
                $(content).slideDown(500, () => $(parent).addClass('open'));
            }

        }
    }

    let tasks = new Tasks();
    tasks.init();

})(jQuery);
