<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索关键词" @search="onSearch(value)"/>
    <van-list>
      <van-cell
        v-for="item in reportData"
        :key="`reportData${item.id}`"
        :title="item.name"
        :label="item.type"
        center
      >
        <template #icon>
          <div style="paddingRight: 10px">
            <van-image width="50" fit="contain" height="50" lazy-load :src="item.poto"/>
          </div>
        </template>
        <template #right-icon>
          <div class="authentication">
            <p>{{item.staten}}</p>
          </div>
          <van-button type="primary" size="small" @click="send(item.id, item.status)">详情</van-button>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
import api from "@/api/report";

var url = require("url");
var parse_url = null;
var Page = 1;
var PageCount = 0;
var new_list = [];
var parameter = {};
var init_data = function() {
  console.log("初始化");
  if (window.location.href.lastIndexOf("#") > -1) {
    parse_url = url.parse(window.location.href.replace("#", ""));
  } else {
    parse_url = url.parse(window.location.href);
  }
  new_list = [];
  Page = 1;
  parameter = {};
};
export default {
  name: "Report",
  data() {
    return {
      value: "",
      reportData: [
        {
          id: 1,
          poto: "",
          name: "",
          type: "女",
          num: 0,
          staten: 1, //状态
          status: 1
        }
      ]
    };
  },
  beforeCreate: function() {
    init_data();
  },
  mounted() {
    this.getData();
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    getData() {
      api
        .getData({
          api: "/app/report/report/index?menuId=1005&page=" + Page,
          parameter: parameter
        })
        .then(res => {
          console.log(res);
          var report = res.data.data.ResultData;
          PageCount = res.data.data.PageCount;
          for (let i = 0; i < report.length; i++) {
            var every_data = {};
            every_data.id = report[i].report_id;
            every_data.poto = report[i].user_avatar;
            every_data.name = report[i].user_name;
            every_data.type = report[i].user_sex;
            var chart_every_data = report[i];
            every_data.status = report[i].status;
            every_data.staten = this.exam(chart_every_data);
            new_list.push(every_data);
          }
          this.reportData = new_list;
          console.log("数据构建成功");
        })
        .catch(err => {
          console.log(err);
        });
    },
    exam(data) {
      var return_data = "";
      switch (data.status) {
        case "0":
          return_data = "待审核";
          break;
        case "1":
          return_data = "审核通过";
          break;
        case "2":
          return_data = "审核拒绝";
          break;
        case "3":
          return_data = "警告用户";
          break;
        case "4":
          return_data = "冻结用户账户";
          break;
        case "5":
          return_data = "禁用用户账户";
          break;
        default:
          return_data = "消息错误";
          return_data.value = "消息类型错误";
      }
      return return_data;
    },
    handleScroll() {
      clearTimeout(this.timer); //清除定時器
      this.timer = setTimeout(this.ScrollEnd, 500);
      this.scrollT =
        document.documentElement.scrollTop || document.body.scrollTop;
    },
    ScrollEnd() {
      this.stopscroll =
        document.documentElement.scrollTop || document.body.scrollTop; //獲取滾動停止后的scrolltop
      if (this.stopscroll == this.scrollT) {
        this.getData(Page++);
      }
    },
    onSearch(val) {
      parameter = {
        "applicationForm[user_name]": val
      };
      Page = 1;
      new_list = [];
      this.getData();
    },
    send(id, status) {
      if (status > 0) {
        return this.$router.push({ path: "/details", query: { id: id } });
      }else{
        return this.$router.push({ path: "/reviewed", query: { id: id } });
      }
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, true); //离开当前组件别忘记移除事件监听哦
    init_data();
  }
};
</script>

<style>
.authentication {
  margin: auto 2%;
}
</style>