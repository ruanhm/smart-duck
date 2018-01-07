import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import $ from 'jquery'
import { Button, Radio, Icon,Table } from 'antd';
//import css from 'antd/dist/antd.css';

const columns = [{
  title: 'Name',
  dataIndex: 'name',
  key: 'name',
  render: text => <a href="#">{text}</a>,
}, {
  title: 'Age',
  dataIndex: 'age',
  key: 'age',
}, {
  title: 'Address',
  dataIndex: 'address',
  key: 'address',
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
    <span>
      <a href="#">Action 一 {record.name}</a>
      <span className="ant-divider" />
      <a href="#">Delete</a>
      <span className="ant-divider" />
      <a href="#" className="ant-dropdown-link">
        More actions <Icon type="down" />
      </a>
    </span>
  ),
}];
const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York No. 1 Lake Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 42,
  address: 'London No. 1 Lake Park',
}, {
  key: '3',
  name: 'Joe Black',
  age: 32,
  address: 'Sidney No. 1 Lake Park',
}];
export default class Index extends React.Component {
  getData() {
    $.ajax({
      type: 'Get',
      url: '/AjaxGridData/FNursings',
      dataType: 'json',
      data: {
        FNTypeID: 1,
        FNursingNO: '',
        InpNO: '',
        WardCode: 0,
        RecordTime1: '',
        RecordTime2: '',
        CreateTime1: '',
        CreateTime2: '',
        Tag: 0,
        BedNO: '',
        PatientName: ''
      },
      success: function (data) {
        

      },

    });
  }
  render() {
    return <div>
      <ul>
        <Head>
          <title>My page title</title>
          <script src="/js/jquery-3.1.0.js" type="text/javascript"></script>
          <link href="/static/antd.css" rel="stylesheet" type="text/css" />
        </Head>
        <li><Link href='/b' as='/a'><a>a</a></Link></li>
        <li><Link href='/a' as='/b'><a>b</a></Link></li>
      </ul>
      {/* <button onClick={this.getData}></button> */}
      <Button type="primary" onClick={this.getData} icon="download">1</Button>
      <Button type="primary" onClick={this.getData} style={{width:'30px',height:'30px'}}>
        <Icon type="left" />2
      </Button>
      <Table columns={columns} dataSource={data} />
    </div>;
  }
}


/* export default class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
} */



