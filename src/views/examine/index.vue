<template>
  <div>
    <van-form @submit="onSubmit">
      <van-cell v-for="item in authenData" :key="item.id">
        <van-cell :border="false" title="用户信息" :value="item.userinformation"/>
        <van-image label="用户图像" width="60%" fit="contain" lazy-load :src="item.poto"/>
        <van-cell title="会员期限" :value="date" @click="show = true"/>
        <van-calendar v-model="show" :max-date="maxDate" type="range" @confirm="onConfirm"/>
        <van-field
          clickable
          label="状态"
          :value="value"
          placeholder="选择状态"
          readonly="readonly"
          name="authentication_status"
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
          name="authentication_content"
          placeholder="请输入留言"
        />
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">提交</van-button>
        </div>
      </van-cell>
    </van-form>
  </div>
</template>


<script>
import api from "@/api/Authentication";
import variable from "@/utils/variable";
var success_authentication_content = "您的真人认证审核通过！",
  fail_authentication_content = "您的真人认证审核未通过！原因：",
  success_authentication_check = "认证成功",
  fail_authentication_check = "认证失败";
var url = require("url");
var parse_url = null;
var new_list = [];
var parameter = {};
export default {
  data() {
    return {
      authenData: [
        {
          id: 0,
          userinformation: "",
          poto: ""
        }
      ],
      date: "",
      show: false,
      maxDate: new Date(2025, 12, 31),
      value: success_authentication_check,
      showPicker: false,
      columns: [
        {
          values: [
            success_authentication_check,
             fail_authentication_check
          ],
          defaultIndex: 0
        }
      ],
      message: success_authentication_content,
      show_center: false
    };
  },
  beforeCreate: function() {
    console.log("初始化");
    if (window.location.href.lastIndexOf("#") > -1) {
      parse_url = url.parse(window.location.href.replace("#", ""));
    } else {
      parse_url = url.parse(window.location.href);
    }
    new_list = [];
    parameter = {
      id_arr: variable.getQueryVariable("id", parse_url.query)
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      api
        .getData({
          api: "/app/user/authenticate/batch?menuId=1011",
          parameter: parameter
        })
        .then(res => {
          var result = res.data;
          if (result.code != 1) {
            this.$toast({
              text: result.msg,
              type: "wraning",
              duration: 3000
            });
            return false;
          }
          var authen = result.data;
          if (authen.length == 0) {
            //这是提示暂无数据
            return false;
          }
          for (let i = 0; i < authen.length; i++) {
            var every_data = {};
            every_data.id = authen[i].authenticate_id;
            every_data.userinformation =
              "用户昵称：" +
              authen[i].user_name +
              "，" +
              "性别：" +
              authen[i].user_gender;
            every_data.poto = authen[i].authenticate_img;
            new_list.push(every_data);
          }
          this.authenData = new_list;
          console.log("数据构建成功");
        })
        .catch(err => {
          console.log(err);
        });
    },
    onSubmit(data) {
      if (data.authentication_content == "") {
        this.$toast({
          text: "请填写审核描述",
          type: "wraning",
          duration: 3000
        });
        return false;
      }
      if (data.authentication_status == "") {
        this.$toast({
          text: "请选择状态",
          type: "wraning",
          duration: 3000
        });
        return false;
      }
      var send_data = {};
      send_data.batch_num = 1;
      if (data.authentication_status == fail_authentication_check) {
        send_data.status = 2;
      } else {
        send_data.status = 1;
      }
      send_data.id = variable.getQueryVariable("id", parse_url.query);
      if (this.date.length > 0) {
        var date = this.date.split("~");
        send_data.start_time = date[0];
        send_data.end_time = date[1];
      }
      send_data.status_desc = data.authentication_content;
      api
        .submitData({
          api: "/app/user/authenticate/batch?menuId=1011&batch_num=1",
          parameter: send_data
        })
        .then(res => {
          console.log(res);
          var result = res.data;
          if (result.code == 1) {
            this.$toast({
              text: result.msg,
              type: "success",
              duration: 3000
            });
            return this.$router.push({
              path: "/authentication"
            });
          } else {
            this.$toast({
              text: result.msg,
              type: "wraning",
              duration: 3000
            });
            return false;
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      const [start, end] = date;
      this.show = false;
      this.date = `${this.formatDate(start)}~${this.formatDate(end)}`;
    },
    onAuthentication(value) {
      this.value = value;
      if (this.value == success_authentication_check) {
        this.message = success_authentication_content;
      } else {
        this.message = fail_authentication_content;
      }
      this.showPicker = false;
    }
  }
};
</script>

<style>
.van-cell.van-cell--borderless .van-cell__title {
  width: 20%;
}
.van-cell__value {
  width: 70%;
}
</style>
