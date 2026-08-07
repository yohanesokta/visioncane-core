import { promises as fs } from "fs";
import path from "path";
const root_path = process.cwd();

async function ensureJsonFile<T>(
    filePath: string,
    defaultData: T
): Promise<void> {
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, {
        recursive: true,
    });
    try {
        await fs.access(filePath);
    } catch {
        await fs.writeFile(
            filePath,
            JSON.stringify(defaultData, null, 2),
            "utf-8"
        );
    }
}

function joinPathRoot(fpath: string) {
    return path.join(root_path, fpath);
}

export async function saveJsonList(
    data: string[],
    filePath: string
): Promise<void> {
    const json = JSON.stringify(data, null, 2);
    await ensureJsonFile<string[]>(
        joinPathRoot(filePath),
        []
    );
    await fs.writeFile(joinPathRoot(filePath), json, "utf-8");
}

export async function readJsonList(
    filePath: string
): Promise<any[]> {
    try {
        await ensureJsonFile<string[]>(
            joinPathRoot(filePath),
            []
        );
        const json = await fs.readFile(joinPathRoot(filePath), "utf-8");
        const data = JSON.parse(json);
        if (!Array.isArray(data)) {
            throw new Error("JSON harus berupa array");
        }
        return data;
    } catch (error: any) {
        if (error.code === "ENOENT") {
            return [];
        }
        throw error;
    }
}
