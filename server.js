const fastify = require('fastify')({ logger: true })
const sql = require('mssql')

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    server: process.env.DB_HOST,
    options: {
        encrypt: false,
        trustServerCertificate: true
    },
    driver: "msnodesqlv8",
}

/*
  PROCESSING STATS
*/
fastify.get('/processing-stats', async function handler(request, reply) {
    try {
        const result = await sql.query(`select sum(SubjectsProcessed) as MatchingEvents from ProcessingStats`);
        if (result.recordset[0].MatchingEvents == null) {
            result.recordset[0].MatchingEvents = 0
        }
        reply.code(200)
        reply.send(result.recordset[0])
        return reply
    } catch (err) {
        console.error(err);
        reply.code(500)
        reply.send(err)
        return reply
    }
})

fastify.delete('/processing-stats', async function handler(request, reply) {
    try {
        const result = await sql.query(`TRUNCATE TABLE ProcessingStats`);
        reply.code(204)
        return reply
    } catch (err) {
        reply.code(500)
        reply.send(err)
        return reply
    }
})

/*
  DATABASE CONNECTION
*/
fastify.post('/database', async function handler(request, reply) {
    try {
        sql.connect(sqlConfig)
        reply.code(200)
        reply.send({
            "status": "connected",
            "message": ""
        })
        return reply
    } catch (err) {
        reply.code(500)
        reply.send({
            "status": "error",
            "message": err
        })
        return reply
    }
})

fastify.get('/database', async function handler(request, reply) {
    try {
        const result = await sql.query(``)
        reply.code(204)
        reply.send({
            "status": "connected",
            "message": ""
        })
        return reply
    } catch (err) {
        switch (err.code) {
            case "ENOCONN":
                reply.code(503)
                reply.send({
                    "status": "disconnected",
                    "message": "Unable to reach database server."
                })
                break
            case "ECONNCLOSED":
                reply.code(205)
                reply.send({
                    "status": "connecting",
                    "message": "Connection attempt in progress."
                })
                break
            default:
                reply.code(500)
                reply.send({
                    "status": "error",
                    "message": err
                })
        }
        return reply
    }
})

fastify.register(require('@fastify/cors'), (instance) => {
  return (req, callback) => {
    const corsOptions = {
      // This is NOT recommended for production as it enables reflection exploits
      origin: "*"
    };

    // callback expects two parameters: error and options
    callback(null, corsOptions)
  }
})

// Run the server!
fastify.listen({port: 3000, host: "0.0.0.0" }, (err) => {
    if (err) {
        fastify.log.error(err)
    }
    sql.connect(sqlConfig)
        .catch(console.error);
})