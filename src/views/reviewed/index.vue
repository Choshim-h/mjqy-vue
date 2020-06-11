<template>
  <div>
    <div class="reportD">举报详情</div>
    <van-form @submit="onSubmit">
      <van-cell v-for="item in reviewedData" :key="item.id">
        <van-field v-model="item.id" name="id" label="id" hidden readonly placeholder="用户信息"/>
        <van-field v-model="item.username" label="用户信息" readonly placeholder="用户信息"/>
        <van-field v-model="item.pho" label="用户手机号码" readonly/>
        <van-field label="被举报用户图像">
          <template #input>
            <img :src="item.img" style="width: 80%" alt srcset>
          </template>
        </van-field>
        <van-cell title="创建时间" :value="item.date"/>
        <van-field v-model="item.mold" label="类型" readonly/>
        <van-field v-model="item.content" label="举报内容" readonly/>
        <van-field v-model="item.state" label="状态" readonly/>
        <van-field v-model="item.target" label="举报目标信息" readonly/>
        <van-field
          readonly
          clickable
          label="审核"
          :value="value"
          name="status"
          placeholder="选择审核类型"
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
        <van-cell title="冻结日期" :value="tiem" @click="showTiem = true"/>
        <van-calendar v-model="showTiem" :max-date="maxDate" type="range" @confirm="ontiemDate"/>
        <van-field v-model="item.auditDescription" name="status_desc" label="审核描述"/>
        <div style="margin: 16px;">
          <van-button class="van-button--round button" type="primary" to="report">返回</van-button>
          <van-button round type="info" native-type="submit">提交</van-button>
        </div>
      </van-cell>
    </van-form>
  </div>
</template>

<script>
import api from "@/api/reviewed";
import variable from "@/utils/variable";

var url = require("url");
var new_list = [];
var parse_url = null;
var parameter = {};
var init_data = function() {
  console.log("初始化");
  if (window.location.href.lastIndexOf("#") > -1) {
    parse_url = url.parse(window.location.href.replace("#", ""));
  } else {
    parse_url = url.parse(window.location.href);
  }
  new_list = [];
};
export default {
  data() {
    return {
      reviewedData: [
        {
          id: 0, //id
          username: "", //举报用户昵称
          img: "", //举报用户头像
          pho: "", //用户手机号码
          date: ``, //创建时间
          mold: "", //举报类型
          content: "", //举报内容
          state: "", //状态
          target: "", //举报目标信息
          select_date: "",
          maxDate: new Date(2025, 12, 31),
          auditDescription: ""
        }
      ],
      value: "",
      showPicker: false,
      columns: [
        "举报成功",
        "举报失败",
        "警告用户",
        "冻结用户账户",
        "禁用用户账户"
      ],
      tiem: "",
      showTiem: false,
      maxDate: new Date(2025, 12, 31)
    };
  },
  beforeCreate: function() {
    init_data();
    parameter = {
      id: variable.getQueryVariable("id", parse_url.query)
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      api
        .getData({
          api: "/app/report/report/detail?menuId=1005",
          parameter: parameter
        })
        .then(res => {
          console.log(res);
          var detail = res.data.data;
          for (let i = 0; i < detail.length; i++) {
            var every_data = {};
            every_data.id = detail[i].report_id; //id
            every_data.username = detail[i].user_name; //用户昵称
            every_data.img = detail[i].target_user_avatar; //用户图像
            every_data.pho = detail[i].user_phone; //用户电话
            every_data.date = detail[i].create_time; //创建时间
            every_data.mold = detail[i].report_type_info; //举报类型
            every_data.content = detail[i].content; //举报内容
            every_data.state = detail[i].status_str; //状态
            every_data.target = detail[i].target_associate_info; //举报目标信息
            new_list.push(every_data);
          }
          this.reviewedData = new_list;
          console.log("数据构建成功");
        })
        .catch(err => {
          console.log(err);
        });
    },
    onConfirm(value) {
      this.value = value;
      this.showPicker = false;
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    ontiemDate(date) {
      console.log(date);
      const [start, end] = date;
      this.showTiem = false;
      this.tiem = `${this.formatDate(start)}~${this.formatDate(end)}`;
      console.log(this.tiem);
    },
    onSubmit(data) {
      console.log(data);
      if (data.status == "") {
        this.$toast({
          text: "请选择状态",
          type: "wraning",
          duration: 3000
        });
        return false;
      }
      var send = {};
      switch (data.status) {
        case "举报成功":
          send["applicationForm[status]"] = 1;
          break;
        case "举报失败":
          send["applicationForm[status]"] = 2;
          break;
        case "警告用户":
          send["applicationForm[status]"] = 3;
          break;
        case "冻结用户账户":
          send["applicationForm[status]"] = 4;
          if (this.tiem == "") {
            this.$toast({
              text: "请选择冻结时间",
              type: "wraning",
              duration: 3000
            });
            return false;
          }
          if (this.tiem.length > 0) {
            var tiem = this.tiem.split("~");
            send["applicationForm[start_time]"] = tiem[0];
            send["applicationForm[end_time]"] = tiem[1];
          }
          break;
        case "禁用用户账户":
          send["applicationForm[status]"] = 5;
          break;
        default:
          this.$toast({
            text: "系统错误",
            type: "wraning",
            duration: 3000
          });
          return false;
      }
      if (data.status_desc == "" || data.status_desc == undefined) {
        this.$toast({
          text: "请填写描述",
          type: "wraning",
          duration: 3000
        });
        return false;
      }
      send["applicationForm[status_desc]"] = data.status_desc;
      send["applicationForm[report_id]"] = data.id;
      console.log(send);
      api
        .sendData({
          api: "/app/report/report/check?menuId=1005",
          parameter: send
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
              path: "/report"
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
    }
  },
  beforeDestroy() {
    init_data();
  }
};
</script>

<style>
.reportD {
  margin: 10px;
}
.button {
  margin-right: 20px;
}
</style>
