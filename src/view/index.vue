<template>
  <div v-if="easyFlowVisible">
    <el-row style="z-index:10;">
      <!--左侧可以拖动的菜单-->
      <el-col :span="3" ref="nodeMenu" style="padding:8px 0 8px 8px;background-color: #4a485f;">
        <node-menu @addNode="addNode"></node-menu>
      </el-col>
      <el-col :span="17" style="padding:8px 8px 8px 0 ;background-color: #4a485f;">
        <el-divider direction="vertical"></el-divider>
        <el-select v-model="zoomValue" placeholder="请选择" size="mini">
          <el-option
            v-for="item in quickZoomOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-divider direction="vertical"></el-divider>
        <el-button
          size="mini"
          class="header-widget"
          icon="el-icon-document"
          :disabled="!targetLine"
          @click="deleteConn()"
        >删除</el-button>

        <el-divider direction="vertical"></el-divider>
        <el-button
          size="mini"
          class="header-widget"
          icon="el-icon-sort"
          @click="dataInfo"
          style
        >转换为自由流程</el-button>
        <el-divider direction="vertical"></el-divider>
        <el-switch
          size="mini"
          v-model="switchValue"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-text="开启智能审批"
        ></el-switch>
      </el-col>
      <el-col :span="4" style="padding:8px 8px 8px 0 ;background-color: #4a485f;text-align:center;">
        <el-button size="mini" class="header-widget" icon="el-icon-document" @click="dataInfo">流程信息</el-button>
        <el-button
          class="header-widget"
          icon="el-icon-document"
          @click="saveProcess"
          size="mini"
        >保存审批流程</el-button>
      </el-col>
    </el-row>
    <el-row ref="designCanvas">
      <el-col :span="24">
        <el-row>
          <!--画布-->
          <el-col :span="24">
            <div id="flowBg" class="flowBg">
              <div id="flowContainer" class="container">
                <flow-node
                  v-for="(node,index) in data.nodeList"
                  :key="index"
                  :zoomValue="zoomValue"
                  v-show="node.show"
                  :id="node.id"
                  :node="node"
                  @deleteNode="deleteNode"
                  @changeNodeSite="changeNodeSite"
                  @nodeRightMenu="nodeRightMenu"
                  @editNode="editNode"
                ></flow-node>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-col>
      <div v-if="visibleSettingPanel" class="float-setting-panel panel-show">
        <div class="flow-set-header">
          <div class="flow-set-title">
            <span>节点条件规则设置</span>
            <el-tooltip class="item" effect="dark" placement="top-start">
              <div slot="content">
                各个条件块之间是或的关系
                <br />条件块中的各个条件是且的关系
              </div>
              <i class="el-icon-question"></i>
            </el-tooltip>
          </div>
          <!-- <span class="text-tips">
            开始审批>>>>>
            审批节点1
          </span>-->
        </div>
        <div class="panel-container float-setting-container">
          <el-form
            ref="form"
            :model="connLineData[targetNodeLine.sourceId+targetNodeLine.targetId]"
            label-width="100px"
          >
            <el-form-item label="条件优先级:">
              <el-select
                v-model="connLineData[targetNodeLine.sourceId+targetNodeLine.targetId].ruleLevel"
                placeholder="请选择"
                size="mini"
              >
                <el-option label="1" value="1"></el-option>
              </el-select>
            </el-form-item>
          </el-form>
          <div class="tab-box condition-tab-box">
            <div>
              <div
                class="condition-block"
                v-for="(item, index) in connLineData[targetNodeLine.sourceId+targetNodeLine.targetId].lineRules"
                :key="index"
              >
                <div class="condition-title">
                  条件块
                  <div style="display:inline-block;float:right;margin-top:2px;">
                    <a @click="deleteConditionBlock(index)">
                      <i class="el-icon-close" style="font-size:18px;"></i>
                    </a>
                  </div>
                </div>
                <div
                  class="condition-content"
                  v-for="(subItem,subIndex) in item"
                  :key="subIndex"
                  style="padding:20px 0 0 20px"
                >
                  <el-select v-model="subItem.tag1" placeholder="请选择">
                    <el-option label="提交人本人" value="提交人本人"></el-option>
                  </el-select>
                  <div style="display:inline-block;width:5px;"></div>
                  <el-select v-model="subItem.tag2" placeholder="请选择">
                    <el-option label="包含" value="包含"></el-option>
                    <el-option label="不包含" value="不包含"></el-option>
                  </el-select>
                  <div style="display:inline-block;width:5px;"></div>
                  <a @click="deleteBlockRule(index,subIndex)">
                    <i class="el-icon-close" style="font-size:18px;"></i>
                  </a>
                  <div style="margin-top:10px;"></div>
                  <div style="padding-right:65px;">
                    <el-select v-model="subItem.tag3" style="display:block;" placeholder="请选择">
                      <el-option label="张三" value="张三"></el-option>
                      <el-option label="李四" value="李四"></el-option>
                    </el-select>
                  </div>
                </div>
                <div style="height:60px;padding-left:10px;">
                  <el-link
                    style="line-height:60px"
                    icon="el-icon-plus"
                    @click="addBlockRule(index)"
                  >添加条件</el-link>
                </div>
              </div>
            </div>
            <div style="height:80px;">
              <el-link
                style="line-height:60px"
                icon="el-icon-plus"
                @click="addConditionBlock()"
              >添加条件块</el-link>
            </div>
          </div>
        </div>
      </div>
    </el-row>

    <!-- 流程数据详情 -->
    <flow-info v-if="flowInfoVisible" ref="flowInfo" :data="data"></flow-info>
    <!-- 流程数据表单 -->
    <flow-node-form v-if="nodeFormVisible" ref="nodeForm"></flow-node-form>
  </div>
