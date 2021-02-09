const commander = require("commander");
const Database = require("./util/database");
const Calculation = require('./util/calculation');

(async () => {
  commander
    .version("v1")
    //THIS OPTIONS IS FOR LISTS
    .option(
      "-n, --new [value]",
      "This command create a new list. Should inform list name at param"
    )
    .option(
      "-s, --search [value]",
      "This command search a specific list. Enter ID at param if not enter, return all database."
    )
    .option("-c, --calc",  "This command should return the total value of a especif list")
    .option( "-id, --list-id [value]", "This command register the people in list specific")
    //THIS OPTIONS IS FOR PEOPLES
    .option( "-p, --people [value...]", "This command register the people in list specific")
    //THIS OPTION IS FOR ITEMS
    .option("-i, --item", "This command register the item in list especific ")
    .option("-in, --item-name [value]", "This command inform item name")
    .option("-iv, --item-value <value>", "This command inform item value. Use the real money value, like 1.5 BRL or 2 BRL (numbers only)")
    .option("-ia, --item-amount <value>", "This command inform item amount.Fractions such as 1.5, 1.7, 5.5 etc can be used")
    .parse(process.argv);

  const options = commander.opts();

  try {
    /**
     * node index.js -n <LIST_NAME>
     * node index.js -n buy_fruits
     */
    if (options.new) {
      const newList = await Database.register({ list_name: options.new ? options.new : 'LIST NO NAME' });
      console.log("THIS IS LIST CODE >>>", newList);
      return;
    }

    /**
     * node index.js -s <LIST_ID>
     * node index.js -s 1
     */
    if (options.search) {
        const search = await Database.list(options.search);
        console.log("THIS IS THE SEARCH RESULT >>>", search);
        return;
    }

    /**
     * node index.js -p <PEOPLE> -id <LIST_ID>
     * node index.js -p <PEOPLE> <PEOPLE> -id <LIST_ID>
     * node index.js -p 'igor@email.com' -id 1
     * node index.js -p 'igor@email.com', 'stone@email.com'] -id 1
     */
    if (options.people) {
      if (!options.listId) {
        console.log("FOR ADD A USER, YOU SHOULD INFORM THE LIST ID")
        return;
      }
      const people = await Database.registerPeople(options.listId, options.people);

      console.log(`${options.people}, register with success in the list: ${options.listId}`);
      return;
    }

    /**
     * node index.js --item -in <ITEM_NAME> -iv <ITEM_VALUE> -ia <ITEMAMOUNT> -id <lIST_ID>
     * node index.js -item -in apple -iv 1.4 -ia 5.8 -id 1
     */
    if (options.item) {
      if(!options.listId) {
        console.log("FOR ADD A ITEM, YOU SHOUL INFORM THE LIST ID")
        return;
      }
      const item = {
        name: options.itemName ? options.itemName : 'ITEM NO NAME',
        value: options.itemValue ? Number(options.itemValue) : 0,
        amount: options.itemAmount ? Number(options.itemAmount) : 1
      }
      
      const itemRegister = await Database.registerItem(options.listId, item);

      console.log("Item:")
      console.log(` Name -> ${item.name}`)
      console.log(` Value -> R$ ${parseFloat(item.value)}`)
      console.log(` Amount -> ${parseFloat(item.amount)}`)
      console.log(`Register with success in the list: ${options.listId}`);
      return;
    }

    /**
     * node index.js -c -id <LIST_ID>
     * node index.js -c -id 1
     */
    if (options.calc) {
      if(!options.listId) {
        console.log("FOR CALCULATION THE TOTAL VALUE OF A ESPECIFIC LIS, YOU SHOULD INFORM THE ID")
        return;
      }
      const total = await Calculation.calc(options.listId);
      console.log(total);
    }
  } catch (error) {
    console.error("Database falure >>>", error);
    return;
  }
})();
