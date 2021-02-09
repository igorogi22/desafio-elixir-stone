const Database = require('./database');

class Calculation {
    convertToCents(value) {
        return value*100;
    }

    convertToBRL(value) {
        return value/100;
    }

    async calc(id) {
        let total = 0;
        let rest = 0;
        let valueForEachPeople = 0;
        const list = await Database.list(id);
        const { peoples, items } = list[0];

        for(let i = 0; i < items.length; i++) {
            total += this.convertToCents(items[i].value) * items[i].amount;
        }

        rest = total % peoples.length;
        valueForEachPeople = (total - rest) / peoples.length;

        const test = {
            resto: rest,
            total: total
        }
        console.log(test);
        return total;
    }
}

module.exports = new Calculation();