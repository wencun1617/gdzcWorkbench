<template>
  <div class="chart">
    <div class="header">
      品名二级分类统计
    </div>

    <div class="bar-charts" ref="bar"></div>
  </div>
</template>

<script>
import { getAsstLsProductCount } from "@/services/home";
import { debounce } from "@/common/utils";
export default {
  data() {
    return {
      debounceGetAsstLsProductCount: null, // 防抖后的请求维修统计
      option: {},
      color: ["#206DCF", "#64D6EF"], // 柱状图各个颜色
    };
  },
  props: {
    hbdwbh: {
      type: String,
      required: true,
    },
  },
  methods: {
    async _getAsstLsProductCount({ hbdwbh = this.hbdwbh }) {
      let res = await getAsstLsProductCount({
        // 维修统计数据请求结果
        hbdwbh,
      });
      console.log(res, "品名二级分类统计");
      if (!res.success) {
        // X轴分类
        this.option.xAxis[0].data = res.map((item) => {
          return item.name;
        });

        let priceArr = res.map((item) => {
          return item.price;
        });

        let countArr = res.map((item) => {
          return item.count;
        });

        this.option.series[0].data = priceArr;
        this.option.series[1].data = countArr;

        if (this.$refs.bar) {
          //解决echarts dom已经加载的报错
          let myChartOld = this.$echarts.getInstanceByDom(this.$refs.bar);
          if (myChartOld) {
            myChartOld.dispose();
          }
        }

        //  基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(this.$refs.bar);

        //  使用刚指定的配置项和数据显示图表
        myChart.setOption(this.option, true);

        // 让图表随着屏幕自适应
        window.addEventListener("resize", () => {
          myChart.resize();
        });
      }
    },
  },
  mounted() {
    this.option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
        },
        formatter: (params) => {
          let value = params[0].axisValue;
          for (let item of params) {
            if (item.seriesName == "金额") {
              value += `<br/> ${item.marker} ${item.seriesName} ${item.value} 元`;
            } else {
              value += `<br/> ${item.marker} ${item.seriesName} ${item.value}`;
            }
          }
          return value;
        },
      },
      legend: {
        orient: "horizontal",
        right: "5%",
        itemGap: 35,
        itemWidth: 20,
        itemHeight: 8,
        textStyle: {
          color: "#333333",
          fontSize: 15,
        },
      },
      grid: {
        left: "10%",
        right: "10%",
        top: "16%",
        bottom: "16%",
      },
      xAxis: [
        {
          type: "category",
          data: [],
          // 坐标轴刻度(轴线上的短线)  相关设置
          axisTick: {
            show: false,
          },
          // 坐标轴轴线相关设置
          axisLine: {
            show: false, // 是否显示坐标轴轴线
          },
          //  坐标轴刻度标签的相关设置
          axisLabel: {
            // 刻度标签文字的颜色，默认取 axisLine.lineStyle.color,支持回调函数，格式如下
            color: "#333333",
            fontSize: 14,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
          axisLabel: {
            // 刻度标签文字的颜色，默认取 axisLine.lineStyle.color,支持回调函数，格式如下
            color: "#4B4D4D",
            formatter: "{value} 元",
          },
          splitLine: {
            lineStyle: {
              color: "#F1F1F2",
              type: "solid",
              opacity: 0.8,
            },
          },
          interval: 2000,
          max: 10000,
        },
        {
          type: "value",
          axisLabel: {
            // 刻度标签文字的颜色，默认取 axisLine.lineStyle.color,支持回调函数，格式如下
            color: "#4B4D4D",
            formatter: "{value} 个",
          },
          interval: 10,
          max: 50,
        },
      ],
      series: [
        {
          name: "金额",
          type: "bar",
          data: [],
          barWidth: 30, // 柱宽度
          barCategoryGap: 10, // 同系列柱之间的宽度
          itemStyle: {
            color: this.color[0],
          },
        },
        {
          name: "数量",
          type: "bar",
          data: [],
          barWidth: 30, // 柱宽度
          barCategoryGap: 10, // 同系列柱之间的宽度
          itemStyle: {
            color: this.color[1],
          },
          yAxisIndex: 1,
        },
      ],
    };
    this.debounceGetAsstLsProductCount = debounce(
      this._getAsstLsProductCount,
      600
    );
    this.$bus.$on("getAllData", () => {
      this.debounceGetAsstLsProductCount({
        hbdwbh: this.hbdwbh,
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.chart {
  height: 100%;
  padding: 0 0.125rem 0.125rem 0.125rem;
}
.header {
  height: 0.625rem;
  line-height: 50px;
  font-size: 0.225rem;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #313233;
}
.bar-charts {
  width: 100%;
  height: calc(100% - 0.75rem);
}
</style>
