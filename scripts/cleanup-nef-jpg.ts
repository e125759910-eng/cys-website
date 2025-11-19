/**
 * 清理错误的 .NEF.jpg 文件
 * 运行方式: npm run cleanup-nef-jpg
 */

import { readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const WORKS_DIR = join(process.cwd(), 'public', 'works');

async function findAndDeleteNefJpgFiles(dir: string): Promise<number> {
  let deletedCount = 0;
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const subCount = await findAndDeleteNefJpgFiles(fullPath);
      deletedCount += subCount;
    } else if (entry.isFile()) {
      // 查找 .NEF.jpg 或 .nef.jpg 文件
      if (entry.name.toLowerCase().endsWith('.nef.jpg')) {
        try {
          await unlink(fullPath);
          console.log(`✅ 已删除: ${entry.name}`);
          deletedCount++;
        } catch (error) {
          console.error(`❌ 无法删除 ${entry.name}:`, error);
        }
      }
    }
  }

  return deletedCount;
}

async function main() {
  console.log('🔍 正在扫描并清理错误的 .NEF.jpg 文件...\n');

  if (!existsSync(WORKS_DIR)) {
    console.log('❌ public/works/ 文件夹不存在');
    return;
  }

  const deletedCount = await findAndDeleteNefJpgFiles(WORKS_DIR);

  console.log(`\n📊 清理完成: 删除了 ${deletedCount} 个错误的文件`);
  
  if (deletedCount > 0) {
    console.log('\n💡 清理完成后，运行: npm run generate-works');
  }
}

main().catch(console.error);

