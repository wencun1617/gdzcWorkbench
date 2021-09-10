<template>
  <div>
    <div class="header">
      我的代办
    </div>

    <div class="table">
      <a-table :columns="columns" :data-source="backlogData"> </a-table>
    </div>
  </div>
</template>

<script>
import { getAssetsApproveData } from "@/services/home";

export default {
  data() {
    return {
      backlogData: [],
      // 列描述数据对象
      columns: [
        {
          title: "类型",
          dataIndex: "type",
          key: "type",
          scopedSlots: { customRender: "name" },
        },
        {
          title: "单据号",
          dataIndex: "code",
          key: "code",
        },
        {
          title: "日期",
          dataIndex: "time",
          key: "time",
        },
        {
          title: "科室",
          dataIndex: "dept_name",
          key: "dept_name",
        },
        {
          title: "申请人",
          dataIndex: "applicant",
          key: "applicant",
        },
        {
          title: "状态",
          dataIndex: "status",
          key: "status",
          scopedSlots: { customRender: "status" },
          customCell: (record, rowIndex) => {
            //在此处定义
            if (record.status == "未提交") {
              return { style: { color: "#FF487B" } };
            }
          },
        },
        {
          title: "操作",
          dataIndex: "operate",
          key: "operate",
          scopedSlots: { customRender: "operate" },
          customCell: (record, rowIndex) => {
            //在此处定义
            if (record.operate == "更多") {
              return { style: { color: "#206DCF" } };
            } else {
              return { style: { color: "#42B983" } };
            }
          },
        },
      ],
    };
  },
  props: {
    hbdwbh: {
      type: String,
      required: true,
    },
  },
  methods: {
    // 获取我的待办数据
    async _getAssetsApproveData({
      hbdwbh = this.hbdwbh,
      codeBlockName = "asst_listTodo",
    }) {
      const res = await getAssetsApproveData({
        hbdwbh,
        codeBlockName,
      });
      console.log(res, "我的待办");
      this.backlogData = res.map((item, index) => {
        item.type = item.id ? "" : item.type;
        item.key = index;
        item.operate = item.id ? "审批" : "更多";
        return item;
      });
    },
  },
  mounted() {
    this.$bus.$on("getAllData", () => {
      this._getAssetsApproveData({});
    });
  },
};
</script>

<style lang="scss" scoped>
.header {
  padding-left: 0.2875rem;
  height: 0.625rem;
  line-height: 50px;
  font-size: 0.225rem;
  font-family: Source Han Sans CN;
  font-weight: bold;
  color: #313233;
}
.table {
  padding-left: 0.25rem;
  padding-right: 0.25rem;
  font-weight: bold;
}
</style>
