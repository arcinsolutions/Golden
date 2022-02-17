const mariadb = require('mariadb');
const pool = mariadb.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
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
      await conn.query("CREATE TABLE IF NOT EXISTS analytics(\
                                    id VARCHAR(255) UNIQUE NOT NULL,\
                                    value INT NOT NULL,\
                                    lastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP\
                                    );\
                                  CREATE TABLE IF NOT EXISTS guilds(\
                                    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\
                                    guildId VARCHAR(255) UNIQUE NOT NULL,\
                                    guildName VARCHAR(255),\
                                    musicChannelId VARCHAR(255),\
                                    musicChannelHeroId VARCHAR(255),\
                                    musicChannelEmbedId VARCHAR(255)\
                                  );\
                                  INSERT IGNORE INTO analytics\
                                    (id, value) VALUES ('channelsCreated', 0)\
                                  ;\
                                  INSERT IGNORE INTO analytics\
                                    (id, value) VALUES ('activePlayers', 0)\
                                  ;\
                                  INSERT IGNORE INTO analytics\
                                    (id, value) VALUES ('activeListeners', 0)\
                                  ;", [1, "mariadb"]);

    } catch (err) {
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  },

  addGuild: async function (guildId, guildName) {
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

  updateGuild: async function (guildId, guildName) {
    console.log(guildName)
    if (guildName === undefined) guildName = "Unknown";
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(`UPDATE guilds\
                                      SET guildName = '${guildName}'\
                                      WHERE guildId = '${guildId}'\
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
    if (guild === undefined) return null; // return null if guild doesnt' exist
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
    if (!await module.exports.guildExists(guildId)) {
     await module.exports.addGuild(guildId, guildName);
    } else {
      await module.exports.updateGuild(guildId, guildName);
    }
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

  getChannelsCreated: async function () {
    let conn;
    try {
      conn = await pool.getConnection();
      const res = await conn.query(`SELECT * FROM analytics WHERE id = 'channelsCreated';`, [1, "mariadb"]);

      if (conn) conn.end();
      return res[0]

    } catch (err) {
      console.log(err)
      throw err;
    }
  },

  increaseChannelsCreated: async function () {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(`UPDATE analytics SET value = value + 1 WHERE id = 'channelsCreated';`, [1, "mariadb"]);
    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  },

  setActivePlayers: async function(amount) {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(`UPDATE analytics SET value = ${amount} WHERE id = 'activePlayers';`, [1, "mariadb"]);
    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  },
  
  setActiveListeners: async function(amount) {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query(`UPDATE analytics SET value = ${amount} WHERE id = 'activeListeners';`, [1, "mariadb"]);
    } catch (err) {
      console.log(err)
      throw err;
    } finally {
      if (conn) return conn.end();
    }
  },

  closeConnection: async function() {
    try {
      console.log('Closing database connection...')
      await pool.end();
    } catch (err) {
      throw err;
    }
  }
}