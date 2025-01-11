import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const execPromise = util.promisify(exec);

// Temporary directory for code files
const CODE_DIR = path.join(dirname(fileURLToPath(import.meta.url)), '../temp_code');

// Ensure the temp_code directory exists
if (!fs.existsSync(CODE_DIR)) {
  fs.mkdirSync(CODE_DIR);
}

const LANGUAGE_CONFIG = {
  javascript: {
    extension: 'js',
    command: (filePath) => `docker run --rm -v ${filePath}:/app/code.js node:14 node /app/code.js`
  },
  python: {
    extension: 'py',
    command: (filePath) => `docker run --rm -v ${filePath}:/app/code.py python:3.9 sh -c "python /app/code.py 2>&1"`
  },
  c: {
    extension: 'c',
    command: (filePath) => `docker run --rm -v ${filePath}:/app/code.c gcc:latest sh -c "gcc /app/code.c -o /app/code && /app/code"`
  },
  cpp: {
    extension: 'cpp',
    command: (filePath) => `docker run --rm -v ${filePath}:/app/code.cpp gcc:latest sh -c "g++ /app/code.cpp -o /app/code && /app/code"`
  },
};

// export const executeCode = async (req, res) => {
//   const { code, language, input } = req.body;
//   console.log(req.body);

//   if (!code || !language) {
//     return res.status(400).json({ error: 'Code and language are required' });
//   }

//   const config = LANGUAGE_CONFIG[language];
//   if (!config) {
//     return res.status(400).json({ error: 'Unsupported language' });
//   }

//   const fileName = `code-${Date.now()}.${config.extension}`;
//   const filePath = path.join(CODE_DIR, fileName);

//   try {
//     // Write code to file
//     fs.writeFileSync(filePath, code);
//     console.log(`Code file created at: ${filePath}`);
//     console.log(`Running command: ${config.command(filePath)}`);

//     // Execute code inside Docker container
//     const { stdout, stderr } = await execPromise(config.command(filePath));
//     console.log('stdout:', stdout);
//     console.log('stderr:', stderr);

//     // Check if there was any error
//     if (stderr) {
//       return res.status(200).json({ error: stderr });
//     }

//     res.json({ output: stdout });
//   } catch (error) {
//     console.error('Execution error:', error);
//     res.status(500).json({ error: 'Failed to execute code', details: error.message });
//   } finally {
//     // Clean up the temporary file
//     try {
//       fs.unlinkSync(filePath);
//       console.log(`Cleaned up file: ${filePath}`);
//     } catch (cleanupError) {
//       console.error('Error during cleanup:', cleanupError);
//     }
//   }
// };



export const executeCode = async (req, res) => {
  const { code, language, input } = req.body;
  console.log('Received request:', req.body);

  if (!code || !language) {
    return res.status(400).json({ error: 'Code and language are required' });
  }

  const config = LANGUAGE_CONFIG[language];
  if (!config) {
    return res.status(400).json({ error: 'Unsupported language' });
  }

  const fileName = `code-${Date.now()}.${config.extension}`;
  const filePath = path.join(CODE_DIR, fileName);

  try {
    // Write code to file
    fs.writeFileSync(filePath, code);
    console.log(`Code written to: ${filePath}`);

    // Execute code inside Docker container
    const { stdout, stderr } = await execPromise(config.command(filePath));
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);

    // Check if there was any error
    if (stderr) {
      console.error('Docker execution error:', stderr);
      return res.status(400).json({ error: stderr });
    }

    res.json({ output: stdout });
  } catch (error) {
    console.error('Execution error:', error);
    res.status(500).json({ error: 'Failed to execute code', details: error.message });
  } finally {
    try {
      // Clean up the temporary file
      // fs.unlinkSync(filePath);
      console.log(`Cleaned up file: ${filePath}`);
    } catch (cleanupError) {
      console.error('Error during cleanup:', cleanupError);
    }
  }
};
