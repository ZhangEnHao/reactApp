import React, { Component } from 'react';
import { Card, Switch, Icon } from 'antd';
import state from '../../Store';
import { observer } from 'mobx-react';
import HostSelection from './HostSelection';
import CollectionResult from './CollectionResult';
import ParameterEntry from './ParameterEntry';


@observer
class ChangeRequest extends Component {
  // 主机选择 Card title = 左侧导航收缩组件
  initHostSel = () => {
    return (
      <div>
        <span style={{ marginRight: 30 }}>主机选择</span>
        <Switch
          checked={state.collapsed}
          onChange={state.switchChange}
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />} />
      </div>
    )
  }

  // 采集结果是否展示
  initCollectionResult = () => {
    if (state.isCollectionResult) {
      return <CollectionResult />
    } else {
      return null
    }
  }

  // 获取url参数
  getQueryVariable = variable => {
    let query = window.location.search.substring(1);
    let vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
      let pair = vars[i].split("=");
      if (pair[0] === variable) { return pair[1]; }
    }
    return (false);
  }

  componentWillMount() {

    state.hostAddList = [
      {
        key: 0,
        deviceName: '主机名称qqqqqqqqwaasassvsdvsvsdsvsdbsdbb',
        representIp: '代管IP',
        osName: '操作系统',
        clusterName: '部署单元'
      }
    ]


  }

  render() {
    return (
      <div>
        <Card title={this.initHostSel()} style={{ minHeight: document.body.clientHeight, }} bodyStyle={{ padding: 0 }}>
          {/* 主机选择 */}
          <HostSelection />
        </Card>
        {/* 采集结果表格 */}
        {this.initCollectionResult()}
        <Card title='变更参数录入'>
          {/* 变更参数录入 */}
          <ParameterEntry />
        </Card>
      </div>
    )
  }
}

export default ChangeRequest