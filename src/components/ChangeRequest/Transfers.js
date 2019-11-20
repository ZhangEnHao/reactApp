import React, { Component } from 'react';
import { Card, Button, Select, InputNumber, Table, Popover, Modal } from 'antd';
import { observer } from 'mobx-react';
import state from '../../Store';


const { Option } = Select;
const columnWidth = '40px';
const bigCard = document.body.clientHeight - 113;
const scrollY = document.body.clientHeight - 217;

@observer
class Transfers extends Component {

  initTitle = () => {
    return (
      <div style={{ width: state.titWidth, transition: 'width 0.5s', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ width: '44%', display: 'flex', justifyContent: 'space-between' }}>
          <span>{`已选中部署单元:${state.hostAddList.length}个`}</span>
          <span>{`选中设备: ${state.addSelKeys.length}台`}</span>
        </div>
        {state.isHostGroup ? <Button type='primary' size='small' onClick={state.hostChange}>
          {state.isHostChange ? '主机分组' : '取消主机分组'}
        </Button> : null}
      </div>
    )
  }

  ininExtra = () => {
    if (state.isHostGroup && !state.isHostChange) {
      return (
        <div>
          <span>分组类型：</span>
          <Select defaultValue="auto" onChange={state.groupSelChange} style={{ width: 100, marginRight: 20 }}>
            <Option value="auto">自动分组</Option>
            <Option value="manual">手动分组</Option>
          </Select>
          {
            this.initGroupCom()
          }
        </div>
      )
    } else {
      return false
    }
  }

  initGroupCom = () => {
    let component
    switch (state.groupType) {
      case 'auto':
        component = (
          <span>
            <span>每组主机数量：</span>
            <InputNumber onChange={state.groupValChange} defaultValue={state.groupNum} style={{ width: 80 }} />
          </span>)
        break;
      case 'manual':
        component = (<Button onClick={state.addGroup} type='primary'>增加</Button>)
        break;
      default:
        component = null
    }
    return component
  }

  initCardGroup = () => {
    const groupColumns = [
      {
        title: '分组', dataIndex: 'groupName', width: 100, ellipsis: true, render: text => {
          return (
            <Popover content={this.groupContent(text)} placement="topLeft">
              <span>{text}</span>
            </Popover>
          )
        }
      },
      {
        title: '排序', dataIndex: 'sort', width: 80, render: (text, record, index) => {
          return (
            <span>
              <Button type='link' icon="arrow-up" />
              <Button type='link' icon="arrow-down" />
            </span>)
        }
      },
      { title: '删除', dataIndex: 'delete', width: 80, render: (text, record, index) => <Button onClick={() => state.groupDelItem(index)} type='link'>Delete</Button> },
    ];

    const groupRowSelection = {
      columnWidth,
      selectedRowKeys: state.groupSelKeys,
      onChange: state.groupSelKeysChange
    };

    const addGroupColumns =[
      {title: '部署单元', dataIndex: 'du'},
      {title: '主机名称', dataIndex: 'host'},
    ];

    const addGroupRowSelection = {
      columnWidth,
      selectedRowKeys: state.AddGroupSelKeys,
      onChange: state.addGroupSelKeysChange
    }

    if (state.isHostGroup && !state.isHostChange) {
      return (
        <div style={{ flex: 3.5, height: scrollY + 40, display: 'flex', justifyContent: 'space-between', transition: 'width 0.5s' }}>
          <div style={{ width: 80, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
            <div>
              <Button onClick={state.addToGroup} disabled={!state.addSelKeys.length} type="primary" icon="right" style={{ marginBottom: 20 }}></Button><br />
              <Button onClick={state.groupToAdd} disabled={!state.groupSelKeys.length} type="primary" icon="left"></Button></div>
          </div>
          <Card style={{ flex: 1, }} bodyStyle={{ padding: 0 }}>
            <Table rowSelection={groupRowSelection} columns={groupColumns} dataSource={state.hostGroupList} scroll={{ y: scrollY + 60 }} pagination={false} bordered size="middle"/>
          </Card>
          <Modal
            title="手动分组"
            visible={state.isAddGroup}
            onOk={() => state.hideModal('ok')}
            onCancel={() => state.hideModal('cancel')}
            okText="确认"
            cancelText="取消"
          >
            <Table rowSelection={addGroupRowSelection} columns={addGroupColumns} dataSource={state.addGroupList} pagination={false} bordered size="middle"/>
          </Modal>
        </div>
      )
    } else {
      return false
    }
  }

  groupContent = text => {
    let textArr = text.split(',');
    return (
      <div>
        {textArr.map((item, index) => {
          return <p key={index}>{item}</p>
        })}
      </div>
    )
  }

  initHostCol = () => {
    return [
      { title: '主机名称', dataIndex: 'deviceName' },
      { title: '代管IP', dataIndex: 'representIp' },
      { title: '操作系统', dataIndex: 'osName' },
      { title: '部署单元', dataIndex: 'clusterName' },
    ]
  }




  render() {
    const queryRowSelection = {
      columnWidth,
      selectedRowKeys: state.querySelKeys,
      onChange: state.querySelKeysChange
    }
    const addRowSelection = {
      columnWidth,
      selectedRowKeys: state.addSelKeys,
      onChange: state.addSelKeysChange
    }

    return (
      <Card title={this.initTitle()} extra={this.ininExtra()} bordered={false} bodyStyle={{ padding: 0 }} headStyle={{ padding: 0 }}>
        <div style={{ height: bigCard, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ flex: 6.5, height: scrollY, display: 'flex', justifyContent: 'space-between' }}>
            <Card extra={<Button onClick={state.deleteQueryItem} disabled={!state.querySelKeys.length} type='primary' size='small'>删除</Button>} title='主机查询列表' style={{ flex: 1 }} headStyle={{ fontSize: 14 }} bodyStyle={{ padding: 0 }}>
              <Table rowSelection={queryRowSelection} columns={this.initHostCol()} dataSource={state.hostQueryList} scroll={{ y: scrollY, }} pagination={false} bordered size="middle" />
            </Card>
            <div style={{ width: 80, textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
              <div>
                <Button onClick={state.quertToAdd} disabled={!state.querySelKeys.length} type="primary" icon="right" style={{ marginBottom: 20 }}></Button><br />
                <Button onClick={state.addToQuery} disabled={!state.addSelKeys.length} type="primary" icon="left"></Button></div>
            </div>
            <Card style={{ flex: 1 }} title='主机添加列表' headStyle={{ fontSize: 14 }} bodyStyle={{ padding: 0 }}>
              <Table rowSelection={addRowSelection} columns={this.initHostCol()} dataSource={state.hostAddList} scroll={{ y: scrollY, }} pagination={false} bordered size="middle" />
            </Card>
          </div>
          {this.initCardGroup()}
        </div>
      </Card>
    )
  }
}

export default Transfers