class BizCheck {
    constructor(id, cue, sql, isRun, checkField) {
        this.id = id
        this.cue = cue
        this.sql = sql
        this.isRun = isRun
        this.checkField = checkField
    }
}

module.exports = BizCheck;