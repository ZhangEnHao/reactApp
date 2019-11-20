// 左侧导航栏配置
export const meunJson = {
  LINUX: [
    { key: 'group', title: '用户组' },
    { key: 'user', title: '用户' },
    { key: 'nas', title: 'NAS' },
    { key: 'ulimits', title: 'ULIMITS' },
    { key: 'sysctl', title: 'SYSCTL' },
    { key: 'software', title: 'SOFTWARE' },
    { key: 'host', title: 'HOSTS' },
    { key: 'link', title: 'LINK' },
  ],
}

// 表格模板，新增表格数据时使用
export const rowTemplate = {
  "group": {
    "gid": "",
    "grpName": "",
    "remark": "",
    "editable": true,
    "status": ''
  },
  "user": {
    "uid": "",
    "userName": "",
    "homePath": "",
    "lvName": "",
    "lvSize": '',
    "mountParamDump": "",
    "mountParamFsck": "",
    "mainGrp": '',
    "backGrp": "",
    "remark": "",
    "editable": true,
    "status": ''
  },
  "nas": {
    "priv": "",
    "groupName": "",
    "ownerName": "",
    "mountParam": "",
    "mountPath": "",
    "nasMountPath": '',
    "srcAddr": "",
    "remark": "",
    "editable": true,
    "status": ''
  },
  "host": {
    "ip": "",
    "hostName": "",
    "remark": "",
    "editable": true,
    "status": ''
  },
  "link": {
    "srcAddr": "",
    "targetAddr": "",
    "remark": "",
    "editable": true,
    "status": ''
  },
  "software": {
    "softwareType": "",
    "softwareName": "",
    "softwareVersion": "",
    "remark": '',
    "editable": true,
    "status": ''
  },
  "sysctl": {
    "paramType": "",
    "paramName": "",
    "paramValue": "",
    "remark": "",
    "editable": true,
    "status": ''
  },
  "ulimits": {
    "paramValue": "",
    "remark": "",
    "editable": true,
    "status": ''
  }
}

// 单元格校验规则
const limitArr = ['informix', 'websphere', 'sfmon', 'patrol', 'controlm', 'puppet', 'appmon', 'applaud', 'apoptr', 'appguard', 'tuxedo', 'oinstall', 'asmadmin', 'asmdba', 'asmoper'];

const configGrpName = {
  dba: 310,
  mqm: 410,
  tuxedo: 420,
  weblogic: 430
}

const configLvName = {
  mqm: 'vg00l4100',
  tuxedo: 'vg00l4200',
  weblogic: 'vg00l4300'
}
const configLvSize = {
  dba: '10GB',
  mqm: '20GB',
  tuxedo: '2GB',
  weblogic: '5GB'
}

