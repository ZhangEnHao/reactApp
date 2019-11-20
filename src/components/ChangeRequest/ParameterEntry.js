import React, { Component } from 'react';
import { Card, Button, Table, Form, Select, Input, InputNumber, AutoComplete, message } from 'antd';
import { observer } from 'mobx-react';
import state from '../../Store';
import { checkForm, getValues } from './rules';
import './changeRequest.css';


const FormItem = Form.Item;
const { Option } = Select;

const EditableContext = React.createContext();

class EditTableCell extends Component {

  initialValue = (options, cellOptions) => {
    let value;
    switch (options.inputType) {
      case "TEXT":
          value = cellOptions.text ? cellOptions.text : options.initValue
          break;
      // 以下三种类型表单， options.initValue 有默认值时需要转换为数组
      case "SELECT":
        value = cellOptions.text ? cellOptions.text : undefined
        break;
      case "CHECKBOX":
          value = cellOptions.text ? cellOptions.text : undefined
          break;
      case "EDIT_SELECT":
          value = cellOptions.text ? cellOptions.text : undefined
          break;
      default:

    }
    return value
  }

  validatorRules = (value, callback, options, deviceName) => {
    // eslint-disable-next-line array-callback-return
    options['chParamTableColRuleList'].map(rule => {
      let ruleOption = rule.validateContent && JSON.parse(rule.validateContent);
      let message;
      // 是否必填
      if (!value && rule.require === 'Y') {
        message = `此项必填`;
        if (message) callback(message)
      } else {
        // 输入类型    自定义校验
        message = checkForm(rule, ruleOption, value, options, deviceName);
        if (message) callback(message)
      }
      callback()
    })
  }

  initRules = (options, deviceName) => {
    let rulesList = [];
    options.chParamTableColRuleList && options.chParamTableColRuleList.forEach(rule => {      
      rulesList.push({
        validator: (rule, value, callback) => this.validatorRules(value, callback, options, deviceName)
      })

      // 配置项
      // rulesList.push({
      //   validator: (rule, value, callback) => this.validatorRules(value, callback, options, deviceName)
      // })
    })
    return rulesList
  }

  initOption = (options, deviceName) => {
    let Options = [];
    switch (options.dataResourcesType) {
      case "MANUALl": // MANUALl  手动填写
        let optionList = JSON.parse(options.initValue);
        for (let i = 0, length = optionList.length; i < length; i++) {
          Options.push(<Option value={optionList[i].code} key={optionList[i].code}>{optionList[i].value}</Option>)
        }
        break;
      case "CH_COLLECTION": // CH_COLLECTION  采集表
        let optionArr = state.getTables(options.dataResourcesType, options.tableId)
        let optionListCOLLECTION = getValues(optionArr, options.tableColCode, deviceName);
        for (let i = 0, length = optionListCOLLECTION.length; i < length; i++) {
          Options.push(<Option value={optionListCOLLECTION[i]} key={i}>{optionListCOLLECTION[i]}</Option>)
        }
        break;
      case "CH_PARAM": // CH_PARAM  变更参数表
          let paramArr = state.getTables(options.dataResourcesType, options.tableId);
          let optionListPARAM = getValues(paramArr, options.tableColCode, deviceName);
          for (let i = 0, length = optionListPARAM.length; i < length; i++) {
            Options.push(<Option value={optionListPARAM[i]} key={i}>{optionListPARAM[i]}</Option>)
          }
        break;
      default:
    }

    return Options
  }

  initAutoComSource = (options, deviceName) => {
    let dataSource = [];
    switch (options.dataResourcesType) {
      case "MANUALl": // MANUALl  手动填写
        let optionList = JSON.parse(options.initValue);
        for (let i = 0, length = optionList.length; i < length; i++) {
          dataSource.push(optionList[i].value)
        }
        break;
      case "CH_COLLECTION": // CH_COLLECTION  采集表
        let optionArr = state.getTables(options.dataResourcesType, options.tableId)
        let optionListCOLLECTION = getValues(optionArr, options.tableColCode, deviceName);
        for (let i = 0, length = optionListCOLLECTION.length; i < length; i++) {
          dataSource.push(optionListCOLLECTION[i])
        }
        break;
      case "CH_PARAM": // CH_PARAM  变更参数表
        let paramArr = state.getTables(options.dataResourcesType, options.tableId);
        let optionListPARAM = getValues(paramArr, options.tableColCode, deviceName);
        for (let i = 0, length = optionListPARAM.length; i < length; i++) {
          dataSource.push(isNaN(optionListPARAM[i]) ? optionListPARAM[i] : optionListPARAM[i] + "")
        }
        break;
      default:
    }
    return dataSource
  }



