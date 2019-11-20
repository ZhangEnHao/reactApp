/* eslint-disable array-callback-return */
import { observable, action, toJS } from 'mobx';
import { message, Modal } from 'antd';

class State {
  @observable collapsed = true;
  @action.bound
  switchChange = checked => this.collapsed = checked;
  // 主机是否分组
  @observable isHostGroup = true;
  // 部署单元树
  @observable duTree = [];
  // checked: true 被选中对部署单元
  @observable hostsArr = [];
  // 主机查询列表
  @observable hostQueryList = [];
  // 自动获取columns
  @action.bound
  getColumns(object) {
    let columns = [];
    Object.keys(object).forEach(item => {
      if (item !== 'key') {
        columns.push({
          title: item,
          dataIndex: item
        })
      }
    })
    return columns;
  }
  // 主机分组按钮切换状态
  @observable isHostChange = true;
  @observable titWidth = '100%';
  // 主机添加列表
  @observable hostAddList = [];
  // 主机分组列表
  @observable hostGroupList = [];
  // 是否展示采集结果列表
  @observable isCollectionResult = true;
  // 主机查询列表 <=> 主机添加列表
  @observable querySelKeys = [];
  @observable addSelKeys = [];

  // 设置部署单元树选中项
  @action.bound
  hostsArrChange = (type, host) => {
    switch (type) {
      case 'push':
        this.hostsArr.push(host)
        break;
      case 'splice':
        this.hostsArr.splice(this.hostsArr.findIndex(item => item === host), 1)
        break;
      default:

    }
    let hosts = this.hostsArr.slice();
    console.log(hosts);
    // let result = await reqHostQueryList(hosts);
    // runInAction(() => {
    //   this.hostQueryList = result.hostQueryList
    //   this.hostColumns()
    // })
  }

  // 主机分组按钮切换状态点击事件
  @action.bound
  hostChange = () => {
    this.isHostChange = !this.isHostChange;
    if (this.isHostChange) {
      this.titWidth = '100%';
      // 取消主机分组
      let groupArr = toJS(this.hostGroupList);
      let newAddArr = [];
      for (let i = 0, length = groupArr.length; i < length; i++) {
        for (let l = 0, len = groupArr[i].groups.length; l < len; l++) {
          newAddArr.push(groupArr[i].groups[l])
        }
      }

      let addArr = toJS(this.hostAddList)
      addArr = [...addArr, ...newAddArr];
      addArr.map((item, index) => item.key = index)
      this.hostAddList = addArr
      this.hostGroupList = [];
    } else {
      this.groupType = 'auto';
      this.titWidth = '93%';
    }
  }

  // 主机查询列表选中项 change
  @action.bound
  querySelKeysChange = (selectedRowKeys, selectedRows) => {
    this.querySelKeys = selectedRowKeys
  }
  // 主机添加列表选中项 change
  @action.bound
  addSelKeysChange = (selectedRowKeys, selectedRows) => {
    this.addSelKeys = selectedRowKeys
  }

  // 删除 主机查询列表选中行
  @action.bound
  deleteQueryItem = fun => {
    let indexs = toJS(this.querySelKeys).sort((a, b) => b - a);
    let queryArr = toJS(this.hostQueryList);
    let addArr = [];
    indexs.forEach(index => {
      addArr.unshift(queryArr[index])
      queryArr.splice(index, 1);
    })
    if (queryArr.length) {
      queryArr.forEach((item, index) => item.key = index);
    } else {
      queryArr = [];
    }
    this.hostQueryList = queryArr;
    this.querySelKeys = [];
    if (fun && typeof (fun) === "function") { fun(addArr) }
  }

  // 主机查询列表项 右移入 主机添加列表
  @action.bound
  quertToAdd = () => {
    this.deleteQueryItem(arr => {
      let addArr = toJS(this.hostAddList)
      addArr = [...addArr, ...arr];
      addArr.map((item, index) => item.key = index)
      this.hostAddList = addArr
    })
  }

