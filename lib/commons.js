const Biz = require('../lib/biz').Biz;
const BizResult = require('../lib/biz-result');

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
    manipulationData: async (queryName, ps) => { }
}