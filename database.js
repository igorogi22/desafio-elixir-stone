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
    };

    await this.writeFile([...data, listWithId]);
    return id;
  }

  async list(id) {
    const data = await this.getFile();
    return data.filter((item) => (id ? item.id == id : true));
  }

  async update(id, updates) {
    const data = await this.getFile();
    const indice = data.findIndex((item) => item.id === parseInt(id));
    if (indice === -1) {
      throw Error("THIS LIST DOES NOT EXIST");
    }

    const atual = data[indice];
    data.splice(indice, 1);

    //workaround to remove undefined values of object
    const objUpdate = JSON.parse(JSON.stringify(updates));
    const objUpdated = Object.assign({}, atual, objUpdate);

    return await this.writeFile([...data, objUpdated]);
  }

  async delete(id) {
    if (!id) {
      await this.writeFile([]);
      return true;
    }

    const data = await this.getFile();

    const indice = data.findIndex((item) => item.id === parseInt(id));
    if (indice === -1) {
      throw Error("THIS LIST DOES NOT EXIST");
    }

    data.splice(indice, 1);
    await this.writeFile(data);
    return true;
  }

  async registerPeople(id, peoples){
    const data = await this.getFile();
    const indice = data.findIndex((item) => item.id === parseInt(id));
    if (indice === -1) {
      throw Error("THIS LIST DOES NOT EXIST");
    }

    const list = data[indice];
    const listWithPeoples = {...list, peoples: peoples};
    return listWithPeoples;

    // //workaround para remover valores undefined do objeto
    // const objUpdate = JSON.parse(JSON.stringify(peoples));
    // const objUpdated = Object.assign({}, atual, objUpdate);

    // return await this.writeFile([...data, objUpdated]);
  }
}

module.exports = new Database();
