let IProcessor = require('../interface/IProcessor')
const request = require('request-promise');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

module.exports =  class extends IProcessor {
    constructor() {
        super()
        this.url = 'http://pdc.adm.ncu.edu.tw/news03.asp';
        this.filePath = './dataStore/NCU.json';
        this.schoolName = '中央'
    }

    async process() {
        let newData = []
        let data = await request.get({ 'url': this.url, encoding: null })
        //之後再考慮要不要抓時間出來
        let $ = cheerio.load(iconv.decode(data, 'big5'))
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