import { Layout, Menu, Breadcrumb, Icon,Tree } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;
import React from 'react'
import BaseLayout from '../_layout';

/* const commons = require('../../lib/commons') */

import 'isomorphic-unfetch'
const TreeNode = Tree.TreeNode;
export default class Index extends React.Component {
    static async getInitialProps({ req }) {
        const res = await fetch('https://api.github.com/repos/zeit/next.js')
        const json = await res.json()

        return { stars: json.stargazers_count }

        /* var bizList=null
        try{
            console.log(bizList)
            var bizList=await commons.getBizs();
            console.log(bizList)
        }
        catch(ex){
            console.log(ex)
        }
        return { bizList }  */
    }
    render() {        
        const loop = data =>data.map((item) => {
        
            if (item.children && item.children.length) {
              return <TreeNode key={item.BizName} title={item.BizName}>{loop(item.children)}</TreeNode>;
            }
            return <TreeNode key={item.BizName} title={item.BizName} />;
          });
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
                    <Menu.Item key="1">模块管理</Menu.Item>
                    <Menu.Item key="2">对象管理</Menu.Item>
                    <Menu.Item key="3">权限管理</Menu.Item>
                    <Menu.Item key="4">数据字典</Menu.Item>
                    <Menu.Item key="5">快捷工具</Menu.Item>
                    <Menu.Item key="6">开发中</Menu.Item>
                </Menu>
            </Header>
            <Layout>
                <Sider width={200} style={{ background: '#fff' }}>
                 <Tree
                    className="draggable-tree"
                    defaultExpandedKeys={['0-0', '0-0-0', '0-0-0-0']}
                    draggable
                    onDragEnter={this.onDragEnter}
                    onDrop={this.onDrop}
                >
                    {loop(this.props.bizList.Data)}
                </Tree> 
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <Breadcrumb style={{ margin: '12px 0' }}>
                        <Breadcrumb.Item>Home</Breadcrumb.Item>
                        <Breadcrumb.Item>List</Breadcrumb.Item>
                        <Breadcrumb.Item>App</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
                        Content
                    </Content>
                </Layout>
            </Layout>
        </Layout>
        </BaseLayout>
    }
};