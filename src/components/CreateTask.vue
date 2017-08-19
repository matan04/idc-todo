<template>
  <div class="card-footer">

    <div class="btn btn-success col align-self-center" v-show="!isCreating" v-on:click="openForm">
      <i class="add icon"></i>
      Add Task
    </div>

    <div class="" v-show="isCreating">

      <div class="extra content ui input">
        <input type='text' v-model="titleText" ref='title' class="form-control" placeholder="Title" v-on:mouseover="$event.target.focus()">
      </div>

      <div class="btn-group col align-self-center" role="group" style="margin-top: 5px;">
        <button class='btn btn-primary' v-on:click="sendForm()">
          Create
        </button>
        <button class='btn btn-secondary' v-on:click="closeForm">
          Cancel
        </button>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        titleText: '',
        isCreating: false,
      };
    },
    methods: {
      openForm() {
        this.isCreating = true;
      },
      closeForm() {
        this.isCreating = false;
        this.titleText = '';
      },
      sendForm() {
        if (this.titleText.length > 0) {
          const title = this.titleText;
          this.$emit('add-task', {
            title,
          });
          this.titleText = '';
        }
        this.isCreating = false;
      },
    },
  };
</script>
