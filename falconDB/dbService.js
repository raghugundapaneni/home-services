import { join, dirname } from 'path';
import { Low, JSONFile } from 'lowdb';
import { fileURLToPath } from 'url';

const FALCON_DB_DIRECTORY = "falconDB"; // Directory where sqlite3 files are stored
const falconDirectory = join(dirname(dirname(fileURLToPath(import.meta.url))), FALCON_DB_DIRECTORY);

const tables = {};  // Singleton holds a lowdb object for each "table"
const indexes = {}; // Singleton holds indexes for fast lookup within "tables"

export class dbService {

    async getTable(tableName, primaryKey) {

        const tableKey = tableName + "::" + primaryKey;
        if (!tables[tableKey]) {

            console.log(tables[tableKey]);

            // If here, there is no table in memory, so read it in now
            const file = join(falconDirectory, `${tableName}.json`);
            const adapter = new JSONFile(file);
            const db = new Low(adapter);

            await db.read();
            console.log ('in dbservice', await db.read());
            if (!db.data) {
                // Initialize a new database
                db.data = {};
                db.data[tableName] = [];
            }

            // Store the lowdb and accessors for data and saving changes
            tables[tableKey] = {
                tableName,
                db,
                primaryKey,
                get data() { return this.db.data[tableName]; },
                item: (key) => {
                    const index = this.#getIndex(tables[tableKey], primaryKey);
                    return index.lookup(key);
                },
                addItem: (row) => {
                    this.#clearIndex(tables[tableKey], primaryKey);
                    db.data[tableName].push(row);
                },
                save: async () => { await db.write(); }
            }
        }

        return tables[tableKey];
    }

    #getIndex(table, columnName) {

        const indexName = `${table.tableName}::${columnName}`;

        if (!indexes[indexName]) {
            const index = {};
            for (let i in table.data) {
                if (index[table.data[i][columnName]]) {
                    throw `ERROR: Primary key values are not unique in ${table.tableName}::${columnName}`;
                }
                index[table.data[i][columnName]] = i;
            }
            indexes[indexName] = {
                index,
                lookup: key => index && index[key] ? table.data[index[key]] : null
            }
        }

        return indexes[indexName];
    }

    #clearIndex(table, columnName) {
        const indexName = `${table.tableName}::${columnName}`;
        indexes[indexName] = null;
    }

}

