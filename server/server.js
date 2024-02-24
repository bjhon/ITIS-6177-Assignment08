const express = require('express');
const app = express();
const port = 3001;

const mariadb = require('mariadb');
const cors = require('cors');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const { hasUncaughtExceptionCaptureCallback } = require('process');
const { isNullOrUndefined } = require('util');
const pool = mariadb.createPool({
        host: 'localhost',
        user: 'root',
        password: 'root',
        database: 'sample',
        port: 3306,
        connectionLimit: 5
});

app.use(express.json());

//GET agents table
app.get('/agents', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM agents");
        conn.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET customers table
app.get('/customers', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM customer");
        conn.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//GET companies table
app.get('/companies', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM company");
        conn.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET orders table
app.get('/orders', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM orders");
        conn.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET student-reports table
app.get('/student-reports', async (req, res) => {
    try {
        const conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM studentreport");
        conn.release();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/agents', async (req, res) => {
    try {
        // take agent data from request body
        const { AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY } = req.body;
        // Insert new agent in database
        const conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO agents (AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY) VALUES (?,?,?,?,?,?)", [AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY]);
        conn.release();
        res.json({ message: "Agent created successfully", agent: req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/costumers', async (req, res) => {
    try {
        //  customer data from request body
        const { CUST_CODE, CUST_NAME, CUST_CITY, WORKING_AREA, CUST_COUNTRY, GRADE, OPENING_AMT, RECEIVE_AMT, PAYMENT_AMT, OUTSTANDING_AMT, PHONE_NO, AGENT_CODE } = req.body;
        // Insert the new customer into the database
        const conn = await pool.getConnection();
        const result = await conn.query("INSERT INTO customer (CUST_CODE, CUST_NAME, CUST_CITY, WORKING_AREA, CUST_COUNTRY, GRADE, OPENING_AMT, RECEIVE_AMT, PAYMENT_AMT, OUTSTANDING_AMT, PHONE_NO, AGENT_CODE) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", [CUST_CODE, CUST_NAME, CUST_CITY, WORKING_AREA, CUST_COUNTRY, GRADE, OPENING_AMT, RECEIVE_AMT, PAYMENT_AMT, OUTSTANDING_AMT, PHONE_NO, AGENT_CODE]);
        conn.release();
        res.json({ message: "Customer created successfully", agent: req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PATCH request to update existing agent
app.patch('/agents/:AGENT_CODE', async (req, res) => {
    try {
        const AGENT_CODE = req.params.AGENT_CODE;
        // agent data from request
        const { AGENT_NAME } = req.body;
        // Update the agent database
        const conn = await pool.getConnection();
        const result = await conn.query("UPDATE agents SET AGENT_NAME=?", [AGENT_NAME]);
        conn.release();
        res.json({ message: "Agent updated successfully", agent: req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PUT request to replace existing agent or to create new
app.put('/agents/:AGENT_CODE', async (req, res) => {
    try {
        const AGENT_CODE = req.params.AGENT_CODE;
        // Extract agent data from request body
        const { AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY } = req.body;
        // Replace or insert the agent into the database
        const conn = await pool.getConnection();
        const result = await conn.query("UPDATE agents (AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY) VALUES (?,?,?,?,?,?)", [AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY]);
        conn.release();
        res.json({ message: "Agent replaced or created successfully", agent: req.body });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE request to delete agent
app.delete('/agents/:AGENT_CODE', async (req, res) => {
    try {
        const AGENT_CODE = req.params.AGENT_CODE;
        // Delete agent from database
        const conn = await pool.getConnection();
        const result = await conn.query("DELETE FROM agents WHERE AGENT_CODE=?", [AGENT_CODE]);
        conn.release();
        res.json({ message: "Agent deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//swagger

const options = {
    swaggerDefinition: {
        info: {
            title: 'Personal Budget API',
            version: '1.0.0',
            description: 'API docs for REST api'
        },
        host: 'localhost:3001',
        basePath: '/',
    },
    apis: ['./server.js'],
};

const specs = swaggerJsdoc(options);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(cors());

/**
 * @swagger
 * /definition:
 *      info: 
 *          title: Return all
 *      produces:
 *         -application/json
 *      responses:
 *         200:
 *             description: Object info containing array of item obj 
 * 
 */
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

//reference: https://www.youtube.com/watch?v=_YA9yII8a3M&ab_channel=EddieJaoude
//&& https://expressjs.com/en/api.html#req
// https://www.w3schools.com/sql/sql_ref_values.asp


