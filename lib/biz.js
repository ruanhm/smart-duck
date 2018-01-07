const DBHelper = require('./db-helper');
const BizResult = require('./biz-result');
const TYPES = require('tedious').TYPES;
const _ = require('lodash');
const BizSql = require('./biz-sql');
const BizCheck = require('./biz-check');
const BizParameter = require('./biz-parameter');
const dataType = require('./data-type');

class Biz {
    constructor(bizName, checks, sqls, type, isSys, params, countSql, hiddenFields, scenes, readOnly4Adds, readOnly4Edits, notNulls) {
        this.bizName = bizName
        this.checks = checks
        this.sqls = sqls
        this.type = type
        this.isSys = isSys
        this.params = params
        this.countSql = countSql
        this.hiddenFields = hiddenFields
        this.scenes = scenes
        this.readOnly4Adds = readOnly4Adds
        this.readOnly4Edits = readOnly4Edits
        this.notNulls = notNulls
    }
    static async getBiz(bizName) {
        if (!bizName) {
            throw new Error('bizName 不能为空')
        }
        var dbhelper = new DBHelper();
        var biz_arr = [];
        const biz_content = `select [Type]=n_Type,IsSys=isnull(b_IsSys,0),CountSql=s_CountSql,HiddenFields=s_HiddenFields,Scenes=s_Scenes,ReadOnly4Adds=s_ReadOnly4Adds,ReadOnly4Edits=s_ReadOnly4Edits,NotNulls=s_NotNulls from FRM_Biz where s_BizName=@BizName`;
        const biz_sql = `select  [Sql]=s_Sql,ID=n_ID,[Name]=s_Name,IsRun=b_IsRun,LoopField=s_LoopField,[Key]=s_Key,AssistKey=s_AssistKey  from FRM_Sql where s_BizName=@BizName`;
        const checks_sql = `select  BizName=s_BizName,ID=n_ID,[Cue]=s_Cue,[Sql]=s_Sql,IsRun=b_IsRun,CheckField=s_CheckField from FRM_Check where s_BizName=@BizName`;
        const params_sql = `select BizName=s_BizName,[Param]=s_Param,ParamName=s_ParamName,ParamType=s_ParamType,IsReturn=b_IsReturn,IsLoop=b_IsLoop,[Default]=s_Default,[IsNull]=b_IsNull,[Sort]=n_Sort FROM FRM_Parameter where s_BizName=@BizName`;
        var ps = [{ name: 'BizName', type: TYPES.VarChar, value: bizName }];
        biz_arr.push(await dbhelper.query(biz_content, ps));
        biz_arr.push(await dbhelper.query(biz_sql, ps));
        biz_arr.push(await dbhelper.query(checks_sql, ps));
        biz_arr.push(await dbhelper.query(params_sql, ps));
        dbhelper.close();

        //获取BizSql
        var sqls = [];
        for (let o of biz_arr[1]) {
            sqls.push(new BizSql(
                o['ID'],
                o['Name'],
                o['Sql'],
                o['Key'],
                o['AssistKey'],
                o['AssistKey'].split(','),
                o['LoopField'],
                o['IsRun']
            ))
        }

        //获取Checks
        var checks = [];
        for (let o of biz_arr[2]) {
            checks.push(new BizCheck(
                o['ID'],
                o['Cue'],
                o['Sql'],
                o['IsRun'],
                o['CheckField']
            ))
        }

        //获取params
        var params = [];
        for (let o of biz_arr[3]) {
            params.push(new BizParameter(
                o['Param'],
                o['ParamName'],
                o['ParamType'],
                o['IsReturn'],
                o['IsLoop'],
                o['IsNull'],
                o['Sort'],
                o['Default'],
            ))
        }
        return biz_arr[0][0]['Type'] == '1' ?
            (new BizQuery(
                bizName,
                checks,
                sqls,
                biz_arr[0][0]['Type'],
                biz_arr[0][0]['IsSys'],
                params,
                biz_arr[0][0]['CountSql'],
                biz_arr[0][0]['HiddenFields'],
                biz_arr[0][0]['Scenes'],
                biz_arr[0][0]['ReadOnly4Adds'],
                biz_arr[0][0]['ReadOnly4Edits'],
                biz_arr[0][0]['NotNulls']
            ))
            :
            (new BizOperation(
                bizName,
                checks,
                sqls,
                biz_arr[0][0]['Type'],
                biz_arr[0][0]['IsSys'],
                params,
                biz_arr[0][0]['CountSql'],
                biz_arr[0][0]['HiddenFields'],
                biz_arr[0][0]['Scenes'],
                biz_arr[0][0]['ReadOnly4Adds'],
                biz_arr[0][0]['ReadOnly4Edits'],
                biz_arr[0][0]['NotNulls']
            ));
    }
    _getSqlParamaters(psValues) {
        var p = this;
        var psMap = new Map();
        var psValuesMap = new Map();

        if (psValues) {
            for (let key in psValues) {
                if (_.isArray(psValues[key]) && psValues[key].length > 0) {
                    for (let [i, obj] of psValues[key].entries()) {
                        for (let k in obj) {
                            let mapKey = `${key}[${i}][${k}]`;
                            psValuesMap.set(mapKey, obj[k]);
                        }
                    }
                }
                else {
                    psValuesMap.set(key, psValues[key]);
                }
            }
            var allKey = [...psValuesMap.keys()];
            if (_.isArray(p.params) && p.params.length > 0) {
                for (let bizParameter of p.params) {
                    if (bizParameter.isLoop) {
                        for (let k of allKey.filter((ele) => { return ele.includes(bizParameter.param) })) {
                            psMap.set(k, {
                                name: bizParameter.param,
                                type: dataType.paramType2DbType(bizParameter.paramType),
                                value: psValuesMap.has(k) ? dataType.convert(psValuesMap.get(k), bizParameter.paramType) : null,
                                isReturn: bizParameter.isReturn
                            });
                        }
                    }
                    else {
                        psMap.set(bizParameter.param, {
                            name: bizParameter.param,
                            type: dataType.paramType2DbType(bizParameter.paramType),
                            value: psValuesMap.has(bizParameter.param) ? dataType.convert(psValuesMap.get(bizParameter.param), bizParameter.paramType) : null,
                            isReturn: bizParameter.isReturn
                        });
                    }
                }
            }
        }
        return psMap;
    }
    _getRunSql(sql) {
        return sql.replace(/@:/g, '@');
    }
}


