let IProcessor = require('../interface/IProcessor')
const request = require('request-promise');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');

module.exports =  class extends IProcessor {
    constructor() {
        super()
        this.url = 'http://exam.nctu.edu.tw/index_0_new.aspx';
        this.domain = 'http://exam.nctu.edu.tw/';
        this.filePath = './dataStore/NCTU.json';
        this.schoolName = '交大'
    }

    async process() {
        let newData = []
        let data = await request.get({ 'url': this.url, encoding: null })
        let $ = cheerio.load(iconv.decode(data, 'big5'))
        let trs = $('#dlCateL_ctl00_gvItem').find('tr')
        trs.each((i, ele) => {
            let entry = $(ele).find('a')
            let link = ''
            if(entry.attr('onclick')){
                link = this.domain + entry.attr('onclick').split('\'')[1]
            }
            else if(entry.attr('href')){
                link = this.domain + entry.attr('href')
            }
            newData.push([entry.text(), link])
        })

        let result = await this.checkNew(newData)
        return this.GenerateMessage(result)
    }
}