import * as fs from 'fs/promises';

export default async function logError(req) {
  const data = req.body;

  if (!data) {
    console.log('Empty request body in LogService!');
    return { success: false, errors: { code: 10 } };
  }

  try {
    await fs.appendFile('./error.log', `\n${new Date(Date.now()).toLocaleString()} -- ${JSON.stringify(data.errors)}`);

    return { success: true, errors: null };
  } catch (e) {
    console.log('Querying failure in LogService\n' + e.stack);
    return { success: false, errors: { code: 500 } };
  }
}
