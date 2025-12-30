import { google } from 'googleapis';
import type { NextApiRequest, NextApiResponse } from 'next';

interface GoogleSheetRecord {
    id: string;
    name: string;
    gender: string;
    gmail: string;
    createAt: string;
    updateAt: string;
    status: boolean;
}
// Column mapping: A=name, B=gender, C=gmail, D=createAt, E=updateAt, F=status
const COLUMNS = {
    NAME: 0,      // A
    GENDER: 1,    // B
    GMAIL: 2,     // C
    CREATE_AT: 3, // D
    UPDATE_AT: 4, // E
    STATUS: 5     // F
};

// Cache auth and sheets instance for better performance
let cachedAuth: any = null;
let cachedSheets: any = null;

function getAuth() {
    if (cachedAuth) return cachedAuth;

    // Validate environment variables
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) {
        throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is not set in environment variables');
    }

    if (!process.env.GOOGLE_PRIVATE_KEY) {
        throw new Error('GOOGLE_PRIVATE_KEY is not set in environment variables');
    }

    if (!process.env.GOOGLE_SHEET_ID) {
        throw new Error('GOOGLE_SHEET_ID is not set in environment variables');
    }

    // Format private key - handle both escaped and unescaped newlines
    let privateKey = process.env.GOOGLE_PRIVATE_KEY;
    privateKey = privateKey.replace(/\\n/g, '\n');

    cachedAuth = new google.auth.GoogleAuth({
        credentials: {
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: privateKey,
        },
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    return cachedAuth;
}

function getSheets() {
    if (cachedSheets) return cachedSheets;
    const auth = getAuth();
    cachedSheets = google.sheets({ version: 'v4', auth });
    return cachedSheets;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                return await handleGet(req, res);
            case 'POST':
                return await handlePost(req, res);
            case 'PUT':
                return await handlePut(req, res);
            case 'DELETE':
                return await handleDelete(req, res);
            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).json({ error: `Method ${method} Not Allowed` });
        }
    } catch (error: any) {
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

// GET - Fetch all records (with soft delete filter)
async function handleGet(req: NextApiRequest, res: NextApiResponse) {
    try {
        const sheets = getSheets();
        const { status } = req.query; // Optional: ?status=true to get only active records

        // Disable caching
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');

        // Get all rows from the sheet (A:F for all 6 columns)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:F',
        });

        const allRows = response.data.values || [];

        // If no rows, return empty array
        if (allRows.length === 0) {
            return res.status(200).json([]);
        }

        // Check if first row is a header
        const firstRow = allRows[0];
        const isHeader = firstRow && (
            firstRow[COLUMNS.NAME]?.toLowerCase().includes('name') ||
            firstRow[COLUMNS.GENDER]?.toLowerCase().includes('gender') ||
            firstRow[COLUMNS.GMAIL]?.toLowerCase().includes('gmail')
        );

        // Skip header if present
        const dataRows = isHeader && allRows.length > 1 ? allRows.slice(1) : allRows;
        const startRowNumber = isHeader ? 2 : 1;

        // Map rows to records and filter by status
        const records = dataRows
            .map((row: any[], index: number) => {
                // Parse status more robustly - handle TRUE, True, true, 1, "1", etc.
                const statusValue = row[COLUMNS.STATUS];
                let recordStatus = false;
                if (statusValue !== undefined && statusValue !== null && statusValue !== '') {
                    const statusStr = String(statusValue).toLowerCase().trim();
                    recordStatus = statusStr === 'true' || statusStr === '1' || statusStr === 'yes';
                }

                return {
                    id: (startRowNumber + index).toString(),
                    name: row[COLUMNS.NAME] || '',
                    gender: row[COLUMNS.GENDER] || '',
                    gmail: row[COLUMNS.GMAIL] || '',
                    createAt: row[COLUMNS.CREATE_AT] || '',
                    updateAt: row[COLUMNS.UPDATE_AT] || '',
                    status: recordStatus,
                };
            })
            .filter((record: GoogleSheetRecord) => {
                // If status query param is provided, filter accordingly
                if (status !== undefined) {
                    const statusStr = Array.isArray(status) ? status[0] : status;
                    const statusFilter = statusStr === 'true';
                    return record.status === statusFilter;
                }
                // Default: return only active records (status = true)
                return record.status === true;
            });

        return res.status(200).json(records);
    } catch (error: any) {
        console.error('GET Error:', error);
        return res.status(500).json({
            error: error.message,
            details: error.response?.data || 'Check your Google Service Account credentials'
        });
    }
}

