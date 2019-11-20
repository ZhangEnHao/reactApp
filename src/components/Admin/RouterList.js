import React, { Component } from "react";
import { withRouter } from 'react-router-dom'
import { Table, Input, Button } from 'antd';
import menuList from "../../config/menuConfig";

const { TextArea } = Input;
class RouterList extends Component {

  state = {
    key: 0
  }

  initColumns = () => {
    return [
      {
				title: '路由名称',
        dataIndex: 'title',
        width: 100
      },
      {
				title: '路由URL',
				dataIndex: 'key',
        width: 200
      },
      {
				title: '路由参数',
        dataIndex: 'parameter',
        render: (text, record, index) => (
          <TextArea value={text} onChange={ e => this.parameter(e, index) } rows={3} />
        )
      },
      {
				title: '备注',
				dataIndex: 'remark',
        width: 200
      },
			{
				title: '操作',
        width: 100,
				render: (text, record, index) => (
					<span>
						<Button type="primary" onClick={() => { this.routrJump(record) }}>跳转路由</Button>
          </span>
				)
			}
    ]
  }

  parameter = (e, index) => {
    this.setState({key: index})
    menuList[index].parameter = e.target.value;
  }

  routrJump = record => {
    let parameterJSON = record.parameter && JSON.parse(record.parameter);
    let parameter = [];
    for(let key in parameterJSON) {
      parameter.push(`${key}=${parameterJSON[key]}`);
    }
    let parameters = parameter.join("&");
    let router = parameters ? `${record.key}?${parameters}` : record.key;
    this.props.history.push(router);
  }

  render() {
    return (
      <Table key={this.state.key} dataSource={menuList} columns={this.initColumns()} pagination={false} bordered size="middle" />
    )
  }
}

export default withRouter(RouterList)
