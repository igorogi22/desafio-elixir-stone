const commander = require("commander");
const Database = require("./database");

(async () => {
  commander
    .version("v1")
    .option(
      "-n, --new [value]",
      "This command create a new list. Should inform list name at param"
    )
    .option(
      "-s, --search [value]",
      "This command search a specific list. Enter ID at param if not enter, return all database."
    )
    .option( "-p, --people [value]", "This command register the people in list specific")
    .option( "-id, --list-id [value]", "This command register the people in list specific")
    .parse(process.argv);

  const options = commander.opts();

  try {
    /**
     * node index.js -n <LIST_NAME>
     * node index.js -n buy_fruits
     */
    if (options.new) {
      const newList = await Database.register({ list_name: options.new });
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
     * node index.js -p <PEOPLE_LIST> -id <LIST_ID>
     * node index.js -p ['igor@email.com', 'stone@email.com'] -id 1
     */
    if (options.people) {
      if (!options.listId) {
        console.log("FOR ADD A USER, YOU SHOULD INFORM THE LIST ID")
        return;
      }

      console.log('User list >>>', options.people);
      console.log('List ID >>>', options.listId);
      console.log('options >>>', options);
      return;
    }
  } catch (error) {
    console.error("Database falure >>>", error);
    return;
  }
})();
