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
                .then(this.addNewTask)
                .then(this.changeColorTheme)
                .catch(this.errorHandler);
        }

        checkToken(self){

            return new Promise(function (resolve, reject) {

                let index = document.cookie.indexOf('_id');
                let indexEnd = document.cookie.indexOf(';', index);
                let token = indexEnd === -1 ?
                    document.cookie.slice(index) :
                    document.cookie.slice(index, indexEnd);

                if(index !== -1) resolve(self);
                else reject('logout');
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

                let activeTaskContainer = $('#active-task .container');
                let doneTaskContainer = $('#all-task .container');

                let getActiveTaskHtml = self.undoneTasks ?
                    Tasks.renderTaskWrap(self.undoneTasks) : '';
                let getDoneTaskHtml = self.doneTasks ?
                    Tasks.renderTaskWrap(self.doneTasks) : '';

                activeTaskContainer.append(getActiveTaskHtml);
                doneTaskContainer.append(getDoneTaskHtml);

                if(!self.undoneTasks){
                    Tasks.emptyTasks(activeTaskContainer, 'У вас нет активных задач')
                }
                if (!self.doneTasks){
                    Tasks.emptyTasks(doneTaskContainer, 'У вас нет завершенных задач')
                }
                resolve(self);
            })
        }

        addEvent(self){
            console.log('Adding events...', self);

            $('.task-header').on('click', Tasks.taskAccordion)

        }

        errorHandler(type){
            if(type === 'logout'){
                this.logout();
            }else{
                console.error('Error');
            }
        }

        changeColorTheme(){
            let li = $('.change-color li');
            let blocks = $('[data-change]');
            let tabs_color =$('[data-change-color]');
            let color = localStorage.getItem('color') || '#00a1f1';

            function setColor(color) {
                blocks.each(function (i, e) {
                    $(e).css("background-color", color);
                });
                tabs_color.each(function (i, e) {
                    $(e).css("color", color);
                })

            }

            li.each(function(i, e) {
                let color = $(e).attr('data-color');
                $(e).css("background-color", color);
            });

            li.on('click', function() {
                let color = $(this).attr('data-color');
                setColor(color);
                localStorage.setItem('color', color);

            });

            setColor(color);
        }

        // addNewTask(task){
        //     this.modal = $('.edit-task');
        //     this.TaskBtn = $('.add-task');
        //     this.overlay = $('.overlay');
        //
        // }

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

        static renderTaskWrap(obj){
            let marcup = '';

            for( let day in obj){
                marcup += `<div>
                                <div class="task-day" data-change="background-color">
                                    <span class="day">${obj[day][0].day}</span>
                                    <span class="month">${obj[day][0].month}</span>
                                </div>

                                <div class="all-task-wrap">
                                    <div class="timeline" data-change="border-left-color"></div>
                                    ${Tasks.renderTasksByDay(obj[day])}
                                    
                                </div>
                            </div>`
            }

            return marcup;
        }

        static renderTasksByDay(array){
            let tasksMarcup = '';
            let date =Date.now();

            array.forEach(task =>{

                let taskWarning = date > task.ms ? 'warning' : '';
                let taskStatus = task.status === 'done' ? 'success' : '';

                tasksMarcup += `<div class="task ${taskStatus || taskWarning}">
						<div class="to-do-time" data-change="background-color">${task.time}</div>
						<div class="task-header flex-container">
							<span class="icon icon-arrow"></span>
							<span class="icon short-task-text">${task.taskText}</span>
							<span class="icon icon-cancel"></span>
						</div>
						<div class="task-content-wrap">
							<div class="time-row flex-container">
								<div class="task-icon">
									<span class="icon icon-time"></span>	
								</div>
								<div class="time">${task.time}</div>
								<div class="task-icon">
									<span class="icon icon-bell"></span>
								</div>
							</div>
							<div class="task-text-row flex-container">
								<div class="task-icon">
									<span class="icon icon-list"></span>
								</div>
								<div class="text">${task.taskText}</div>
							</div>
							<div class="task-check-row check-done flex-container">
								<div class="task-icon">
									<span class="icon icon-check"></span>
								</div>
								<div class="check">
									<input type="checkbox" name="status" id="status">
									<label for="status">Я выполнил задачу</label>
								</div>
							</div>
							<div class="task-check-row check-current flex-container">
								<div class="task-icon">
									<span class="icon icon-check"></span>
								</div>
								<div class="check">
									<input type="checkbox" name="status" id="status">
									<label for="status">Здача еще не выполнена</label>
								</div>
							</div>
							<div class="task-edit-row flex-container">
								<span class="icon icon-edit"></span>
							</div>
							
						</div>
						<div class="task-message deadline">
							<div class="message-row flex-container">
								<div class="task-icon">
									<span class="icon icon-warning"></span>
								</div>
								<div class="text">
									<p>Вы не выполнили задачу</p>
								</div>
							</div>
						</div>
						<div class="task-message done">
							<div class="message-row flex-container">
								<div class="task-icon">
									<span class="icon icon-star"></span>
								</div>
								<div class="text">
									<p>Поздравляем!</p>
									<p>Вы справились с задачей</p>
								</div>
							</div>
						</div>
					</div>`

            });

            return tasksMarcup;
        }

        static emptyTasks(container, text){

            let alert = `<div class="alert empty-task"> ${text} </div>`;

            container.append(alert);
        }

    }

    let tasks = new Tasks();
    tasks.init();

})(jQuery);
