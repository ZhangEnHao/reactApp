import React from 'react';
import { Table, Button, Form } from 'antd';
import { rowTemplate, rules } from './config';
import EditableCellFrom from './EditableCellFrom';

class EditableTable extends React.Component {
  constructor(props) {
    super(props);
    this.rowTemplate = rowTemplate
    this.columnsJson = {
      group: [
        { title: 'GID', dataIndex: 'gid', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'gid', text), },
        { title: '组名称', dataIndex: 'grpName', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'grpName', text), },
        { title: '备注', dataIndex: 'remark', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'remark', text), },
        {
          title: '操作',
          dataIndex: 'action',
          render: (text, record, index) => {
            const editable = this.state.dataSource[index].editable;
            return (
              <div>
                {
                  editable ?
                    <span>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'save')} ref={editDoneButton => this.editDoneButton = editDoneButton} type='primary' size="small" style={{ marginRight: 10 }}>保存</Button>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'cancel')} type='danger' size="small">取消</Button>
                    </span>
                    :
                    <span>
                      <Button onClick={() => this.edit(this.state.dataSource, index)} disabled={!this.props.toEdit} type='primary' size="small" style={{ marginRight: 10 }}>修改</Button>
                      <Button onClick={() => this.handleDelete(record.key)} disabled={!this.props.toEdit} type="danger" size="small">删除</Button>
                    </span>
                }
              </div>
            );
          },
        }
      ],
      user: [
        { title: '主组', dataIndex: 'mainGrp', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'mainGrp', text), },
        { title: 'UID', dataIndex: 'uid', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'uid', text), },
        { title: '用户名', dataIndex: 'userName', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'userName', text), },
        { title: '主目录', dataIndex: 'homePath', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'homePath', text), },
        { title: 'LV名称', dataIndex: 'lvName', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'lvName', text), },
        { title: 'LV大小（G）', dataIndex: 'lvSize', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'lvSize', text), },
        { title: '挂载参数dump', dataIndex: 'mountParamDump', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'mountParamDump', text), },
        { title: '挂载参数fsck', dataIndex: 'mountParamFsck', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'mountParamFsck', text), },
        { title: '属组', dataIndex: 'backGrp', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'backGrp', text), },
        { title: '备注', dataIndex: 'remark', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'remark', text), },
        {
          title: '操作',
          dataIndex: 'action',
          render: (text, record, index) => {
            const editable = this.state.dataSource[index].editable;
            return (
              <div>
                {
                  editable ?
                    <span>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'save')} type='primary' size="small" style={{ marginRight: 10 }}>保存</Button>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'cancel')} type='danger' size="small">取消</Button>
                    </span>
                    :
                    <span>
                      <Button onClick={() => this.edit(this.state.dataSource, index)} disabled={!this.props.toEdit} type='primary' size="small" style={{ marginRight: 10 }}>修改</Button>
                      <Button onClick={() => this.handleDelete(record.key)} disabled={!this.props.toEdit} type="danger" size="small">删除</Button>
                    </span>
                }
              </div>
            );
          },
        }
      ],
      nas: [
        { title: 'NAS源地址', dataIndex: 'srcAddr', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'srcAddr', text), },
        { title: '挂载点', dataIndex: 'mountPath', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'mountPath', text), },
        { title: '属主', dataIndex: 'ownerName', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'ownerName', text), },
        { title: '属组', dataIndex: 'groupName', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'groupName', text), },
        { title: '权限', dataIndex: 'priv', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'priv', text), },
        { title: '备注', dataIndex: 'remark', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'remark', text), },
        {
          title: '操作',
          dataIndex: 'action',
          render: (text, record, index) => {
            const editable = this.state.dataSource[index].editable;
            return (
              <div>
                {
                  editable ?
                    <span>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'save')} type='primary' size="small" style={{ marginRight: 10 }}>保存</Button>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'cancel')} type='danger' size="small">取消</Button>
                    </span>
                    :
                    <span>
                      <Button onClick={() => this.edit(this.state.dataSource, index)} disabled={!this.props.toEdit} type='primary' size="small" style={{ marginRight: 10 }}>修改</Button>
                      <Button onClick={() => this.handleDelete(record.key)} disabled={!this.props.toEdit} type="danger" size="small">删除</Button>
                    </span>
                }
              </div>
            );
          },
        }
      ],
      ulimits: [
        { title: '参数值', dataIndex: 'paramValue', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'paramValue', text), },
        { title: '备注', dataIndex: 'remark', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'remark', text), },
        {
          title: '操作',
          dataIndex: 'action',
          render: (text, record, index) => {
            const editable = this.state.dataSource[index].editable;
            return (
              <div>
                {
                  editable ?
                    <span>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'save')} type='primary' size="small" style={{ marginRight: 10 }}>保存</Button>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'cancel')} type='danger' size="small">取消</Button>
                    </span>
                    :
                    <span>
                      <Button onClick={() => this.edit(this.state.dataSource, index)} disabled={!this.props.toEdit} type='primary' size="small" style={{ marginRight: 10 }}>修改</Button>
                      <Button onClick={() => this.handleDelete(record.key)} disabled={!this.props.toEdit} type="danger" size="small">删除</Button>
                    </span>
                }
              </div>
            );
          },
        }
      ],
      sysctl: [
        { title: '参数类型', dataIndex: 'paramType', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'paramType', text), },
        { title: '参数名称', dataIndex: 'paramName', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'paramName', text), },
        { title: '参数值', dataIndex: 'paramValue', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'paramValue', text), },
        { title: '备注', dataIndex: 'remark', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'remark', text), },
        {
          title: '操作',
          dataIndex: 'action',
          render: (text, record, index) => {
            const editable = this.state.dataSource[index].editable;
            return (
              <div>
                {
                  editable ?
                    <span>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'save')} type='primary' size="small" style={{ marginRight: 10 }}>保存</Button>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'cancel')} type='danger' size="small">取消</Button>
                    </span>
                    :
                    <span>
                      <Button onClick={() => this.edit(this.state.dataSource, index)} disabled={!this.props.toEdit} type='primary' size="small" style={{ marginRight: 10 }}>修改</Button>
                      <Button onClick={() => this.handleDelete(record.key)} disabled={!this.props.toEdit} type="danger" size="small">删除</Button>
                    </span>
                }
              </div>
            );
          },
        }
      ],
      software: [
        { title: '软件名称', dataIndex: 'softwareName', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'softwareName', text), },
        { title: '软件类型', dataIndex: 'softwareType', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'softwareType', text), },
        { title: '软件版本', dataIndex: 'softwareVersion', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'softwareVersion', text), },
        { title: '备注', dataIndex: 'remark', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'remark', text), },
        {
          title: '操作',
          dataIndex: 'action',
          render: (text, record, index) => {
            const editable = this.state.dataSource[index].editable;
            return (
              <div>
                {
                  editable ?
                    <span>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'save')} type='primary' size="small" style={{ marginRight: 10 }}>保存</Button>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'cancel')} type='danger' size="small">取消</Button>
                    </span>
                    :
                    <span>
                      <Button onClick={() => this.edit(this.state.dataSource, index)} disabled={!this.props.toEdit} type='primary' size="small" style={{ marginRight: 10 }}>修改</Button>
                      <Button onClick={() => this.handleDelete(record.key)} disabled={!this.props.toEdit} type="danger" size="small">删除</Button>
                    </span>
                }
              </div>
            );
          },
        }
      ],
      host: [
        { title: 'IP', dataIndex: 'ip', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'ip', text), },
        { title: '主机名称', dataIndex: 'hostName', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'hostName', text), },
        { title: '备注', dataIndex: 'remark', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'remark', text), },
        {
          title: '操作',
          dataIndex: 'action',
          render: (text, record, index) => {
            const editable = this.state.dataSource[index].editable;
            return (
              <div>
                {
                  editable ?
                    <span>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'save')} type='primary' size="small" style={{ marginRight: 10 }}>保存</Button>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'cancel')} type='danger' size="small">取消</Button>
                    </span>
                    :
                    <span>
                      <Button onClick={() => this.edit(this.state.dataSource, index)} disabled={!this.props.toEdit} type='primary' size="small" style={{ marginRight: 10 }}>修改</Button>
                      <Button onClick={() => this.handleDelete(record.key)} disabled={!this.props.toEdit} type="danger" size="small">删除</Button>
                    </span>
                }
              </div>
            );
          },
        }
      ],
      link: [
        { title: '源地址', dataIndex: 'srcAddr', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'srcAddr', text), },
        { title: '目标地址', dataIndex: 'targetAddr', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'targetAddr', text), },
        { title: '备注', dataIndex: 'remark', render: (text, record, index) => this.renderColumns(this.state.dataSource, index, 'remark', text), },
        {
          title: '操作',
          dataIndex: 'action',
          render: (text, record, index) => {
            const editable = this.state.dataSource[index].editable;
            return (
              <div>
                {
                  editable ?
                    <span>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'save')} type='primary' size="small" style={{ marginRight: 10 }}>保存</Button>
                      <Button onClick={() => this.editDone(this.state.dataSource, index, 'cancel')} type='danger' size="small">取消</Button>
                    </span>
                    :
                    <span>
                      <Button onClick={() => this.edit(this.state.dataSource, index)} disabled={!this.props.toEdit} type='primary' size="small" style={{ marginRight: 10 }}>修改</Button>
                      <Button onClick={() => this.handleDelete(record.key)} disabled={!this.props.toEdit} type="danger" size="small">删除</Button>
                    </span>
                }
              </div>
            );
          },
        }
      ]
    }

    this.state = {
      isPlatMgr: this.props.isPlatMgr,
      openKey: this.props.openKey,
      check: this.props.check,
      columns: [],
      dataSource: this.props.dataSource,
      key: null,
      groupList: this.props.groupList
    };
  }

  renderColumns(data, index, key, text) {
    const { editable, status } = data[index];
    const { check, isPlatMgr, groupList, dataSource } = this.state;

    if (typeof editable === 'undefined') {
      return text;
    }
    return (<EditableCellFrom
      id={key}
      isPlatMgr={isPlatMgr}
      check={check}
      rules={rules[key]}
      editable={editable}
      value={text}
      index={index}
      onChange={value => this.handleChange(data, key, index, value)}
      status={status}
      getGrpName={this.setGrpName}
      getGid={this.setGid}
      groupList={groupList}
      getMainGrp={this.setMainGrp}
      userList={dataSource}
      getUserName={this.setUserName}
    />);
  }

  handleChange(data, key, index, value) {
    data[index][key] = value;
    this.setState({ dataSource: data });
  }

  editDone(data, index, type) {
    if (data[index] && typeof data[index].editable !== 'undefined') {
      data[index].editable = false;
      data[index].status = type;
    }
    this.setState({ dataSource: data }, () => {
      if (data[index] && typeof data[index].editable !== 'undefined') {
        delete data[index].status;
      }
    });
  }

  edit(data, index) {
    if (data[index]) {
      data[index].editable = true;
    }
    this.setState({ dataSource: data });
  }

  handleDelete = key => {
    const newDataSource = [...this.state.dataSource];
    let dataSource = newDataSource.filter(item => item.key !== key);
    dataSource.forEach((item, index) => item.key = index);
    this.setState({ dataSource });
  }

  handleAdd = () => {
    const { check, openKey, dataSource } = this.state;
    let baseGid;
    if (dataSource.length) {
      baseGid = dataSource[dataSource.length - 1].gid - 0 || null;
    } else {
      if (check.osVersion > 6) {
        baseGid = 1500
      } else {
        baseGid = 500
      }
    }
    let newData = JSON.parse(JSON.stringify(rowTemplate[openKey]));
    if (check.osVersion > 6) {
      if (baseGid >= 1600) {
        baseGid = 1600
      }
    } else {
      if (baseGid >= 600) {
        baseGid = 600
      }
    }
    if (dataSource.length) {
      if((check.osVersion > 6 && baseGid === 1600) || (check.osVersion<=6 && baseGid === 600)) {
        newData.gid = baseGid;
      }else {
        newData.gid = baseGid + 10;
      }
    } else {
      newData.gid = baseGid;
    }
    let newDataSource = [...dataSource, newData];
    newDataSource.forEach((item, index) => item.key = index);
    this.setState({ dataSource: newDataSource });
  }

  setGrpName = (index, gid, grpName) => {
    const { dataSource } = this.state;
    let newDataSource = [...dataSource];
    newDataSource[index].gid = gid;
    newDataSource[index].grpName = grpName;

    this.setState({
      dataSource: newDataSource,
      key: grpName,
    })
  }

  setGid = (index, grpName, gid) => {
    const { dataSource } = this.state;
    let newDataSource = [...dataSource];
    newDataSource[index].gid = gid;
    newDataSource[index].grpName = grpName;

    this.setState({
      dataSource: newDataSource,
      key: grpName,
    })
  }

  setMainGrp = (index, value) => {
    const { dataSource } = this.state;
    let newDataSource = [...dataSource];
    newDataSource[index].mainGrp = value.label;
    newDataSource[index].uid = value.key;
    this.setState({
      dataSource: newDataSource,
      key: value.key,
    })
  }

  setUserName = (index, obj) => {
    const { dataSource } = this.state;
    let newDataSource = [...dataSource];

    newDataSource[index].mainGrp = obj.grpName || '';
    newDataSource[index].uid = obj.uid;
    newDataSource[index].userName = obj.userName;
    newDataSource[index].homePath = obj.homePath;
    newDataSource[index].lvName = obj.lvName;
    newDataSource[index].lvSize = obj.lvSize;
    newDataSource[index].mountParamDump = obj.mountParamDump;
    newDataSource[index].mountParamFsck = obj.mountParamFsck;

    this.setState({
      dataSource: newDataSource,
      key: obj.uid ? obj.uid : obj.userName,
    })
  }

  componentWillMount() {
    const { openKey, dataSource } = this.props;
    let columns = this.columnsJson[openKey];

    this.setState({
      openKey,
      columns,
      dataSource
    })
  }

  componentWillUnmount() {
    // 保存
    const { openKey, dataSource } = this.state;
    // let indexs = [];
    dataSource.forEach((item, index) => {
      ['editable', 'key', 'status'].map(key => delete item[key]);
      // for (let k in item) {
      //   if ((item[k] === '' || item[k]) && k !== 'remark') {
      //     // indexs.push(index)
      //     dataSource.splice(index, 1)
      //   }
      // }
    })
    // indexs.sort(function (a, b) { return b - a })
    // indexs.forEach(index => dataSource.splice(index, 1))
    this.props.getData(openKey, dataSource)
  }

  render() {
    const { columns, dataSource, key } = this.state;
    return (
      <Form>
        <Button onClick={this.handleAdd} disabled={!this.props.toEdit} type="primary" size="small" style={{ marginTop: 5, marginBottom: 5 }}>新增</Button>
        <Table
          key={key}
          bordered
          dataSource={dataSource}
          columns={columns}
          // pagination={{ defaultPageSize: 11 }}
        />
      </Form>
    );
  }
}

const EditableFormTable = Form.create()(EditableTable);

export default EditableFormTable