// POST - Create new record
async function handlePost(req: NextApiRequest, res: NextApiResponse) {
    try {
        const sheets = getSheets();
        const { name, gender, gmail } = req.body;

        if (!name || !gmail) {
            return res.status(400).json({ error: 'Name and gmail are required' });
        }

        // First, get current row count to determine the new row number
        const currentData = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:F',
        });

        const allRows = currentData.data.values || [];
        const isHeader = allRows.length > 0 && (
            allRows[0][COLUMNS.NAME]?.toLowerCase().includes('name') ||
            allRows[0][COLUMNS.GENDER]?.toLowerCase().includes('gender') ||
            allRows[0][COLUMNS.GMAIL]?.toLowerCase().includes('gmail')
        );

        // Calculate the next row number
        const nextRowNumber = isHeader ? allRows.length + 1 : allRows.length + 1;

        const now = new Date().toISOString();
        const status = 'true'; // New records are active by default

        const appendResponse = await sheets.spreadsheets.values.append({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:F',
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[name, gender || '', gmail, now, now, status]],
            },
        });

        // Return the record with the actual row number as ID
        return res.status(200).json({
            id: nextRowNumber.toString(),
            name,
            gender: gender || '',
            gmail,
            createAt: now,
            updateAt: now,
            status: true
        });
    } catch (error: any) {
        console.error('POST Error:', error);
        return res.status(500).json({
            error: error.message,
            details: error.response?.data || 'Check your Google Service Account credentials'
        });
    }
}

