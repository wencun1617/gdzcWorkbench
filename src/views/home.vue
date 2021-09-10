<template>
  <div class="container">
    <!-- 顶部 -->
    <div class="category-list">
      <div
        class="category-item"
        v-for="(item, index) in assetsDataList"
        :key="index"
      >
        <div class="icon-field">
          <img :src="iconList[index]" alt="" />
          {{ item.title }}
        </div>
        <div class="data-show">
          <div class="data-box">
            <div class="field">{{ item.quantity ? "数量" : "待审批" }}</div>
            <div class="value">
              {{ item.quantity ? item.quantity : item.noApproved }}
            </div>
          </div>
          <div class="data-box">
            <div class="field">{{ item.amount ? "金额" : "已审批" }}</div>
            <div class="value">
              {{ item.amount ? `${item.amount}(万)` : item.approved }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 中间 -->
    <div class="middle">
      <!-- 我的代办 -->
      <div class="backlog">
        <backlog :hbdwbh="hbdwbh" />
      </div>
      <!-- 快捷方式 -->
      <div class="shortcut">
        <div class="header">
          快捷方式
        </div>
        <div class="shortcut-list">
          <div
            class="shortcut-item"
            v-for="(item, index) in shortcutList"
            :key="index"
          >
            <img :src="shortcutIcon[index]" alt="" />
            <div class="shortcut-name">
              {{ item.field }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bottom">
      <div class="maintenance-statistics">
        <maintenance-statistics :hbdwbh="hbdwbh" />
      </div>
      <div class="productname-classify">
        <product-name-count :hbdwbh="hbdwbh" />
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import axios from "axios";
import qs from "querystring";
import { getAssetsApproveData } from "@/services/home";
import MaintenanceStatistics from "@/components/content/MaintenanceStatistics";
import ProductNameCount from "@/components/content/ProductNameCount";
import Backlog from "@/components/content/Backlog";
export default {
  data() {
    return {
      // 快捷方式文字
      shortcutList: [
        {
          field: "采购审批",
        },
        {
          field: "会议纪要",
        },
        {
          field: "汇总采购",
        },
        {
          field: "安装台账",
        },
        {
          field: "验收管理",
        },
        {
          field: "汇总报表",
        },
        {
          field: "接口配置",
        },
        {
          field: "拓展组件",
        },
        {
          field: "用户管理",
        },
        {
          field: "文件管理",
        },
        {
          field: "图表配置",
        },
        {
          field: "数据分析",
        },
      ],
      // 快捷方式图标
      shortcutIcon: [
        require("../assets/image/home/shortcut/1.png"),
        require("../assets/image/home/shortcut/2.png"),
        require("../assets/image/home/shortcut/3.png"),
        require("../assets/image/home/shortcut/4.png"),
        require("../assets/image/home/shortcut/5.png"),
        require("../assets/image/home/shortcut/6.png"),
        require("../assets/image/home/shortcut/7.png"),
        require("../assets/image/home/shortcut/8.png"),
        require("../assets/image/home/shortcut/9.png"),
        require("../assets/image/home/shortcut/10.png"),
        require("../assets/image/home/shortcut/11.png"),
        require("../assets/image/home/shortcut/12.png"),
      ],
      // 顶部图标
      iconList: [
        require("../assets/image/home/total.png"),
        require("../assets/image/home/in_tock.png"),
        require("../assets/image/home/using.png"),
        require("../assets/image/home/purchase.png"),
        require("../assets/image/home/scrapped.png"),
      ],
      // 资产和审批相关数据
      assetsDataList: [
        {
          title: "资产总数",
          quantity: 250,
          amount: 1617,
          codeBlockName: "asst_totalCount",
        },
        {
          title: "在库资产",
          quantity: 250,
          amount: 1617,
          codeBlockName: "asst_inWarehouseCount",
        },
        {
          title: "在用资产",
          quantity: 250,
          amount: 1617,
          codeBlockName: "asst_inUseCount",
        },
        {
          title: "采购审批",
          noApproved: 250,
          approved: 1617,
          codeBlockName: "asst_approvalCount",
        },
        {
          title: "报废审批",
          noApproved: 250,
          approved: 1617,
          codeBlockName: "asst_uselessApproval",
        },
      ],
      hbdwbh: "", // 预登录获取的合并单位编号
    };
  },
  components: {
    MaintenanceStatistics,
    ProductNameCount,
    Backlog,
  },
  methods: {
    ...mapActions(["asyncChangeToken"]),
    // 登录成功时,获取所有数据,
    // 定时请求,获取所有数据
    refreshData() {
      this.$bus.$off("getAllData", {});
      this.$bus.$emit("getAllData");
    },
    // 预登录
    loginOperate() {
      const url = "http://59.56.182.79:9192/api/login";
      const data = {
        username: "bj",
        password: "e10adc3949ba59abbe56e057f20f883e",
      };
      axios
        .post(url, qs.stringify(data), {
          headers: {
            "content-type": "application/x-www-form-urlencoded",
          },
        })
        .then(async (res) => {
          if (res.data.code == 200) {
            // console.log(res.data);
            this.hbdwbh = res.data.data.user.officeCode;
            await this.asyncChangeToken(res.data.data.token);
            this.refreshData();
          }
        });

      // 刷新页面
      // if (this.timer) {
      //   clearInterval(this.timer);
      // } else {
      //   this.timer = setInterval(() => {
      //     setTimeout(this.refreshData(), 0);
      //     console.log("刷新");
      //   }, 5 * 60 * 1000);
      // }
    },

    // 获取顶部资产和审批相关数据  传入合并单位编号和模块名
    async _getAssetsApproveData({ hbdwbh = this.hbdwbh, codeBlockName }) {
      const res = await getAssetsApproveData({
        hbdwbh,
        codeBlockName,
      });
      // console.log(res, codeBlockName);
      if (!res.success) {
        switch (codeBlockName) {
          case "asst_totalCount": // 资产总数
            this.assetsDataList.forEach((item) => {
              if (item.codeBlockName == "asst_totalCount") {
                item.quantity = res.sum_card;
                item.amount = res.sum_price;
              }
            });
            break;
          case "asst_inWarehouseCount": // 在库资产
            this.assetsDataList.forEach((item) => {
              if (item.codeBlockName == "asst_inWarehouseCount") {
                item.quantity = res.in_warehouse;
                item.amount = res.sum_price;
              }
            });
            break;
          case "asst_inUseCount": // 在用资产
            this.assetsDataList.forEach((item) => {
              if (item.codeBlockName == "asst_inUseCount") {
                item.quantity = res.in_use;
                item.amount = res.sum_price;
              }
            });
            break;
          case "asst_approvalCount": // 采购审批
            this.assetsDataList.forEach((item) => {
              if (item.codeBlockName == "asst_approvalCount") {
                item.noApproved = res[0].value;
                item.approved = res[1].value;
              }
            });
            break;
          case "asst_uselessApproval": // 报废审批
            this.assetsDataList.forEach((item) => {
              if (item.codeBlockName == "asst_uselessApproval") {
                item.noApproved = res[0].value;
                item.approved = res[1].value;
              }
            });
            break;
        }
      }
    },
  },
  mounted() {
    // 模拟登录
    this.loginOperate();
    this.$bus.$on("getAllData", () => {
      // 资产总数
      this._getAssetsApproveData({
        codeBlockName: "asst_totalCount",
      });
      // 在库资产
      this._getAssetsApproveData({
        codeBlockName: "asst_inWarehouseCount",
      });
      // 在用资产
      this._getAssetsApproveData({
        codeBlockName: "asst_inUseCount",
      });
      // 采购审批
      this._getAssetsApproveData({
        codeBlockName: "asst_approvalCount",
      });
      // 报废审批
      this._getAssetsApproveData({
        codeBlockName: "asst_uselessApproval",
      });
    });
  },
};
</script>

<style lang="scss" scoped>
.container {
  width: 20.7625rem;
  height: 100vh;
  margin: auto;
  background-color: #ebeef2;
}
// 顶部
.category-list {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 20.3375rem;
  height: 2rem;
  margin: auto;
  & .category-item:nth-child(1) {
    background: url("../assets/image/home/total_bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  & .category-item:nth-child(2) {
    background: url("../assets/image/home/in_tock_bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  & .category-item:nth-child(3) {
    background: url("../assets/image/home/using_bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  & .category-item:nth-child(4) {
    background: url("../assets/image/home/purchase_bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  & .category-item:nth-child(5) {
    background: url("../assets/image/home/scrapped_bg.png");
    background-size: 100% 100%;
    background-repeat: no-repeat;
  }
  .category-item {
    width: 3.8875rem;
    height: 1.625rem;
    padding-left: 0.1875rem;
    padding-right: 0.25rem;
    box-sizing: border-box;
    border-radius: 0.125rem;
    background-color: #ffffff;
    .icon-field {
      display: flex;
      align-items: center;
      height: 50%;
      font-size: 0.225rem;
      font-family: Source Han Sans CN;
      font-weight: bold;
      color: #ffffff;
      img {
        width: 0.6125rem;
        height: 0.6125rem;
        margin-right: 0.1625rem;
      }
    }
    .data-show {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50%;
      .data-box {
        display: flex;
        align-items: center;
        height: 100%;
        .field {
          font-size: 0.175rem;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #ffffff;
          margin-right: 0.15rem;
          white-space: nowrap;
        }
        .value {
          font-size: 0.3rem;
          font-family: Source Han Sans CN;
          font-weight: bold;
          color: #ffffff;
        }
      }
    }
  }
}
// 中间
.middle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 20.3375rem;
  margin: auto;
  margin-bottom: 0.1875rem;
  .backlog {
    width: 13.3rem;
    height: 6.075rem;
    background: #ffffff;
    border-radius: 0.125rem;
  }
  .shortcut {
    width: 6.8375rem;
    height: 6.075rem;
    background: #ffffff;
    border-radius: 0.125rem;
    .shortcut-list {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 0.35rem;
      flex-wrap: wrap;
      .shortcut-item {
        width: 0.7rem;
        height: 1.0625rem;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        margin-right: 0.375rem;
        margin-bottom: 0.325rem;
        font-size: 0.175rem;
        font-family: Source Han Sans CN;
        font-weight: bold;
        color: #4a4a6b;
        img {
          width: 0.675rem;
          height: 0.675rem;
          margin-bottom: 0.1625rem;
        }
        .shortcut-name {
          white-space: nowrap;
          width: 100%;
        }
      }
    }
  }
  .header {
    padding-left: 0.2875rem;
    height: 0.625rem;
    line-height: 50px;
    font-size: 0.225rem;
    font-family: Source Han Sans CN;
    font-weight: bold;
    color: #313233;
  }
}

// 底部
.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 20.3375rem;
  margin: auto;
  .maintenance-statistics {
    width: 6.8875rem;
    height: 4.2rem;
    background: #ffffff;
    border-radius: 0.125rem;
  }
  .productname-classify {
    width: 13.175rem;
    height: 4.2rem;
    background: #ffffff;
    border-radius: 0.125rem;
  }
}
</style>
