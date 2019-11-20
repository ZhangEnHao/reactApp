import React, { Component } from 'react';
import { Form, Input, Select, InputNumber } from 'antd';

const FormItem = Form.Item;
const { Option } = Select;

class EditableCell extends Component {
  state = {
    id: this.props.id,
    rules: this.props.rules,
    value: this.props.value,
    index: this.props.index,
    check: this.props.check,
    editable: this.props.editable || false,
    isPlatMgr: this.props.isPlatMgr,
    groupList: this.props.groupList,
    userList : this.props.userList
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.editable !== this.state.editable) {
      this.setState({ editable: nextProps.editable });
      if (nextProps.editable) {
        this.cacheValue = this.state.value;
      }
    }
    if (nextProps.status && nextProps.status !== this.props.status) {
      if (nextProps.status === 'save') {
        this.props.onChange(this.state.value);
      } else if (nextProps.status === 'cancel') {
        this.setState({ value: this.cacheValue });
        this.props.onChange(this.cacheValue);
      }
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.editable !== this.state.editable ||
      nextState.value !== this.state.value;
  }
  handleChange(e, type, fun) {
    let value;
    if(type === 'num' || type === 'select') {
      value = e
    }else {
      value = e.target.value;
    }
    this.setState({ 
      value,
      min: null,
      max: null
     }, () => {
       console.log(fun)
       for(let key in fun) {
        if(fun[key] && !('key' in fun)) {
        switch(key) {
          case 'grpName':
            this.props.getGrpName(this.state.index, value, fun[key])
            break;
          case 'gid':
            this.props.getGid(this.state.index, value, fun[key])
            break;
          case 'mainGrp':
            this.props.getMainGrp(this.state.index, fun[key])
            break;
          default:
            
        } 
        }else if('key' in fun) {
          switch(fun.key) {
            case 'userName':
              this.props.getUserName(this.state.index, fun)
              break;
            default:
               
          }
        }
       }
    });
  }

  // initMin(id, minVal=null) {
  //   const { check } = this.state;
  //   let min;
  //   switch(id){
  //     case 'gid':
  //       (check.osVersion>6) ? (min = 1500) : (min = 500)
  //       break;
  //     default:
  //       min = minVal
  //   }
  //   return min
  // }

  // initmax(id, maxVal=null) {
  //   const { check } = this.state;
  //   let max;
  //   switch(id){
  //     case 'gid':
  //       (check.osVersion>6) ? (max = 1600) : (max = 600)
  //       break;
  //     default:
  //       max = maxVal
  //   }
  //   return max;
  // }

  initOption(id) {
    const {groupList } = this.state;
    let options = [];
    const limitArr = ['dba', 'mqm', 'tuxedo', 'weblogic']
    switch(id) {
      case 'mainGrp':
        for(let i = 0, length = groupList.length; i < length; i++) {
          if(limitArr.indexOf(groupList[i].grpName) > -1) {
            continue;
          }
          options.push(<Option value={groupList[i].gid} key={groupList[i].gid}>{groupList[i].grpName}</Option>)
        }
        break;
      default:
    }
    return options
  }

  initComp(value) {
    const { id, rules, isPlatMgr, min, max, userList } = this.state;
    let cellComp;
    switch(rules.type) {
      case 'select':
        cellComp = (
          <Select
            onChange={e => this.handleChange(e, 'select', rules.change(e, userList))}
            placeholder={rules.placeholder}
            labelInValue>
              {this.initOption(id)}
          </Select>
        )
        break;
      case 'num':
        cellComp =  (<InputNumber 
          min={min}
          max={max}
          step={rules.step}
          onChange={e => this.handleChange(e, 'num', rules.change(e))}
          placeholder={rules.placeholder}/>)
        break;
      default: 
        cellComp = <Input onChange={e => this.handleChange(e, null, rules.change(e.target.value, userList))} placeholder={rules.placeholder} />;
    }
    if(!isPlatMgr) {
      const noAdmin = ['uid', 'homePath', 'lvName',];
      if(noAdmin.indexOf(id) > -1) {
        cellComp = (<span>{value}</span>)
      }
    }
    return cellComp
  }

  componentWillMount() {
    const { id, check } = this.state;
    let min;
    let max;
    switch(id){
      case 'gid':
        if(check.osVersion>6) {
          min = 1500;
          max = 1600;
        }else {
          min = 500;
          max = 600;
        }
        break;
      default:
        min = null;
        max = null;
    }
    this.setState({ min, max })
  }

  render() {
    const { id, rules, value, editable } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        {
          editable ?
            <div>
              <FormItem>
                {getFieldDecorator(id, {
                  initialValue: id === 'mainGrp' ? { key: value, label: value } : value,
                  rules: [
                    {
                      required: rules.required,
                      message: rules.message,
                      validator: rules.validator
                    },
                  ],
                })(
                  this.initComp(value)
                )}
              </FormItem>
            </div>
            :
            <div>
              {value ? (value.toString() || ' ') : ''}
            </div>
        }
      </div>
    );
  }
}
const EditableCellFrom = Form.create()(EditableCell);

export default EditableCellFrom;
