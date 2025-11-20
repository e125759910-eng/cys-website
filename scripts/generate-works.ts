/**
 * 自动生成作品数据脚本
 * 运行方式: npx tsx scripts/generate-works.ts
 * 或添加到 package.json 的 scripts 中
 */

import { readdir, stat, writeFile, unlink, mkdir } from 'fs/promises';
import { join, dirname, basename, extname } from 'path';
import { existsSync } from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// 支持的图片格式（网页可显示）
const WEB_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// RAW 格式（浏览器无法显示，但可以检测到）
const RAW_IMAGE_EXTENSIONS = ['.nef', '.NEF', '.cr2', '.CR2', '.arw', '.ARW', '.raf', '.RAF'];

// 所有支持的格式（用于检测）
const IMAGE_EXTENSIONS = [...WEB_IMAGE_EXTENSIONS, ...RAW_IMAGE_EXTENSIONS];

interface ImageFile {
  path: string;
  name: string;
  folder?: string;
}

async function scanDirectory(dir: string, baseDir: string, files: ImageFile[] = []): Promise<ImageFile[]> {
  const entries = await readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    const relativePath = fullPath.replace(baseDir + '\\', '').replace(baseDir + '/', '');
    
    if (entry.isDirectory()) {
      // 递归扫描子文件夹
      await scanDirectory(fullPath, baseDir, files);
    } else if (entry.isFile()) {
      const ext = entry.name.toLowerCase().substring(entry.name.lastIndexOf('.'));
      if (IMAGE_EXTENSIONS.includes(ext)) {
        const folderPath = dir.replace(baseDir + '\\', '').replace(baseDir + '/', '');
        files.push({
          path: relativePath.replace(/\\/g, '/'), // 统一使用 / 作为路径分隔符
          name: entry.name,
          folder: folderPath && folderPath !== 'works' ? folderPath : undefined
        });
      }
    }
  }
  
  return files;
}

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
  
  if (!existsSync(dir)) {
    return nefFiles;
  }
  
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
  const fileName = basename(nefPath);
  const baseName = fileName.replace(/\.nef$/i, '');
  const jpgPath = join(dir, `${baseName}.jpg`);

  // 如果 JPG 已存在，删除对应的 NEF 文件
  if (existsSync(jpgPath)) {
    try {
      if (existsSync(nefPath)) {
        await unlink(nefPath);
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
        } catch (error) {
          console.error(`   ⚠️  无法删除原始文件 ${fileName}:`, error);
        }
      }
      return success;
    }
    return false;
  } else {
    return false;
  }
}

// 自动转换所有 NEF 文件
async function convertAllNefFiles(): Promise<void> {
  const publicDir = join(process.cwd(), 'public');
  const worksDir = join(publicDir, 'works');
  
  console.log('🔍 正在扫描 NEF 文件...\n');
  
  // 扫描 works 文件夹
  let nefFiles: string[] = [];
  if (existsSync(worksDir)) {
    nefFiles = await findNefFiles(worksDir);
  }
  
  // 如果 works 文件夹不存在或为空，扫描 public 下的其他文件夹
  if (nefFiles.length === 0) {
    const entries = await readdir(publicDir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory() && entry.name !== 'works') {
        const subDir = join(publicDir, entry.name);
        const subFiles = await findNefFiles(subDir);
        nefFiles.push(...subFiles);
      }
    }
  }
  
  if (nefFiles.length === 0) {
    console.log('✅ 未找到 NEF 文件\n');
    return;
  }
  
  console.log(`📁 找到 ${nefFiles.length} 个 NEF 文件\n`);
  
  const hasImageMagick = await checkImageMagick();
  
  if (!hasImageMagick) {
    console.log('⚠️  未检测到 ImageMagick，跳过 NEF 转换');
    console.log('💡 安装 ImageMagick 后，NEF 文件将自动转换');
    console.log('   下载地址: https://imagemagick.org/script/download.php\n');
    return;
  }
  
  console.log('✅ 检测到 ImageMagick，开始转换...\n');
  
  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;
  
  for (const nefFile of nefFiles) {
    const relativePath = nefFile.replace(process.cwd() + '\\', '').replace(process.cwd() + '/', '');
    const fileName = basename(nefFile);
    const baseName = fileName.replace(/\.nef$/i, '');
    const jpgPath = join(dirname(nefFile), `${baseName}.jpg`);
    
    // 如果 JPG 已存在，跳过转换但删除 NEF
    if (existsSync(jpgPath)) {
      try {
        await unlink(nefFile);
        skipCount++;
      } catch (error) {
        console.error(`   ⚠️  无法删除 ${fileName}`);
      }
      continue;
    }
    
    console.log(`🔄 正在转换: ${fileName} -> ${baseName}.jpg`);
    
    const result = await convertNefFile(nefFile);
    if (result) {
      if (existsSync(jpgPath)) {
        successCount++;
        console.log(`   ✅ 转换成功并已删除原始文件`);
      } else {
        skipCount++;
      }
    } else {
      failCount++;
      console.log(`   ❌ 转换失败`);
    }
  }
  
  console.log('\n📊 转换结果:');
  console.log(`   ✅ 成功转换并删除: ${successCount} 个`);
  console.log(`   ⏭️  跳过（JPG已存在）: ${skipCount} 个`);
  console.log(`   ❌ 失败: ${failCount} 个\n`);
}

