import React, { Component } from 'react';
import { Card, Button, Modal, Table } from 'antd';
import { observer } from 'mobx-react';
import state from '../../Store';

@observer
class CollectionResult extends Component {

  initTable = () => {
    // return state.collectionResultList.map((resultItem, resultIndex) => {
    //   resultItem.collectionResultJson.map((item, index) => item.key = index);
    //   return (
    //     <Card title={resultItem.title} key={resultIndex} bordered={false} bodyStyle={{ padding: 0 }} headStyle={{ padding: 0, fontSize: 14 }} >
    //       <Table columns={state.getColumns(resultItem.collectionResultJson[0])} dataSource={resultItem.collectionResultJson} pagination={false} bordered size="middle" scroll={{ y: '80vh', }} />
    //     </Card>
    //   )
    // })
  }

  render() {
    
    return (
      <div>
        <Card
          title={
            <div style={{ width: '40%', display: 'flex', justifyContent: 'space-between' }}>
              <span>采集结果表格</span>
              <Button onClick={state.collection} type='primary' size='small' style={{ width: 72 }}>采集</Button>
              <Button onClick={state.showLogModal} type='primary' size='small'>采集日志</Button>
            </div>
          }
        >
          {this.initTable()}
        </Card>
        <Modal
          title="采集日志"
          footer={false}
          visible={state.isLogModel}
          onOk={state.hideLogModal}
          onCancel={state.hideLogModal} >
        </Modal>
      </div>

    )
  }
}

export default CollectionResult