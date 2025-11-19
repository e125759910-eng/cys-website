/**
 * NEF 转 JPG 转换脚本
 * 运行方式: npm run convert-nef
 * 
 * 需要安装 ImageMagick 或使用 sharp 库
 */

import { readdir, stat, copyFile, mkdir, unlink } from 'fs/promises';
import { join, dirname, extname, basename } from 'path';
import { existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const WORKS_DIR = join(process.cwd(), 'public', 'works');

// 检查 ImageMagick 是否可用
async function checkImageMagick(): Promise<boolean> {
  try {
    await execAsync('magick -version');
    return true;
  } catch {
    try {
      await execAsync('convert -version');
      return true;
    } catch {
      return false;
    }
  }
}

// 使用 ImageMagick 转换 NEF 到 JPG
async function convertWithImageMagick(inputPath: string, outputPath: string): Promise<boolean> {
  try {
    // 尝试使用 magick 命令（ImageMagick 7+）
    try {
      await execAsync(`magick "${inputPath}" -quality 90 "${outputPath}"`);
      return true;
    } catch {
      // 尝试使用 convert 命令（ImageMagick 6）
      await execAsync(`convert "${inputPath}" -quality 90 "${outputPath}"`);
      return true;
    }
  } catch (error) {
    console.error(`转换失败 ${inputPath}:`, error);
    return false;
  }
}

// 递归扫描文件夹查找 NEF 文件
async function findNefFiles(dir: string): Promise<string[]> {
  const nefFiles: string[] = [];
  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      const subFiles = await findNefFiles(fullPath);
      nefFiles.push(...subFiles);
    } else if (entry.isFile()) {
      const ext = extname(entry.name).toLowerCase();
      if (ext === '.nef') {
        nefFiles.push(fullPath);
      }
    }
  }

  return nefFiles;
}

// 转换单个 NEF 文件
async function convertNefFile(nefPath: string): Promise<boolean> {
  const dir = dirname(nefPath);
  // 处理大小写不敏感的文件名
  const fileName = basename(nefPath);
  const baseName = fileName.replace(/\.nef$/i, '');
  const jpgPath = join(dir, `${baseName}.jpg`);

  // 如果 JPG 已存在，删除对应的 NEF 文件
  if (existsSync(jpgPath)) {
    console.log(`⏭️  跳过（JPG 已存在）: ${baseName}.jpg`);
    // 删除对应的 NEF 文件
    try {
      if (existsSync(nefPath)) {
        await unlink(nefPath);
        console.log(`   ✅ 已删除原始 NEF 文件: ${fileName}`);
      }
    } catch (error) {
      console.error(`   ⚠️  无法删除 NEF 文件 ${fileName}:`, error);
    }
    return true;
  }
  
  // 检查转换是否成功
  const checkSuccess = async () => {
    for (let i = 0; i < 10; i++) {
      await new Promise(resolve => setTimeout(resolve, 500));
      if (existsSync(jpgPath)) {
        return true;
      }
    }
    return false;
  };

  console.log(`🔄 正在转换: ${fileName} -> ${baseName}.jpg`);

  const hasImageMagick = await checkImageMagick();
  
  if (hasImageMagick) {
    const result = await convertWithImageMagick(nefPath, jpgPath);
    if (result) {
      // 等待文件生成
      const success = await checkSuccess();
      if (success) {
        // 转换成功后删除原始 NEF 文件
        try {
          await unlink(nefPath);
          console.log(`   ✅ 已删除原始文件: ${fileName}`);
        } catch (error) {
          console.error(`   ⚠️  无法删除原始文件 ${fileName}:`, error);
        }
      }
      return success;
    }
    return false;
  } else {
    console.error(`❌ 未找到 ImageMagick，无法转换 ${nefPath}`);
    console.log('\n💡 请安装 ImageMagick:');
    console.log('   Windows: 下载并安装 https://imagemagick.org/script/download.php');
    console.log('   或使用 Chocolatey: choco install imagemagick');
    return false;
  }
}

// 主函数
async function main() {
  console.log('🔍 正在扫描 NEF 文件...\n');

  if (!existsSync(WORKS_DIR)) {
    console.log('❌ public/works/ 文件夹不存在');
    return;
  }

  const nefFiles = await findNefFiles(WORKS_DIR);

  if (nefFiles.length === 0) {
    console.log('✅ 未找到 NEF 文件');
    return;
  }

  console.log(`📁 找到 ${nefFiles.length} 个 NEF 文件\n`);

  const hasImageMagick = await checkImageMagick();
  
  if (!hasImageMagick) {
    console.log('❌ 未检测到 ImageMagick');
    console.log('\n📥 安装说明:');
    console.log('   1. 下载 ImageMagick: https://imagemagick.org/script/download.php');
    console.log('   2. 安装时选择 "Install legacy utilities (e.g. convert)"');
    console.log('   3. 或使用 Chocolatey: choco install imagemagick');
    console.log('\n   安装完成后重新运行此脚本');
    return;
  }

  console.log('✅ 检测到 ImageMagick，开始转换...\n');

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (const nefFile of nefFiles) {
    const result = await convertNefFile(nefFile);
    if (result) {
      if (existsSync(nefFile.replace(/\.nef$/i, '.jpg'))) {
        successCount++;
      } else {
        skipCount++;
      }
    } else {
      failCount++;
    }
  }

  console.log('\n📊 转换结果:');
  console.log(`   ✅ 成功转换并删除: ${successCount} 个`);
  console.log(`   ⏭️  跳过（JPG已存在）: ${skipCount} 个`);
  console.log(`   ❌ 失败: ${failCount} 个`);

  if (successCount > 0) {
    console.log('\n💡 转换完成后，运行: npm run generate-works');
    console.log('📝 注意：原始 NEF 文件已被删除，仅保留 JPG 文件');
  }
}

main().catch(console.error);