  // 移除主机添加列表选中项
  deleteAddItem = fun => {
    let indexs = toJS(this.addSelKeys).sort((a, b) => b - a);
    let addArr = toJS(this.hostAddList);
    let selArr = [];
    indexs.forEach(index => {
      selArr.unshift(addArr[index])
      addArr.splice(index, 1);
    })
    if (addArr.length) {
      addArr.forEach((item, index) => item.key = index);
    } else {
      addArr = [];
    }
    this.hostAddList = addArr;
    this.addSelKeys = [];
    if (fun && typeof (fun) === "function") { fun(selArr) }
  }

  // 主机添加列表 左移入 主机查询列表项
  @action.bound
  addToQuery = () => {
    this.deleteAddItem(selArr => {
      let queryArr = toJS(this.hostQueryList)
      queryArr = [...queryArr, ...selArr];
      queryArr.map((item, index) => item.key = index)
      this.hostQueryList = queryArr
    })
  }

  // 主机分组下拉框
  @observable groupType = 'auto';
  @action.bound
  groupSelChange = value => this.groupType = value;

  // 主机分组自动分组数字输入框
  @observable groupNum = 2;
  @action.bound
  groupValChange = value => this.groupNum = value;

  // 主机分组自动分组
  @observable addGroupList = [];
  @observable AddGroupSelKeys = [];
  @action.bound
  addGroupSelKeysChange = (selectedRowKeys, selectedRows) => {
    this.AddGroupSelKeys = selectedRowKeys
  }
  @observable isAddGroup = false;
  @action.bound
  addGroup = () => this.isAddGroup = true;
  @action.bound
  hideModal = type => {
    switch (type) {
      case 'cancel':
        this.isAddGroup = false;
        break;
      case 'ok':
        // 手动添加分组
        break;
      default:
    }
  }

  // 主机分组列表选中项
  @observable groupSelKeys = [];

  // 主机分组列表选中项 change
  @action.bound
  groupSelKeysChange = (selectedRowKeys, selectedRows) => {
    this.groupSelKeys = selectedRowKeys
  }
  // 主机添加列表 <=> 主机分组列表
  @action.bound
  addToGroup = () => {
    this.deleteAddItem(selArr => {
      let groups = new Array(Math.ceil(selArr.length / this.groupNum));

      for (let i = 0, length = groups.length; i < length; i++) {
        groups[i] = []
      }
      for (let j = 0, length = selArr.length; j < length; j++) {
        groups[parseInt(j / this.groupNum)][j % this.groupNum] = selArr[j];
      }

      let newGroup = [];
      for (let k = 0, length = groups.length; k < length; k++) {
        let group = [];
        groups[k].forEach(item => group.push(item.deviceName))
        newGroup.push({
          groupName: group.join(','),
          groups: groups[k]
        })
      }

      let grupuArr = toJS(this.hostGroupList)
      grupuArr = [...grupuArr, ...newGroup];
      grupuArr.map((item, index) => item.key = index)
      this.hostGroupList = grupuArr;
    })
  }

  @action.bound
  groupToAdd = () => {
    let indexs = toJS(this.groupSelKeys).sort((a, b) => b - a);
    let groupArr = toJS(this.hostGroupList);
    let selArr = [];
    indexs.forEach(index => {
      selArr.unshift(groupArr[index])
      groupArr.splice(index, 1);
    })
    if (groupArr.length) {
      groupArr.forEach((item, index) => item.key = index);
    } else {
      groupArr = [];
    }
    this.hostGroupList = groupArr;
    this.groupSelKeys = [];

    let newAddArr = [];
    for (let i = 0, length = selArr.length; i < length; i++) {
      for (let l = 0, len = selArr[i].groups.length; l < len; l++) {
        newAddArr.push(selArr[i].groups[l])
      }
    }
    let addArr = toJS(this.hostAddList)
    addArr = [...addArr, ...newAddArr];
    addArr.map((item, index) => item.key = index)
    this.hostAddList = addArr
  }

