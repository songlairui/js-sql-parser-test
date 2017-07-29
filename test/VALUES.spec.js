const parseValues = require('../src/partical/parseVALUES')
const expect = require('chai').expect
const assert = require('assert')

const testVALUES = [
  `'value1','value2',null,'value3'`,
  `'value1'`,
  `null`,
  `'_''_'`,
  `'''_'`,
  `'_'''`,
  `'''''_'''''`,
  `''' , '''`,
  `''' , null , '''`,
  `''' a '''`
]

describe('err RETURN', function() {
  it('should return null in result.err, and values in values', function() {
    let result = parseValues(testVALUES[0])
    assert.equal(null, result.err)
  })
})

describe('VALUES in some conditions', function() {
  describe(`一般的VALUES : VALUES(${testVALUES[1]})`, function() {
    it(`should return \`value1\``, function() {
      let result = parseValues(testVALUES[1])
      assert.equal('value1', result.values[0])
    })
  })
  describe(`VALUES为null : VALUES(${testVALUES[2]})`, function() {
    it(`should return \`null\``, function() {
      let result = parseValues(testVALUES[2])
      assert.equal(null, result.values[0])
    })
  })
  describe(`中间含有一个单引号转义: VALUES(${testVALUES[3]})`, function() {
    it(`should return \`_'_\``, function() {
      let result = parseValues(testVALUES[3])
      assert.equal(`_'_`, result.values[0])
    })
  })
  describe(`开头含有一个单引号转义: VALUES(${testVALUES[4]})`, function() {
    it(`should return \`'_\``, function() {
      let result = parseValues(testVALUES[4])
      assert.equal(`'_`, result.values[0])
    })
  })
  describe(`结尾含有一个单引号转义: VALUES(${testVALUES[5]})`, function() {
    it(`should return \`_'\``, function() {
      let result = parseValues(testVALUES[5])
      assert.equal(`_'`, result.values[0])
    })
  })
  describe(`结尾含有多个单引号转义: VALUES(${testVALUES[6]})`, function() {
    it(`should return \`''_''\``, function() {
      let result = parseValues(testVALUES[6])
      assert.equal(`''_''`, result.values[0])
    })
  })

  describe(`有单引号转义，且含形如 ' , ' 的字符片段: VALUES(${testVALUES[7]}) \n 此种情况正则难以区分 `, function() {
    it(`should return \`' , '\``, function() {
      let result = parseValues(testVALUES[7])
      // console.info(result)
      assert.equal(`' , '`, result.values[0])
    })
  })

  describe(`有单引号转义，且含形如  ' ,null , ' 的字符片段: VALUES(${testVALUES[8]}) \n此种情况正则难以区分 `, function() {
    it(`should return \`' , null , '\``, function() {
      let result = parseValues(testVALUES[8])
      // console.info(result)
      assert.equal(`' , null , '`, result.values[0])
    })
  })
  describe(`单引号转义前后有空格: VALUES(${testVALUES[9]}) `, function() {
    it(`should return \`' a '\``, function() {
      let result = parseValues(testVALUES[9])
      // console.info(result)
      assert.equal(`' a '`, result.values[0])
    })
  })
})