</template>

<script>
import { jsPlumb } from "jsplumb";
import flowNode from "./node";
import nodeMenu from "./node_menu";
import FlowInfo from "./info";
import FlowNodeForm from "./node_form";
import lodash from "lodash";
import { getDataA } from "./data_A";
window.setZoom = function(zoom, instance, transformOrigin, el) {
  transformOrigin = transformOrigin || [0.5, 0.5];
  instance = instance || jsPlumb;
  el = el || instance.getContainer();
  var p = ["webkit", "moz", "ms", "o"],
    s = "scale(" + zoom + ")",
    oString = transformOrigin[0] * 100 + "% " + transformOrigin[1] * 100 + "%";

  for (var i = 0; i < p.length; i++) {
    el.style[p[i] + "Transform"] = s;
    el.style[p[i] + "TransformOrigin"] = oString;
  }
  el.style["transform"] = s;
  el.style["transformOrigin"] = oString;

  instance.setZoom(zoom);
};
export default {
  name: "workdesign",
  data() {
    return {
      zoomValue: 1,
      quickZoomOptions: [
        { label: "缩放：25%", value: 0.25 },
        { label: "缩放：50%", value: 0.5 },
        { label: "缩放：75%", value: 0.75 },
        { label: "缩放：100%", value: 1 }
      ],
      // jsPlumb 实例
      jsPlumb: null,
      easyFlowVisible: true,
      // 控制流程数据显示与隐藏
      flowInfoVisible: false,
      // 控制表单显示与隐藏
      nodeFormVisible: false,
      // 默认设置参数
      jsplumbSetting: {
        // 动态锚点、位置自适应
        Anchors: [
          "Top",
          "TopCenter",
          "TopRight",
          "TopLeft",
          "Right",
          "RightMiddle",
          "Bottom",
          "BottomCenter",
          "BottomRight",
          "BottomLeft",
          "Left",
          "LeftMiddle"
        ],
        Container: "flowContainer",
        // 连线的样式 StateMachine、Flowchart
        Connector: ["Flowchart", { gap: 10 }],
        // 鼠标不能拖动删除线
        ConnectionsDetachable: false,
        // 删除线的时候节点不删除
        DeleteEndpointsOnDetach: false,
        // 连线的端点
        // Endpoint: ["Dot", {radius: 5}],
        Endpoint: ["Rectangle", { height: 10, width: 10 }],
        // 线端点的样式
        EndpointStyle: { fill: "rgba(255,255,255,0)", outlineWidth: 1 },
        LogEnabled: true, //是否打开jsPlumb的内部日志记录
        // 绘制线
        PaintStyle: { stroke: "black", strokeWidth: 3 },
        // HoverPaintStyle: { stroke: "#1E90FF" },
        // 绘制箭头
        Overlays: [["Arrow", { width: 12, length: 12, location: 1 }]],
        RenderMode: "svg"
      },
      // jsplumb连接参数
      jsplumbConnectOptions: {
        isSource: true,
        isTarget: true,
        // 动态锚点、提供了4个方向 Continuous、AutoDefault
        anchor: "Continuous"
      },
      jsplumbSourceOptions: {
        /*"span"表示标签，".className"表示类，"#id"表示元素id*/
        filter: ".flow-node-drag",
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false
      },
      jsplumbTargetOptions: {
        /*"span"表示标签，".className"表示类，"#id"表示元素id*/
        filter: ".flow-node-drag",
        filterExclude: false,
        anchor: "Continuous",
        allowLoopback: false
      },
      // 是否加载完毕
      loadEasyFlowFinish: false,
      // 数据
      data: {},
      key: 1,
      targetLine: undefined,
      targetNodeLine: {},
      visibleSettingPanel: false,
      connLineData: {},
      switchValue: true
    };
  },
  components: {
    flowNode,
    nodeMenu,
    FlowInfo,
    FlowNodeForm
  },
  mounted() {
    this.jsPlumb = jsPlumb.getInstance();
    this.$nextTick(() => {
      // 默认加载流程A的数据
      this.dataReload(getDataA());
    });
    window.addEventListener("mousewheel", this.handleScroll, false);
  },
  methods: {
    handleScroll(event) {
      if (event.target.id == "flowBg" || event.target.id == "flowContainer") {
        if (event.deltaY == 100 && this.zoomValue > 0.2) {
          this.zoomValue = parseFloat((this.zoomValue - 0.01).toFixed(2));
        } else if (event.deltaY == -100 && this.zoomValue < 2) {
          this.zoomValue = parseFloat((this.zoomValue + 0.01).toFixed(2));
        }
      }
    },
    deleteConditionBlock(index) {
      this.connLineData[
        this.targetNodeLine.sourceId + this.targetNodeLine.targetId
      ].lineRules.splice(index, 1);
    },
    addConditionBlock() {
      this.connLineData[
        this.targetNodeLine.sourceId + this.targetNodeLine.targetId
      ].lineRules.push([]);
    },
    deleteBlockRule(index, subIndex) {
      this.connLineData[
        this.targetNodeLine.sourceId + this.targetNodeLine.targetId
      ].lineRules[index].splice(subIndex, 1);
    },
    addBlockRule(index) {
      this.connLineData[
        this.targetNodeLine.sourceId + this.targetNodeLine.targetId
      ].lineRules[index].push({ tag1: "", tag2: "", tag3: "" });
    },
    //删除连接线
    deleteConn() {
      this.jsPlumb.deleteConnection(this.targetNodeLine);
      this.targetLine = undefined;
      this.visibleSettingPanel = false;
    },
    //测试调用方法
    doSomething() {
      this.visibleSettingPanel = !this.visibleSettingPanel;
      // this.jsPlumb.setZoom(0.75);
    },
    //保存流程
    saveProcess() {
      this.$prompt("请输入审批流程的名字", "新增审批流程", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value.trim() == "") return;
          return;
        })
        .catch(() => {
          return;
          // this.msgInfo("取消新增");
        });
    },
    // 返回唯一标识
    getUUID() {
      return Math.random()
        .toString(36)
        .substr(3, 10);
    },
    jsPlumbInit() {
      // const _this = this;
      this.jsPlumb.ready(() => {
        // 导入默认配置
        this.jsPlumb.importDefaults(this.jsplumbSetting);
        // 会使整个jsPlumb立即重绘。
        this.jsPlumb.setSuspendDrawing(false, true);
        // 初始化节点
        this.loadEasyFlow();
        // 单点击了连接线,
        document
          .getElementById("flowContainer")
          .addEventListener("click", e => {
            if (e.target == document.getElementById("flowContainer")) {
              if (this.targetLine) {
                this.targetLine.nextSibling.attributes["stroke"].value =
                  "black";
                this.targetLine.nextSibling.attributes["fill"].value = "black";
                this.targetLine.attributes["stroke"].value = "black";
              }
              this.targetLine = undefined;
              this.visibleSettingPanel = false;
            }
          });
        this.jsPlumb.bind("click", (conn, originalEvent) => {
          this.visibleSettingPanel = true;
          if (this.targetLine) {
            this.targetLine.nextSibling.attributes["stroke"].value = "black";
            this.targetLine.nextSibling.attributes["fill"].value = "black";
            this.targetLine.attributes["stroke"].value = "black";
          }
          originalEvent.target.nextSibling.attributes["stroke"].value = "red";
          originalEvent.target.nextSibling.attributes["fill"].value = "red";
          originalEvent.target.attributes["stroke"].value = "red";
          this.targetLine = originalEvent.target;
          this.targetNodeLine = conn;
        });
        // 连线
        this.jsPlumb.bind("connection", evt => {
          let from = evt.source.id;
          let to = evt.target.id;
          if (this.loadEasyFlowFinish) {
            this.data.lineList.push({ from: from, to: to });
            this.$set(this.connLineData, from + to, {
              ruleLevel: 1,
              lineRules: []
            });
          }
        });

        // 删除连线回调
        this.jsPlumb.bind("connectionDetached", evt => {
          this.deleteLine(evt.sourceId, evt.targetId);
          this.$delete(
            this.connLineData,
            this.targetNodeLine.sourceId + this.targetNodeLine.targetId
          );
          this.targetNodeLine = undefined;
        });

        // 改变线的连接节点
        this.jsPlumb.bind("connectionMoved", evt => {
          this.changeLine(evt.originalSourceId, evt.originalTargetId);
        });

        // 单击endpoint
        // jsPlumb.bind("endpointClick", function (evt) {
        //   console.log('endpointClick', evt)
        // })
        //
        // // 双击endpoint
        // jsPlumb.bind("endpointDblClick", function (evt) {
        //   console.log('endpointDblClick', evt)
        // })

        // contextmenu
        //鼠标右击事件
        // this.jsPlumb.bind("contextmenu", (evt, e) => {
        //   console.log("contextmenu", evt);
        //   e.preventDefault();
        // });

        // 连线
        this.jsPlumb.bind("beforeDrop", evt => {
          let from = evt.sourceId;
          let to = evt.targetId;
          if (from === to) {
            this.$message.error("不能连接自己");
            return false;
          }
          if (this.hasLine(from, to)) {
            this.$message.error("不能重复连线");
            return false;
          }
          if (this.hashOppositeLine(from, to)) {
            this.$message.error("不能回环");
            return false;
          }
          return true;
        });

        // beforeDetach
        this.jsPlumb.bind("beforeDetach", evt => {
          console.log("beforeDetach", evt);
        });
      });
    },
    // 加载流程图
    loadEasyFlow() {
      // 初始化节点
      for (let i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        // 设置源点，可以拖出线连接其他节点
        this.jsPlumb.makeSource(node.id, this.jsplumbSourceOptions);
        // // 设置目标点，其他源点拖出的线可以连接该节点
        this.jsPlumb.makeTarget(node.id, this.jsplumbTargetOptions);

        // this.jsPlumb.draggable(node.id, {
        //   containment: "parent"
        // });
        this.jsPlumb.draggable(node.id);
        // this.jsPlumb.draggable("flowContainer");
      }

      // 初始化连线
      for (let i = 0; i < this.data.lineList.length; i++) {
        let line = this.data.lineList[i];
        this.jsPlumb.connect(
          {
            source: line.from,
            target: line.to
          },
          this.jsplumbConnectOptions
        );
      }
      this.$nextTick(function() {
        this.loadEasyFlowFinish = true;
      });
    },
    // 删除线
    deleteLine(from, to) {
      this.data.lineList = this.data.lineList.filter(function(line) {
        if (line.from == from && line.to == to) {
          return false;
        }
        return true;
      });
    },
    // 改变连线
    changeLine(oldFrom, oldTo) {
      this.deleteLine(oldFrom, oldTo);
    },
    // 改变节点的位置
    changeNodeSite(data) {
      for (var i = 0; i < this.data.nodeList.length; i++) {
        let node = this.data.nodeList[i];
        if (node.id === data.nodeId) {
          node.left = data.left;
          node.top = data.top;
        }
      }
    },
    /**
     * 拖拽结束后添加新的节点
     * @param evt
     * @param nodeMenu 被添加的节点对象
     * @param mousePosition 鼠标拖拽结束的坐标
     */
    addNode(evt, nodeMenu, mousePosition) {
      // let width = this.$refs.nodeMenu.$el.clientWidth;
      let nodeId = this.getUUID(),
        left =
          mousePosition.left -
          this.$refs["designCanvas"].$el.getBoundingClientRect().left,
        top =
          mousePosition.top -
          this.$refs["designCanvas"].$el.getBoundingClientRect().top;
      let arr = this.data.nodeList;
      if (nodeMenu.type != "check") {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].type == nodeMenu.type) {
            this.$message.error("不允许重复添加开始审批和结束审批节点");
            return;
          }
        }
      }
      var node = {
        id: nodeId,
        name: nodeMenu.type == "check" ? "审批节点" + this.key : nodeMenu.name,
        type: nodeMenu.type,
        left: left + "px",
        top: top + "px",
        ico: nodeMenu.ico,
        show: true
      };
      if (nodeMenu.type == "check") {
        this.key++;
      }
      /**
       * 这里可以进行业务判断、是否能够添加该节点
       */
      this.data.nodeList.push(node);
      this.$nextTick(function() {
        this.jsPlumb.makeSource(nodeId, this.jsplumbSourceOptions);
        this.jsPlumb.makeTarget(nodeId, this.jsplumbTargetOptions);
        // this.jsPlumb.draggable(nodeId, {
        //   containment: "parent"
        // });
        this.jsPlumb.draggable(nodeId);
      });
    },
    /**
     * 删除节点
     * @param nodeId 被删除节点的ID
     */
    deleteNode(nodeId) {
      this.$confirm("确定要删除节点" + nodeId + "?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        closeOnClickModal: false
      })
        .then(() => {
          /**
           * 这里需要进行业务判断，是否可以删除
           */
          this.data.nodeList = this.data.nodeList.filter(function(node) {
            if (node.id === nodeId) {
              // 伪删除，将节点隐藏，否则会导致位置错位
              node.show = false;
            }
            return true;
          });
          this.$nextTick(function() {
            this.jsPlumb.removeAllEndpoints(nodeId);
          });
        })
        .catch(() => {});
      return true;
    },
    /**
     * 编辑节点
     * @param nodeId 被点击编辑的节点的ID
     */
    editNode(nodeId) {
      this.nodeFormVisible = true;
      this.$nextTick(function() {
        this.$refs.nodeForm.init(this.data, nodeId);
      });
    },
    // 是否具有该线
    hasLine(from, to) {
      for (var i = 0; i < this.data.lineList.length; i++) {
        var line = this.data.lineList[i];
        if (line.from === from && line.to === to) {
          return true;
        }
      }
      return false;
    },
    // 是否含有相反的线
    hashOppositeLine(from, to) {
      return this.hasLine(to, from);
    },
    nodeRightMenu(nodeId, evt) {
      this.menu.show = true;
      this.menu.curNodeId = nodeId;
      this.menu.left = evt.x + "px";
      this.menu.top = evt.y + "px";
    },
    // 流程数据信息
    dataInfo() {
      this.flowInfoVisible = true;
      this.$nextTick(function() {
        this.$refs.flowInfo.init();
      });
    },
    // 加载流程图
    dataReload(data) {
      this.easyFlowVisible = false;
      this.data.nodeList = [];
      this.data.lineList = [];
      this.$nextTick(() => {
        data = lodash.cloneDeep(data);
        this.easyFlowVisible = true;
        this.data = data;
        this.$nextTick(() => {
          this.jsPlumb = jsPlumb.getInstance();
          this.$nextTick(() => {
            this.jsPlumbInit();
          });
        });
      });
    },
    // 模拟载入数据dataA
    dataReloadA() {
      this.dataReload(getDataA());
    },
    changeLabel(source, target, label) {
      var lines = this.jsPlumb.getConnections({
        source: source,
        target: target
      });
      lines[0].setLabel({
        label: label,
        cssClass: "labelClass"
      });
    }
  },
  watch: {
    zoomValue: {
      deep: true,
      handler(val) {
        window.setZoom(val, this.jsPlumb);
      }
    },
    connLineData: {
      deep: true,
      handler(val) {
        if (this.targetNodeLine == null) return;
        let str = "";
        if (!val[this.targetNodeLine.sourceId + this.targetNodeLine.targetId]) {
          this.changeLabel(
            this.targetNodeLine.sourceId,
            this.targetNodeLine.targetId,
            str
          );
          return;
        }
        let arr =
          val[this.targetNodeLine.sourceId + this.targetNodeLine.targetId]
            .lineRules;
        let count = 0;
        for (let i = 0; i < arr.length; i++) {
          for (let j = 0; j < arr[i].length; j++) {
            if (
              arr[i][j].tag1 != "" &&
              arr[i][j].tag2 != "" &&
              arr[i][j].tag3 != ""
            ) {
              count++;
              str += arr[i][j].tag1 + arr[i][j].tag2 + arr[i][j].tag3 + "</br>";
            }
          }
        }
        if (count > 1) {
          str = count + "个条件";
        }
        this.changeLabel(
          this.targetNodeLine.sourceId,
          this.targetNodeLine.targetId,
          str == "" ? " " : str
        );
      }
    }
  }
};
</script>

