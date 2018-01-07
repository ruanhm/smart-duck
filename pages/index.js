import React from 'react'
import Link from 'next/link'
import Head from 'next/head'
import $ from 'jquery'


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
        </Head>
        <li><Link href='/b' as='/a'><a>a</a></Link></li>
        <li><Link href='/a' as='/b'><a>b</a></Link></li>
      </ul>
      <button onClick={this.getData}></button>
    </div>;
  }
}


/* export default class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
} */



