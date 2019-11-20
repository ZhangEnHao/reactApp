const { override, fixBabelImports, disableEsLint, addDecoratorsLegacy } = require('customize-cra');

module.exports = override(
   fixBabelImports('import', {
     libraryName: 'antd',
     libraryDirectory: 'es',
     style: 'css',
   }),
   	// 禁用es语法检查
   	disableEsLint(),
	// 启用装饰器语法
	addDecoratorsLegacy(),
 );