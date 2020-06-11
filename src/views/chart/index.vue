<template>
  <div class="h-100">
    <div class="content-box" id="chatRecord">
      <template v-for="item in listchart">
        <div :key="item.id" v-if="item.location === 1" class="chart-right">
          <div v-if="item.typeData == 1" class="chart-text">{{ item.value }}</div>
          <div v-else-if="item.typeData == 2" class="chart-img">{{ item.value }}</div>
          <div v-else-if="item.typeData == 3" class="chart-voice">{{ item.value }}</div>
          <div v-else-if="item.typeData == 4" class="chart-video">{{ item.value }}</div>
          <div v-else class="chart-text">{{ item.value }}</div>
          <van-image
            class="chart-photo"
            width="50"
            fit="contain"
            height="50"
            lazy-load
            :src="item.thePhoto"
          />
        </div>
        <div :key="item.id" v-if="item.location === 2" class="chart-left">
          <van-image
            class="chart-photo"
            width="50"
            fit="contain"
            height="50"
            lazy-load
            :src="item.thePhoto"
          />
          <!-- typeData 1 文字，2：图片，3：语音，4：视频 -->
          <div v-if="item.typeData == 1" class="chart-text">{{ item.value }}</div>
          <div v-else-if="item.typeData == 2" class="chart-img">{{ item.value }}</div>
          <div v-else-if="item.typeData == 3" class="chart-voice">{{ item.value }}</div>
          <div v-else-if="item.typeData == 4" class="chart-video">{{ item.value }}</div>
          <div v-else class="chart-text">{{ item.value }}</div>
        </div>
      </template>
    </div>
    <van-field class="input-box" v-model.trim="value" placeholder="输入内容" @click-right-icon="send">
      <template #right-icon>
        <van-button type="primary" size="small">发送</van-button>
      </template>
    </van-field>
  </div>
</template>

