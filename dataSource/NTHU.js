let IProcessor = require('../interface/IProcessor')
const request = require('request-promise');
const cheerio = require('cheerio');
//const iconv = require('iconv-lite');

module.exports =  class extends IProcessor {
    constructor() {
        super()
        this.url = 'http://adms.web.nthu.edu.tw/bin/showmodule.php?O=1072&F=/72/1072/modules/rcg_mstr/95/rcg_mstr-1259.htm.zh-tw&Mo=14046&Type=rcg_mstr&Nbr=1259&Seq=1259&Cg=cmb&TagName=sm_div_acb448dfd3c8e1b30410af16bbfa99da2_0_Dyn_2_3&DivId=sm_div_acb448dfd3c8e1b30410af16bbfa99da2_0_Dyn_2_3'
        this.filePath = './dataStore/NTHU.json'
        this.schoolName = '清大'
    }

    async process() {
        let newData = []
        let formData = {
            'rs': 'sajaxSubmit',
            'rsargs[]': '%3CInput%3E%3CF%3E%3CK%3E%3C/K%3E%3CV%3E%3C/V%3E%3C/F%3E%3C/Input%3E'
        }
        let rawData = await request.post({ 'url': this.url }).form(formData)
        //chop data
        //之後再考慮要不要抓時間出來
        let startIndex = rawData.indexOf('<table summary="list" cellspacing="0" cellpadding="0" border="0" width="100%" class="baseTB list_TIDY">')
        let endIndex = rawData.indexOf('</table>') + 8
        let data = rawData.substring(startIndex, endIndex)
        let $ = cheerio.load(data)
        let trs = $('table').find('tr')
        trs.each((i, ele) => {
            let entry = $(ele).find('a')
            if(entry.text().trim() != ''){
                newData.push([entry.text().trim(), entry.attr('href')])
            }
        })

        let result = await this.checkNew(newData)
        return this.GenerateMessage(result)
    }
}