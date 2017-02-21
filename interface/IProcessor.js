const request = require('request-promise');
const cheerio = require('cheerio');
const bluebird = require('bluebird');
const readFile = bluebird.promisify(require("fs").readFile);
const writeFile = bluebird.promisify(require("fs").writeFile);

module.exports = class {
    constructor(){};

    async process(){};

    async checkNew(newDataSet) {
        let raw = await readFile(this.filePath, 'utf-8');
        let filecontent;
        try {
            filecontent = JSON.parse(raw);
        } catch (e) {
            filecontent = [];
        }
        await writeFile(this.filePath, JSON.stringify(newDataSet), 'utf-8');
        let newDataToSend = [];
        for(let i = 0;i < newDataSet.length;i++){
            let found = false;
            for(let j = 0;j < filecontent.length;j++){
                if(JSON.stringify(filecontent[j]) == JSON.stringify(newDataSet[i])){
                    found = true;
                    break;
                }
            }
            if(!found){
                newDataToSend.push(newDataSet[i]);
            }
        }
        return newDataToSend;
    };

    GenerateMessage(rawData) {
        let result = [];
        for(let i = 0;i < rawData.length;i++){
            result.push(this.schoolName + "通知來囉!!!" +
                        "\n內容: " + rawData[i][0] + 
                        "\n網址: " + rawData[i][1])
        }
        return result;
    };
}