<script>
import api from "@/api/chart";
import variable from "@/utils/variable";
import { black } from "color-name";
var url = require("url");
var parse_url = null;
var Page = 1;
var PageCount = 0;
var new_list = [];
var parameter = {};
var root_id = null;
var user_id = null;
//typeData 1 文字，2：图片，3：语音，4：视频
var typeDataText = 1;
var typeDataImg = 2;
var typeDataVoice = 3;
var typeDataVideo = 4;
//1:右边 2：左边
var left_location = 2;
var right_location = 1;
function init_data() {
  console.log("初始化");
  if (window.location.href.lastIndexOf("#") > -1) {
    parse_url = url.parse(window.location.href.replace("#", ""));
  } else {
    parse_url = url.parse(window.location.href);
  }
  new_list = [];
  Page = 1;
  root_id = variable.getQueryVariable("jid", parse_url.query);
  user_id = variable.getQueryVariable("uid", parse_url.query);
  parameter = {
    "applicationForm[target_user_id]": root_id,
    "applicationForm[every_target_user_id]": user_id,
    // im_id_arr: im_id_arr
  };
}
export default {
  name: "Chart",
  data() {
    return {
      listchart: [
        {
          id: 1,
          //位置
          location: 2,
          value: "暂无数据",
          thePhoto: "",
          //类型
          typeData: 1
        }
      ],
      value: "", //聊天内容
      timer: null //定时器
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      api
        .getData({
          api:
            "/app/im/iM/OperationChatUserChatRecord?menuId=1053&page=" + Page,
          parameter: parameter
        })
        .then(res => {
          console.log(res);
          var chart = res.data.data.ResultData;
          if (chart.length == 0) {
            //这是提示暂无数据
            return false;
          }
          var UnreadId = [];
          var new_list_length = new_list.length;
          PageCount = res.data.data.PageCount;
          for (let i = 0; i < chart.length; i++) {
            var chart_every_data = chart[i];
            if (chart_every_data.is_reply) {
              UnreadId.push(chart_every_data.im_id);
            }
            var data = this.get_chat_data(chart_every_data);
            if (JSON.stringify(data) != "{}") new_list.push(data);
          }
          if (new_list.length > new_list_length) {
            this.listchart = new_list;
            console.log("数据构建成功");
          }
          if (UnreadId.length > 0) {
            this.setHaveRead(UnreadId.join(","));
          }
        })
        .catch(err => {
          console.log(err);
        });
    },
    get_chat_data(data) {
      var return_data = {};
      if (new_list.length > 0) {
        for (let i = 0; i < new_list.length; i++) {
          if (new_list[i].id == data.im_id) {
            return return_data;
          }
        }
      }
      return_data.id = data.im_id;
      // 消息类型 1:文字、2：图片、3:坐标、4：语音、5：视频、6：其他
      switch (data.news_type) {
        case "1":
          return_data.typeData = typeDataText;
          return_data.value = data.news_content;
          break;
        case "2":
          return_data.typeData = typeDataImg;
          return_data.value = data.resources_url;
          break;
        case "3":
          return_data.typeData = typeDataText;
          return_data.value = data.news_content;
          break;
        case "4":
          return_data.typeData = typeDataVoice;
          return_data.value = data.resources_url;
          break;
        case "5":
          return_data.typeData = typeDataVideo;
          return_data.value = data.resources_url;
          break;
        case "6":
          return_data.typeData = typeDataText;
          return_data.value = data.news_content;
          break;
        default:
          return_data.typeData = typeDataText;
          return_data.value = "消息类型错误";
      }
      if (data.im_type == "1") {
        return_data.location = right_location;
        return_data.thePhoto = data.sender_account_user_avatar;
      } else {
        //这是机器人的
        return_data.location = left_location;
        return_data.thePhoto = data.sender_account_user_avatar;
      }
      return return_data;
    },
    setHaveRead(im_id_arr){
      api.getData({
        api:"/app/im/iM/HaveRead?menuId=1055",
        parameter:{"operating_type":2,"im_id_arr":im_id_arr}
      })
      .then(res => {
          console.log(res);
        })
        .catch(err => {
          console.log(err);
        });
    },
    send() {
      var news = {};
      if (this.value == "") {
        this.$toast({
          text: "不能发送空白信息",
          type: "wraning",
          duration: 3000
        });
        return false;
      } else {
        news.target_user_id = variable.getQueryVariable("uid", parse_url.query);
        news.chat_user_id = variable.getQueryVariable("jid", parse_url.query);
        news.chat_content = this.value;
      }
      api
        .sendData({
          api: "/app/im/iM/UserChat?menuId=1057",
          parameter: news
        })
        .then(res => {
          console.log(res);
          var result = res.data;
          if (result.code == 1) {
            // this.$toast({
            //   // text: result.msg,
            //   type: "success",
            //   duration: 3000
            // });
            this.listchart.push({
              id: result.data.im_id, // 临时id，或者后台返回，主要是保证每条消息唯一
              value: this.value,
              location: right_location,
              thePhoto: result.data.user_avatar,
              typeData: typeDataText
            });
            this.value = "";
            Page--;
            return false;
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
      //
    }
  },
  updated() {
    // 聊天定位到底部
    let ele = document.getElementById("chatRecord");
    ele.scrollTop = ele.scrollHeight;
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll, true); //离开当前组件别忘记移除事件监听哦
    if (this.timer !== null) {
      window.clearInterval(this.timer); //移除定时器
    }
  },
  beforeMount() {
    //设置定时器，每3秒刷新一次
    this.timer = setInterval(Refresh, 15000);
    var self = this;
    function Refresh() {
      if (Page <= PageCount) {
        Page++;
        self.getData();
      } else {
        Page = 1;
      }
    }
  },
  beforeCreate: function() {
    init_data();
  }
};
</script>

<style lang="scss" scoped>
.content-box {
  max-height: 100%;
  padding-bottom: 50px;
  overflow-y: auto;
  .chart-text {
    background: #ffffff;
    border-radius: 6px;
    padding: 5px 10px;
    font-size: 14px;
    display: inline-block;
    line-height: 16px;
  }

  .chart-right {
    display: flex;
    justify-content: flex-end;
    padding: 10px 10px 10px 30%;
    .chart-photo {
      margin-left: 10px;
    }
  }
  .chart-left {
    display: flex;
    justify-content: flex-start;
    padding: 10px 30% 10px 10px;
    .chart-photo {
      margin-right: 10px;
    }
  }
}
.input-box {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
