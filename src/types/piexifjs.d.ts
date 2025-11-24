declare module "piexifjs" {
  type ExifSection = Record<number | string, unknown>;

  interface ExifData {
    "0th": ExifSection;
    Exif: ExifSection;
    GPS: ExifSection;
    Interop: ExifSection;
    "1st": ExifSection;
    thumbnail: string | null;
  }

  function load(data: string): ExifData;
  function dump(data: ExifData): string;
  function insert(exif: string, jpeg: string): string;
  function remove(jpeg: string): string;

  const piexif: {
    load: typeof load;
    dump: typeof dump;
    insert: typeof insert;
    remove: typeof remove;
  };

  export { load, dump, insert, remove, ExifData };
  export default piexif;
}

