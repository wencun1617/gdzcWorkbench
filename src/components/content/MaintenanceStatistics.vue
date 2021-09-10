<template>
  <div class="chart">
    <div class="header">
      维修统计
    </div>

    <div class="bar-charts" ref="bar"></div>

    <!-- 月份选择器 -->
    <div class="month-picker">
      <a-month-picker
        :default-value="moment(getCurrentDate(), 'YYYY-MM')"
        @change="changeDataHandle"
        valueFormat="yyyy-MM"
        :allowClear="false"
      />
    </div>
  </div>
</template>

<script>
import { getAsstLsRepairCount } from "@/services/home";

import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

export default {
  data() {
    return {
      moment,
      year_month: moment().format("YYYY-MM"),
      option: {},
      color: ["#0BB572", "#ED6F57", "#2F64FC"], // 柱状图各个颜色
    };
  },
  props: {
    hbdwbh: {
      type: String,
      required: true,
    },
  },
  methods: {
    async _getAsstLsRepairCount({
      hbdwbh = this.hbdwbh,
      year_month = this.year_month,
    }) {
      let res = await getAsstLsRepairCount({
        // 维修统计数据请求结果
        hbdwbh,
        year_month,
      });
      console.log(res, "维修统计");
      if (!res.success) {
        // X轴分类
        this.option.xAxis[0].data = res.map((item) => {
          return item.name;
        });

        this.option.series[0].data = res.map((item, index) => {
          return {
            value: item.value,
            itemStyle: {
              color: this.color[index],
            },
          };
        });

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
    changeDataHandle(checkItem) {
      this.year_month = checkItem.format("yyyy-MM");
      this._getAsstLsRepairCount({
        hbdwbh: this.hbdwbh,
        year_month: this.year_month,
      });
    },
    getCurrentDate() {
      return new Date().toLocaleDateString();
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
            value += `<br/> ${item.marker} ${item.seriesName} ${item.value}`;
          }
          return value;
        },
      },
      legend: {
        orient: "horizontal",
        left: "0%",
        itemWidth: 12,
        itemHeight: 12,
        textStyle: {
          color: "#fff",
          fontSize: 12,
        },
      },
      grid: {
        left: "10%",
        right: "10%",
        top: "16%",
        bottom: "12%",
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
          },
          splitLine: {
            lineStyle: {
              color: "#F1F1F2",
              type: "solid",
            },
          },
        },
      ],
      series: [
        {
          name: "",
          type: "bar",
          data: [],
          barWidth: 30, // 柱宽度
        },
      ],
    };
    this.$bus.$on("getAllData", () => {
      this._getAsstLsRepairCount({
        hbdwbh: this.hbdwbh,
        year_month: this.year_month,
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.chart {
  position: relative;
  height: 100%;
  padding: 0 0.25rem 0.3125rem 0.25rem;
}
.month-picker {
  position: absolute;
  top: 0.25rem;
  right: 0.3125rem;
}
.el-input {
  height: 0.5rem !important;
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
  height: calc(100% - 0.875rem);
}
</style>
