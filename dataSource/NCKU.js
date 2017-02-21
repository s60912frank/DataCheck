let IProcessor = require('../interface/IProcessor')
const request = require('request-promise');
const cheerio = require('cheerio');
//const iconv = require('iconv-lite');

module.exports =  class extends IProcessor {
    constructor() {
        super()
        this.url = 'http://reg.acad.ncku.edu.tw/files/11-1055-6596-1.php?Lang=zh-tw'
        this.filePath = './dataStore/NCKU.json';
        this.schoolName = '成大'
    }

    async process() {
        let newData = []
        let data = await request.get({ 'url': this.url })
        //之後再考慮要不要抓時間出來
        let $ = cheerio.load(data)
        let trs = $('#Dyn_2_2').find('tr')
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