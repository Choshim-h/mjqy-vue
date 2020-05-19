<template>
  <div>
    <van-form @submit="onSubmit">
      <van-field v-model="username" name="用户信息" label="用户信息" placeholder="用户信息"/>
      <van-cell title="会员期限" :value="date" @click="show = true"/>
      <van-calendar v-model="show" :max-date="maxDate" type="range" @confirm="onConfirm"/>
      <van-field
        readonly
        clickable
        label="状态"
        :value="value"
        placeholder="选择状态"
        @click="showPicker = true"
      />
      <van-popup v-model="showPicker" round position="bottom">
        <van-picker
          show-toolbar
          :columns="columns"
          @cancel="showPicker = false"
          @confirm="onAuthentication"
        />
      </van-popup>
      <van-field
        v-model="message"
        rows="5"
        autosize
        label="留言"
        type="textarea"
        placeholder="请输入留言"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>


<script>
export default {
  data() {
    return {
      username: "",
      date: "",
      show: false,
      maxDate: new Date(2025, 12, 31),
      value: "",
      showPicker: false,
      columns: ["认证成功", "认证失败"],
      message: ""
    };
  },
  methods: {
    onSubmit(values) {
      console.log("submit", values);
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      const [start, end] = date;
      this.show = false;
      this.date = `${this.formatDate(start)} ~ ${this.formatDate(end)}`;
    },
    onAuthentication(value) {
      this.value = value;
      this.showPicker = false;
    }
  },
  mounted() {}
};
</script>