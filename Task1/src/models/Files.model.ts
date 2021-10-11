import fs from "fs"
import path from "path"

const DIR = path.resolve(__dirname, '../../public/files') + '/'

export const FileModel = {
  create(filename: string, content: string) {
    try{
      if (!filename.includes('.')) filename += '.txt'
      fs.appendFileSync(DIR + filename, content)
    } catch {
      throw new Error("Client error")
    }
  },
  
  getAll() {
    try {
      return fs.readdirSync(DIR)
    } catch {
      throw Error("Client error")
    }
  },
  
  getByName(filename: string) {
    if (!filename.trim()) throw Error("Client error")
      
    const file = fs.readdirSync(DIR).find(f => f.startsWith(filename + '.') || f === filename)
    if (!fs.existsSync(DIR + file)) throw Error(`No file with '${filename}' filename found`)
   
    const arr = file.split('.')
    const ext = arr[arr.length - 1]
    const content = fs.readFileSync(DIR + file, 'utf8')
  
    return {
        "filename": file,
        "content": content,
        "extension": ext,
        "uploadedDate": "2017-07-21T17:32:28Z"
    }
  }
}