class BizQuery extends Biz {
    constructor(bizName, checks, sqls, type, isSys, params, countSql, hiddenFields, scenes, readOnly4Adds, readOnly4Edits, notNulls) {
        super(bizName, checks, sqls, type, isSys, params, countSql, hiddenFields, scenes, readOnly4Adds, readOnly4Edits, notNulls)
    }
    async execute(ps) {
        var p = this;
        var rs = new BizResult();
        var dbhelper = new DBHelper();
        try {
            var runPs = p._getSqlRunParamaters(ps);
            var page = ps.page ? ps.page : 1;
            var pagesize = ps.pagesize ? ps.pagesize : 10;
            runPs.push({ name: 'Operator', type: TYPES.VarChar, value: 'admin' })
            runPs.push({ name: 'beginIndex', type: TYPES.Int, value: (page - 1) * pagesize + 1 })
            runPs.push({ name: 'endIndex', type: TYPES.Int, value: page * pagesize })
            var pormises = [];
            //执行sql
            for (let sql of p.sqls) {
                let runSql = p._pagingGenerator(sql.sql,ps.SortName,ps.SortOrder);
                rs.Data.push(await dbhelper.query(runSql, runPs));
            }
            //执行统计查询
            var isHasCountTag = /--\[Pagenation[\w\W]*--\[Columns\][\w\W]*--\[\/Columns\][\w\W]*--\[\/Pagenation\]/g.test(p.sqls[0].sql);
            try {
                if ((p.countSql && p.countSql.trim().length > 0) || isHasCountTag) {
                    let runSql = p.countSql;
                    if ((!p.countSql || p.countSql.trim().length == 0) && isHasCountTag) {
                        runSql = p._countGenerator(p.sqls[0].sql);
                    }
                    rs.Data.push(await dbhelper.query(runSql, runPs));
                }
            }
            catch (ex) {
                throw new Error('合计查询错误：' + ex.message);
            }
        }
        catch (ex) {
            rs.IsSuccess = false;
            rs.Msgs = [ex.message];
            rs.Data = null;
        }
        dbhelper.close();
        return rs;
    }
    _getSqlRunParamaters(ps) {
        var p = this;
        var psMap = p._getSqlParamaters(ps);
        /* var psArr = [];
        for (let obj of p.params) {
            let dbType = dataType.paramType2DbType(obj.paramType);
            let value = psMap.has(obj.param) ? dataType.convert(psMap.get(obj.param).value, obj.paramType) : null;
            psArr.push({
                name: obj.param,
                type: dbType,
                value: value
            })
        } */
        return [...psMap.values()];
    }
    _pagingGenerator(sql, sortName, sortOrder = 'asc') {
        var beginMatch = sql.match(/--\[Pagenation:[\w\s\,]*\]/g);
        var endMatch = sql.match(/--\[\/Pagenation\]/g);
        if (beginMatch && beginMatch.length > 0) {
            if (!endMatch || endMatch.length != beginMatch.length) {
                throw new Error('标记[Pagenation]个数必须与[/Pagenation]个数相等');
            }
            for (let page of beginMatch) {
                let orderbyStr = page.replace('--[Pagenation:', '').replace(']', '');
                if (sortName && sortName.trim().length > 0) {
                    orderbyStr = "[" + sortName + "] " + sortOrder;
                }
                sql = sql.replace(page, 'select * from ( select RowNumber=row_number() over(order by ' + orderbyStr + ' ),* from (');
            }
            sql = sql.replace('--[/Pagenation]', ') T_pagenation  ) TT_pagenation  where RowNumber between @:beginIndex and @:endIndex ');
        }
        return this._getRunSql(sql);
    }
    _countGenerator(sql) {
        var columnsMatch = sql.match(/--\[Columns\][\w\W]*--\[\/Columns\]/g);
        var pagenationMatch = sql.match(/--\[Pagenation:[\w\s\,]*\]/g);
        if (columnsMatch.length != pagenationMatch.length) {
            throw new Error('标记[Pagenation]与[Columns]必须相等！');
        }
        if (columnsMatch.length > 0 && pagenationMatch.length > 0) {
            for (let i = 0; i < columnsMatch.length; i++) {
                sql = sql.replace(columnsMatch[i], ' R=1 ')
                    .replace(pagenationMatch[i], 'select RowsCount=COUNT(1) from (')
                    .replace('--[/Pagenation]', ' ) T_RowsCount ');
            }

        }
        return this._getRunSql(sql);
    }
}

class BizOperation extends Biz {
    constructor(bizName, checks, sqls, type, isSys, params, countSql, hiddenFields, scenes, readOnly4Adds, readOnly4Edits, notNulls) {
        super(bizName, checks, sqls, type, isSys, params, countSql, hiddenFields, scenes, readOnly4Adds, readOnly4Edits, notNulls)
    }
    async execute(ps) {
        var p = this;
        var dbhelper = new DBHelper();
        var rs = new BizResult();
        try {
            await dbhelper.beginTransaction();
            var outputPs = p._findOutputParamaters();
            var outputPsMap = new Map();
            var psMap = p._getSqlParamaters(ps);
            var checkRunPs = p._getSqlRunParamaters(psMap);
            for (let check of p.checks) {
                if (check.isRun && check.sql.trim().length > 0 && !p._checkFieldIsLoop(check.checkField)) {
                    await p._executeCheck(dbhelper, check, checkRunPs);
                }
            }
            if (p.sqls && p.sqls.length > 0) {
                for (let sql of p.sqls) {
                    if (sql.isRun && sql.sql.trim().length > 0) {
                        let runSql = p._getRunSql(sql.sql);
                        let sqlRunCount = p._getSqlRunCount(psMap, sql.loopField);
                        for (let i = 0; i < sqlRunCount; i++) {
                            let runPs = p._getSqlRunParamaters(psMap, i, sql.loopField);
                            for (let check of p.checks) {
                                if (check.isRun && check.sql.trim().length > 0 && p._checkFieldIsLoop(check.checkField)) {
                                    await p._executeCheck(dbhelper, check, runPs);
                                }
                            }
                            let outputValue = await dbhelper.executeSql(runSql, runPs);
                            if (outputValue.size > 0) {
                                for (let op of outputPs) {
                                    let value = null;
                                    if (outputValue.has(op.param)) {
                                        value = outputValue.get(op.param);
                                        psMap.get(op.param).value = value;
                                    }
                                    outputPsMap.set(op.param, value);
                                }
                            }
                        }
                    }
                }
                if (outputPsMap.size > 0) {
                    rs.Output = {};
                    for (let [k, v] of outputPsMap) {
                        rs.Output[k] = v;
                    }
                }
            }
            await dbhelper.commitTransaction();
            rs.IsSuccess = true;
        }
        catch (ex) {
            rs.IsSuccess = false;
            rs.Msgs = [ex.message];
            rs.Output = null;
            await dbhelper.rollbackTransaction();
        }
        dbhelper.close();
        return rs;
    }
    _getSqlRunParamaters(psMap, loopIndex = 0, loopField) {
        var p = this;
        var psArr = [];
        if (p.params && p.params.length > 0) {
            var keyTag = '';
            if (loopField && loopField.trim().length > 0) {
                var tempStr = '[' + loopIndex + '][' + loopField + ']';
                keyTag = [...psMap.keys()].find((ele) => { return ele.includes(tempStr) });
                keyTag = keyTag ? keyTag.replace(tempStr, '') : '';
            }
            for (let param of p.params) {
                if (psMap.has(param.param)) {
                    psArr.push(psMap.get(param.param));
                }
                else if (psMap.has(keyTag + '[' + loopIndex + '][' + param.param + ']')) {
                    psArr.push(psMap.get(keyTag + '[' + loopIndex + '][' + param.param + ']'));
                }
                else {
                    psArr.push({
                        name: param.param,
                        type: dataType.paramType2DbType(param.paramType)
                    })
                }
            }
        }
        return psArr;
    }
    _getSqlRunCount(psMap, loopField) {
        return loopField && loopField.trim().length > 0 ?
            [...psMap.keys()].filter((ele) => { return ele.includes('[' + loopField + ']') }).length : 1;
    }
    async _executeCheck(dbhelper, check, ps) {
        try {
            var rs = await dbhelper.query(this._getRunSql(check.sql), ps);
        }
        catch (ex) {
            throw new Error('业务检查Sql错误：' + ex.message);
        }
        if (rs.length == 0) {
            var eMsg = check.id + '.*.' + check.cue;
            for (let o of ps) {
                let reg = new RegExp('@:' + o.name, 'g');
                eMsg = eMsg.replace(reg, o.value);
            }
            throw new Error(eMsg);
        }

    }
    _findOutputParamaters() {
        var p = this;
        var psArr = [];
        if (_.isArray(p.params) && p.params.length > 0) {
            psArr = p.params.filter((ele) => { return ele.isReturn });
        }
        return psArr;
    }
    _findLoopParamaters() {
        var p = this;
        var psArr = [];
        if (_.isArray(p.params) && p.params.length > 0) {
            psArr = p.params.filter((ele) => { return ele.isLoop });
        }
        return psArr;
    }
    _checkFieldIsLoop(checkField) {
        var loopParams = this._findLoopParamaters();
        //return loopParams.filter((ele) => { return ele.checkField === checkField }).length > 0;
        return loopParams.some((ele) => { return ele.checkField === checkField });
    }
}
class BizManage extends Biz {
    static async saveBiz(biz) {
        var dbhelper = new DBHelper();
        var sql = this.exportBiz(biz);
        await dbhelper.executeSqlTran(sql);
    }
    static async addBiz(bizName, isSys, type) {
        var dbhelper = new DBHelper();
        var sql = 'Insert into FRM_Biz(s_BizName,n_Type,b_IsSys) values (@BizName,@Type,@IsSys)';
        var ps = [
            { name: 'BizName', type: TYPES.VarChar, value: bizName },
            { name: 'Type', type: TYPES.Int, value: type },
            { name: 'IsSys', type: TYPES.Bit, value: IsSys },
        ];
        await dbhelper.executeSql(sql, ps);
    }
    static async delBiz(bizName) {
        var dbhelper = new DBHelper();
        var sql = ` if exists(
                select 1 from FRM_Biz where s_BizName=@BizName and  b_IsSys=1
            )
            begin
                raiserror 99999 '系统对象不能删除'
                return
            end
            --删除相关表
            delete from FRM_ModuleBiz where s_BizName=@BizName
            delete from FRM_Biz where s_BizName=@BizName
            delete from FRM_Check where s_BizName=@BizName
            delete from FRM_Sql where s_BizName=@BizName
            delete from FRM_Parameter where s_BizName=@BizName`;
        var ps = [{ name: 'BizName', type: TYPES.VarChar, value: bizName }];
        await dbhelper.executeSqlTran(sql, ps);
    }
    static async renameBiz(oldBizName, newBizName) {
        var dbhelper = new DBHelper();
        var sql = `if exists(
                select 1 from FRM_Biz where s_BizName=@OldBizName and  b_IsSys=1
                )
                begin
                    raiserror 99999 '系统对象不能重命名'
                    return
                end
                --更新相关表
                update FRM_Biz set s_BizName='@OldBizName' where s_BizName=@NewBizName
                update FRM_Check set  s_BizName=@OldBizName where s_BizName=@NewBizName
                update FRM_Parameter set  s_BizName=@OldBizName where s_BizName=@NewBizName
                update FRM_Sql set  s_BizName=@OldBizName where s_BizName=@NewBizName
                update FRM_ModuleBiz set s_BizName =@OldBizName where s_BizName=@NewBizName
                update FRM_Power set s_PowerID =@OldBizName where s_PowerID=@NewBizName
                update FRM_PowerPGroup set s_PowerID =@OldBizName where s_PowerID=@NewBizName`;
        var ps = [
            { name: 'OldBizName', type: TYPES.VarChar, value: oldBizName },
            { name: 'NewBizName', type: TYPES.VarChar, value: newBizName },
        ];
        await dbhelper.executeSqlTran(sql, ps);
    }
    static exportBiz(biz) {
        if (!biz.bizName) {
            throw new Error('bizName is not null');
        }
        biz.bizName = biz.bizName.replace(/'/g, "''");
        var sqlStr = `
/*****************************************************
导出对象：${biz.bizName}
*****************************************************/
        --删除相关表
        delete from FRM_Biz where s_BizName='${biz.bizName}'
        delete from FRM_Sql where s_BizName='${biz.bizName}'
        delete from FRM_Check where s_BizName='${biz.bizName}'
        delete from FRM_Parameter where s_BizName='${biz.bizName}'

        --插入Biz表
        INSERT INTO FRM_Biz(s_BizName,n_Type,b_IsSys,s_CountSql,s_HiddenFields,s_Scenes,s_ReadOnly4Adds,s_ReadOnly4Edits,s_NotNulls) 
        VALUES ('${biz.bizName}',${biz.type},${biz.isSys ? 1 : 0},'${biz.countSql.replace(/'/g, "''")}','${biz.hiddenFields.replace(/'/g, "''")}','${biz.scenes.replace(/'/g, "''")}','${biz.readOnly4Adds.replace(/'/g, "''")}','${biz.readOnly4Edits.replace(/'/g, "''")}','${biz.notNulls.replace(/'/g, "''")}')
        `;
        if (biz.checks) {
            sqlStr += '\r\n--插入Check';
            for (let check of biz.checks) {
                sqlStr += `\r\nINSERT INTO FRM_Check(s_BizName,n_ID,s_Cue,s_Sql,b_IsRun,s_CheckField)
                VALUES('${biz.bizName}',${check.id},'${check.cue.replace(/'/g, "''")}','${check.sql.replace(/'/g, "''")}',${check.isRun ? 1 : 0},'${check.checkField.replace(/'/g, "''")}')`;
            }
        }
        if (biz.sqls) {
            sqlStr += "\r\n--插入BizSql";
            for (let sql of biz.sqls) {
                sqlStr += `\r\nINSERT INTO FRM_Sql(s_BizName,n_ID,s_Sql,b_IsRun,s_LoopField,s_Name,s_Key,s_AssistKey)
                VALUES('${biz.bizName}',${sql.id},'${sql.sql.replace(/'/g, "''")}',${sql.isRun ? 1 : 0},'${sql.loopField.replace(/'/g, "''")}','${sql.name.replace(/'/g, "''")}','${sql.key.replace(/'/g, "''")}','${sql.assistKey.replace(/'/g, "''")}')`;
            }
        }
        if (biz.params) {
            sqlStr += '\r\n--插入BizSql';
            for (let param of biz.params) {
                sqlStr += `\r\nINSERT INTO FRM_Parameter(s_BizName,s_Param,s_ParamName,s_ParamType,b_IsReturn,b_IsLoop,s_Default,b_IsNull,n_Sort) 
                VALUES('${biz.bizName}','${param.param.replace(/'/g, "''")}','${param.paramName.replace(/'/g, "''")}','${param.paramType.replace(/'/g, "''")}',${param.isReturn ? 1 : 0},${param.isLoop ? 1 : 0},'${param.default.replace(/'/g, "''")}',${param.isNull ? 1 : 0},${param.id})`;
            }
        }
        return sqlStr;
    }

}
module.exports.Biz = Biz;
module.exports.BizManage = BizManage;
