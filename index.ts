import express, { Request, Response } from 'express';
import fs from 'fs';
import readline from 'readline';
import { Readable } from 'stream';
import path from 'path';

const app: express.Application = express();
const port: number = 3000;

/**
 * @openapi
 * /files:
 *   get:
 *     summary: List all 3D files
 *     description: Retrieve a list of all 3D files stored on the server.
 *     responses:
 *       200:
 *         description: A list of 3D files.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   size:
 *                     type: integer
 *                     format: int32
 *                   lastModified:
 *                     type: string
 *                     format: date-time
 */
app.get('/files', (req: Request, res: Response) => {
    // Implementation would go here
});

/**
 * @openapi
 * /files/upload:
 *   post:
 *     summary: Upload a 3D file
 *     description: Allows for uploading a new 3D file to the server.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The 3D file to upload
 *     responses:
 *       201:
 *         description: File uploaded successfully
 */
app.post('/files/upload', (req: Request, res: Response) => {
    // Implementation would go here
});

/**
 * @openapi
 * /files/{fileName}:
 *   get:
 *     summary: Download original file
 *     description: Downloads the original 3D file without any transformations.
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 */
app.get('/files/:fileName', (req: Request, res: Response) => {
    // Implementation would go here
});

/**
 * @openapi
 * /files/{fileName}:
 *   patch:
 *     summary: Rename file
 *     description: Rename a specific 3D file on the server.
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newName:
 *                 type: string
 *                 description: New name for the file
 *     responses:
 *       200:
 *         description: File renamed successfully
 *       404:
 *         description: File not found
 */
app.patch('/files/:fileName', (req: Request, res: Response) => {
    // Implementation would go here
});

/**
 * @openapi
 * /files/{fileName}:
 *   delete:
 *     summary: Delete file
 *     description: Deletes a specific 3D file from the server.
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: File deleted successfully
 *       404:
 *         description: File not found
 */
app.delete('/files/:fileName', (req: Request, res: Response) => {
    // Implementation would go here
});

// Helper function to validate the vectors
function isValidVector(vector: any): vector is number[] {
    return Array.isArray(vector) &&
           vector.length === 3 &&
           vector.every(v => typeof v === 'number');
}

/**
 * @openapi
 * /files/transform/{fileName}:
 *   get:
 *     summary: Download transformed file
 *     description: Downloads a transformed version of a 3D file based on scale and translation vectors.
 *     parameters:
 *       - in: path
 *         name: fileName
 *         required: true
 *         schema:
 *           type: string
 *         description: Name of the file to transform and download
 *       - in: query
 *         name: scale
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: number
 *           minItems: 3
 *           maxItems: 3
 *         description: Scale vector [x, y, z] for transforming the file
 *       - in: query
 *         name: translate
 *         required: true
 *         schema:
 *           type: array
 *           items:
 *             type: number
 *           minItems: 3
 *           maxItems: 3
 *         description: Translation vector [x, y, z] for transforming the file
 *     responses:
 *       200:
 *         description: File transformed and downloaded successfully
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       400:
 *         description: Invalid input parameters
 *       404:
 *         description: File not found
 */
app.get('/files/transform/:fileName', (req: Request, res: Response): void => {
    const { fileName } = req.params;

    const plain: boolean = req.query.plain ? true : false; // undocumented, just for test
    let scale: number[], translate: number[];    

    let baseFileName: string = '';

    try {
        baseFileName = path.basename(fileName); // Remove any path elements
        if (!/^[a-zA-Z0-9_\-\.]+$/.test(baseFileName)) {
            throw new Error('Invalid file name.');
        }

        // Parse and validate scale and translate vectors
        scale = req.query.scale ? JSON.parse(req.query.scale as string) : [1, 1, 1];
        translate = req.query.translate ? JSON.parse(req.query.translate as string) : [0, 0, 0];
        if (!isValidVector(scale) || !isValidVector(translate)) {
            throw new Error('Scale and translate vectors must each be an array of three numbers.');
        }
    } catch (error: unknown) {
        // Checking if error is an instance of Error
        if (error instanceof Error) {
            res.status(400).send(`Invalid input: ${error.message}`);
        } else {
            res.status(400).send(`Invalid input: An unknown error occurred.`);
        }
        return;
    }

    // Path to the large file
    const filePath: string = path.join('files', baseFileName);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
        res.status(404).send('File not found');
        return;
    }

    // Set headers for streaming and downloading
    if (plain) {
        res.setHeader('Content-Type', 'text/plain');
    } else {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.setHeader('Content-Disposition', 'attachment; filename="transformed.obj"');
    }

    // Create a read stream
    const readStream: Readable = fs.createReadStream(filePath);

    // Create readline interface
    const rl = readline.createInterface({
        input: readStream,
        crlfDelay: Infinity
    });

    // Handle each line
    rl.on('line', (line: string): void => {
        if (line.startsWith('v')) {
            const parts: string[] = line.split(/\s+/).slice(1);
            const transformedNumbers: string[] = parts.map((num: string, index: number): string => 
                ((parseFloat(num) * scale[index] + translate[index]).toFixed(6))
            );
            // Write the transformed line to the response
            res.write(`v ${transformedNumbers.join(' ')}\n`);
        } else {
            // Write non-transformed lines directly to the response
            res.write(line + '\n');
        }
    });

    // Close the response stream after processing all lines
    rl.on('close', () => {
        res.end();
    });

    // Handle errors
    readStream.on('error', (err: Error): void => {
        console.error('Error reading the file:', err);
        res.status(500).send('Error reading the file');
    });
});

app.listen(port, (): void => {
    console.log(`Server listening at http://localhost:${port}`);
});
