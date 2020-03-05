<template>
  <div
    ref="node"
    :style="nodeContainerStyle"
    @mouseenter="mouseEnter=true"
    @mouseleave="mouseEnter=false"
    @mouseup="changeNodePosition"
  >
    <div v-if="node.type === 'check'">
      <div class="flow-node-header">
        <!--左上角的那个图标样式-->
        <!-- <i :class="nodeIcoClass"></i> -->
        <!--鼠标移入到节点中时右上角的【编辑】、【删除】 按钮-->
        {{node.name}}
        <div v-show="mouseEnter" class="flow-node-operate">
          <a href="#" @click="editNode">
            <img src="./assets/edit.png" />
          </a>&nbsp;
          <a href="#" @click="deleteNode">
            <img src="./assets/delete.png" />
          </a> &nbsp;
        </div>
      </div>
      <!--节点的正文部分-->
      <div class="flow-node-body">
        <div class="node-data" style="padding: 15px;text-align:left;font-size:14px;">
          <div v-if="node.approver && node.ccpeople.length!=0">
            <span>审批人:</span>
            <span>{{node.approver}}</span>
          </div>
          <div v-if="node.ccpeople && node.ccpeople.length!=0">
            <span>抄送人:</span>
            <span>{{ node.ccpeople}}</span>
          </div>
        </div>
        <div
          class="flow-node-signType"
          :style="signTypeStyle"
        >{{ node.typeapproval?node.typeapproval:"会签"}}</div>
      </div>
      <div class="flow-checknode-forLine-left">
        <i class="icon iconfont icon-dian flow-node-drag" style="font-size:28px;"></i>
      </div>
      <div class="flow-checknode-forLine-top">
        <i class="icon iconfont icon-dian flow-node-drag" style="font-size:28px;"></i>
      </div>
      <div class="flow-checknode-forLine-right">
        <i class="icon iconfont icon-dian flow-node-drag" style="font-size:28px;"></i>
      </div>
      <div class="flow-checknode-forLine-bottom">
        <i class="icon iconfont icon-dian flow-node-drag" style="font-size:28px;"></i>
      </div>
    </div>
    <!-- {{node.name}} -->
    <div v-if="node.type != 'check'" class="flow-node-beginOrEnd">
      <!--左上角的那个图标样式-->
      <!-- <i :class="nodeIcoClass"></i> -->
      <!--鼠标移入到节点中时右上角的【编辑】、【删除】 按钮-->
      <span v-if="node.type === 'begin'">
        <i
          class="el-icon-video-play"
          style="font-size:25px;line-height:80px;vertical-align:middle;"
        ></i>
        开始审批
      </span>
      <span v-if="node.type === 'end'">
        <i
          class="el-icon-switch-button"
          style="font-size:25px;line-height:80px;vertical-align:middle;"
        ></i>结束审批
      </span>
      <div class="flow-node-forLine-left">
        <i class="icon iconfont icon-dian flow-node-drag" style="font-size:28px;"></i>
      </div>
      <div class="flow-node-forLine-top">
        <i class="icon iconfont icon-dian flow-node-drag" style="font-size:28px;"></i>
      </div>
      <div class="flow-node-forLine-right">
        <i class="icon iconfont icon-dian flow-node-drag" style="font-size:28px;"></i>
      </div>
      <div class="flow-node-forLine-bottom">
        <i class="icon iconfont icon-dian flow-node-drag" style="font-size:28px;"></i>
      </div>
      <div v-show="mouseEnter" class="flow-node-operate">
        <a href="#" @click="editNode">
          <img src="./assets/edit.png" />
        </a>&nbsp;
        <a href="#" @click="deleteNode">
          <img src="./assets/delete.png" />
        </a> &nbsp;
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    node: Object,
    zoomValue: Number
  },
  data() {
    return {
      // 控制节点操作显示
      mouseEnter: false
    };
  },
  computed: {
    // 节点容器样式
    nodeContainerStyle() {
      return {
        position: "absolute",
        width: this.node.type == "check" ? "250px" : "122px",
        top: this.node.top,
        left: this.node.left,
        // boxShadow: this.mouseEnter ? "#66a6e0 0px 0px 12px 0px" : "",
        backgroundColor: "transparent",
        border: "1px solid #c2cbd0",
        "border-radius": "6px"
      };
    },
    signTypeStyle() {
      switch (this.node.typeapproval) {
        case "会签":
          return {
            "border-right": "1px solid #5182bf",
            "background-color": "#6096d8"
          };
        case "或签":
          return {
            "border-right": "1px solid #cf6c45",
            "background-color": "#f1875d"
          };
        case "依次":
          return {
            "border-right": "1px solid #77a14d",
            "background-color": "#98c66b"
          };
        default:
          return {
            "border-right": "1px solid #5182bf",
            "background-color": "#6096d8"
          };
      }
    },
    nodeIcoClass() {
      var nodeIcoClass = {};
      nodeIcoClass[this.node.ico] = true;
      // 添加该class可以推拽连线出来
      nodeIcoClass["flow-node-drag"] = true;

      return nodeIcoClass;
    }
  },
  methods: {
    // 删除节点
    deleteNode() {
      this.$emit("deleteNode", this.node.id);
    },
    // 编辑节点
    editNode() {
      this.$emit("editNode", this.node.id);
    },
    // 鼠标移动后抬起
    changeNodePosition() {
      // 避免抖动
      if (
        this.node.left == this.$refs.node.style.left &&
        this.node.top == this.$refs.node.style.top
      ) {
        return;
      }
      this.$emit("changeNodeSite", {
        nodeId: this.node.id,
        left: this.$refs.node.style.left,
        top: this.$refs.node.style.top
      });
    }
  },
  watch: {
    zoomValue: {
      deep: true,
      handler() {
        // console.log(val);
        // this.$refs.node.style.transform = "scale" + "(" + val + ")";
      }
    }
  }
};
</script>

