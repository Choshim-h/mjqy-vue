<template>
  <div>
    <van-search class="search" v-model="value" placeholder="请输入搜索关键词" @search="onSearch(value)"/>
    <van-list v-model="loading">
      <van-cell
        v-for="item in listData"
        :key="item.id"
        :title="item.name"
        @click="onGetid(item.id)"
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
import api from "@/api/index";

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
    parameter={};
};
export default {
  name: "Index",
  data() {
    return {
      value: "",
      listData: [
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
          api: "/app/im/iM/OperationList?menuId=1051&page=" + Page,
          parameter: parameter //这是填写搜索的
        })
        .then(res => {
          var list = res.data.data.ResultData;
          PageCount = res.data.data.PageCount;
          for (let i = 0; i < list.length; i++) {
            var every_data = {};
            every_data.id = list[i].user_id;
            every_data.poto = list[i].user_avatar;
            every_data.name = list[i].user_name;
            every_data.num = list[i].total_unread;
            new_list.push(every_data);
          }
          this.listData = new_list;
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
    onGetid(id) {
      return this.$router.push({ path: "/user", query: { id: id } });
    }
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, true); //离开当前组件别忘记移除事件监听哦
    init_data();
  }
};
</script>

<style>
</style>
