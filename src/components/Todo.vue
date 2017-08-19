<template>
  <div class="col-sm-3">

    <div class="card" v-bind:style="{ background: todo.background }">

      <div class="card-body" v-show="!isEditing">
        <div class='card-title'>
          <label v-on:click="showForm">
            {{ todo.title }}

          </label>

          <span class='pull-right' v-on:click="deleteTodo(todo)">
          <i class='fa fa-trash-o'></i>
        </span>
        </div>

      </div>


      <task v-on:delete-task="deleteTask" v-for="task in todo.tasks" v-bind:task="task" v-show="!isEditing" ></task>

      <create-task v-on:add-task="addTask" v-show="!isEditing"></create-task>


      <div class="card-body" v-show="isEditing">
        <div class='form-group'>
          <label>Title</label>
          <input class="form-control" type='text' v-model="todo.title" v-on:mouseover="$event.target.focus()">
        </div>
      </div>

      <div class="card-footer text-center" v-on:click="hideForm" v-show="isEditing">
        <i class="fa fa-close"></i>
        Close
      </div>
    </div>
  </div>
</template>

<script type="text/javascript">
  import Task from './Task';
  import CreateTask from './CreateTask';

  export default {
    props: ['todo'],
    components: {
      Task,
      CreateTask,
    },
    data() {
      return {
        isEditing: false,
      };
    },
    methods: {
      showForm() {
        this.isEditing = true;
      },
      hideForm() {
        this.isEditing = false;
      },
      deleteTodo(todo) {
        this.$emit('delete-todo', todo);
      },
      deleteTask(task) {
        const index = this.todo.tasks.indexOf(task);
        this.todo.tasks.splice(index, 1);
      },
      addTask(data) {
        this.todo.tasks.push({
          title: data.title,
          done: false,
          tasks: [],
        });
      },
    },
  };
</script>

<style>

  .card-title {
    margin-bottom: 0;
  }

  .card {
    margin-top: 10px;
  }
</style>
