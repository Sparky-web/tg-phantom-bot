import _fs from "fs"
const fs = _fs.promises

import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function getRelativePath(absolutePath) {
    return join(__dirname, '../', absolutePath)
}

async function isExists(absolutePath) {
    return _fs.existsSync(getRelativePath(absolutePath))
}

async function writeToFile(absolutePath, contents) {
    await fs.writeFile(getRelativePath(absolutePath), contents)
}

async function createFileIfNotExists(absolutePath, contents = "") {
    const fileRelativePath = await getRelativePath(absolutePath)
    const isExists = await _fs.existsSync(fileRelativePath)
    if(isExists) return

    const pathSplat = absolutePath.split("/")
    pathSplat.pop()

    const folder = pathSplat.join("/")
    const folderRelativePath = await getRelativePath(folder)
    const isFolderExists = await _fs.existsSync(folderRelativePath)

    if(!isFolderExists) await fs.mkdir(folderRelativePath, {recursive: true})

    await fs.writeFile(fileRelativePath, contents)
}

async function getFileContents(absolutePath) {
    const data = await fs.readFile(getRelativePath(absolutePath))
    return data.toString()
}

async function appendToFile(absolutePath, contents)  {
    await createFileIfNotExists(absolutePath, "")
    const content = await getFileContents(absolutePath)
    await writeToFile(absolutePath, content + "\n" + contents)
}

export default {createFileIfNotExists, isExists, writeToFile, getRelativePath, getFileContents, appendToFile}