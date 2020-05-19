<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索关键词"/>
    <van-list
      v-model="loading"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <van-cell
        v-for="item in listData"
        :key="`listData${item.id}`"
        :title="item.name"
        @click="$router.push('/user')"
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

export default {
  name: "Index",
  data() {
    return {
      value: "",
      listData: [
        {
          id: 1,
          poto: "https://img.yzcdn.cn/vant/cat.jpeg",
          name: "大佬胡吹",
          // chart: "随便说了啥",
          num: 0
        },
        {
          id: 2,
          poto: "https://img.yzcdn.cn/vant/apple-2.jpg",
          name: "大佬胡吹",
          // chart: "随便说了啥",
          num: 4
        },
        {
          id: 3,
          poto: "https://img.yzcdn.cn/vant/apple-1.jpg",
          name: "大佬胡吹",
          // chart: "随便说了啥",
          num: 4
        },
        {
          id: 4,
          poto: "",
          name: "大佬胡吹",
          // chart: "随便说了啥",
          num: 4
        },
        {
          id: 4,
          poto: "",
          name: "大佬胡吹",
          // chart: "随便说了啥",
          num: 4
        },
        {
          id: 4,
          poto: "",
          name: "大佬胡吹",
          // chart: "随便说了啥",
          num: 4
        },
        {
          id: 4,
          poto: "",
          name: "大佬胡吹",
          // chart: "随便说了啥",
          num: 4
        },
        {
          id: 4,
          poto: "",
          name: "大佬胡吹",
          // chart: "随便说了啥",
          num: 4
        },
        {
          id: 4,
          poto: "",
          name: "大佬胡吹",
          // chart: "随便说了啥",
          num: 4
        }
      ],
      error: false,
      loading: false,
      finished: false
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      api.getData ({
        api: 'common.first.level.area'
      })
      .then(res => {
        console.log(res)
      })
      .catch(err => {
        console.log(err)
      })
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.listData.push(this.listData.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.listData.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    }
  }
};
</script>