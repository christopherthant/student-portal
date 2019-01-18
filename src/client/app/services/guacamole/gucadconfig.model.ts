export class GuacdConfig {
  token = '';
  GUAC_DATA_SOURCE = 'default';
  GUAC_TYPE = 'c';
  GUAC_ID = '';
  GUAC_NAME = '';
  GUAC_WIDTH = 1278;
  GUAC_HEIGHT = 720;
  GUAC_DPI = 96;
  GUAC_AUDIO = ['audio/L8', 'audio/L16'];
  GUAC_IMAGE = ['image/jpeg', 'image/png', 'image/webp'];

  constructor(identifier, name, width: number, height: number) {
    this.GUAC_ID = identifier;
    this.GUAC_NAME = name;
    this.GUAC_WIDTH = Math.round(width);
    this.GUAC_HEIGHT = Math.round(height);
  }
}