<template>
  <div>
    <div class="reportD">举报详情</div>
    <van-form @submit="onSubmit">
      <van-field v-model="username" name="用户信息" label="用户信息" placeholder="用户信息"/>
      <van-field name="uploader" label="用户图像">
        <template #input>
          <img src="https://img.yzcdn.cn/vant/leaf.jpg" style="width: 100px" alt srcset>
        </template>
      </van-field>
      <van-field v-model="pho" name="用户手机号码" label="用户手机号码"/>
      <van-cell title="创建时间" :value="date"/>
      <van-field v-model="mold" name="类型" label="类型"/>
      <van-field v-model="content" name="举报内容" label="举报内容"/>
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
          @confirm="onConfirm"
        />
      </van-popup>
      <van-field v-model="target" name="举报目标信息" label="举报目标信息"/>
      <van-field v-model="auditTime" name="审核时间" label="审核时间"/>
      <van-field v-model="auditDescription" name="审核描述" label="审核描述"/>
      <div style="margin: 16px;">
        <van-button type="primary" to="report">返回</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "",
      pho: "280984503",
      date: `2020-05-15`,
      mold: "",
      content: "",
      value: "",
      showPicker: false,
      columns: ["举报成功", "举报失败"],
      target: "",
      auditTime: "",
      auditDescription:""
    };
  },
  // mounted() {
  //   this.formatDate();
  // },
  methods: {
    onSubmit(values) {
      console.log("submit", values);
    },
    onConfirm(value) {
      this.value = value;
      this.showPicker = false;
    }
  }
};
</script>

<style>
.reportD{
  margin: 10px;
}
</style>
