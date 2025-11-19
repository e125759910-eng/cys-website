import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

// 支持的图片格式
const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

export async function GET() {
  try {
    // 作品文件夹路径
    const worksDir = join(process.cwd(), 'public', 'works');
    
    // 读取文件夹中的所有文件
    const files = await readdir(worksDir, { withFileTypes: true });
    
    // 过滤出图片文件并按名称排序
    const imageFiles = files
      .filter(file => {
        if (!file.isFile()) return false;
        const ext = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        return IMAGE_EXTENSIONS.includes(ext);
      })
      .map((file, index) => {
        const fileName = file.name;
        // 从文件名提取标题（移除扩展名，替换下划线和连字符为空格）
        const title = fileName
          .substring(0, fileName.lastIndexOf('.'))
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase()); // 首字母大写
        
        return {
          id: index + 1,
          title: title || `作品 ${index + 1}`,
          img: `/works/${fileName}`,
          description: "專業包膜服務展示",
          category: "包膜案例"
        };
      })
      .sort((a, b) => a.title.localeCompare(b.title, 'zh-TW')); // 按中文排序
    
    return NextResponse.json(imageFiles);
  } catch (error: any) {
    // 如果文件夹不存在，返回空数组
    if (error.code === 'ENOENT') {
      return NextResponse.json([]);
    }
    console.error('读取作品文件夹错误:', error);
    return NextResponse.json(
      { error: '读取作品失败' },
      { status: 500 }
    );
  }
}

