<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索关键词" @search="onSearch(value)"/>
    <van-list>
      <van-cell
        v-for="item in userData"
        :key="item.id"
        :title="item.name"
        @click="ongetid(item.id)"
      >
        <template #icon>
          <div style="paddingRight: 10px">
            <van-image width="50" fit="contain" height="50" lazy-load :src="item.poto"/>
          </div>
        </template>
        <template #right-icon>
          <div>
            <van-tag round type="danger" v-show="item.num > 0">{{ item.num }}</van-tag>
          </div>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
import api from "@/api/user";
import variable from "@/utils/variable";

var url = require("url");
var parse_url = null;
var Page = 1;
var PageCount = 0;
var new_list = [];
var parameter = {};
export default {
  name: "Index",
  data() {
    return {
      value: "",
      userData: [
        {
          id: 1,
          poto: "",
          name: "",
          num: 0
        }
      ],
      timer: null,
      scrollT: 0,
      stopscroll: 0
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
    Page = 1;
    parameter = {
        "applicationForm[target_user_id]": variable.getQueryVariable(
            "id",
            parse_url.query
        )
    };
  },
  mounted() {
    this.getData();
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    getData() {
      api
        .getData({
          api: "/app/im/iM/OperationChatUserList?menuId=1052&page=" + Page,
          parameter: parameter
        })
        .then(res => {
          var user = res.data.data.ResultData;
          if (user.length == 0) {
            //这是提示暂无数据
            return false;
          }
          PageCount = res.data.data.PageCount;
          console.log(1);
          for (let i = 0; i < user.length; i++) {
            var every_data = {};
            every_data.id = user[i].user_id;
            every_data.poto = user[i].user_avatar;
            every_data.name = user[i].user_name;
            every_data.num = user[i].total_unread;
            new_list.push(every_data);
          }
          this.userData = new_list;
          console.log("数据构建成功");
        })
        .catch(err => {
          console.log(err);
        });
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
        console.log("page=" + Page);
        this.getData(Page++);
      }
    },
    onSearch(val) {
      parameter = {
        "applicationForm[user_name]": val,
        "applicationForm[target_user_id]": variable.getQueryVariable(
          "id",
          parse_url.query
        )
      };
      Page = 1;
      new_list = [];
      this.getData();
      console.log(33);
    },
    ongetid(id) {
      return this.$router.push({
        path: "/chart",
        query: {
          uid: id,
          jid: variable.getQueryVariable("id", parse_url.query)
        }
      });
    }
  },
  beforeDestroy() {
      window.removeEventListener("scroll",this.handleScroll, true); //离开当前组件别忘记移除事件监听哦
  }
};
</script>