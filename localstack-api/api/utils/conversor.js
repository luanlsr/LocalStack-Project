function toDynamoItem(obj) {
    const result = {};
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        result[key] = { S: obj[key] };
      } else if (typeof obj[key] === 'number') {
        result[key] = { N: obj[key].toString() };
      } else if (typeof obj[key] === 'boolean') {
        result[key] = { BOOL: obj[key] };
      }
      // Adicione outros tipos conforme necessário
    }
    return result;
  }

module.exports = { toDynamoItem };
