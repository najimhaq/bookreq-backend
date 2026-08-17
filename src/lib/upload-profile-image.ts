type ImgBbUploadResponse = {
  success: boolean;
  data?: {
    url: string;
    display_url: string;
    delete_url: string;
  };
  error?: {
    message: string;
  };
};

export async function uploadProfileImageToImgBB(
  file: Express.Multer.File,
  userId: string
): Promise<string> {
  const apiKey = process.env.IMGBB_API_KEY;

  if (!apiKey) {
    throw new Error('IMGBB_API_KEY is not configured.');
  }

  const formData = new FormData();

  formData.append(
    'image',
    new Blob([Buffer.from(file.buffer)], { type: file.mimetype }),
    file.originalname
  );

  formData.append('name', `profile-${userId}`);

  const response = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
    method: 'POST',
    body: formData,
  });

  const result = (await response.json()) as ImgBbUploadResponse;

  if (!response.ok || !result.success || !result.data?.url) {
    throw new Error(result.error?.message ?? 'ImgBB image upload failed.');
  }

  return result.data.url;
}
