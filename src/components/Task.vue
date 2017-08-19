<template>

  <ul class="list-group list-group-flush" style="background: inherit;">
    <li class="list-group-item" v-show="!isEditing" style="background: inherit;">
      <div class="form-group">
        <div class="form-check">
          <label class="form-check-label">
            <input class="form-check-input" type="checkbox" v-model="task.done">
            <label v-on:click="showForm">{{ task.title }}</label>
          </label>
          <span class='pull-right' v-on:click="deleteTask(task)">
          <i class='fa fa-close'></i>
        </span>
        </div>
      </div>
    </li>

    <li class="list-group-item" v-show="isEditing" style="background: inherit;">
      <input type='text' class="form-control" v-model="task.title" v-on:blur="hideForm"
             v-on:mouseover="$event.target.focus()">
    </li>
  </ul>

</template>

<script type="text/javascript">

  export default {
    props: ['task'],
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
      deleteTask(task) {
        this.$emit('delete-task', task);
      },
    },
  };
</script>

<style>
  label {
    min-width: 100px;
    display: inline-block;
  }

  .form-group, .form-check {
    margin: 0;
  }
</style>