  initComp(cellOptions, options) {
    let cellComp;
    switch (options.inputType) {
      case 'SELECT':
        cellComp = (
          <Select
            onChange={(value, option, cellOption, id) => state.cellSelChange(value, cellOptions, options.colCode)}
            style={{ minWidth: 120 }} >
            {this.initOption(options, cellOptions.deviceName)}
          </Select>
        )
        break;
      case 'TEXT':
        cellComp = (<Input onChange={(value, option, cellOption, id) => state.cellInputChange(value, cellOptions, options.colCode)}/>)
        if (options.chParamTableColRuleList[0].validateType === "VALIDAT_NUMBER") {
          cellComp = (<InputNumber onChange={(value, option, cellOption, id) => state.cellInputChange(value, cellOptions, options.colCode)} />)
          
          // eslint-disable-next-line array-callback-return
          // options['chParamTableColRuleList'].map(rule => {
          //   let ruleOption = rule.validateContent && JSON.parse(rule.validateContent);
          //   let {min, max} = getPeak(ruleOption, cellOptions.deviceName)
          //   cellComp = (<InputNumber min={min} max={max} onChange={(value, option, cellOption, id) => state.cellInputChange(value, cellOptions, options.colCode)} />)
          // })
        }
        break;
      case 'EDIT_SELECT':
        cellComp = (<AutoComplete
          onChange={value => state.autoComChange(value, cellOptions, options.colCode)}
          dataSource={this.initAutoComSource(options, cellOptions.deviceName)}
          style={{ minWidth: 120 }}
        />)
        break;
      case 'CHECKBOX':
        cellComp = (<Select
          onChange={(value, option, cellOption, id) => state.cellSelChange(value, cellOptions, options.colCode)}
          mode="multiple"
          style={{ width: 120 }}
        >
          {this.initOption(options, cellOptions.deviceName)}
        </Select>)
        break;
      default:

    }

    return cellComp
  }


  renderCell = ({ getFieldDecorator }) => {
    const { cellOptions, options } = this.props;
    return (
      <div>
        <FormItem>
          {
            getFieldDecorator(`${cellOptions.tableIndex},${cellOptions.index},${options.colCode}`, {
              initialValue: this.initialValue(options, cellOptions),
              rules: this.initRules(options, cellOptions.deviceName),
            })(
              this.initComp(cellOptions, options)
            )
          }
        </FormItem>
      </div>
    )
  }

  render() {
    return (
      <EditableContext.Consumer>
        {this.renderCell}
      </EditableContext.Consumer>)
  }
}

@observer
class ParameterEntry extends Component {

  initTable = () => {
    return state.parameterEntryList.map((tableItem, tableIndex) => {
      return (
        <Card title={tableItem.paramTableName} key={tableIndex} bordered={false} bodyStyle={{ padding: 0 }}>
          <Table
            rowKey={record => record.key}
            columns={this.initColumns(tableItem, tableIndex)}
            dataSource={state.parameterDataSource[tableIndex]}
            pagination={false} bordered size="middle" scroll={{ y: '80vh', }} />
        </Card>
      )
    })
  }

  initColumns = (tableItem, tableIndex) => {
    let columns = state.initParameterColumns(tableItem, this.renderColumns, tableIndex)
    columns.push({
      title: '操作',
      key: 'action',
      width: 150,
      render: (text, record, index) => {
        return (
          <span>
            <Button onClick={() => state.copyParameterEntry(tableIndex, index)} type='link' icon='plus' ></Button>
            <Button onClick={() => state.deleteParameterEntry(tableIndex, index)} type='link' icon='minus'></Button>
          </span>
        )
      }
    })
    return columns
  }

  renderColumns = (text, record, index, options, tableIndex) => {
    let deviceName = record.deviceName;
    return (
      <EditTableCell
        key={record.key * Date.parse(new Date())}
        cellOptions={{ tableIndex, index, text, deviceName }}
        options={options} />
    )
  }

  // 获取所有提交数据 => 底部保存按钮点击事件
  handleClick = form => {
    form.validateFields((err, values) => {
      if (!err) {
        console.log(err)
        // console.log(state.parameterDataSource)
      } else {
        message.error('变更参数录入失败！')
      }
    })
  }

  componentWillMount() {
    // eslint-disable-next-line array-callback-return
    state.parameterEntryList.map((tableItem, tableIndex) => {
      state.initParameterDataSource(tableItem, tableIndex)
    })
  }

  render() {
    return (
      <EditableContext.Provider value={this.props.form}>
        {this.initTable()}
        <Card bordered={false} bodyStyle={{ paddingRight: 0, paddingBottom: 0 }} style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            onClick={() => this.handleClick(this.props.form)}
            type='primary'>保存</Button>
        </Card>
      </EditableContext.Provider>
    )
  }
}

const ParameterEntryFrom = Form.create()(ParameterEntry);

export default ParameterEntryFrom