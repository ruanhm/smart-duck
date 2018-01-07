module.exports = class BizResult {
    constructor(data = [], isSuccess = true, msgs = null, toUrl = '', output = null, orther1 = null, orther2 = null) {
        /**<summary>
         * 返回数据
         * </summary>
         */ 
        this.Data = data;

        /**<summary>
         * 是否成功
         * </summary>
         */ 
        this.IsSuccess = isSuccess;

        /**<summary>
         * 信息（通常用于错误信息返回）
         * </summary>
         */ 
        this.Msgs = msgs;

        /**<summary>
         * 返回后跳转的URL
         * </summary>
         */ 
        this.ToUrl = toUrl;

        /**<summary>
         * 返回参数
         * </summary>
         */ 
        this.Output = output;

        /**<summary>
         * 备用字段1
         * </summary>
         */ 
        this.Orther1 = orther1;

        /**<summary>
         * 备用字段2
         * </summary>
         */ 
        this.Orther2 = orther2
    }
}