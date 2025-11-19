/**
 * 自动生成作品数据脚本
 * 运行方式: npx tsx scripts/generate-works.ts
 * 或添加到 package.json 的 scripts 中
 */

import { readdir, stat, writeFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

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

async function generateWorks() {
  try {
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
      
      // 检查是否有 RAW 格式文件
      const rawFiles = files.filter(file => {
        const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        return RAW_IMAGE_EXTENSIONS.includes(ext);
      });
      
      if (rawFiles.length > 0) {
        console.log(`⚠️  警告：${folderName} 資料夾中有 ${rawFiles.length} 個 RAW 格式文件（.NEF），這些文件無法在網頁上顯示，請轉換為 JPG/PNG 格式`);
      }
      
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
    
    console.log(`✅ 成功生成 ${works.length} 個作品個案到 data/works.ts`);
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

