const TYPES = {
  FLOAT: 'float',
  INTEGER: 'integer',
  STRING: 'string',
  TIMESTAMP: 'timestamp',
}

const CONSTANTS = {
  ACTIVE: 'active',
  DATA_TYPE: 'dataType',
  KEY: 'key',
  NAME: 'name',
  REQUIRED: 'required',
  VALUE: 'value',
  _TYPE: Object.freeze(TYPES),
};

export default Object.freeze(CONSTANTS);