<style lang="scss" scoped>
#flowBg,
#flowContainer {
  height: calc(100vh - 136px);
  position: absolute;
  top: 2px;
  bottom: 0;
  width: 100%;
  min-width: 1100px;
}
#flowBg {
  background: url(./assets/bgspace.png) #fff;
}

/deep/.labelClass {
  padding: 5px;
  opacity: 0.7;
  font-size: 14px;
  color: #ff9200;
  text-align: center;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.connTargetLabel {
  color: red;
}
.jtk-connector:focus {
  color: red;
}
.header-widget {
  background-color: #424056;
  border: 1px solid #5a5970;
  color: #b7b6c7;
}
.header-widget:hover {
  color: #fff;
  background-color: rgba(255, 246, 223, 0.2);
  border-color: #ff9200;
}
.header-widget:focus {
  color: #fff;
  background-color: rgba(255, 246, 223, 0.2);
  border-color: #ff9200;
}
.float-setting-panel,
.panel-show {
  width: 540px;
}
.float-setting-panel {
  position: absolute;
  top: 0;
  right: 0;
  box-sizing: border-box;
  box-shadow: 0 2px 10px 0 rgba(66, 64, 86, 0.15);
  background-color: #fff;
  -ms-flex-direction: column;
  flex-direction: column;
  display: -ms-flexbox;
  display: flex;
  /* transition-property: width;
  transition-duration: 0.5s;
  transition-timing-function: ease;
  transition-delay: 0s; */
  z-index: 10;
}
.flow-set-header {
  margin: 0 16px 0 20px;
  border-bottom: 1px solid #e1eaf1;
}
.flow-set-title {
  display: inline-block;
  position: relative;
  height: 42px;
  line-height: 42px;
  font-size: 16px;
  cursor: pointer;
}
.text-tips {
  color: #98a1a8;
  font-size: 12px;
}
.panel-container {
  margin-left: 20px;
  height: 100%;
  overflow: auto;
  padding-top: 20px;
  padding-right: 20px;
  font-size: 12px;
}
/deep/.el-form-item__label {
  font-weight: 400;
}
.el-link.el-link--default {
  color: #ff9200;
  font-size: 12px;
  cursor: pointer;
}
a {
  text-decoration: none;
}
a:hover {
  cursor: pointer;
}
.condition-block {
  position: relative;
  width: 100%;
  font-size: 12px;
  color: #3d464a;
  border: 1px solid #e1eaf1;
  border-radius: 6px;
  margin-top: 20px;
}
.condition-block .condition-title {
  position: relative;
  padding: 0 14px;
  height: 36px;
  line-height: 36px;
  background: #f4f6fa;
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  border-bottom: 1px solid #e1eaf1;
}
.el-link.is-underline:hover:after {
  border: none;
}
.canvas {
  width: 50px;
  height: 50px;
  position: absolute;
  top: 20px;
  left: 20px;
}
</style>
