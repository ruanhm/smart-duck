const TYPES = require('tedious').TYPES;

module.exports = {
    paramType2DbType(type) {
        var dbType = null;
        type = type.toLowerCase();
        switch (type) {
            case "int":
                dbType = TYPES.Int;
                break;
            case "bigint":
                dbType = TYPES.BigInt;
                break;
            case "string":
                dbType = TYPES.VarChar;
                break;
            case "bit":
                dbType = TYPES.Bit;
                break;
            case "datetime":
                dbType = TYPES.DateTime;
                break;
            case "float":
                dbType = TYPES.Float;
                break;
            case "begindatetime":
                dbType = TYPES.DateTime;
                break;
            case "enddatetime":
                dbType = TYPES.DateTime;
                break;
            case "yyyymm":
                dbType = TYPES.VarChar;
                break;
            case "beginyyyymm":
                dbType = TYPES.VarChar;
                break;
            case "endyyyymm":
                dbType = TYPES.VarChar;
                break;
        }
        return dbType
    },
    convert(value, type) {
        type = type.toLowerCase();
        try {
            switch (type) {
                case "int":
                case "float":
                case "bigint":
                    value=Number(value);
                    break;
                case "string":
                case "yyyymm":
                    value = value.toString();
                    break;
                case "bit":
                    value=value?true:false;
                    break;
                case "datetime":
                    value=new Date(value);
                    break;
                case "begindatetime":
                    value=!value||value.trim().length==0?new Date('1900-01-01'):new Date(value);
                    break;
                case "enddatetime":
                    value=!value||value.trim().length==0?new Date('2900-01-01'):new Date(value);
                    break;
                case "beginyyyymm":
                    value=!value||value.trim().length==0?'1900-01-01':value.toString();
                    break;
                case "endyyyymm":
                    value=!value||value.trim().length==0?'2900-01-01':value.toString();
                    break;
            }
        }
        catch (ex) {
            value = null;
        }
        finally {
            return value;
        }
    }
}