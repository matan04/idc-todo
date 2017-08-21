<template>
  <div class="card" v-bind:style="{ background: todo.background }">

    <div class="card-body">
      <div class='card-title'>
        <label v-on:click="showList(todo)">
          <h3 style="display: inline-block;">{{ todo.title }}</h3>
          <span class="badge badge-warning" v-show="todo.shareWith">Shared</span>
        </label>

        <span class='pull-right' v-on:click="deleteTodo(todo)" v-show="!isShareView">
          <i class='fa fa-trash-o'></i>
        </span>
      </div>

    </div>


    <task v-on:delete-task="deleteTask" v-for="task in todo.tasks" v-bind:task="task" isShareView="isShareView"></task>

    <create-task v-on:add-task="addTask" v-show="!isShareView"></create-task>

  </div>
</template>

<script type="text/javascript">
  import Task from './Task';
  import CreateTask from './CreateTask';

  export default {
    props: ['todo', 'isShareView'],
    components: {
      Task,
      CreateTask,
    },
    methods: {
      deleteTodo(todo) {
        this.$store.state.getters.deleteTodo(todo);
      },
      deleteTask(task) {
        this.$store.state.getters.deleteTask(this.todo, task);
      },
      addTask(data) {
        this.$store.state.getters.addTask(this.todo, data);
      },
      showList(data) {
        this.$router.push({ name: 'todo', params: { id: data.id } });
      },
    },
  };
</script>

<style>

  .card-title {
    margin-bottom: 0;
  }

</style>
