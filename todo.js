var app = {}; //tạo đối tượng app

//Tạo model cho 1 dòng
app.Todo = Backbone.Model.extend({
    default: {
        title: '',
        completed: false
    }
});

//Tạo collection cho để lưu trữ danh sách
app.TodoList = Backbone.Collection.extend({
    model: app.Todo,
    localStorage: new Store("backbone-todo")
});

//Tạo 1 đối tượng của collection
// app.todoList = new app.TodoList();

//Tạo view để hiển thị 1 dòng trong list
app.TodoView = Backbone.View.extend({
    tagName: 'li',
    template: _.template($('#item-template').html()),
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.input = this.$('.edit');
        return this;
    },
    initialize: function() {
        this.model.on('change', this.render, this);
        this.model.on('destroy', this.remove, this); // xóa khỏi DOM
    },
    events: {
        'dblclick span': 'edit',
        'keypress .edit': 'updateOnEnter',
        'blur .edit': 'close',
        'click .destroy': 'destroy'
    },
    edit: function() {
        this.$el.addClass('editing');
        this.input.focus();
    },
    close: function() {
        var value = this.input.val().trim();
        if (value) {
            this.model.save({
                title: value
            });
        }
        this.$el.removeClass('editing');
    },
    updateOnEnter: function(e) {
        if (e.which == 13) {
            this.close();
        }
    },
    destroy: function() {
        this.model.destroy();
    }
});

//Tạo view hiển thị cho todolist
app.AppView = Backbone.View.extend({
    el: '#todoapp',
    initialize: function() {
        this.input = this.$('#new-todo');

        app.todoList = new app.TodoList();

        app.todoList.on('add', this.addAll, this);
        app.todoList.on('reset', this.addAll, this);
        app.todoList.fetch(); //Load dữ liệu từ local storage
    },
    events: {
        'keypress #new-todo': 'createTodoOnEnter',
        'click  #btnAdd': 'createTodoOnClick',
    },
    createTodoOnClick: function() {
        if (!this.input.val().trim()) {
            return;
        }
        app.todoList.create(this.newAttributes());
        this.input.val('');
    },
    createTodoOnEnter: function(e) {
        if (e.which !== 13 || !this.input.val().trim()) {
            return;
        }
        app.todoList.create(this.newAttributes());
        this.input.val('');
    },
    addOne: function(todo) {
        var view = new app.TodoView({
            model: todo
        });
        $('#todo-list').append(view.render().el); //render dòng mới thêm trên DOM
    },
    addAll: function() {
        this.$('#todo-list').html('');
        app.todoList.each(this.addOne, this);
    },
    newAttributes: function() {
        return {
            title: this.input.val().trim(),
            completed: false
        }
    }
});

//Khởi tạo todolist
app.AppView = new app.AppView();