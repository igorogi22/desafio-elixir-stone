const { writeFile, readFile } = require("fs");
const { promisify } = require("util");
const [writeFileAsync, readFileAsync] = [
  promisify(writeFile),
  promisify(readFile),
];

class Database {
  constructor() {
    this.FILENAME = "lists.json";
  }

  async getFile() {
    const file = await readFileAsync(this.FILENAME);
    return JSON.parse(file.toString());
  }

  async writeFile(data) {
    await writeFileAsync(this.FILENAME, JSON.stringify(data));
    return true;
  }

  async register(list) {
    const data = await this.getFile();

    const id = data.length + 1;

    const listWithId = {
      id,
      ...list,
      peoples: [],
      items: []
    };

    await this.writeFile([...data, listWithId]);
    return id;
  }

  async list(id) {
    const data = await this.getFile();
    return data.filter((item) => (id ? item.id == id : true));
  }

  async registerPeople(id, peoples){
    const data = await this.getFile();
    const indice = data.findIndex((item) => item.id === parseInt(id));
    if (indice === -1) {
      throw Error("THIS LIST DOES NOT EXIST");
    }

    const list = data[indice];
    data.splice(indice, 1);

    const newPeoples = JSON.parse(JSON.stringify(peoples));
    let listWithPeoples = [...list.peoples];

    for(let i = 0; i < newPeoples.length; i++){
      listWithPeoples.push(newPeoples[i]);
    }

    const objUpdated = {...list, peoples: listWithPeoples}

    return await this.writeFile([...data, objUpdated]);
  }

  async registerItem(id, itemRegister){
    const data = await this.getFile();
    const indice = data.findIndex((item) => item.id === parseInt(id));
    if (indice === -1) {
      throw Error("THIS LIST DOES NOT EXIST");
    }

    const list = data[indice];
    data.splice(indice, 1);
    
    const newItem = JSON.parse(JSON.stringify(itemRegister));
    const listWithItems = [...list.items, newItem];

    const objUpdated = {...list, items: listWithItems}

    return await this.writeFile([...data, objUpdated]);
  }
}

module.exports = new Database();