  groupDelItem = index => {
    let indexs = toJS(this.groupSelKeys).sort((a, b) => b - a);
    let newGKeys = [];
    indexs.map(item => {
      if (item > index) {
        newGKeys.push(item - 1)
      }
    })
    this.groupSelKeys = newGKeys;

    let groupArr = toJS(this.hostGroupList);
    let selArr = [];
    selArr.unshift(groupArr[index]);
    groupArr.splice(index, 1);

    if (groupArr.length) {
      groupArr.forEach((item, index) => item.key = index);
    } else {
      groupArr = [];
    }

    this.hostGroupList = groupArr;

    let newAddArr = [];
    for (let i = 0, length = selArr.length; i < length; i++) {
      for (let l = 0, len = selArr[i].groups.length; l < len; l++) {
        newAddArr.push(selArr[i].groups[l]);
      }
    }
    let addArr = toJS(this.hostAddList);
    addArr = [...addArr, ...newAddArr];
    addArr.map((item, index) => item.key = index);
    this.hostAddList = addArr;
  }

  // 采集日志 Modal 是否展示
  @observable isLogModel = false;
  @action.bound
  showLogModal = () => {
    this.isLogModel = true;
  }
  @action.bound
  hideLogModal = () => this.isLogModel = false;
  // 采集按钮 点击事件
  @action.bound
  collection = () => {
    this.showLogModal();
    // 接口 刷新日志

  }
  // 采集结果列表
  @observable collectionResultList = [
    {
      title: '标题1',
      paramTablelCode: 'table1',
      table: [
        {
          deviceName: 'John Atpem',
          host: '128.192.162.231-BJLINUXT02',
          FSNAME: '/',
          FSTYPE: 'ext4',
          FSSIZE_MB: 10
        },
        {
          deviceName: 'John Atpem',
          host: '128.192.162.231-BJLINUXT02',
          FSNAME: '/home',
          FSTYPE: 'ext4',
          FSSIZE_MB: 40
        },
        {
          deviceName: 'John Brown',
          host: '128.192.162.231-BJLINUXT02',
          FSNAME: '/dev',
          FSTYPE: 'ext4',
          FSSIZE_MB: 12
        },
        {
          deviceName: 'John Brown',
          host: '128.192.162.231-BJLINUXT02',
          FSNAME: '/some',
          FSTYPE: 'ext4',
          FSSIZE_MB: 35
        }
      ]
    },
    {
      title: '标题2',
      paramTablelCode: 'table2',
      table: [
        {
          host: '128.192.162.231-BJLINUXT02',
          FSNAME: '/index',
          FSTYPE: 'ext4',
          FSSIZE_MB: 15
        },
        {
          host: '128.192.162.231-BJLINUXT02',
          FSNAME: '/move',
          FSTYPE: 'ext4',
          FSSIZE_MB: 23
        }
      ]
    }
  ];

