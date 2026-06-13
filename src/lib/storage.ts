// ─── Nesne Depolama Soyutlaması ───
// Varsayılan: yerel dosya sistemi. Arayüz S3/Supabase'e geçişe hazır.

export interface StorageProvider {
  /**
   * Dosya yükle. `key` benzersiz bir dosya adı/anahtarı.
   * Başarılı olursa dosyanın erişim URL'sini döner.
   */
  put(key: string, data: Buffer, contentType?: string): Promise<string>;

  /**
   * Dosya oku. `key` ile eşleşen dosyanın içeriğini döner.
   */
  get(key: string): Promise<Buffer | null>;

  /**
   * Dosyanın erişim URL'sini döner.
   */
  url(key: string): string;
}

// ─── Yerel Dosya Sistemi Sağlayıcısı ───

import { promises as fs } from "fs";
import path from "path";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "/home/z/my-project/uploads";

export class LocalStorageProvider implements StorageProvider {
  async put(key: string, data: Buffer, _contentType?: string): Promise<string> {
    const filePath = path.join(UPLOAD_DIR, key);
    const dir = path.dirname(filePath);

    // Dizin yoksa oluştur
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(filePath, data);

    return this.url(key);
  }

  async get(key: string): Promise<Buffer | null> {
    try {
      const filePath = path.join(UPLOAD_DIR, key);
      return await fs.readFile(filePath);
    } catch {
      return null;
    }
  }

  url(key: string): string {
    return `/uploads/${key}`;
  }
}

// ─── S3/Supabase Sağlayıcı (Gelecekte) ───
// export class S3StorageProvider implements StorageProvider { ... }

// ─── Varsayılan Sağlayıcı ───

let _provider: StorageProvider | null = null;

export function getStorage(): StorageProvider {
  if (!_provider) {
    _provider = new LocalStorageProvider();
  }
  return _provider;
}

/**
 * Depolama sağlayıcısını değiştir (test veya S3 geçişi için).
 */
export function setStorage(provider: StorageProvider): void {
  _provider = provider;
}