async function generateWorks() {
  try {
    // 首先自动转换所有 NEF 文件为 JPG 并删除 NEF 文件
    await convertAllNefFiles();
    
    // 支持两种方式：
    // 1. 扫描 public/works/ 文件夹（如果存在）
    // 2. 扫描 public/ 下的所有子文件夹（排除 logo.svg, work1.svg 等根文件）
    const publicDir = join(process.cwd(), 'public');
    const worksDir = join(publicDir, 'works');
    
    let imageFiles: ImageFile[] = [];
    
    // 先尝试扫描 works 文件夹
    try {
      const worksFiles = await scanDirectory(worksDir, worksDir);
      imageFiles = worksFiles;
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // works 文件夹不存在，扫描 public 下的所有子文件夹
        const entries = await readdir(publicDir, { withFileTypes: true });
        for (const entry of entries) {
          if (entry.isDirectory() && entry.name !== 'works') {
            const subDir = join(publicDir, entry.name);
            const subFiles = await scanDirectory(subDir, publicDir);
            imageFiles.push(...subFiles);
          }
        }
      } else {
        throw error;
      }
    }
    
    // 如果 works 文件夹存在但为空，也扫描 public 下的其他文件夹
    if (imageFiles.length === 0) {
      const entries = await readdir(publicDir, { withFileTypes: true });
      for (const entry of entries) {
        if (entry.isDirectory() && entry.name !== 'works') {
          const subDir = join(publicDir, entry.name);
          const subFiles = await scanDirectory(subDir, publicDir);
          imageFiles.push(...subFiles);
        }
      }
    }
    
    // 按文件夹分组，每个文件夹作为一个作品个案
    const groupedByFolder = new Map<string, ImageFile[]>();
    imageFiles.forEach(file => {
      const folder = file.folder || '其他';
      if (!groupedByFolder.has(folder)) {
        groupedByFolder.set(folder, []);
      }
      groupedByFolder.get(folder)!.push(file);
    });
    
    // 生成作品个案
    const cases: Array<{
      folder: string;
      folderName: string;
      images: Array<{ file: ImageFile; imgPath: string }>;
    }> = [];
    
    Array.from(groupedByFolder.entries()).forEach(([folder, files]) => {
      const folderName = folder
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .trim();
      
      const images = files
        .filter(file => {
          // 只处理网页可显示的格式
          const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
          return WEB_IMAGE_EXTENSIONS.includes(ext);
        })
        .map((file, fileIndex) => {
          // 根据路径确定图片URL
          let imgPath = file.path;
          if (!imgPath.startsWith('/')) {
            imgPath = '/' + imgPath;
          }
          // 如果文件是从 works 文件夹扫描的，确保路径包含 /works/
          const worksDir = join(process.cwd(), 'public', 'works');
          const fileInWorks = join(worksDir, file.path.replace(/^\//, ''));
          if (existsSync(fileInWorks)) {
            imgPath = '/works/' + file.path.replace(/^\//, '');
          } else {
            // 如果不在 works 文件夹，检查是否在 public 根目录下
            const fileInPublic = join(process.cwd(), 'public', file.path.replace(/^\//, ''));
            if (existsSync(fileInPublic)) {
              imgPath = '/' + file.path.replace(/^\//, '');
            }
          }
          
          return { file, imgPath };
        });
      
      cases.push({ folder, folderName, images });
    });
    
    // 转换为作品个案格式
    const works = cases.map((caseItem, caseIndex) => {
      const firstImage = caseItem.images[0];
      const coverImage = firstImage ? firstImage.imgPath : '';
      const workImages = caseItem.images.map((img, imgIndex) => ({
        id: imgIndex + 1,
        title: `${caseItem.folderName} - ${imgIndex + 1}`,
        img: img.imgPath
      }));
      
      return {
        id: caseIndex + 1,
        title: caseItem.folderName,
        folder: caseItem.folder,
        coverImage: coverImage,
        images: workImages,
        description: `${caseItem.folderName} - 專業包膜服務展示`,
        category: "包膜案例"
      };
    }).sort((a, b) => a.title.localeCompare(b.title, 'zh-TW'));
    
    // 生成 TypeScript 文件内容
    const fileContent = `// 作品資料檔案（自動生成）
// 此檔案由 scripts/generate-works.ts 自動生成
// 請勿手動編輯此檔案，如需修改請編輯 public/works/ 資料夾中的圖片

export interface WorkImage {
  id: number;
  title: string;
  img: string;
}

export interface WorkCase {
  id: number;
  title: string;
  folder: string;
  coverImage: string;
  images: WorkImage[];
  description?: string;
  category?: string;
}

export const works: WorkCase[] = ${JSON.stringify(works, null, 2)};

// 使用說明：
// 1. 將作品圖片放入 public/works/ 目錄
// 2. 運行: npm run generate-works
// 3. 作品會自動從 public/works/ 資料夾中讀取並生成此檔案
`;
    
    const outputPath = join(process.cwd(), 'data', 'works.ts');
    await writeFile(outputPath, fileContent, 'utf-8');
    
    // 同时生成 JSON 文件到 public/data/works.json
    const dataDir = join(process.cwd(), 'public', 'data');
    if (!existsSync(dataDir)) {
      await mkdir(dataDir, { recursive: true });
    }
    const jsonPath = join(dataDir, 'works.json');
    const jsonContent = JSON.stringify({ works }, null, 2);
    await writeFile(jsonPath, jsonContent, 'utf-8');
    
    console.log(`✅ 成功生成 ${works.length} 個作品個案到 data/works.ts`);
    console.log(`✅ 成功生成 JSON 文件到 public/data/works.json`);
    console.log('📁 作品個案列表:');
    works.forEach(work => {
      console.log(`   - ${work.title} (${work.images.length} 張照片)`);
    });
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      console.log('⚠️  public/works/ 資料夾不存在，正在創建...');
      // 這裡可以選擇創建資料夾，但為了安全起見，我們只提示
      console.log('💡 請先創建 public/works/ 資料夾並放入作品圖片');
    } else {
      console.error('❌ 生成作品失敗:', error);
    }
  }
}

generateWorks();

