// ts -> .d.ts 翻译文件 -> js
import fs from 'fs';
import path from 'path';
import superagent from 'superagent';
import DellAnalyzer from './analyzer';

export interface Analyzer {
  analyze: (html: string, filePath: string) => string;
}

class Crowller {
  private filePath = path.resolve(__dirname, '../../data/course.json');

  // 1. 获取网页html
  private async getRawHtml() {
    const result = await superagent.get(this.url);
    return result.text;
  }

  // 4. 写入data.json
  private writeFile(content: string) {
    fs.writeFileSync(this.filePath, content);
  }

  private async initSpiderProcess() {
    const html = await this.getRawHtml();
    const fileContent = this.analyzer.analyze(html, this.filePath);
    this.writeFile(fileContent);
  }

  constructor(private url: string, private analyzer: Analyzer) {
    this.initSpiderProcess();
  }
}

export default Crowller;
