class BizSql {
    constructor(id, name, sql, key, assistKey, listAssistKey, loopField, isRun) {
        this.id = id
        this.name = name
        this.sql = sql
        this.key = key
        this.assistKey = assistKey
        this.listAssistKey = listAssistKey
        this.loopField = loopField
        this.isRun = isRun
    }
}

module.exports = BizSql;