import React, { Component } from 'react';
import { Layout, Menu, Icon, Tabs, Input, Button, Checkbox } from 'antd';
import state from '../../Store';
import { observer } from 'mobx-react';
import Transfers from './Transfers';


const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const { TabPane } = Tabs;
const { TextArea } = Input;

@observer
class HostSelection extends Component {
  // 生成左侧导航
  initMenu = menuArray => {
    return menuArray.map(item => {
      if (!item.children) {
        return (
          <Menu.Item key={item.title}>
            <Checkbox val={item.title} onChange={this.checkboxChange}>{item.title}</Checkbox>
          </Menu.Item>
        )
      } else {
        return (
          <SubMenu
            key={item.title}
            title={
              <span>
                <Icon type="desktop" />
                <span>{item.title}</span>
              </span>
            }
          >
            {this.initMenu(item.children)}
          </SubMenu>
        )
      }
    })
  }

  // 导航checkbox点击
  checkboxChange = e => {
    if (e.target.checked) {
      state.hostsArrChange('push', e.target.val)
    } else {
      state.hostsArrChange('splice', e.target.val)
    }
  }

  componentWillMount() {
    const duTree = [
      {
        title: 'Navigation0', children: [
          {
            title: 'Submenu0',
            children: [{ title: 'option1' }, { title: 'option2' }, { title: 'option3' }]
          }
        ]
      },
      {
        title: 'Navigation1', children: [
          {
            title: 'Submenu1',
            children: [{ title: 'option4' }, { title: 'option5' }, { title: 'option6' }]
          }
        ]
      },
      {
        title: 'Navigation2', children: [
          {
            title: 'Submenu2',
            children: [{ title: 'option7' }, { title: 'option8' }, { title: 'option9' }]
          }
        ]
      },
    ];
    // let duTree = state.getDuTree(); // 获取部署单元树
    this.menuNodes = this.initMenu(duTree);
    // state.getIsHostGroup(); // 获取主机是否分组
  }

  render() {

    return (
      <Layout>
        <Sider collapsed={!state.collapsed} theme='light' width={223}>
          <Tabs defaultActiveKey="1" size='small'>
            <TabPane tab="部署单元树" key="1" style={{ maxHeight: document.body.clientHeight - 110, overflow: 'auto' }}>
              <Menu mode="inline">
                {this.menuNodes}
              </Menu>
            </TabPane>
            <TabPane tab="设备名称" key="2" style={{ padding: '0 10px', }}>
              <Button type='primary' size='small' style={{ marginBottom: 10, float: 'right' }}>搜索</Button>
              <TextArea rows={20} />
            </TabPane>
          </Tabs>
        </Sider>
        <Layout>
          <Content style={{ minHeight: document.body.clientHeight - 60 }}>
            {/* 右侧 穿梭表格 */}
            <Transfers hostGroup={state.isHostGroup} />
          </Content>
        </Layout>
      </Layout>
    )
  }
}

export default HostSelection