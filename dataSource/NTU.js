let IProcessor = require('../interface/IProcessor')
const request = require('request-promise')
const cheerio = require('cheerio')

module.exports =  class extends IProcessor {
    constructor() {
        super()
        this.url = 'http://www.aca.ntu.edu.tw/news.asp?ord=bdate%20desc,btime&desc=desc&kind2=dname|%E7%A0%94%E6%95%99%E7%B5%84';
        this.filePath = './dataStore/NTU.json'
        this.schoolName = '台大'
    }

    async process() {
        let newData = []
        let data = await request.get({ 'url': this.url })
        let $ = cheerio.load(data)
        let trs = $('tbody').find('tr')
        trs.each((i, ele) => {
            let entry = $(ele).find('a')
            if(entry.text() != '') {
                newData.push([entry.text().trim(), entry.attr('href')])
            }
        })

        let result = await this.checkNew(newData)
        return this.GenerateMessage(result)
    }
}