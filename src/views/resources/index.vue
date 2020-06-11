<template>
  <div>
    <van-dropdown-menu>
      <van-dropdown-item
        v-model="value1"
        :options="option1"
        title="人工检阅状态"
        @change="change_manual_status(value1)"
      />
      <van-dropdown-item
        v-model="value2"
        :options="option2"
        title="状态"
        @change="change_status(value2)"
      />
      <van-dropdown-item
        v-model="value3"
        :options="option3"
        title="是否疑似"
        @change="change_maybe_invalid(value3)"
      />
    </van-dropdown-menu>
    <van-list
      class="list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-swipe-cell v-for="item in resour" :key="item.id">
        <van-cell :border="false">
          <van-image
            v-if="item.typeData == 1"
            class="chart-text"
            width="100%"
            lazy-load
            :src="item.img"
            :res_type="item.res_type"
            v-on:click="play(item)"
          />
          <video
            v-else-if="item.typeData == 2"
            class="video-js vjs-default-skin"
            id="my-video"
            controls
            preload="none"
            x5-playsinline
            webkit-playsinline
            playsinline
            poster
            x-webkit-airplay="allow"
          >
            <source :src="item.img">
          </video>
          <van-field v-else-if="item.typeData == 3" v-model="item.img" readonly/>
          <van-cell :border="false" :value="item.center"/>
        </van-cell>
        <template #right>
          <van-button
            square
            type="danger"
            class="delete-button"
            v-on:click="Disable(item)"
          >{{item.danger}}</van-button>
          <van-button
            square
            type="primary"
            class="delete-button"
            v-on:click="Enable(item)"
          >{{item.primary}}</van-button>
        </template>
      </van-swipe-cell>
    </van-list>
  </div>
</template>


<script>
import api from "@/api/resources";
import { black } from "color-name";
import videojs from 'video.js'

var url = require("url");
var parse_url = null;
var Page = 1;
var PageCount = 0;
var new_list = [];
var parameter = {};
//typeData 1：图片、2：视频、3:文字
var typeDataImg = 1;
var typeDataVoice = 2;
var typeDataText = 3;
var Enaid = {};
var init_data = function() {
  console.log("初始化");
  var data = arguments;
  if (window.location.href.lastIndexOf("#") > -1) {
    parse_url = url.parse(window.location.href.replace("#", ""));
  } else {
    parse_url = url.parse(window.location.href);
  }
  new_list = [];
  Page = 1;
  if (data.length > 0) {
    for (let index = 0; index < data.length; index++) {
      const element = data[index];
      for (const key in element) {
        parameter[key] = element[key];
      }
    }
  } else {
    parameter = {
      "applicationForm[manual_status]": "",
      "applicationForm[status]": "",
      "applicationForm[maybe_invalid]": ""
    };
  }
};
export default {
  name: "Resources",
  data() {
    return {
      resour: [
        {
          id: 0,
          img: "",
          center: "",
          danger: "禁用",
          primary: "启用",
          video_url: "",
          res_type: "",
          typeData: 1
        }
      ],
      value1: 0,
      value2: 0,
      value3: 0,
      option1: [
        { text: "全部", value: "" },
        { text: "待检阅", value: -1 },
        { text: "非法", value: 0 },
        { text: "合法", value: 1 }
      ],
      option2: [
        { text: "全部", value: "" },
        { text: "禁用", value: 0 },
        { text: "启用", value: 1 }
      ],
      option3: [{ text: "全部", value: "" }, { text: "是", value: 1 }],
      loading: false,
      finished: false,
      show: false,
      timer: null
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
          api: "/app/user/reviewRes/multimedia?menuId=1070&page=" + Page,
          parameter: parameter
        })
        .then(res => {
          console.log(res);
          var authen = res.data.data.ResultData;
          PageCount = res.data.data.PageCount;
          for (let i = 0; i < authen.length; i++) {
            var every_data = {};
            every_data.id = authen[i].id;
            every_data.center = authen[i].review_info;
            every_data.res_type = authen[i].type;
            every_data.video_url = authen[i].video_url;
            every_data.danger = "禁用";
            every_data.primary = "启用";
            every_data.typeData = authen[i].type;
            var chart_every_data = authen[i];
            var data = this.get_chat_data(chart_every_data);
            every_data.img = data.img;
            new_list.push(every_data);
          }
          this.resour = new_list;
          console.log("数据构建成功");
        })
        .catch(err => {
          // console.log(err);
        });
    },
    get_chat_data(data) {
      var return_data = {};
      // 消息类型 1：图片、2：视频、3:文字
      switch (data.type) {
        case "1":
          return_data.typeData = typeDataImg;
          return_data.img = data.img_url;
          break;
        case "2":
          return_data.typeData = typeDataVoice;
          return_data.img = data.video_url;
          break;
        case "3":
          return_data.typeData = typeDataText;
          return_data.img = data.news_content;
          break;
        default:
          return_data.typeData = typeDataText;
          return_data.img = "消息类型错误";
      }
      return return_data;
    },
    change_manual_status(manual_status) {
      init_data({ "applicationForm[manual_status]": manual_status });
      this.getData();
    },
    change_status(status) {
      init_data({ "applicationForm[status]": status });
      this.getData();
    },
    change_maybe_invalid(maybe_invalid) {
      init_data({ "applicationForm[maybe_invalid]": maybe_invalid });
      this.getData();
    },
    Disable(data) {
      Enaid = {
        id: data.id,
        batch_num: 0
      };
      api
        .EnableData({
          api: "/app/user/reviewRes/batch?menuId=1072",
          parameter: Enaid
        })
        .then(res => {
          // console.log(res);
          for (let i = 0; i < this.resour.length; i++) {
            if (this.resour[i].id == data.id) {
              var searchvalue = "启用";
              var index = this.resour[i].center.indexOf(searchvalue);
              if (index > -1) {
                this.resour[i].center = this.resour[i].center.replace(
                  searchvalue,
                  "禁用"
                );
              }
              black;
            }
          }
          console.log("数据构建成功");
        });
    },
    Enable(data) {
      Enaid = {
        id: data.id,
        batch_num: 1
      };
      api
        .EnableData({
          api: "/app/user/reviewRes/batch?menuId=1072"
          // parameter: Enaid
        })
        .then(res => {
          // console.log(res);
          for (let i = 0; i < this.resour.length; i++) {
            if (this.resour[i].id == data.id) {
              var searchvalue = "禁用";
              var index = this.resour[i].center.indexOf(searchvalue);
              if (index > -1) {
                var center = this.resour[i].center.replace(searchvalue, "启用");
                this.resour[i].center = center;
              }
              black;
            }
          }
          console.log("数据构建成功");
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
        // console.log("page=" + Page);
        this.getData(Page++);
      }
    },

    showPopup() {
      this.show = true;
    }
  },
  beforeCreate: function() {
    console.log("进入");
    init_data();
  },
  beforeDestroy() {
    console.log("离开");
    window.removeEventListener("scroll", this.handleScroll, true); //离开当前组件别忘记移除事件监听哦
    init_data();
  }
};
</script>

<style>
.tag {
  width: 100%;
  height: 30px;
  color: #fff;
  padding: 20px;
  box-sizing: border-box;
}
.van-dropdown-menu {
  position: fixed;
  width: 100%;
  top: 43px;
  z-index: 1;
}
.list {
  margin-top: 49px;
}
.delete-button {
  margin-top: 100%;
}
.van-tag {
  display: inline-block;
}
#my-video{
  width: 100%;
  height: auto;
  max-height: 700px;
}
</style>
