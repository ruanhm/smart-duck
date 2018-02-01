import { Tree, Layout, Breadcrumb, Input } from 'antd';
import React from 'react';
const { Header, Content, Sider } = Layout;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;


export default class ObjectManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [
                { title: '0', key: '1' },
                { title: '1', key: '2' },
            ],
            rawData:[],
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
        }
        this.onChange = this.onChange.bind(this);
        this.onExpand = this.onExpand.bind(this);
    }
    onChange(value) {
        value = value.toLowerCase();
        var expandedKeys = new Set();
        var treeData = [
            {
                title: '0', key: '1', children: [
                    { key: '1-sys', title: '系统', children: [] },
                    { key: '1-common', title: '普通', children: [] }
                ]
            },
            {
                title: '1', key: '2', children: [
                    { key: '2-sys', title: '系统', children: [] },
                    { key: '2-common', title: '普通', children: [] }
                ]
            },
        ];
        const treeDataList = this.state.rawData.filter(o => o.BizName.toLowerCase().indexOf(value) > -1)
        for (let o of treeDataList) {
            var obj = { key: o.BizName, title: o.BizName, isLeaf: true };
            treeData[o.BizType - 1]['children'][o.IsSys ? 0 : 1]['children'].push(obj);
            expandedKeys.add(o.BizType.toString()).add(o.BizType + '-' + (o.IsSys ? 'sys' : 'common'));
        }

        this.setState({
            expandedKeys: [...expandedKeys],
            treeData,
            searchValue: value,
            autoExpandParent: true,
        });
    }
    onExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false
        });
    }
    renderTreeNodes(data, searchValue) {
        return data.map((item) => {
            var index = searchValue.length == 0 ? -1 : item.title.toLowerCase().indexOf(searchValue);
            var beforeStr = item.title.substr(0, index);
            var afterStr = item.title.substr(index + searchValue.length);
            var value=item.title.substr(index,searchValue.length);
            var title = index > -1 ? (
                <span>
                    {beforeStr}
                    <span style={{ color: '#f50' }}>{value}</span>
                    {afterStr}
                </span>
            ) : <span>{item.title}</span>;
            if (item.children) {
                return (
                    <TreeNode key={item.key} title={title} dataRef={item}>
                        {this.renderTreeNodes(item.children, searchValue)}
                    </TreeNode>
                );
            }
            return <TreeNode key={item.key} title={title} dataRef={item} />;

        });
    }
    componentDidMount() {
        var p = this;
        fetch('/tools/getBizs')
            .then(res => res.json())
            .then(data => {
                var treeData = [
                    {
                        title: '0', key: '1', children: [
                            { key: '1-sys', title: '系统', children: [] },
                            { key: '1-common', title: '普通', children: [] }
                        ]
                    },
                    {
                        title: '1', key: '2', children: [
                            { key: '2-sys', title: '系统', children: [] },
                            { key: '2-common', title: '普通', children: [] }
                        ]
                    },
                ];

                for (let o of data.Data[0]) {
                    var obj = { key: o.BizName, title: o.BizName, isLeaf: true };
                    treeData[o.BizType - 1]['children'][o.IsSys ? 0 : 1]['children'].push(obj);
                }
                this.setState({
                    treeData: [...treeData],
                    rawData: [...data.Data[0]],
                    autoExpandParent: false

                });


            })
    }
    render() {
        const { searchValue, expandedKeys, autoExpandParent } = this.state;
        return (
            <Layout>
                <Sider width={300} style={{ background: '#fff' }}>
                    <div style={{ height: this.props.height + 'px', overflow: 'auto' }}>
                        <Search style={{ marginBottom: 8, marginTop: 8 }} placeholder="Search" onSearch={this.onChange} enterButton/>
                        <Tree
                            // loadData={this.onLoadData}
                            showLine
                            expandedKeys={expandedKeys}
                            onExpand={this.onExpand}
                            autoExpandParent={autoExpandParent}
                        >
                            {this.renderTreeNodes(this.state.treeData, searchValue)}
                        </Tree>
                    </div>
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
        )
    }
}
