import axios from "axios";
import path from "path";
import fs from 'fs';

export const remoteFileUpload = async (fileUrl: string, fileName: string) => {
  try {
    const response = await axios.get(fileUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    // Đảm bảo thư mục tmp-files tồn tại
    const tmpDir = path.join(process.cwd(), 'tmp-files');
    console.log("tmpDir", tmpDir);
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }

    const filePath = path.join(tmpDir, fileName);
    fs.writeFileSync(filePath, buffer);

    // Kiểm tra xem file có tồn tại không
    if (!fs.existsSync(filePath)) {
      throw new Error(`File ${filePath} does not exist`);
    }

    // Tạo đường dẫn tương đối
    const relativeFilePath = path.relative(process.cwd(), filePath);
    console.log("relativeFilePath", relativeFilePath);

    // upload to strapi
    const uploadResponse = await strapi.plugins['upload'].services.upload.upload({
      data: {}, // dữ liệu bổ sung nếu cần
      files: {
        path: relativeFilePath,
        name: fileName,
        type: 'application/pdf',
        size: buffer.length,
      },
    });

    // remove temp file
    fs.unlinkSync(filePath);
    return uploadResponse;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw error;
  }
};
