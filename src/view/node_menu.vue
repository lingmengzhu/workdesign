<template>
  <!-- style="background-color: #4a485f;" -->
  <div ref="tool">
    <span style="font-size: 12px;color: #d4d3e5;">节点：</span>
    <draggable
      @end="addNode"
      @choose="move"
      v-model="menuList"
      :options="draggableOptions"
      style="display:inline-block;"
    >
      <el-button
        v-for="(item, index) in menuList"
        :key="index"
        :nodeType="item.type"
        icon="el-icon-document"
        class="drag-widget"
        size="mini"
      >{{item.name}}</el-button>
    </draggable>
  </div>
</template>
<script>
import draggable from "vuedraggable";

let mousePosition = {
  left: -1,
  top: -1
};

export default {
  data() {
    return {
      draggableOptions: {
        preventOnFilter: false,
        sort: false
      },
      // 默认打开的左侧菜单的id
      menuList: [
        // {
        //   id: "1",
        //   type: "begin",
        //   name: "开始审批",
        //   ico: "el-icon-begin"
        // },
        {
          id: "2",
          type: "check",
          name: "审核",
          ico: "el-icon-time"
          // typeapproval: "会签"
        },
        {
          id: "3",
          type: "end",
          name: "结束",
          ico: "el-icon-end"
        }
      ],
      nodeMenu: {}
    };
  },
  components: {
    draggable
  },
  created() {
    /**
     * 以下是为了解决在火狐浏览器上推拽时弹出tab页到搜索问题
     * @param event
     */
    if (this.isFirefox()) {
      document.body.ondrop = function(event) {
        // 解决火狐浏览器无法获取鼠标拖拽结束的坐标问题
        mousePosition.left = event.layerX;
        mousePosition.top = event.clientY - 50;
        event.preventDefault();
        event.stopPropagation();
      };
    }
  },
  methods: {
    // 根据类型获取左侧菜单对象
    getMenu(type) {
      for (let i = 0; i < this.menuList.length; i++) {
        if (this.menuList[i].type === type) {
          return this.menuList[i];
        }
      }
    },
    // 拖拽开始时触发
    move(evt) {
      var type = evt.item.attributes.nodeType.nodeValue; //timer
      this.nodeMenu = this.getMenu(type);
    },
    // 拖拽结束时触发
    addNode(evt, e) {
      mousePosition = {
        left: evt.originalEvent.clientX,
        top: evt.originalEvent.clientY
      };
      this.$emit("addNode", evt, this.nodeMenu, mousePosition);
    },
    // 是否是火狐浏览器
    isFirefox() {
      var userAgent = navigator.userAgent;
      if (userAgent.indexOf("Firefox") > -1) {
        return true;
      }
      return false;
    }
  }
};
</script>
<style lang="scss" scoped>
.flow-tool-menu {
  background-color: #eeeeee;
  cursor: pointer;
  padding-left: 5px;
  height: 50px;
  line-height: 50px;
  border-bottom: 1px solid #979797;
}

.flow-tool-submenu {
  background-color: white;
  padding-left: 20px;
  cursor: pointer;
  height: 50px;
  line-height: 50px;
  vertical-align: middle;
  border-bottom: 1px solid #d3d3d3;
}
.drag-widget {
  margin: 0 4px;
  background-color: #424056;
  border: 1px solid #5a5970;
  color: #b7b6c7;
  border-style: dashed;
}
.drag-widget:hover {
  color: #fff;
  background-color: rgba(255, 246, 223, 0.2);
  border-color: #ff9200;
}
.el-button:focus {
  color: #fff;
  background-color: rgba(255, 246, 223, 0.2);
  border-color: #ff9200;
}
</style>
