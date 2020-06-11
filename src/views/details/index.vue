<template>
  <div>
    <div class="reportD">举报详情</div>
    <van-form @submit="onSubmit">
      <van-cell v-for="item in detailsData" :key="item.id">
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
        <van-field v-model="item.auditTime" label="审核时间" readonly/>
        <van-field v-model="item.auditDescription" name="status_desc" label="审核描述" readonly/>
        <div style="margin: 16px;">
          <van-button class="van-button--round button" type="primary" to="report">返回</van-button>
        </div>
      </van-cell>
    </van-form>
  </div>
</template>

<script>
import api from "@/api/details";
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
      detailsData: [
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
          auditTime: "", //审核时间
          auditDescription: "" //审核详述
        }
      ]
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
            every_data.auditTime = detail[i].status_mod_time; //审核时间
            every_data.auditDescription = detail[i].status_desc; //审核详述
            new_list.push(every_data);
          }
          this.detailsData = new_list;
          console.log("数据构建成功");
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
