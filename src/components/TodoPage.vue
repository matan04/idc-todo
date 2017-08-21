<template>
  <div class="card" v-bind:style="{ background: todo.background }">

    <div class="card-body">
      <div class='card-title'>
        <label>
          <h3 style="display: inline-block;">{{ todo.title }}</h3>
          <span class="badge badge-warning" v-show="checkShare">Shared</span>
        </label>

        <span class='pull-right todo-action' v-on:click="deleteTodo" v-show="!isShareView">
          <i class='fa fa-trash-o'></i>
        </span>
        <span class='pull-right todo-action' v-on:click="toggleShareDialog" v-show="!isShareView">
          <i class='fa fa-share'></i>
        </span>
      </div>

      <div class="input-group input-group-lg">
        <span class="input-group-addon">@</span>
        <input type="text" v-model="searchText" class="form-control" placeholder="Search Task...">
      </div>
    </div>

    <task v-on:delete-task="deleteTask" v-for="task in todo.tasks" v-bind:task="task" v-show="!isShareView"></task>

    <create-task v-on:add-task="addTask"></create-task>

    <modal :showModal="showShareDialog" :closeAction="toggleShareDialog">
      <h3 slot="header" style="width: 100%;direction: ltr;">Share Todo List</h3>
      <div slot="body">
        <div class="form-group">
          <label>Username</label>
          <input type="email" class="form-control" placeholder="Enter username" v-model="shareWith">
          <small id="emailHelp" class="form-text text-muted">Enter username of the person you like to share with.
          </small>
        </div>
        <button class="btn btn-primary" v-on:click="shareTodo">Submit</button>
      </div>
    </modal>

  </div>
</template>

<script type="text/javascript">
  import Modal from 'modal-vue';
  import Task from './Task';
  import CreateTask from './CreateTask';

  export default {
    props: ['id'],
    components: {
      Task,
      CreateTask,
      Modal,
    },
    data() {
      return {
        todo: {},
        errors: [],
        searchText: '',
        showShareDialog: false,
        shareWith: '',
        isShareView: false,
        checkShare: false,
      };
    },
    created() {
      const that = this;
      this.$store.state.getters.getTodo(this.id)
      .then((data) => {
        that.todo = data;
        that.shareWith = data && data.shareWith && data.shareWith.username;
      });
    },
    watch: {
      searchText(val) {
        this.$store.state.getters.searchTasks(this.id, val)
        .then((data) => {
          this.todo.tasks = data;
        });
      },
      todo() {
        this.checkShare = this.todo && this.todo.shareWith && this.todo.shareWith.username !== undefined;
        this.shareWith = todo && todo.shareWith && todo.shareWith.username;
      },
    },
    methods: {
      toggleShareDialog() {
        this.showShareDialog = !this.showShareDialog;
      },
      shareTodo() {
        const that = this;
        this.$store.state.getters.shareTodo(this.todo, this.shareWith)
        .then((todo) => {
          that.todo = todo;
          that.toggleShareDialog();
        });
      },
      deleteTodo() {
        this.$store.state.getters.deleteTodo(this.todo).then(() => {
          this.$router.push({ name: 'lists' });
        });
      },
      deleteTask(task) {
        this.$store.state.getters.deleteTask(this.todo, task);
      },
      addTask(data) {
        this.$store.state.getters.addTask(this.todo, data);
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

  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5) !important;
  }

  .modal-header {
    direction: rtl;
  }

  .close {
    width: 15px;
  }

  .todo-action {
    margin-right: 5px;
  }
</style>
