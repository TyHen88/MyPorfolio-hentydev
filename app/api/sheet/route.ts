import { google } from 'googleapis';
import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetMedelRecord } from '@/lib/model/GoogleSheet';


const HEADER_ROW: string[] = [
    'Content Name',
    'Content Title',
    'Content Description',
    'Content Image',
    'Content Link',
    'Content Tags',
    'Content Date Start',
    'Content Date End',
    'Content Type',
    'Create At',
    'Update At',
    'Status',
    'Content Subtitle',
];

// Column mapping: A=contentName, B=contentTitle, C=contentDescription, D=contentImage, E=contentLink, F=contentTags, G=contentDateStart, H=contentDateEnd, I=contentType, J=createAt, K=updateAt, L=status
const COLUMNS = {
    CONTENT_NAME: 0,      // A
    CONTENT_TITLE: 1,    // B
    CONTENT_DESCRIPTION: 2, // C
    CONTENT_IMAGE: 3, // D
    CONTENT_LINK: 4, // E
    CONTENT_TAGS: 5, // F
    CONTENT_DATE_START: 6, // G
    CONTENT_DATE_END: 7, // H
    CONTENT_TYPE: 8, // I
    CREATE_AT: 9, // J
    UPDATE_AT: 10, // K
    STATUS: 11,     // L
    CONTENT_SUBTITLE: 12, // M
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

export async function GET(request: NextRequest) {
    return handleGet(request);
}

export async function POST(request: NextRequest) {
    return handlePost(request);
}

export async function PUT(request: NextRequest) {
    return handlePut(request);
}

export async function DELETE(request: NextRequest) {
    return handleDelete(request);
}

// GET - Fetch all records (with soft delete filter)
async function handleGet(request: NextRequest) {
    try {
        const sheets = getSheets();
        const { searchParams } = new URL(request.url);
        const statusParam = searchParams.get('status'); // Optional: ?status=true to get only active records

        // Get all rows from the sheet (A:M for all 13 columns)
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:M',
        });

        const allRows = response.data.values || [];

        // If no rows, return empty array
        if (allRows.length === 0) {
            const emptyResponse = NextResponse.json([], { status: 200 });
            emptyResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            emptyResponse.headers.set('Pragma', 'no-cache');
            emptyResponse.headers.set('Expires', '0');
            return emptyResponse;
        }

        // Check if first row is a header
        const firstRow = allRows[0];
        const isHeader = firstRow && (
            firstRow[COLUMNS.CONTENT_NAME]?.toLowerCase().includes('content name') ||
            firstRow[COLUMNS.CONTENT_TITLE]?.toLowerCase().includes('content title') ||
            firstRow[COLUMNS.CONTENT_TYPE]?.toLowerCase().includes('content type')
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

                // Parse contentTags - handle comma-separated string or array
                let contentTags: string[] = [];
                const tagsValue = row[COLUMNS.CONTENT_TAGS];
                if (tagsValue) {
                    if (Array.isArray(tagsValue)) {
                        contentTags = tagsValue;
                    } else if (typeof tagsValue === 'string') {
                        contentTags = tagsValue.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0);
                    }
                }

                return {
                    id: (startRowNumber + index).toString(),
                    contentName: row[COLUMNS.CONTENT_NAME] || '',
                    contentTitle: row[COLUMNS.CONTENT_TITLE] || '',
                    contentDescription: row[COLUMNS.CONTENT_DESCRIPTION] || '',
                    contentImage: row[COLUMNS.CONTENT_IMAGE] || '',
                    contentLink: row[COLUMNS.CONTENT_LINK] || '',
                    contentTags: contentTags,
                    contentDateStart: row[COLUMNS.CONTENT_DATE_START] || '',
                    contentDateEnd: row[COLUMNS.CONTENT_DATE_END] || '',
                    contentType: row[COLUMNS.CONTENT_TYPE] || 'other',
                    createAt: row[COLUMNS.CREATE_AT] || '',
                    updateAt: row[COLUMNS.UPDATE_AT] || '',
                    status: recordStatus,
                    contentSubtitle: row[COLUMNS.CONTENT_SUBTITLE] || '',
                };
            })
            .filter((record: GoogleSheetMedelRecord) => {
                // If status query param is provided, filter accordingly
                if (statusParam !== null) {
                    const statusFilter = statusParam === 'true';
                    return record.status === statusFilter;
                }
                // Default: return only active records (status = true)
                return record.status === true;
            });

        const responseBody = NextResponse.json(records, { status: 200 });

        // Disable caching
        responseBody.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        responseBody.headers.set('Pragma', 'no-cache');
        responseBody.headers.set('Expires', '0');

        return responseBody;
    } catch (error: any) {
        console.error('GET Error:', error);
        return NextResponse.json({
            error: error.message,
            details: error.response?.data || 'Check your Google Service Account credentials'
        }, { status: 500 });
    }
}

