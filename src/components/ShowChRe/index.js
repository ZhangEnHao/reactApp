import React, { Component } from 'react';
import {Card, Table } from 'antd';
import { observer } from 'mobx-react';
import state from '../../Store';

@observer
class ShowChRe extends Component {

  initColumns = () => {
    
  }

  render () {
    return (
      <Card>
        <Table />
      </Card>
    )
  }
}

export default ShowChRe