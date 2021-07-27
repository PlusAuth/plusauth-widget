export class H1FingerVeinService {
  salt: string
  constructor(salt: string) {
    this.salt = salt
  }

  private async fetch( body: string){
    const res = await fetch('http://127.0.0.1:8125/root/', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'text/plain' }
    })
    const text = await res.text()
    let parsed: any;
    try{
      parsed = JSON.parse(text);
    }catch (e) {
      return text
    }
    if(parsed.retCode && parsed.retCode !== '0'){
      throw parsed
    }
    return parsed

  }
  async ping(){
    await this.fetch( '33' )
  }

  version(){
    return this.fetch( '25' )
  }

  async deviceStatus(){
    const statusText: string = await this.fetch( '27' )
    return statusText.split(';').map(sec => sec.split('=')).reduce((prev, cur) => {
      prev[cur[0]] = cur[1]
      return prev
    }, {})
  }

  enroll(fingerIndex: number){
    return this.fetch( `22${fingerIndex}` )
  }

  verify(fingerIndex: number, templates: string[]){
    const body = `34${ fingerIndex }${templates.length}${
      templates.map(template => template.length.toString().padStart(4, '0') + template).join('')
    }${this.salt.length.toString().padStart(4,'0')}${this.salt}`

    return this.fetch(body)
  }
}
