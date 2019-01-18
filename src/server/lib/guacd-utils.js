const crypto = require('crypto');
const IV = Buffer.alloc(16, 0, 'hex');

function encrypt(secret_key, json) {
  if ('object' === typeof json && !Buffer.isBuffer(json)) {
    json = JSON.stringify(json);
  }
  const secret_hex = Buffer.from(secret_key, 'hex');

  const signature = crypto.createHmac('sha256', secret_hex)
    .update(json)
    .digest();

  const cipher = crypto.createCipheriv("aes-128-cbc", secret_hex, IV);

  let result = cipher.update(signature, null, 'base64');
  result += cipher.update(json, 'utf8', 'base64');
  result += cipher.final('base64');

  return result;
}

function convert(deviceList, options, seconds) {
  let output = {};
  options = options || output;
  output.username = options.username || "anonymous";
  let sessionTime = seconds || 3600000; // 3600000 = an hour
  output.expires = options.expires || Date.now() + sessionTime; 
  output.connections = {};

  if (!deviceList.hasOwnProperty('devices')) {
    throw "Input json must have devices property";
  }

  deviceList.devices.forEach(machine => {
    let ref = output.connections[machine.name] = {};
    ref.protocol = machine.connection;
    ref.parameters = {
      'hostname': machine.ip_addr,
      'port': machine.port,
      'security':'tls',
      'ignore-cert':true
    };
  });

  return output;
}

exports.convert = convert;
exports.encrypt = encrypt;