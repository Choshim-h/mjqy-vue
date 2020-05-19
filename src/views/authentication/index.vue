<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索关键词"/>
    <van-list v-model="loading" :error.sync="error" error-text="请求失败，点击重新加载" :finished="finished" finished-text="没有更多了" @load="onLoad">
    <van-cell
      v-for="item in authenData"
      :key="`authenData${item.id}`"
      :title="item.name"
      :label="item.gender"
      @click="$router.push('/examine')"
      center
    >
      <template #icon>
        <div style="paddingRight: 10px">
          <van-image width="50" fit="contain" height="50" lazy-load :src="item.poto"/>
        </div>
      </template>
      <template #right-icon>
        <div class="authentication">
          <p>{{state}}</p>
        </div>
        <van-button type="primary" size="small">审核</van-button>
      </template>
    </van-cell>
    </van-list>
  </div>
</template>
<script>
export default {
  name: "Authentication",
  data() {
    return {
      value: "",
      state: " ",
      authenData: [
        {
          id: 1,
          poto: "https://img.yzcdn.cn/vant/cat.jpeg",
          name: "大佬胡吹",
          gender: "女",
          num: 0
        },
        {
          id: 2,
          poto: "https://img.yzcdn.cn/vant/apple-2.jpg",
          name: "大佬胡吹",
          gender: "女",
          num: 4
        },
        {
          id: 3,
          poto: "https://img.yzcdn.cn/vant/apple-1.jpg",
          name: "大佬胡吹",
          gender: "女",
          num: 4
        },
        {
          id: 4,
          poto: "",
          name: "大佬胡吹",
          gender: "女",
          num: 4
        }
      ],
      error: false,
      loading: false,
      finished: false,
      staten: 0,
      state: "",
      show: false,
    };
  },
  mounted() {
    this.exam();
  },
  methods: {
    exam() {
      if (this.staten == 0) {
        this.state = "未审核";
      }
      if (this.staten == 1) {
        this.state = "认证成功";
      } else {
        this.state = "认证失败";
      }
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.authenData.push(this.authenData.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.authenData.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    }
  }
};
</script>

<style>
.authentication {
  margin: auto 2%;
}
</style>