  // 变更参数录入接口数据
  @observable parameterEntryList = [
    {
      "chServiceId": "0598755A9CCB4FA7AA8DBA89F987D20B",
      "paramTableName": "变更参数表1",
      "paramTablelCode": "paramCode",
      "validateOperateCode": "paramCollection",
      "chParamTableColList": [
        {
          "id": "0F940827999D4BE18896F359BAE5EDB0",
          "chParamTableId": "B2FF4CAF8E1948DA9675BFDC0A310B41",
          "colName": "sizeNum",
          "colCode": "sizeNum",
          "inputType": "TEXT",
          "dataResourcesType": "MANUALl",
          "initValue": 35,
          "tableId": null,
          "tableColCode": null,
          "chParamTableColRuleList": [
            {
              "chParamTableColId": "0F940827999D4BE18896F359BAE5EDB0",
              "require": "Y",
              "validateType": "VALIDAT_NUMBER",
              "validateContent": '{"minSymbol": "VALUE_CONTAINS","minType": "FIXED","minValueSource": "collection","minValueTableCode": "table1","minValueColId": "FSSIZE_MB","minValue": null,"maxSymbol": "VALUE_CONTAINS","maxType": "FIXED","maxValueSource": "FIXED","maxValueTableCode": "table1","maxValueColId":"FSSIZE_MB","maxValue": null,"firstCharacterLetter":"Y","stringLength": "1-2"}',
              "id": "3B03047F6D394EF7A3ABAB8122A84A58"
            }
          ]
        },
        {
          "id": "0F940827999D4BE18896F359BAE5EDB0",
          "chParamTableId": "B2FF4CAF8E1948DA9675BFDC0A310B41",
          "colName": "sizeStr",
          "colCode": "sizeStr",
          "inputType": "TEXT",
          "dataResourcesType": "MANUALl",
          "initValue": "dc",
          "tableId": null,
          "tableColCode": null,
          "chParamTableColRuleList": [
            {
              "chParamTableColId": "0F940827999D4BE18896F359BAE5EDB0",
              "require": "Y",
              "validateType": "VALIDAT_STRING",
              "validateContent": '{"containsCharacters": ["NUMBER","LOWERCASE","CHARACTER"],"firstCharacterLetter":"N","stringLength": "3-9","notContainsCharacters": "a"}',
              "id": "3B03047F6D394EF7A3ABAB8122A84A58"
            }
          ]
        },
      ],
      "id": "B2FF4CAF8E1948DA9675BFDC0A310B41"
    },
    // {
    //   "chServiceId": "0598755A9CCB4FA7AA8DBA89F987D20B",
    //   "paramTableName": "变更参数表2",
    //   "paramTablelCode": "paramCode2",
    //   "validateOperateCode": "paramCollection",
    //   "chParamTableColList": [
    //     {
    //       "id": "0F940827999D4BE18896F359BAE5EDB0",
    //       "chParamTableId": "B2FF4CAF8E1948DA9675BFDC0A310B41",
    //       "colName": "服务器CHECKBOX",
    //       "colCode": "serversc",
    //       "inputType": "CHECKBOX",
    //       "dataResourcesType": "CH_COLLECTION",
    //       "initValue": '[{"code": "server1","value": "服务器1"},{"code": "server2","value": "服务器2"}]',
    //       "tableId": "table1",
    //       "tableColCode": "FSNAME",
    //       "chParamTableColRuleList": [{
    //         "require": "N",
    //       }]
    //     },
    //     {
    //       "id": "0F940827999D4BE18896F359BAE5EDB0",
    //       "chParamTableId": "B2FF4CAF8E1948DA9675BFDC0A310B41",
    //       "colName": "服务器EDIT_SELECT",
    //       "colCode": "serversel",
    //       "inputType": "EDIT_SELECT",
    //       "dataResourcesType": "CH_COLLECTION",
    //       "initValue": '[{"code": "server1","value": "服务器1"},{"code": "server2","value": "服务器2"}]',
    //       "tableId": "paramCode1",
    //       "tableColCode": "sizeNum",
    //       "chParamTableColRuleList": [{
    //         "require": "Y",
    //       }]
    //     },
    //     {
    //       "id": "0F940827999D4BE18896F359BAE5EDB0",
    //       "chParamTableId": "B2FF4CAF8E1948DA9675BFDC0A310B41",
    //       "colName": "sizeNum",
    //       "colCode": "sizeNum",
    //       "inputType": "TEXT",
    //       "dataResourcesType": "MANUALl",
    //       "initValue": 24,
    //       "tableId": null,
    //       "tableColCode": null,
    //       "chParamTableColRuleList": [
    //         {
    //           "chParamTableColId": "0F940827999D4BE18896F359BAE5EDB0",
    //           "require": "Y",
    //           "validateType": "VALIDAT_NUMBER",
    //           "validateContent": '{"minSymbol": "VALUE_CONTAINS_EQUAL","minType": "FIXED","minValueSource": "collection","minValueTableCode": "table1","minValueColId": "FSSIZE_MB","minValue": "30","maxSymbol": "VALUE_CONTAINS_EQUAL","maxType": "DYNAMIC","maxValueSource": "FIXED","maxValueTableCode": "表编码","maxValueColId":"列id","maxValue": "40","firstCharacterLetter":"Y","stringLength": "20-40"}',
    //           "id": "3B03047F6D394EF7A3ABAB8122A84A58"
    //         }
    //       ]
    //     },
    //     {
    //       "id": "0F940827999D4BE18896F359BAE5EDB0",
    //       "chParamTableId": "B2FF4CAF8E1948DA9675BFDC0A310B41",
    //       "colName": "服务SELECT",
    //       "colCode": "serv",
    //       "inputType": "SELECT",
    //       "dataResourcesType": "MANUALl",
    //       "initValue": '[{"code": "server1","value": "server1"},{"code": "server2","value": "server2"}]',
    //       "tableId": null,
    //       "tableColCode": null,
    //       "chParamTableColRuleList": [
    //         {
    //           "chParamTableColId": "0F940827999D4BE18896F359BAE5EDB0",
    //           "require": "Y",
    //           "validateType": "VALIDAT_STRING",
    //           "validateContent": '{"containsCharacters":"DC","firstCharacterLetter":"Y","stringLength":"2-8"}',
    //           "id": "3B03047F6D394EF7A3ABAB8122A84A58"
    //         },
    //         // {
    //         //   "chParamTableColId": "0F940827999D4BE18896F359BAE5EDB0",
    //         //   "require": "Y",
    //         //   "validateType": "VALIDAT_NUMBER",
    //         //   "validateContent": '{"minSymbol": "VALUE_CONTAINS_EQUAL","minType": "FIXED","minValueSource": "来源","minValueTableCode": "表编码","minValueColId": "列id","minValue": 2,"maxSymbol": "VALUE_CONTAINS_EQUAL","maxType": "FIXED","maxValueSource": "来源","maxValueTableCode": "表编码","maxValueColId":"列id","maxValue": 10,"firstCharacterLetter":"Y","stringLength": "20-40"}',
    //         //   "id": "3B03047F6D394EF7A3ABAB8122A84A58"
    //         // }
    //       ]
    //     },
    //   ],
    //   "id": "B2FF4CAF8E1948DA9675BFDC0A310B41"
    // }
  ];
  // 变更参数录入列表生成表格数据
  @observable parameterDataSource = [];
  // 变更参数录入列表生成表头
  @action.bound
  initParameterColumns = (tableItem, renderColumns, tableIndex) => {
    let columns = [{
      title: '主机名称',
      dataIndex: 'deviceName',
      ellipsis: true
    }];
    toJS(tableItem).chParamTableColList.map(tableCol => {
      let options = { ...tableCol };
      columns.push({
        title: tableCol.colName,
        dataIndex: tableCol.colCode,
        render: (text, record, index, option, tIndex) => renderColumns(text, toJS(record), index, options, tableIndex)
      })
    })
    // if (!this.parameterDataSource.length) {
    //   this.initParameterDataSource(tableItem, tableIndex)
    // }
    return columns
  }
  // 变更参数表数据
  @action.bound
  initParameterDataSource = (tableItem, tableIndex) => {
    let obj = {}
    toJS(tableItem).chParamTableColList.map(tableCol => {
      tableCol.chParamTableColRuleList && tableCol.chParamTableColRuleList.map(rule => {
        if (tableCol.inputType === 'TEXT') {
          if (rule.validateType === "VALIDAT_NUMBER") {
            obj[tableCol.colCode] = tableCol.initValue - 0;
          } else {
            obj[tableCol.colCode] = tableCol.initValue;
          }
        } else {
          obj[tableCol.colCode] = null;
        }
      })
    })
    let dataSource = [];
    toJS(this.hostAddList).map((item, index) => {
      dataSource.push({
        key: index,
        deviceName: item.deviceName,
        ...obj
      })
    })

    let parameterDataSource;
    if (toJS(this.parameterDataSource).length) {
      parameterDataSource = [...toJS(this.parameterDataSource)];
      parameterDataSource[tableIndex] = dataSource;
    } else {
      parameterDataSource = [];
      parameterDataSource[tableIndex] = dataSource;
    }
    this.parameterDataSource = parameterDataSource
  }

