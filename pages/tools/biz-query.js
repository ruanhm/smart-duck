import React from 'react';
import { Button,Tabs } from 'antd';
const TabPane=Tabs.TabPane;
export default class Index extends React.Component {
    constructor(props) {
        super(props);

    }
    componentDidMount() {
        fetch('/tools/getBiz?BizName=' + this.props.bizName)
            .then(res => res.json())
            .then(data => {

            })
    }
    render() {
        return (<div>
            <Button type="primary" icon="save" >保存</Button>
            <Button type="primary" icon="delete" style={{ marginLeft: 5 }}>删除</Button>
            <Button type="primary" icon="export" style={{ marginLeft: 5 }}>导出</Button>
            <Tabs defaultActiveKey="1">
                <TabPane tab="配置" key="1">Tab 1</TabPane>
                <TabPane tab="查询语句" key="2">Tab 2</TabPane>
                <TabPane tab="统计查询" key="3">Tab 3</TabPane>
                <TabPane tab="参数设置" key="4">Tab 3</TabPane>
                <TabPane tab="专业选择" key="5">Tab 3</TabPane>
            </Tabs>
        </div>);
    }
}