<style>
.flow-node-header {
  background-color: #e9ecf4;
  height: 34px;
  cursor: pointer;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom: 1px solid #c2cbd0;
  text-align: center;
  line-height: 34px;
  font-size: 14px;
  color: #3d464a;
}

.flow-node-header a,
.flow-node-beginOrEnd a img {
  text-decoration: none;
  line-height: 25px;
  vertical-align: middle;
}

.flow-node-header a img,
.flow-node-beginOrEnd a img {
  line-height: 25px;
  vertical-align: middle;
  margin-bottom: 5px;
}
.flow-node-beginOrEnd {
  background-color: #f4f6fa;
  height: 80px;
  cursor: pointer;
  border-radius: 6px;
  text-align: center;
  line-height: 80px;
  font-size: 14px;
  color: #3d464a;
}
.flow-node-body {
  /*background-color: beige;*/
  background-color: white;
  text-align: center;
  cursor: pointer;
  height: 124px;
  line-height: 25px;
  border-bottom-left-radius: 6px;
  border-bottom-right-radius: 6px;
  overflow: hidden;
  position: relative;
}
.flow-node-signType {
  position: absolute;
  width: 80px;
  height: 80px;
  right: -45px;
  bottom: -45px;
  transform: rotate(-45deg);
  line-height: 22px;
  font-size: 12px;
  /* border-right: 1px solid #cf6c45;
  background-color: #f1875d; */
  color: #fff;
  text-align: center;
}
/* 修改、删除按钮样式*/
.flow-node-operate {
  position: absolute;
  top: 0px;
  right: 0px;
  line-height: 30px;
  /* background-color: black; */
}
.flow-node-forLine-left {
  position: absolute;
  top: 0px;
  left: -15px;
}
.flow-node-forLine-top {
  position: absolute;
  top: -40px;
  left: 46px;
}
.flow-node-forLine-right {
  position: absolute;
  top: 0px;
  right: -15px;
}
.flow-node-forLine-bottom {
  position: absolute;
  bottom: -46px;
  left: 46px;
}
.flow-checknode-forLine-left {
  position: absolute;
  top: 64px;
  left: -14px;
}
.flow-checknode-forLine-top {
  position: absolute;
  top: -16px;
  left: 110px;
}
.flow-checknode-forLine-right {
  position: absolute;
  top: 64px;
  right: -15px;
}
.flow-checknode-forLine-bottom {
  position: absolute;
  bottom: -16px;
  left: 110px;
}
</style>