  // 获取数字输入框极值
  getCollection = (ruleOption, deviceName, fun) => {
    let objArr;
    let colId;
    toJS(this.collectionResultList).forEach((result, i) => {
      if (result.paramTablelCode === ruleOption.minValueTableCode) {
        objArr = result.table;
        colId = ruleOption.minValueColId;
      }
    })

    let peakArr = fun(objArr, colId, deviceName);
    peakArr.sort((a, b) => a - b);
    return peakArr
  }

  // 变更参数单元格改变
  @action.bound
  cellSelChange = (value, cellOptions, id) => {
    let dataSource = [...toJS(this.parameterDataSource)];
    dataSource[cellOptions.tableIndex][cellOptions.index][id] = value;
    this.parameterDataSource = dataSource;
  }
  // 可编辑单元格改变
  @action.bound
  autoComChange = (value, cellOptions, colCode) => {
    let dataSource = [...toJS(this.parameterDataSource)];
    dataSource[cellOptions.tableIndex][cellOptions.index][colCode] = value;
    this.parameterDataSource = dataSource;
  }

  // 可编辑input
  @action.bound
  cellInputChange = (value, cellOptions, colCode) => {
    let dataSource = [...toJS(this.parameterDataSource)];
    dataSource[cellOptions.tableIndex][cellOptions.index][colCode] = value;
    this.parameterDataSource = dataSource;
  }

