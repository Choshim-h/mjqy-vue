<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索关键词" @search="onSearch(value)"/>
    <van-list>
      <van-cell
        v-for="item in authenData"
        :key="item.id"
        :title="item.name"
        :label="item.gender"
        center
      >
        <template #icon>
          <div style="paddingRight: 10px">
            <van-image width="50" fit="contain" height="50" lazy-load :src="item.poto"/>
          </div>
        </template>
        <template #right-icon>
          <div class="authentication">
            <p>{{item.state}}</p>
          </div>
          <van-button v-if="item.seen" type="primary" size="small" @click="send(item.id)">审核</van-button>
        </template>
      </van-cell>
    </van-list>
  </div>
</template>
<script>
import api from "@/api/index";

var url = require("url");
var parse_url = null;
var Page = 1;
var PageCount = 0;
var new_list = [];
var parameter = {};
export default {
  name: "Authentication",
  data() {
    return {
      value: "",
      authenData: [
        {
          id: 1,
          poto: "",
          name: "",
          gender: "",
          num: 0,
          state: " ",
          seen: "true"
        }
      ],
         timer:null
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
  },
  mounted() {
    this.getData();
    window.addEventListener("scroll", this.handleScroll, true);
  },
  methods: {
    getData() {
      console.log(parameter)
      api
        .getData({
          api: "/app/user/authenticate/index?menuId=1011&page=" + Page,
          parameter: parameter
        })
        .then(res => {
          console.log(res);
          var authen = res.data.data.ResultData;
          if (authen.length == 0) {
            //这是提示暂无数据
            return false;
          }
          PageCount = res.data.data.PageCount;
          for (let i = 0; i < authen.length; i++) {
            var every_data = {};
            every_data.id = authen[i].authenticate_id;
            every_data.poto = authen[i].authenticate_img;
            every_data.gender = authen[i].user_gender;
            every_data.name = authen[i].user_name;
            every_data.state = authen[i].status_str;
            if (authen[i].status == 3) {
              every_data.seen = true;
            } else {
              every_data.seen = false;
            }
            new_list.push(every_data);
          }
          this.authenData = new_list;
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
        this.getData(Page++);
      }
    },
    onSearch(val) {
      parameter = { "applicationForm[user_name]": val };
      Page = 1;
      new_list = [];
      this.getData();
    },
    send(id) {
      return this.$router.push({ path: "/examine", query: { id: id } });
    },

  },
  beforeDestroy() {
    window.removeEventListener("scroll",this.handleScroll, true); //离开当前组件别忘记移除事件监听哦
  }
};
</script>

<style>
.authentication {
  margin: auto 2%;
}
</style>
