import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import $ from 'jquery'
import { Button, Radio, Icon, Table } from 'antd';
import Layout from './base-layout';
//import 'isomorphic-unfetch'

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
  static async getInitialProps({ req }) {
    if (req) {
      /* const res = await fetch('https://api.github.com/repos/zeit/next.js')
      const json = await res.json()
      return { stars: json.stargazers_count } */
      const commons= require('../lib/commons');
      console.log(commons)
      var bizList = await commons.getBizs();
      console.log(bizList.Data[0][0])
      return { stars: bizList.Data[0][0].BizName }
    }
  }


  getData() {
    $.ajax({
      type: 'Get',
      url: '/ToolsAjaxGet/FNursings',
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

    return <Layout>
      <ul>

        <li><Link href='/b' as='/a'><a>a</a></Link></li>
        <li><Link href='/a' as='/b'><a>b</a></Link></li>
      </ul>
      {/* <button onClick={this.getData}></button> */}
      <Button type="primary" onClick={this.getData} icon="download">1</Button>
      <Button type="primary" onClick={this.getData} >
        <Icon type="left" />{this.props.stars}
      </Button>
      <Table columns={columns} dataSource={data} />
    </Layout>;
  }
}


/* export default class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
} */