  // 获取指定表格特定列数据 = 数组
  @action.bound
  getTables = (dataResourcesType, tableId) => {
    let initArr = [];
    let initTablel = [];
    switch (dataResourcesType) {
      case "CH_COLLECTION":
        initArr = [...toJS(this.collectionResultList)];
        initArr.forEach((item, i) => {
          if (item.paramTablelCode === tableId) {
            initTablel = item.table;
          }
        })
        break;
      case "CH_PARAM":
        initArr = [...toJS(this.parameterEntryList)];
        initArr.forEach((item, index) => {
          if (item.paramTablelCode === tableId) {
            initTablel = [...toJS(this.parameterDataSource)][index];
          }
        })
        break;
      default:
    }
    return initTablel;
  }

  // 复制一行 变更参数录入行
  @action.bound
  copyParameterEntry = (tableIndex, index) => {
    let dataSource = toJS(this.parameterDataSource);
    let newRow = JSON.parse(JSON.stringify(dataSource[tableIndex][index]));
    for (let key in newRow) {
      if (key !== 'deviceName') {
        newRow[key] = undefined
      }
    }
    dataSource[tableIndex].splice((index + 1), 0, newRow);
    dataSource[tableIndex].map((item, index) => item.key = index);
    console.log(dataSource)
    this.parameterDataSource = dataSource;
  }

  // 删除一行 变更参数录入行
  @action.bound
  deleteParameterEntry = (tableIndex, index) => {
    let dataSource = toJS(this.parameterDataSource);

    let ips = [];
    dataSource[tableIndex]['tableInfo'].forEach((item, i) => {
      if(item.ip === dataSource[tableIndex]['tableInfo'][index].ip) {
        ips.push(i);
      }
    })

    if(ips.length) {
      dataSource[tableIndex]['tableInfo'].splice(index, 1);
      dataSource[tableIndex]['tableInfo'].map((item, index) => item.key = index);
      this.parameterDataSource = dataSource;
    }else {
      Modal.error({
        content: `删除失败！`
      });

      message.error(`删除失败！`)
    }


  }



}

const state = new State()

export default state;
