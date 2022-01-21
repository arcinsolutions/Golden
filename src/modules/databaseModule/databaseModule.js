const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  connectionLimit: 5,
  multipleStatements: true
});

module.exports = {

  createTables: async function () {
    let conn;
    try {
      conn = await pool.getConnection();
      // TODO: change global table.., check connection in golden.js, maybe change setup icon buttons to yellow?
      await conn.query("CREATE TABLE IF NOT EXISTS global(\
                                    id VARCHAR(255) UNIQUE NOT NULL,\
                                    value INT NOT NULL\
                                  );\
                                  INSERT IGNORE INTO global\
                                    (id, value) VALUES ('channelCount', 0)\
                                  ;\
                                  CREATE TABLE IF NOT EXISTS guilds(\
                                    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\
                                    guildId VARCHAR(255) UNIQUE NOT NULL,\
                                    guildName VARCHAR(255),\
                                    musicChannelId VARCHAR(255),\
                                    musicChannelHeroId VARCHAR(255),\
                                    musicChannelEmbedId VARCHAR(255)\
                                  );", [1, "mariadb"]);

    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  },

  addGuildIfNotExists: async function (guildId, guildName) {
    if (!await module.exports.guildExists(guildId)) module.exports.addGuild(guildId, guildName)
  },

  addGuild: async function (guildId, guildName) {
    console.log(guildName)
    if (guildName === undefined) guildName = "Unknown";
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(`INSERT INTO guilds\
                                      (guildId, guildName) VALUES ('${guildId}', '${guildName}')\
                                    ;`, [1, "mariadb"]);

    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  },

  getAllGuilds: async function () {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query('SELECT * FROM guilds;', [1, "mariadb"]);

      if (conn) conn.end();
      return res;

    } catch (err) {
      console.log(err)
      throw err;
    }
  },

  getGuild: async function (guildId) {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(`SELECT * FROM guilds WHERE guildId = '${guildId}';`, [1, "mariadb"]);

      if (conn) conn.end();
      return res[0]

    } catch (err) {
      console.log(err)
      throw err;
    }
  },

  getGuildChannel: async function (guildId) {
    const guild = await module.exports.getGuild(guildId);
    return guild.musicChannelId;
  },

  getGuildChannelEmbed: async function (guildId) {
    const guild = await module.exports.getGuild(guildId);
    return guild.musicChannelEmbedId;
  },

  guildExists: async function (guildId) {
    return await module.exports.getGuild(guildId) === undefined ? false : true
  },

  addGuildIfNotExists: async function (guildId, guildName) {
    if (!await module.exports.guildExists(guildId)) module.exports.addGuild(guildId, guildName);
  },


  setGuildChannel: async function (guildId, channelId, guildName) {
    await module.exports.addGuildIfNotExists(guildId, guildName)
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(`UPDATE guilds SET musicChannelId = '${channelId}' WHERE guildId = '${guildId}';`, [1, "mariadb"]);

    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  },

  setGuildChannelHero: async function (guildId, messageId, guildName) {
    await module.exports.addGuildIfNotExists(guildId, guildName)
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(`UPDATE guilds SET musicChannelHeroId = '${messageId}' WHERE guildId = '${guildId}';`, [1, "mariadb"]);

    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  },

  setGuildChannelEmbed: async function (guildId, messageId, guildName) {
    await module.exports.addGuildIfNotExists(guildId, guildName)
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(`UPDATE guilds SET musicChannelEmbedId = '${messageId}' WHERE guildId = '${guildId}';`, [1, "mariadb"]);

    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  },

  getGlobal: async function () {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(`SELECT * FROM global;`, [1, "mariadb"]);

      if (conn) conn.end();
      return res[0]

    } catch (err) {
      console.log(err)
      throw err;
    }
  },

  increaseChannelCount: async function () {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(`UPDATE global SET value = value + 1 WHERE id = 'channelCount';`, [1, "mariadb"]);
    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  }

}