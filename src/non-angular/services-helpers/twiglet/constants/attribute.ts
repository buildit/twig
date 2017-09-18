const TYPES = {
  FLOAT: 'float',
  INTEGER: 'integer',
  STRING: 'string',
  TIMESTAMP: 'timestamp',
}

const CONSTANTS = {
  ACTIVE: 'active',
  KEY: 'key',
  VALUE: 'value',
  _TYPE: Object.freeze(TYPES),
};

export default Object.freeze(CONSTANTS);