// POST - Create new record
async function handlePost(request: NextRequest) {
    try {
        const sheets = getSheets();
        const body = await request.json();
        const {
            contentName,
            contentTitle,
            contentDescription,
            contentImage,
            contentLink,
            contentTags,
            contentDateStart,
            contentDateEnd,
            contentType,
            contentSubtitle
        } = body;

        if (!contentName) {
            return NextResponse.json({ error: 'Content Name is required' }, { status: 400 });
        }

        // First, get current row count to determine the new row number
        const currentData = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Sheet1!A:M',
        });
        const allRows = currentData.data.values || [];

        let nextRowNumber = allRows.length + 1;

        if (allRows.length === 0) {
            await sheets.spreadsheets.values.update({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'Sheet1!A1:M1',
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [HEADER_ROW],
                },
            });
            nextRowNumber = 2;
        }

        const now = new Date().toISOString();
        const status = 'true'; // New records are active by default

        // Format contentTags - convert array to comma-separated string
        const tagsString = Array.isArray(contentTags)
            ? contentTags.join(', ')
            : (contentTags || '');

        await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: `Sheet1!A${nextRowNumber}:M${nextRowNumber}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: {
                values: [[
                    contentName || '',
                    contentTitle || '',
                    contentDescription || '',
                    contentImage || '',
                    contentLink || '',
                    tagsString,
                    contentDateStart || '',
                    contentDateEnd || '',
                    contentType || 'other',
                    now,
                    now,
                    status,
                    contentSubtitle || ''
                ]],
            },
        });

        // Return the record with the actual row number as ID
        return NextResponse.json({
            id: nextRowNumber.toString(),
            contentName: contentName || '',
            contentTitle: contentTitle || '',
            contentDescription: contentDescription || '',
            contentImage: contentImage || '',
            contentLink: contentLink || '',
            contentTags: Array.isArray(contentTags) ? contentTags : (contentTags ? [contentTags] : []),
            contentDateStart: contentDateStart || '',
            contentDateEnd: contentDateEnd || '',
            contentType: contentType || 'other',
            createAt: now,
            updateAt: now,
            status: true,
            contentSubtitle: contentSubtitle || ''
        }, { status: 200 });
    } catch (error: any) {
        console.error('POST Error:', error);
        return NextResponse.json({
            error: error.message,
            details: error.response?.data || 'Check your Google Service Account credentials'
        }, { status: 500 });
    }
}

// PUT - Update record
async function handlePut(request: NextRequest) {
    try {
        const sheets = getSheets();
        const body = await request.json();
        const {
            id,
            contentName,
            contentTitle,
            contentDescription,
            contentImage,
            contentLink,
            contentTags,
            contentDateStart,
            contentDateEnd,
            contentType,
            contentSubtitle
        } = body;

        if (!id || !contentName) {
            return NextResponse.json({ error: 'ID and Content Name are required' }, { status: 400 });
        }

        const rowNumber = parseInt(id, 10);
        if (isNaN(rowNumber) || rowNumber < 1) {
            return NextResponse.json({ error: 'Invalid row ID' }, { status: 400 });
        }

        // Get existing row to preserve createAt and status
        try {
            // First, get all rows to find the correct row index
            const allRowsResponse = await sheets.spreadsheets.values.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'Sheet1!A:M',
            });

            const allRows = allRowsResponse.data.values || [];
            if (allRows.length === 0) {
                return NextResponse.json({ error: 'Sheet is empty' }, { status: 404 });
            }

            // Check if first row is a header
            const firstRow = allRows[0];
            const isHeader = firstRow && (
                firstRow[COLUMNS.CONTENT_NAME]?.toLowerCase().includes('content name') ||
                firstRow[COLUMNS.CONTENT_TITLE]?.toLowerCase().includes('content title') ||
                firstRow[COLUMNS.CONTENT_TYPE]?.toLowerCase().includes('content type')
            );

            // Calculate actual row index in the array
            const actualRowIndex = isHeader ? rowNumber - 1 : rowNumber - 1;

            if (actualRowIndex < 0 || actualRowIndex >= allRows.length) {
                console.error(`Row ${rowNumber} (index ${actualRowIndex}) is out of bounds. Total rows: ${allRows.length}`);
                return NextResponse.json({ error: `Row ${rowNumber} not found (out of bounds)` }, { status: 404 });
            }

            const existing: any[] = allRows[actualRowIndex];

            // Check if row is empty (all cells are empty)
            const isEmpty = !existing || existing.every((cell: any) => !cell || cell.toString().trim() === '');
            if (isEmpty) {
                console.error(`Row ${rowNumber} is empty`);
                return NextResponse.json({ error: `Row ${rowNumber} not found (empty row)` }, { status: 404 });
            }

            const createAt = existing[COLUMNS.CREATE_AT] || new Date().toISOString();
            // Preserve existing status value as-is
            const status = existing[COLUMNS.STATUS] !== undefined && existing[COLUMNS.STATUS] !== null
                ? String(existing[COLUMNS.STATUS])
                : 'true';
            const updateAt = new Date().toISOString();

            // Format contentTags - convert array to comma-separated string
            const tagsString = Array.isArray(contentTags)
                ? contentTags.join(', ')
                : (contentTags || existing[COLUMNS.CONTENT_TAGS] || '');

            // Update the row (A:M for all 13 columns)
            await sheets.spreadsheets.values.update({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: `Sheet1!A${rowNumber}:M${rowNumber}`,
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [[
                        contentName || '',
                        contentTitle || existing[COLUMNS.CONTENT_TITLE] || '',
                        contentDescription !== undefined ? contentDescription : (existing[COLUMNS.CONTENT_DESCRIPTION] || ''),
                        contentImage !== undefined ? contentImage : (existing[COLUMNS.CONTENT_IMAGE] || ''),
                        contentLink !== undefined ? contentLink : (existing[COLUMNS.CONTENT_LINK] || ''),
                        tagsString,
                        contentDateStart !== undefined ? contentDateStart : (existing[COLUMNS.CONTENT_DATE_START] || ''),
                        contentDateEnd !== undefined ? contentDateEnd : (existing[COLUMNS.CONTENT_DATE_END] || ''),
                        contentType || existing[COLUMNS.CONTENT_TYPE] || 'other',
                        createAt,
                        updateAt,
                        status,
                        contentSubtitle || ''
                    ]],
                },
            });

            console.log(`Successfully updated row ${rowNumber}`);

            // Parse tags for response
            const responseTags = Array.isArray(contentTags)
                ? contentTags
                : (tagsString ? tagsString.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0) : []);

            return NextResponse.json({
                id: rowNumber.toString(),
                contentName: contentName || '',
                contentTitle: contentTitle || existing[COLUMNS.CONTENT_TITLE] || '',
                contentDescription: contentDescription !== undefined ? contentDescription : (existing[COLUMNS.CONTENT_DESCRIPTION] || ''),
                contentImage: contentImage !== undefined ? contentImage : (existing[COLUMNS.CONTENT_IMAGE] || ''),
                contentLink: contentLink !== undefined ? contentLink : (existing[COLUMNS.CONTENT_LINK] || ''),
                contentTags: responseTags,
                contentDateStart: contentDateStart !== undefined ? contentDateStart : (existing[COLUMNS.CONTENT_DATE_START] || ''),
                contentDateEnd: contentDateEnd !== undefined ? contentDateEnd : (existing[COLUMNS.CONTENT_DATE_END] || ''),
                contentType: contentType || existing[COLUMNS.CONTENT_TYPE] || 'other',
                createAt,
                updateAt,
                status: status === 'true' || status === '1',
                contentSubtitle: contentSubtitle || ''
            }, { status: 200 });
        } catch (checkError: any) {
            console.error(`Error accessing row ${rowNumber}:`, checkError);
            // If it's a 404 from Google Sheets API, return our own 404
            if (checkError.code === 400 || checkError.message?.includes('not found')) {
                return NextResponse.json({ error: `Row ${rowNumber} not found` }, { status: 404 });
            }
            throw checkError;
        }
    } catch (error: any) {
        console.error('PUT Error:', error);
        return NextResponse.json({
            error: error.message,
            details: error.response?.data || 'Check your Google Service Account credentials'
        }, { status: 500 });
    }
}

// DELETE - Soft delete record (set status to false)
async function handleDelete(request: NextRequest) {
    try {
        const sheets = getSheets();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id || typeof id !== 'string') {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        const rowNumber = parseInt(id, 10);
        if (isNaN(rowNumber) || rowNumber < 1) {
            return NextResponse.json({ error: 'Invalid row ID' }, { status: 400 });
        }

        // Get existing row to preserve other fields
        try {
            // First, get all rows to find the correct row index
            const allRowsResponse = await sheets.spreadsheets.values.get({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: 'Sheet1!A:M',
            });

            const allRows = allRowsResponse.data.values || [];
            if (allRows.length === 0) {
                return NextResponse.json({ error: 'Sheet is empty' }, { status: 404 });
            }

            // Check if first row is a header
            const firstRow = allRows[0];
            const isHeader = firstRow && (
                firstRow[COLUMNS.CONTENT_NAME]?.toLowerCase().includes('content name') ||
                firstRow[COLUMNS.CONTENT_TITLE]?.toLowerCase().includes('content title') ||
                firstRow[COLUMNS.CONTENT_TYPE]?.toLowerCase().includes('content type')
            );

            // Calculate actual row index in the array
            const actualRowIndex = isHeader ? rowNumber - 1 : rowNumber - 1;

            if (actualRowIndex < 0 || actualRowIndex >= allRows.length) {
                console.error(`Row ${rowNumber} (index ${actualRowIndex}) is out of bounds. Total rows: ${allRows.length}`);
                return NextResponse.json({ error: `Row ${rowNumber} not found (out of bounds)` }, { status: 404 });
            }

            const existing: any[] = allRows[actualRowIndex];

            // Check if row is empty
            const isEmpty = !existing || existing.every((cell: any) => !cell || cell.toString().trim() === '');
            if (isEmpty) {
                console.error(`Row ${rowNumber} is empty - cannot delete`);
                return NextResponse.json({ error: `Row ${rowNumber} not found (empty row)` }, { status: 404 });
            }

            const updateAt = new Date().toISOString();

            // Soft delete: update status to false and updateAt in one call (more efficient)
            // UpdateAt is column K (index 10), Status is column L (index 11)
            await sheets.spreadsheets.values.update({
                spreadsheetId: process.env.GOOGLE_SHEET_ID,
                range: `Sheet1!K${rowNumber}:L${rowNumber}`, // Update both updateAt (K) and status (L)
                valueInputOption: 'USER_ENTERED',
                requestBody: {
                    values: [[updateAt, 'false']],
                },
            });

            console.log(`Successfully soft deleted row ${rowNumber}`);

            return NextResponse.json({ success: true, id, message: 'Record soft deleted' }, { status: 200 });
        } catch (checkError: any) {
            console.error(`Error accessing row ${rowNumber} for deletion:`, checkError);
            if (checkError.code === 400 || checkError.message?.includes('not found')) {
                return NextResponse.json({ error: `Row ${rowNumber} not found` }, { status: 404 });
            }
            throw checkError;
        }
    } catch (error: any) {
        console.error('DELETE Error:', error);
        return NextResponse.json({
            error: error.message,
            details: error.response?.data || 'Check your Google Service Account credentials'
        }, { status: 500 });
    }
}
