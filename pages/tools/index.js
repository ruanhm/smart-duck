import { Layout, Menu, Breadcrumb, Icon,Tree } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import React from 'react'
import BaseLayout from '../base-layout';
import ObjectManage from './object-manage';
import 'antd/dist/antd.css'; 
// import $ from 'jquery'




const TreeNode = Tree.TreeNode;
export default class Index extends React.Component {
    constructor(){
        super();
        this.state={
            height:0
        }
    }
    componentDidMount(){
        var bodyHeight=document.body.offsetHeight;
        var headerHeight=document.getElementsByClassName('header')[0].offsetHeight;
        this.setState({height:bodyHeight-headerHeight-10})
    }
    render() {        
        
        return <BaseLayout>
        <Layout>
            <Header className="header">
                <div className="logo" />
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['2']}
                    style={{ lineHeight: '64px' }}
                >
                    <Menu.Item key="1">1</Menu.Item>
                    <Menu.Item key="2">2</Menu.Item>
                    <Menu.Item key="3">3</Menu.Item>
                    <Menu.Item key="4">4</Menu.Item>
                    <Menu.Item key="5">5</Menu.Item>
                    <Menu.Item key="6">6</Menu.Item>
                </Menu>
            </Header>
            <ObjectManage height={this.state.height}></ObjectManage>
        </Layout>
        </BaseLayout>
    }
};