import { Tree, Layout, Breadcrumb, Input, Tabs } from 'antd';
import React from 'react';
import BizQuery from './biz-query';
const { Header, Content, Sider } = Layout;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
const TabPane = Tabs.TabPane;
export default class ObjectManage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [
                { title: '0', key: '1' },
                { title: '1', key: '2' },
            ],
            rawData: [],
            expandedKeys: [],
            searchValue: '',
            autoExpandParent: true,
            activeKey: null,
            panes: [],
        }
        this.onChange = this.onChange.bind(this);
        this.onExpand = this.onExpand.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onTabChange = this.onTabChange.bind(this);
        this.onTabEdit = this.onTabEdit.bind(this);
    }
    onChange(value) {
        value = value.toLowerCase();
        var expandedKeys = new Set();
        var treeData = [
            {
                title: '0', key: '1', children: [
                    { key: '1-1', title: '系统', children: [] },
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
            let obj = { key: o.BizName, title: o.BizName, isLeaf: true };
            let firstLetter = o.BizName.substr(0, 1).toUpperCase();
            let childrenArr = treeData[o.BizType - 1]['children'][o.IsSys ? 0 : 1]['children'];
            let firstLetterObj = childrenArr.find(o => o.title == firstLetter);
            let key = '';
            if (firstLetterObj) {
                firstLetterObj.children.push(obj);
            }
            else {
                key = o.BizType + '-' + (o.IsSys ? 'sys' : 'common') + '-' + firstLetter;
                firstLetterObj = { key: key, title: firstLetter, children: [obj] };
                childrenArr.push(firstLetterObj);
            }
            expandedKeys.add(o.BizType.toString()).add(key).add(o.BizType + '-' + (o.IsSys ? 'sys' : 'common'));
        }

        this.setState({
            expandedKeys: [...expandedKeys],
            treeData,
            searchValue: value,
            autoExpandParent: true,
        });
    }
    onSelect(selectedKeys, e) {
        if (e.selected && e.node.props.dataRef.isLeaf) {
            this.addTab(selectedKeys[0]);
        }
    }
    onExpand(expandedKeys) {
        this.setState({
            expandedKeys,
            autoExpandParent: false
        });
    }
    onTabChange(activeKey) {
        this.setState({ activeKey });
    }
    onTabEdit(targetKey, action) {
        if (action == 'remove') {
            this.removeTab(targetKey);
        }
    }
    addTab(key) {
        const panes = this.state.panes;
        if (!panes.some(o => o.key == key)) {
            panes.push({ title: key, key: key });
        }
        this.setState({ panes, activeKey: key });
    }
    removeTab(targetKey) {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({ panes, activeKey });
    }
    renderTreeNodes(data, searchValue) {
        return data.map((item) => {
            var index = searchValue.length == 0 ? -1 : item.title.toLowerCase().indexOf(searchValue);
            var beforeStr = item.title.substr(0, index);
            var afterStr = item.title.substr(index + searchValue.length);
            var value = item.title.substr(index, searchValue.length);
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
                    let obj = { key: o.BizName, title: o.BizName, isLeaf: true };
                    let firstLetter = o.BizName.substr(0, 1).toUpperCase();
                    let childrenArr = treeData[o.BizType - 1]['children'][o.IsSys ? 0 : 1]['children'];
                    let firstLetterObj = childrenArr.find(o => o.title == firstLetter);
                    if (firstLetterObj) {
                        firstLetterObj.children.push(obj);
                    }
                    else {
                        let key = o.BizType + '-' + (o.IsSys ? 'sys' : 'common') + '-' + firstLetter;
                        firstLetterObj = { key: key, title: firstLetter, children: [obj] };
                        childrenArr.push(firstLetterObj);
                    }
                    //treeData[o.BizType - 1]['children'][o.IsSys ? 0 : 1]['children'].push(obj);
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
                        <Search style={{ marginBottom: 8, marginTop: 8 }} placeholder="Search" onSearch={this.onChange} enterButton />
                        <Tree
                            // loadData={this.onLoadData}
                            showLine
                            expandedKeys={expandedKeys}
                            onExpand={this.onExpand}
                            autoExpandParent={autoExpandParent}
                            onSelect={this.onSelect}
                        >
                            {this.renderTreeNodes(this.state.treeData, searchValue)}
                        </Tree>
                    </div>
                </Sider>
                <Layout style={{ paddingLeft: '5px' }}>
                    <div style={{ background: 'white', padding: '5px 0 0 5px', height: this.props.height + 'px' }}>
                        <Tabs
                            hideAdd
                            onChange={this.onTabChange}
                            activeKey={this.state.activeKey}
                            type="editable-card"
                            onEdit={this.onTabEdit}
                            animated={true}
                        >
                            {this.state.panes.map(pane => <TabPane tab={pane.title} key={pane.key}><BizQuery bizName={pane.key}></BizQuery></TabPane>)}

                        </Tabs>
                    </div>
                </Layout>
            </Layout>
        )
    }
}