export const rules = {
  remark: {
    required: false,
    placeholder: '请输入备注信息'
  },
  gid: {
    type: 'num',
    step: 10,
    required: true,
    message: '不符合gid校验规则。',
    validator: (rule, value, callback) => {
      let regPos = /^\d+(\.\d+)?$/;
      if (regPos.test(value)) {
        if(value % 10 !== 0) {
          callback('不符合gid校验规则。')
        }else {
          callback()
        }
      } else {
        callback('不符合gid校验规则。')
      }
    },
    change: value => {
      let grpName;
      switch(value){
        case 310:
          grpName = 'dba'
          break;
        case 410:
          grpName = 'mqm'
          break;
        case 420:
          grpName = 'tuxedo'
          break;
        case 430:
          grpName = 'weblogic'
          break;
        default:
          grpName = null 
      }
      return { grpName }
    }
  },
  grpName: {
    required: true,
    message: '不符合grpName校验规则。',
    validator: (rule, value, callback) => {
      const reg = /^[A-Za-z0-9]+$/;
      if(limitArr.indexOf(value) > -1) {
        callback('不符合grpName校验规则。')
      }else {
        if (reg.test(value)) {
          callback()
        } else {
          callback('不符合grpName校验规则。')
        }
      }
    },
    change: value => ({ gid: configGrpName[value] })
  },
  mainGrp: {
    type: 'select',
    message: '不符合mainGrp校验规则。',
    required: true,
    validator: (rule, value, callback) => {
      
    },
    change: (value, userList) => {
      userList = [...userList]
      // if(userList.length > 1) { userList.pop() }
      let uidArr = [];
      for(let i = 0, length = userList.length; i < length; i++) {
        if((userList[i].mainGrp === value.key - 0) || (userList[i].mainGrp === value.label)) {
          uidArr.push(userList[i].uid)
        }
      }
      uidArr.sort(function(a,b){return a-b});
      if(uidArr.length) {
        return { mainGrp: {key: uidArr[uidArr.length - 1] + 1, label: value.label} }
      }else {
        return { mainGrp: {key: (value.key - 0) + 1, label: value.label} }
      }
    }
  },
  uid: {
    required: true,
    message: '不符合uid校验规则。',
    validator: (rule, value, callback) => {
      
    },
    initialValue: '',
  },
  userName: {
    required: true,
    message: '不符合userName校验规则。',
    validator: (rule, value, callback) => {
      const reg = /^[A-Za-z0-9]+$/;
      if(limitArr.indexOf(value) > -1) {
        callback('不符合userName校验规则。')
      }else {
        if (reg.test(value)) {
          callback()
        } else {
          callback('不符合userName校验规则。')
        } 
      }
    },
    change: (val, userList) => {
      const speName = Object.keys(configGrpName);
      let value;
      if(!val) {
        return {
          key: 'userName',
          gid: '',
          grpName: '',
          userName: '',
          homePath: ''
        }
      }
      let homePath;
      let lvName;
      let mountParamDump;
      let mountParamFsck;
      if(val === 'oracle') {
        value = 'dba';
        homePath = `/home/db/oracle`;
        lvName = 'vg00l3100';
        mountParamDump = 1;
        mountParamFsck = 2;
      }else {
        value = val;
        homePath = `/home/mw/${value}`;
        lvName = configLvName[val];
        mountParamDump = 0;
        mountParamFsck = 0;
      }
      if(speName.indexOf(value) > -1) {
        let obj = {
          key: 'userName',
          gid: configGrpName[value],
          grpName: value,
          userName: val,
          homePath,
          lvName,
          lvSize: configLvSize[value],
          mountParamDump,
          mountParamFsck,
        }
        let uidArr = [];
        for(let i = 0, length = userList.length; i < length; i++) {
          if((userList[i].mainGrp === configGrpName[value] - 0) || (userList[i].mainGrp === configGrpName[value])) {
            uidArr.push(userList[i].uid)
          }
        }
        if(uidArr.length) {
          obj.uid = uidArr[uidArr.length - 1] + 1
          return obj
        }else {
          obj.uid = (configGrpName[value] - 0) + 1
          return obj
        }
      }
      // else {
      //   return {
      //     key: 'userName',
      //     userName: val,
      //     homePath: `/home/ap/${val}`
      //   }
      // }
    }
  },
  homePath: {
    required: true,
    message: '不符合homePath校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  lvName: {
    required: true,
    message: '不符合lvName校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  lvSize: {
    type: 'num',
    required: true,
    message: '不符合lvSize校验规则。',
    min: 0,
    validator: (rule, value, callback) => {
      
    }
  },
  mountParamDump: {
    required: true,
    message: '不符合mountParamDump校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  mountParamFsck: {
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  backGrp: {
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  srcAddr: {
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      let reg = /^\//;
      if(reg.test(value)) {
        callback()
      }else {
        callback('请输入绝对路径')
      }
    }
  },
  mountPath: {
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  ownerName: {
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  groupName: {
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  priv: {
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  paramValue: {
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  paramType: {
    type: 'select',
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  paramName: {
    type: 'select',
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  // paramValue: {
  //   required: true,
  //   message: '',
  //   validator: (rule, value, callback) => {
      
  //   }
  // },
  softwareName: {
    type: 'select',
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  softwareType: {
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  softwareVersion: {
    required: true,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      
    }
  },
  ip: {
    required: true,
    message: '请输入正确的IP地址',
    validator: (rule, value, callback) => {
      // IPv4正则
      const ipv4 = /^((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))\.(((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([0-9]))\.){2}((2[0-4][0-9])|(25[0-5])|(1[0-9]{0,2})|([1-9][0-9])|([1-9]))$/
      //  IPv6正则
      const ipv6 = /^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/gm;
      if (ipv4.test(value) || ipv6.test(value)) {
        callback()
      } else {
        callback('不符合IP校验规则。')
      }
    }
  },
  hostName: {
    required: false,
    message: '不符合校验规则。',
    validator: (rule, value, callback) => {
      let reg = /^\//;
      let vals = (value.indexOf(',')>-1) ? value.split(',') : null;
      if(vals) {
        vals.forEach(val => {
          if(reg.test(val)) {
            callback()
          }else {
            callback('请输入绝对路径')
          }
        })
      }else if(reg.test(value)) {
        callback()
      }else {
        callback('请输入绝对路径')
      }
    }
  },
  // srcAddr: {
  //   required: true,
  //   message: '',
  //   validator: (rule, value, callback) => {
      
  //   }
  // },
  targetAddr: {
    required: true,
    message: '',
    validator: (rule, value, callback) => {
      let reg = /^\//;
      if(reg.test(value)) {
        callback()
      }else {
        callback('请输入绝对路径')
      }
    }
  }
}