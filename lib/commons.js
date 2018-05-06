const Biz = require('./biz').Biz;
const BizManage = require('./biz').BizManage;
const BizResult = require('./biz-result');

module.exports = {
    queryData: async (queryName, ps) => {
        let rs = null;
        try {
            let biz = await Biz.getBiz(queryName);
            rs = await biz.execute(ps);
        }
        catch (ex) {
            rs = new BizResult();
            rs.IsSuccess = false;
            rs.Msgs = [ex.message];
            rs.Data = null;
        }
        return rs;
    },
    queryGridData: async (queryName, ps) => {
        let rs = null;
        try {
            let biz = await Biz.getBiz(queryName);
            rs = await biz.execute(ps);
            if (rs.IsSuccess && rs.Data.length > 0) {
                let last = rs.Data.pop();
                rs.Orther1 = last.RowsCount ? last.RowsCount : 0;
                rs.Orther2 = last;
            }
        }
        catch (ex) {
            rs = new BizResult();
            rs.IsSuccess = false;
            rs.Msgs = [ex.message];
            rs.Data = null;
        }
        return rs;
    },
    manipulationData: async (queryName, ps) => { },
    getBizs: async (bizType) => {
        let rs = new BizResult();;
        try {
            rs.Data.push(await BizManage.getBizs(bizType));
            rs.IsSuccess = true;
        }
        catch (ex) {
            rs.IsSuccess = false;
            rs.Msgs = [ex.message];
            rs.Data = null;
        }
        return rs;
    },
    getBiz: async (bizName) => {
        let rs = new BizResult();
        try {
            let biz = await Biz.getBiz(bizName);
            if(biz.type==1){
                let columnMeta=await biz.getcolumnMetadata();
                biz.columnMeta=columnMeta;
            }
            rs.Data = biz;
        }
        catch (ex) {
            rs.IsSuccess = false;
            rs.Msgs = [ex.message];
            rs.Data = null;
        }
        return rs;
    }
}