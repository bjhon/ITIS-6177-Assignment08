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

// GET student-reports table.
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

//POST request.
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

//POST request.
app.post('/customers', async (req, res) => {
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

// PATCH request to update existing agent.
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
app.put('/agents/:id', async (req, res) => {
    try {
        const { AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY, AGENT_CODE } = req.body; // Ensure AGENT_CODE is provided
        const conn = await pool.getConnection();
        const result = await conn.query("REPLACE INTO agents (AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY) VALUES (?, ?, ?, ?, ?, ?)",
            [AGENT_CODE, AGENT_NAME, WORKING_AREA, COMMISSION, PHONE_NO, COUNTRY]); // Include AGENT_CODE in the parameter list
        conn.release();
        res.json({ message: 'Agent replaced successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// DELETE request to delete agent.
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
 * definitions:
 *   Agent:
 *     type: object
 *     properties:
 *       AGENT_CODE:
 *         type: string
 *       AGENT_NAME:
 *         type: string
 *       WORKING_AREA:
 *         type: string
 *       COMMISSION:
 *         type: number
 *       PHONE_NO:
 *         type: string
 *       COUNTRY:
 *         type: string
 */

/**
 * @swagger
 * /agents:
 *   get:
 *     summary: Retrieve a list of agents
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of agents
 *         schema:
 *           type: array
 *           items:
 *             $ref: '#/definitions/Agent'
 *
 *   post:
 *     summary: Create a new agent
 *     parameters:
 *       - in: body
 *         name: agent
 *         description: The agent to create
 *         schema:
 *           $ref: '#/definitions/Agent'
 *     responses:
 *       200:
 *         description: Successfully created
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /agents/{id}:
 *   put:
 *     summary: Replace an existing agent
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: agent
 *         description: The updated agent information
 *         schema:
 *           $ref: '#/definitions/Agent'
 *     responses:
 *       200:
 *         description: Successfully replaced
 *       404:
 *         description: Agent not found
 *       400:
 *         description: Invalid input
 *
 *   patch:
 *     summary: Update an existing agent
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *       - in: body
 *         name: agent
 *         description: The fields to update
 *         schema:
 *           type: object
 *           properties:
 *             AGENT_NAME:
 *               type: string
 *             WORKING_AREA:
 *               type: string
 *             COMMISSION:
 *               type: number
 *             PHONE_NO:
 *               type: string
 *             COUNTRY:
 *               type: string
 *     responses:
 *       200:
 *         description: Successfully updated
 *       404:
 *         description: Agent not found
 *       400:
 *         description: Invalid input
 *
 *   delete:
 *     summary: Delete an existing agent
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Successfully deleted
 *       404:
 *         description: Agent not found
 */
/**
 * @swagger
 * /customers/{id}:
 *   get:
 *     summary: Retrieve a customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         type: string
 *         required: true
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: A single customer
 *         schema:
 *           $ref: '#/definitions/Customer'
 *       404:
 *         description: Customer not found
 *
 */
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

//reference: https://www.youtube.com/watch?v=_YA9yII8a3M&ab_channel=EddieJaoude
//&& https://expressjs.com/en/api.html#req
// https://www.w3schools.com/sql/sql_ref_values.asp


