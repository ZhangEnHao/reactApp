exports.formatMockData = (
  mockData = {},
  codeStatus = 0,
  message = '@cword(1,10)',
  customData
) => {
  if (customData) return customData
  let initFormatObj = {
    code: codeStatus,
    data: mockData,
    message: message
  }
  return initFormatObj
}

// 组合数据
exports.comp = function (value) {
  return [null, '', value]
}