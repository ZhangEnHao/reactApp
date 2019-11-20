// const NUMBER_SYMBOL = {
//   VALUE_CONTAINS_EQUAL,// 值包含等于
//   VALUE_CONTAINS, // 值包含
//   SUM_CONTAINS, // 和包含等于
//   SUM_CONTAINS_EQUAL, // 和包含
// }
import state from '../../Store';

export const checkForm = (rule, ruleOption, value, options, deviceName) => {
  let rules = {};
  // 校验文案
  let message = [];

  // 是否必填
  let required = (rule.require === 'Y') ? true : false;
  if (required) {
    rules.required = required;
    message.push(`此项必填！`);
  }
  // 内建校验类型
  let type;
  let pattern;   // 正则
  if (options.inputType === "TEXT" || options.inputType === "EDIT_SELECT") {
    if (rule.validateType === "VALIDAT_NUMBER") {
      type = 'number'
      rules.type = type;
      message.push(` 输入项必须是数字！`);
      let ruleNum = checkNumber(ruleOption, value, deviceName)
      rules.minNum = ruleNum.minNum;
      rules.maxNum = ruleNum.maxNum;
      message.concat(ruleNum.message)
    } else if (rule.validateType === "VALIDAT_STRING") {
      type = 'string'
      rules.type = type;
      message.push(` 输入项必须是字符串！`);
      let ruleStr = checkString(ruleOption, value)
      console.log(ruleStr);
      rules.min = ruleStr.min;
      rules.max = ruleStr.max;
      rules.pattern = ruleStr.pattern;
      message.concat(ruleStr.message)
    } else if (rule.validateType === "VALIDAT_REGULAR") { // 正则
      // pattern = 
      rules.pattern = pattern;
    }
  }
  message = message.join('');
  rules.message = message
  return rules
}

// 获取对象数组特定 key 的 value 组成数组
export const getValues = (objArr, key, deviceName) => {
  let valArr = [];
  objArr.forEach(obj => {
    if (obj.deviceName === deviceName) {
      valArr.push(obj[key])
    }
  })
  return Array.from(new Set(valArr))
}

// 校验数字
export const checkNumber = (ruleOption, value, deviceName) => {
  let minNum,
    maxNum;
  // 获取 min
  switch (ruleOption.minType) {
    case "FIXED":
      minNum = ruleOption.minValue - 0;
      break;
    case "DYNAMIC":
      let peakArr = state.getCollection(ruleOption, deviceName, getValues)
      minNum = peakArr[0];
      break;
    default:
  }
  // 获取 max
  switch (ruleOption.minType) {
    case "FIXED":
      maxNum = ruleOption.maxValue - 0;
      break;
    case "DYNAMIC":
      let peakArr = state.getCollection(ruleOption, deviceName, getValues);
      maxNum = peakArr[peakArr.length - 1];
      break;
    default:
  }

  let message = [];
  if (ruleOption.minSymbol === "VALUE_CONTAINS_EQUAL") {
    message.push(`最小值需要大于等于${minNum}`)
  } else if (ruleOption.minSymbol === "VALUE_CONTAINS") {
    message.push(`最小值需要大于${minNum}`)
  }

  if (ruleOption.maxSymbol === "VALUE_CONTAINS_EQUAL") {
    message.push(`最大值需要小于等于${maxNum}`)
  } else if (ruleOption.maxSymbol === "VALUE_CONTAINS") {
    message.push(`最大值需要小于${maxNum}`)
  }
  return {
    minNum,
    maxNum,
    message
  }
}

// 校验字符串
export const checkString = (ruleOption, value) => {
  let min;
  let max;
  let pattern;
  let message = [];

  let len = ruleOption && ruleOption.stringLength && ruleOption.stringLength.split('-');
  min = len && len.length && len[0] - 0;
  if(min) message.push(`字符串最小${min}位！`)
  max = len && len.length && len[1] - 0;
  if(max) message.push(`字符串最大${max}位！`)

  if (ruleOption.firstCharacterLetter === 'Y') {
    pattern = /^[a-zA-z]/;
    message.push(`字符串必须以字母开头`);
  }

  if (ruleOption.containsCharacters) {
    if (pattern) {

    } else {
      // pattern = /d/;
    }
    message.push(`需包含字符串“${ruleOption.containsCharacters}”`);
  }
  if (ruleOption.notContainsCharacters) {
    // 正则怎么写

    message.push(`不可包含字符“${ruleOption.containsCharacters}”`)
  }
  // console.log(min, max, pattern, message)
  return {
    min,
    max,
    pattern,
    message
  }
}

