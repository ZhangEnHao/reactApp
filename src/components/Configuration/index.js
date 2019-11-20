import React, { Component } from 'react';
import { Layout, Menu } from 'antd';
import { meunJson } from './config';
import EditableTable from './EditableTable';

const { Sider, Content } = Layout;

class Configuration extends Component {
  constructor(props) {
    super(props)
    this.state = {
      osType: this.props.osType,
      isEdit: this.props.isEdit,
      newAppDu: this.props.newAppDu,
      ppConfig: this.props.ppConfig,
      isPlatMgr: this.props.isPlatMgr,
      check: this.props.check,
      openKey: '',
      columns: [],
      dataSource: [],
      disabled: false,
    }
  }

  getMenuNodes = () => {
    const osType = this.state.osType;
    let menuConfig = meunJson[osType];
    return menuConfig.map(item => {
      return (
        <Menu.Item key={item.key}>
          <span>{item.title}</span>
        </Menu.Item>
      )
    })
  }

  initTable = openKey => {
    let dataSource = this.state.ppConfig[openKey];
    dataSource.forEach((item, index) => {
      item.key = index;
      item.editable = false;
      item.status = '';
    })
    this.setState({
      openKey,
      dataSource
    })
  }

  handleClick = e => {
    this.initTable(e.key);
  }

  setData = (openKey, dataSource) => {
    let ppConfig = this.state.ppConfig;
    ppConfig[openKey] = dataSource;
    this.setState({
      ppConfig
    })
  }

  componentWillMount() {
    this.menuNodes = this.getMenuNodes();
    const osType = this.state.osType;
    let openKey = meunJson[osType][0].key;
    this.initTable(openKey);
  }

  componentWillUnmount() {
    // give => xie
    // const { ppConfig } = this.state;
    // this.props.getData(ppConfig)
  }

  render() {
    const { isEdit, newAppDu, isPlatMgr, check, openKey, dataSource, ppConfig } = this.state;
    let toEdit;
    (isEdit && newAppDu) ? (toEdit = true) : (toEdit = false);
    return (
      <div>
        <Layout>
          <Sider>
            <Menu
              selectedKeys={[openKey]}
              onClick={this.handleClick}
            >
              {this.menuNodes}
            </Menu>
          </Sider>
          <Content>
            <EditableTable 
              key={openKey}
              toEdit={toEdit}
              isPlatMgr={isPlatMgr}
              check={check}
              openKey={openKey}
              dataSource={dataSource}
              getData={this.setData}
              groupList={ppConfig.group}/>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default Configuration;
