const List = require('../models/List');
const Agent = require('../models/Agent');
const csv = require('csv-parser');
const xlsx = require('xlsx');
const fs = require('fs');
const multer = require('multer');
const { Readable } = require('stream');

// Setup multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'text/csv',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only CSV, XLS, and XLSX are allowed.'), false);
        }
    }
});

const distributeList = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const agents = await Agent.find().select('_id');
        if (agents.length === 0) {
            return res.status(400).json({ message: 'No agents available to distribute lists' });
        }

        const dataBuffer = req.file.buffer;
        let items = [];

        // Parse the file based on its type
        if (req.file.mimetype === 'text/csv') {
            const stream = new Readable();
            stream.push(dataBuffer);
            stream.push(null);

            const results = [];
            stream.pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    try {
                        items = results.map(item => ({
                            firstName: item.FirstName,
                            phone: item.Phone,
                            notes: item.Notes
                        }));
                        await processAndSaveLists(items, agents, res);
                    } catch (err) {
                        console.error('Error processing CSV:', err.stack || err);
                        if (!res.headersSent) res.status(500).send('Server Error (CSV)');
                    }
                })
                .on('error', (err) => {
                    console.error('CSV stream error:', err.stack || err);
                    if (!res.headersSent) res.status(500).send('CSV parsing error');
                });
        } else {
            const workbook = xlsx.read(dataBuffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            items = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

            // Assuming the first row is the header
            const header = items.shift();
            if (!header) {
                return res.status(400).json({ message: 'Empty or malformed XLS/XLSX file. No header row found.' });
            }
            const colMap = {
                'FirstName': header.indexOf('FirstName'),
                'Phone': header.indexOf('Phone'),
                'Notes': header.indexOf('Notes')
            };

            if (colMap.FirstName === -1 || colMap.Phone === -1 || colMap.Notes === -1) {
                return res.status(400).json({ message: 'Invalid CSV/XLSX format. Required columns: FirstName, Phone, Notes' });
            }

            items = items.map(row => ({
                firstName: row[colMap.FirstName],
                phone: row[colMap.Phone],
                notes: row[colMap.Notes]
            }));

            try {
                await processAndSaveLists(items, agents, res);
            } catch (err) {
                console.error('Error processing XLS/XLSX:', err.stack || err);
                if (!res.headersSent) res.status(500).send('Server Error (XLS/XLSX)');
            }
        }
    } catch (err) {
        console.error('Error distributing list:', err.message);
        res.status(500).send('Server Error');
    }
};

const processAndSaveLists = async (items, agents, res) => {
    try {
        const totalItems = items.length;
        const numAgents = agents.length;
        const baseItemsPerAgent = Math.floor(totalItems / numAgents);
        let remainingItems = totalItems % numAgents;

        const bulkOps = [];
        let itemIndex = 0;

        for (let i = 0; i < numAgents; i++) {
            let itemsToAssign = baseItemsPerAgent;
            if (remainingItems > 0) {
                itemsToAssign++;
                remainingItems--;
            }

            for (let j = 0; j < itemsToAssign; j++) {
                if (itemIndex < totalItems) {
                    bulkOps.push({
                        firstName: items[itemIndex].firstName,
                        phone: items[itemIndex].phone,
                        notes: items[itemIndex].notes,
                        assignedTo: agents[i]._id
                    });
                    itemIndex++;
                }
            }
        }

        if (bulkOps.length > 0) {
            await List.insertMany(bulkOps);
        }

        if (!res.headersSent) {
            res.status(200).json({ message: 'Lists distributed successfully', distributedItems: totalItems });
        }
    } catch (err) {
        console.error('Error in processAndSaveLists:', err.stack || err);
        if (!res.headersSent) res.status(500).send('Server Error (processAndSaveLists)');
    }
};

const getAgentLists = async (req, res) => {
    try {
        const { agentId } = req.params;
        const lists = await List.find({ assignedTo: agentId }).populate('assignedTo', 'name email');
        res.json(lists);
    } catch (err) {
        console.error('Error fetching agent lists:', err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { upload, distributeList, getAgentLists };