// PUT - Update record
async function handlePut(req: NextApiRequest, res: NextApiResponse) {
    try {
        const sheets = getSheets();
        const { id, name, gender, gmail } = req.body;

        if (!id || !name || !gmail) {
            return res.status(400).json({ error: 'ID, name, and gmail are required' });
        }

        const rowNumber = parseInt(id, 10);
        if (isNaN(rowNumber) || rowNumber < 1) {
            return res.status(400).json({ error: 'Invalid row ID' });
        }

        // Get existing row to preserve createAt and status
        try {
            // First, get all rows to find the correct row index
            const allRowsResponse = await sheets.spreadsheets.values.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'Sheet1!A:F',
            });

            const allRows = allRowsResponse.data.values || [];
            if (allRows.length === 0) {
                return res.status(404).json({ error: `Sheet is empty` });
            }

            // Check if first row is a header
            const firstRow = allRows[0];
            const isHeader = firstRow && (
                firstRow[COLUMNS.NAME]?.toLowerCase().includes('name') ||
                firstRow[COLUMNS.GENDER]?.toLowerCase().includes('gender') ||
                firstRow[COLUMNS.GMAIL]?.toLowerCase().includes('gmail')
            );

            // Calculate actual row index in the array
            const actualRowIndex = isHeader ? rowNumber - 1 : rowNumber - 1;

            if (actualRowIndex < 0 || actualRowIndex >= allRows.length) {
                console.error(`Row ${rowNumber} (index ${actualRowIndex}) is out of bounds. Total rows: ${allRows.length}`);
                return res.status(404).json({ error: `Row ${rowNumber} not found (out of bounds)` });
            }

            const existing: any[] = allRows[actualRowIndex];

            // Check if row is empty (all cells are empty)
            const isEmpty = !existing || existing.every((cell: any) => !cell || cell.toString().trim() === '');
            if (isEmpty) {
                console.error(`Row ${rowNumber} is empty`);
                return res.status(404).json({ error: `Row ${rowNumber} not found (empty row)` });
            }

            const createAt = existing[COLUMNS.CREATE_AT] || new Date().toISOString();
            // Preserve existing status value as-is
            const status = existing[COLUMNS.STATUS] !== undefined && existing[COLUMNS.STATUS] !== null
                ? String(existing[COLUMNS.STATUS])
                : 'true';
            const updateAt = new Date().toISOString();

            // Update the row (A=name, B=gender, C=gmail, D=createAt, E=updateAt, F=status)
            await sheets.spreadsheets.values.update({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: `Sheet1!A${rowNumber}:F${rowNumber}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [[name, gender || '', gmail, createAt, updateAt, status]],
                },
            });

            console.log(`Successfully updated row ${rowNumber}`);

            return res.status(200).json({
                id: rowNumber.toString(),
                name,
                gender: gender || '',
                gmail,
                createAt,
                updateAt,
                status: status === 'true' || status === '1',
            });
        } catch (checkError: any) {
            console.error(`Error accessing row ${rowNumber}:`, checkError);
            // If it's a 404 from Google Sheets API, return our own 404
            if (checkError.code === 400 || checkError.message?.includes('not found')) {
                return res.status(404).json({ error: `Row ${rowNumber} not found` });
            }
            throw checkError;
        }
    } catch (error: any) {
        console.error('PUT Error:', error);
        return res.status(500).json({
            error: error.message,
            details: error.response?.data || 'Check your Google Service Account credentials'
        });
    }
}

// DELETE - Soft delete record (set status to false)
async function handleDelete(req: NextApiRequest, res: NextApiResponse) {
    try {
        const sheets = getSheets();
        const { id } = req.query;

        if (!id || typeof id !== 'string') {
            return res.status(400).json({ error: 'ID is required' });
        }

        const rowNumber = parseInt(id, 10);
        if (isNaN(rowNumber) || rowNumber < 1) {
            return res.status(400).json({ error: 'Invalid row ID' });
        }

        // Get existing row to preserve other fields
        try {
            // First, get all rows to find the correct row index
            const allRowsResponse = await sheets.spreadsheets.values.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'Sheet1!A:F',
            });

            const allRows = allRowsResponse.data.values || [];
            if (allRows.length === 0) {
                return res.status(404).json({ error: `Sheet is empty` });
            }

            // Check if first row is a header
            const firstRow = allRows[0];
            const isHeader = firstRow && (
                firstRow[COLUMNS.NAME]?.toLowerCase().includes('name') ||
                firstRow[COLUMNS.GENDER]?.toLowerCase().includes('gender') ||
                firstRow[COLUMNS.GMAIL]?.toLowerCase().includes('gmail')
            );

            // Calculate actual row index in the array
            const actualRowIndex = isHeader ? rowNumber - 1 : rowNumber - 1;

            if (actualRowIndex < 0 || actualRowIndex >= allRows.length) {
                console.error(`Row ${rowNumber} (index ${actualRowIndex}) is out of bounds. Total rows: ${allRows.length}`);
                return res.status(404).json({ error: `Row ${rowNumber} not found (out of bounds)` });
            }

            const existing: any[] = allRows[actualRowIndex];

            // Check if row is empty
            const isEmpty = !existing || existing.every((cell: any) => !cell || cell.toString().trim() === '');
            if (isEmpty) {
                console.error(`Row ${rowNumber} is empty - cannot delete`);
                return res.status(404).json({ error: `Row ${rowNumber} not found (empty row)` });
            }

            const updateAt = new Date().toISOString();

            // Soft delete: update status to false and updateAt in one call (more efficient)
            await sheets.spreadsheets.values.update({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: `Sheet1!E${rowNumber}:F${rowNumber}`, // Update both updateAt and status
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [[updateAt, 'false']],
                },
            });

            console.log(`Successfully soft deleted row ${rowNumber}`);

            return res.status(200).json({ success: true, id, message: 'Record soft deleted' });
        } catch (checkError: any) {
            console.error(`Error accessing row ${rowNumber} for deletion:`, checkError);
            if (checkError.code === 400 || checkError.message?.includes('not found')) {
                return res.status(404).json({ error: `Row ${rowNumber} not found` });
            }
            throw checkError;
        }
    } catch (error: any) {
        console.error('DELETE Error:', error);
        return res.status(500).json({
            error: error.message,
            details: error.response?.data || 'Check your Google Service Account credentials'
        });
    }
}