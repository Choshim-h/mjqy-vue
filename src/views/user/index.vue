<template>
  <div>
    <van-search v-model="value" placeholder="请输入搜索关键词" />
    <van-cell
      v-for="item in listData"
      :key="`listData${item.id}`"
      :title="item.name"
      @click="$router.push('/chart')"
    >
      <template #icon>
        <div style="paddingRight: 10px">
          <van-image width="50" fit="contain" height="50" lazy-load :src="item.poto" />
        </div>
      </template>
      <template #right-icon>
        <div>
          <van-tag round type="danger" v-show="item.num > 0">{{ item.num }}</van-tag>
        </div>
      </template>
    </van-cell>
  </div>
</template>
<script>
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
        }
      ]
    };
  }
};
</script>