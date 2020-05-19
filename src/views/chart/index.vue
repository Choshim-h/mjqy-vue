<template>
  <div class="h-100">
    <div class="content-box">
      <template v-for="item in list">
        <div :key="item.id" v-if="item.type === 1" class="chart-right">
          <div class="chart-text">{{ item.value }}</div>
          <van-image
            class="chart-photo"
            width="50"
            fit="contain"
            height="50"
            lazy-load
            :src="mePhoto"
          />
        </div>
        <div :key="item.id" v-if="item.type === 2" class="chart-left">
          <van-image
            class="chart-photo"
            width="50"
            fit="contain"
            height="50"
            lazy-load
            :src="thePhoto"
          />
          <div class="chart-text">{{ item.value }}</div>
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
export default {
  name: "Chart",
  data() {
    return {
      thePhoto: "https://img.yzcdn.cn/vant/cat.jpeg",
      mePhoto: "https://img.yzcdn.cn/vant/apple-2.jpg",
      list: [
        {
          id: 1,
          type: 2,
          value: "你好"
        },
        {
          id: 2,
          type: 1,
          value: "好个屁"
        }
      ],
      value: ""
    };
  },
  mounted() {},
  methods: {
    send() {
      this.list.push({
        id: +new Date(), // 临时id，或者后台返回，主要是保证每条消息唯一
        type: 1,
        value: this.value
      });
      this.value = "";
    }
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
